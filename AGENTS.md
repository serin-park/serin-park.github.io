# AGENTS.md

이 저장소(`serin-park/serin-park.github.io`)에서 작업하는 AI 코딩 에이전트(Codex 등)를 위한 가이드입니다. 코드를 고치기 전에 이 문서부터 읽고, 구조 파악을 위해 전체 파일을 훑지 마세요.

## 저장소 구성

이 저장소에는 서로 독립적인 프로젝트 두 개가 들어 있습니다. 서로 소스를 import하지 않고, 아래 설명하는 느슨한 브리지(postMessage / chrome.storage)로만 연결됩니다.

```
/
├── serin.github.io/           # 실제 배포되는 GitHub Pages 사이트 (메인 프로젝트)
│   ├── index.html             # 페이지 마크업 + 모든 폼(form) 구조 + js/* 스크립트 로드 순서
│   ├── style.css              # 랜딩/헤더 등 전역 스타일
│   ├── schedule.css           # 플래너 전용 스타일 (대용량, ~4,300줄)
│   ├── js/                    # 플래너 로직 (구 schedule.js를 기능별로 분리, 아래 "모듈 분리" 참고)
│   │   ├── state.js
│   │   ├── storage-sync.js
│   │   ├── schedule-logic.js
│   │   ├── render-views.js
│   │   ├── forms-and-search.js
│   │   └── bindings-and-init.js
│   ├── schedule.js             # (사용 안 함) 분리 이전 원본. 검증 끝나면 git rm 대상 — 아래 참고
│   ├── supabase-config.js     # Supabase URL + publishable key (공개 키, RLS로 보호됨)
│   ├── supabase-schema.sql    # DB 스키마 정의 (수동 실행 전용, 아래 "배포" 참고)
│   └── README.md
└── naver-schedule-extension/  # 개인용 Chrome 확장 (MV3)
    ├── manifest.json
    ├── background.js          # service worker: 탭 포커스 + 결과 전달
    ├── naver-map.js/.css      # map.naver.com에 주입되는 content script
    └── schedule-page.js       # serin-park.github.io / localhost / file:// 에 주입되는 content script
```

> 주의: 로컬 클론 폴더명은 `serin.github.io`이지만 실제 GitHub 저장소/배포 도메인은 **`serin-park.github.io`** 입니다. origin remote: `https://github.com/serin-park/serin-park.github.io.git`, 배포 브랜치: `main`.

## `serin.github.io` 아키텍처 (메인 앱)

**바닐라 JS SPA, 프레임워크 없음, 빌드 스텝 없음.** `package.json`, 번들러, transpiler, linter/formatter 설정 파일이 전혀 없습니다. `schedule.js`를 직접 수정하고 그대로 브라우저에서 실행됩니다. 외부 라이브러리는 `index.html`에서 CDN `<script>` 태그로만 로드합니다 (Leaflet, `@supabase/supabase-js@2`). npm install 같은 과정이 필요 없고, 시도하지 마세요.

### 모듈 분리 (2026-09) — 반드시 읽을 것

원래 `schedule.js` 하나(~5,300줄)였던 걸 **번들러 없이, `<script type="module">`도 안 쓰고** (파일을 그냥 열어도(`file://`) 동작해야 해서 — ES 모듈은 `file://`에서 CORS로 막힘) 순서대로 로드되는 **일반 `<script>` 6개**로 쪼갰습니다. 브라우저는 같은 문서 안에서 순차 실행되는 classic script들을 하나의 전역 스코프로 취급하므로, 원래 파일 안에서 함수/상수가 서로 참조하던 방식이 그대로 유지됩니다. `index.html`에 나열된 순서가 곧 실행 순서이자 의존 순서이므로 **절대 바꾸지 말 것**:

1. **`js/state.js`** — 상수 + localStorage 키 정의, `index.html`의 id와 1:1 매칭되는 DOM 참조 상수(`const xxx = document.querySelector("#xxx")`), 그리고 모든 전역 `let` 상태 변수 선언. 새 UI 엘리먼트를 추가하면 여기에도 대응 상수를 추가하는 게 관례.
   - ⚠️ **`initializeScheduleState()` 함수가 이 파일 끝에 있음.** 원래 이 상태 변수들은 파일 로드 즉시 `loadEvents()` 등을 호출해서 초기값을 채웠는데(원본 파일은 함수 선언이 파일 전체에서 호이스팅되니까 가능했음), 여러 파일로 쪼개면서 그 즉시 호출을 그대로 두면 아직 로드 안 된 `js/storage-sync.js`의 함수를 부르게 돼 에러가 납니다. 그래서 초기값 계산 로직을 함수로 감싸 두고, 모든 스크립트가 로드된 뒤 `js/bindings-and-init.js` 맨 첫 줄에서 호출하도록 미뤘습니다. **새로운 전역 상태를 추가할 때도 이 패턴을 따를 것**: 다른 파일의 함수를 호출해서 초기값을 정해야 한다면, 최상단에서 즉시 호출하지 말고 `initializeScheduleState()`에 추가하세요.
2. **`js/storage-sync.js`** — localStorage 로드/저장, 정규화(normalize) 함수들, 인증 + 클라우드 동기화
3. **`js/schedule-logic.js`** — 카테고리/분류/그룹, 반복 일정, 캘린더/지도 헬퍼, 이동(travel) 다이얼로그 로직
4. **`js/render-views.js`** — 이벤트 카드, 타임라인/카테고리/할일/노트 4개 뷰 렌더링, `renderAll()`
5. **`js/forms-and-search.js`** — 위치 검색(Nominatim), 이벤트 폼 상태 머신, 태스크 패널, 카테고리 관리
6. **`js/bindings-and-init.js`** — 맨 위에서 `initializeScheduleState()` 호출 → 모든 `addEventListener` 바인딩 → 파일 맨 끝에서 `initializePlannerMap()` / `renderAll()` / `initializeCloudSync()` 등 최종 초기화 호출

**정규화(normalize) 함수 컨벤션은 그대로 유지됩니다**: `normalizeTask`, `normalizeEventGroup`, `normalizeNote`, `normalizeEventTodos`, `normalizeClassificationLinks` 등이 `storage-sync.js`에 있고, 데이터를 불러올 때마다 이 함수들을 통과시켜 구버전 로컬/클라우드 데이터와의 하위 호환을 보장합니다. 이벤트/태스크/노트 데이터 모델 필드를 추가·변경할 때는 반드시 해당 normalize 함수도 같이 업데이트할 것.

레거시 `schedule.js` 파일은 더 이상 아무 데서도 참조되지 않습니다(사용 안 함). 로컬에서 실제로 동작을 확인한 뒤 `git rm serin.github.io/schedule.js`로 정리하세요. **이 분리 작업 자체는 아직 로컬에서 브라우저로 열어서 검증되지 않았습니다** — 커밋 전에 반드시 직접 열어서 로그인/일정 CRUD/캘린더/이동 계획 등 주요 흐름을 확인할 것.

### 데이터 모델 요약
- **event**: `id, title, category, date, startTime/endTime, locationType(offline/online), location/locationDetail 또는 departure/destinationLocation(travel), reservationStatus(none/needed/booked/considering), cancellationDeadline*, todos[], classificationLinks[], recurrence rule` 등
- **task**: 이벤트에 딸린 todo가 독립 태스크로 승격될 수 있음(`tasksFromEventTodos`, `mergeTaskLists`). 부모-자식 계층 구조 지원(`taskParentSelect`, `hierarchicalTasks`).
- **note**: 제목 + 본문 텍스트, 별도 목록/에디터.
- **eventGroup**: 카테고리 하위의 그룹, 드래그 정렬 가능(`setupGroupDragSorting`).

### localStorage 키 (변경 시 마이그레이션 주의)
`serin-schedule-events-v1`, `serin-schedule-category-order-v1`, `serin-schedule-home-location-v1`, `serin-schedule-home-visible-v1`, `serin-schedule-notes-v1`, `serin-schedule-tasks-v1`, `serin-schedule-task-settings-v1`, `serin-schedule-groups-v1`, `serin-schedule-cloud-calendar-v1`, `serin-schedule-cloud-owner-v1`

## `naver-schedule-extension` (Chrome 확장, MV3)

개인용 브리지 확장. 빌드 스텝 없음 — 파일을 그대로 "압축해제된 확장 프로그램으로 로드"해서 사용. 흐름:
1. `naver-map.js`가 `map.naver.com`에 주입되어 사용자가 고른 경로 요약을 캡처, `background.js`(service worker)로 전달.
2. `background.js`가 `chrome.storage.local`에 결과를 저장하고, 열려 있는 플래너 탭(`serin-park.github.io` / `localhost` / `file://`)을 찾아 포커스 후 `SERIN_ROUTE_RESULT` 메시지 전송.
3. `schedule-page.js`가 플래너 페이지에 주입되어 메시지를 받아 `window.postMessage`로 페이지(`schedule.js`)에 전달. 페이지 쪽에서 `ROUTE_RESULT_ACCEPTED`를 다시 postMessage하면 storage를 정리.

확장 파일을 수정하면 `chrome://extensions`에서 새로고침 버튼을 눌러야 반영됨 (README.md에 안내 있음). `manifest.json`의 `version`은 수동으로 올려야 함 (현재 0.7.4 형식 유지).

## 빌드 / 배포 파이프라인

**빌드 파이프라인 자체가 없습니다.** CI 워크플로(`.github/workflows`)도 없습니다.
- `serin.github.io`: `main` 브랜치에 push하면 GitHub Pages가 저장소 루트(`serin.github.io/` 폴더가 아니라, 그 폴더 자체가 Pages 저장소의 루트)를 그대로 정적 서빙합니다. Jekyll 처리 없음(`_config.yml`, `.nojekyll` 없음) — HTML/CSS/JS 파일을 그대로 서빙한다고 가정하면 됩니다.
- `supabase-schema.sql`은 **자동 실행되지 않는 참고 문서**입니다. DB 스키마를 바꾸려면 Supabase 대시보드의 SQL 에디터에 수동으로 실행하고, 이 파일도 함께 갱신해야 실제 스키마와 문서가 어긋나지 않습니다.
- `naver-schedule-extension`은 Chrome Web Store에 배포되지 않고 로컬 "압축해제된 확장 프로그램"으로만 로드해서 씁니다.

## 작업 워크플로

- **브랜치/PR 없이 `main`에 직접 커밋 → push**가 원칙. 별도 리뷰 프로세스가 없으므로, 코덱스가 기능 브랜치를 만들거나 PR을 여는 흐름을 임의로 제안/실행하지 말 것. (위험도가 큰 변경이라 별도 브랜치로 나누는 게 좋겠다고 판단되면, 실행 전에 먼저 사용자에게 물어볼 것.)
- **테스트 자동화 없음.** 로컬에서 `index.html`을 직접 열거나 로컬 서버로 띄워서 눈으로 확인하는 방식이 유일한 검증 수단. 코드를 고친 뒤에는 "이 파일을 로컬에서 열어서 이런 부분을 확인해보세요" 정도로 확인 방법을 안내할 것 — 실행/스크린샷 검증을 코덱스가 대신 할 수 없다고 가정.
- **커밋 메시지는 영어로 작성.** (UI 문구, 폼 라벨, 주석은 한국어 유지 — 이 둘은 구분됨.)

## 컨벤션 / 작업 시 유의사항

- UI 문구, 폼 라벨, 주석은 한국어. 새 UI 문구도 한국어로 작성.
- DOM id는 camelCase이며 `schedule.js` 상단의 `const <동일이름> = document.querySelector("#<동일id>")` 패턴을 그대로 따름. 새 엘리먼트를 `index.html`에 추가하면 대응 상수도 추가.
- linter/formatter/타입체커가 없으므로 스타일을 강제하는 자동 도구가 없음 — 기존 코드 스타일(2-space indent, 세미콜론 사용, 화살표 함수/일반 함수 혼용)을 눈으로 보고 맞출 것.
- `schedule.js` 로직은 `js/` 아래 6개 파일로 나뉘어 있으니(위 "모듈 분리" 참고), 수정할 기능이 어느 파일에 속하는지부터 확인하고 그 파일만 열 것. `schedule.css`는 아직 하나의 큰 파일(~4,300줄)이므로 전체를 다시 읽기보다 관련 섹션만 `grep`/검색으로 찾아 수정하는 것을 권장.
- Supabase publishable key는 공개되어도 안전하도록 설계됨(RLS 정책이 `owner_id = auth.uid()`로 강제) — `supabase-config.js`를 git에서 빼거나 비밀로 취급할 필요 없음. 단, service role key 등 진짜 비밀 키는 절대 이 파일들에 넣지 말 것. Supabase 프로젝트는 dev/prod 구분 없이 단일 프로젝트이고, 스키마 변경 권한은 소유자 본인뿐(협업자 없음).
- 클라우드 동기화는 "전체 상태 스냅샷 업서트" 방식이라, 여러 기기에서 동시 편집 시 마지막에 sync한 쪽이 이길 수 있음(`mergedPlannerState`가 로그인 시점 병합만 처리). 동시성 관련 버그를 다룰 때 이 한계를 감안할 것.
- **위치 검색(Nominatim)은 정확도가 낮다는 게 알려진 한계.** 그래서 이벤트 폼의 장소 검색은 "대략적인 위치"만 찍는 용도로 쓰고, 실제 이동 계획(travel planner)을 짤 때는 사용자가 네이버지도에서 정확한 위치로 다시 잡아야 함. 이 흐름을 전제로 하고 있으므로, Nominatim 정확도를 올리려는 시도보다는 "네이버지도에서 재설정"이라는 2단계 흐름 자체가 의도된 설계라는 점을 감안할 것. 경로/이동시간 계산도 자체 라우팅 로직이 아니라 사용자가 네이버지도에서 직접 고른 값을 확장 프로그램으로 가져오는 방식(자동 라우팅 API 없음).
- "이건 절대 바꾸지 마"라는 제약은 없음. 다만 로컬 환경(Supabase 설정, 확장 프로그램 로드 등) 변경이 필요한 작업이면 실행 전에 먼저 사용자에게 알릴 것.

## 향후 계획 (아직 미확정 — 임의로 진행하지 말고 먼저 확인)

- **멀티유저 오픈**: 현재는 본인 혼자 쓰는 중이지만, 나중에 다른 사람에게도 열어줄 가능성을 염두에 두고 있음. DB 스키마(RLS)는 이미 사용자별로 분리돼 있어 구조적으로는 준비돼 있지만, 실제로 오픈하기 전에 온보딩 UX·요금(Supabase 사용량)·악용 방지 등을 점검해야 함.
- **모바일 대응**: 현재는 데스크톱 뷰만 신경 쓰고 있고 반응형 CSS는 갖춰져 있지 않음. 지금 당장 모바일 레이아웃을 병행 개발하지는 않기로 함 — 대신 새 UI를 짤 때 고정 px보다 유연한 단위를 쓰는 정도로 나중의 모바일 작업 부담을 줄여두는 걸 권장.
- **Naver Maps API 연동**: 지금은 확장 프로그램으로 사용자가 네이버지도에서 고른 값을 수동으로 가져오는 방식인데, 나중에 API를 직접 붙이는 것도 먼 미래 계획으로 고려 중. 착수 시점 미정.
- **`naver-schedule-extension` 버전 규칙**: 정해진 규칙 없이, 오류가 나서 새로 고칠 때마다 버전을 올리는 정도. Chrome 웹스토어 배포는 검토된 바 없고 계속 로컬 전용으로 사용 중.
