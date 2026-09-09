function loadEvents() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved.map(normalizeEventTodos) : [];
  } catch (error) {
    console.error("저장된 일정을 불러오지 못했습니다.", error);
    return [];
  }
}

function saveEvents() {
  if (demoMode) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  queueCloudSync();
}

function normalizeTask(task = {}) {
  const now = new Date().toISOString();
  const completed = Boolean(task.completed);
  return {
    id: task.id || crypto.randomUUID(),
    title: String(task.title || ""),
    dueDate: String(task.dueDate || ""),
    dueTime: String(task.dueTime || "").slice(0, 5),
    submissionRequired: Boolean(task.submissionRequired),
    completed,
    completedAt: completed ? String(task.completedAt || task.updatedAt || task.createdAt || now) : "",
    archivedAt: String(task.archivedAt || ""),
    memo: String(task.memo || ""),
    eventId: String(task.eventId || ""),
    groupId: String(task.groupId || ""),
    classifications: normalizeClassificationLinks(task.classifications, {
      category: task.category || "MISC",
      groupId: task.groupId
    }),
    parentTaskId: String(task.parentTaskId || ""),
    repeatSeriesId: String(task.repeatSeriesId || ""),
    repeatRule: task.repeatRule && typeof task.repeatRule === "object" ? task.repeatRule : null,
    createdAt: String(task.createdAt || now),
    updatedAt: String(task.updatedAt || task.createdAt || now)
  };
}

function normalizeClassificationLinks(rawLinks, legacy = {}) {
  const links = Array.isArray(rawLinks) && rawLinks.length
    ? rawLinks
    : [{ category: legacy.category || "MISC", groupId: legacy.groupId || "" }];
  const unique = new Map();
  links.forEach((rawLink) => {
    const category = normalizedCategory(rawLink?.category || "MISC");
    const groupId = String(rawLink?.groupId || "");
    unique.set(`${category}::${groupId}`, { category, groupId });
  });
  return [...unique.values()];
}

function normalizeEventGroup(group = {}) {
  return {
    id: String(group.id || crypto.randomUUID()),
    name: String(group.name || "").trim().slice(0, 80),
    category: normalizedCategory(group.category || "ETC"),
    order: Number.isFinite(Number(group.order)) ? Number(group.order) : 0,
    createdAt: String(group.createdAt || new Date().toISOString()),
    updatedAt: String(group.updatedAt || group.createdAt || new Date().toISOString())
  };
}

function loadEventGroups() {
  try {
    const saved = JSON.parse(localStorage.getItem(GROUPS_KEY) || "[]");
    return Array.isArray(saved) ? saved.map(normalizeEventGroup).filter((group) => group.name) : [];
  } catch (error) {
    console.error("저장된 일정 그룹을 불러오지 못했습니다.", error);
    return [];
  }
}

function saveEventGroups() {
  if (demoMode) return;
  localStorage.setItem(GROUPS_KEY, JSON.stringify(eventGroups));
  queueCloudSync();
}

function tasksFromEventTodos(sourceEvents = []) {
  return sourceEvents.flatMap((event) => (Array.isArray(event.todos) ? event.todos : []).map((todo) => normalizeTask({
    ...todo,
    eventId: event.id,
    createdAt: todo.createdAt || event.createdAt,
    updatedAt: todo.updatedAt || event.updatedAt || event.createdAt
  })));
}

function mergeTaskLists(...lists) {
  const merged = new Map();
  lists.flat().forEach((rawTask) => {
    const task = normalizeTask(rawTask);
    const existing = merged.get(task.id);
    if (!existing || String(task.updatedAt) >= String(existing.updatedAt)) merged.set(task.id, task);
  });
  return [...merged.values()];
}

function removeClonedRecurringEventTasks(sourceTasks = [], sourceEvents = []) {
  const recurringEvents = new Map(
    sourceEvents
      .filter((event) => event.recurrenceSeriesId)
      .map((event) => [event.id, event])
  );
  const earliestSignature = new Map();

  return [...sourceTasks]
    .sort((a, b) => {
      const eventA = recurringEvents.get(a.eventId);
      const eventB = recurringEvents.get(b.eventId);
      return String(eventA?.date || "").localeCompare(String(eventB?.date || ""));
    })
    .filter((rawTask) => {
      const task = normalizeTask(rawTask);
      const event = recurringEvents.get(task.eventId);
      if (!event) return true;

      const signature = JSON.stringify([
        event.recurrenceSeriesId,
        task.title,
        task.dueDate,
        task.dueTime,
        task.submissionRequired,
        task.memo,
        task.createdAt
      ]);
      if (earliestSignature.has(signature)) return false;
      earliestSignature.set(signature, task.id);
      return true;
    });
}

function loadTasks(sourceEvents = []) {
  try {
    const saved = JSON.parse(localStorage.getItem(TASKS_KEY) || "[]");
    return mergeTaskLists(tasksFromEventTodos(sourceEvents), Array.isArray(saved) ? saved : []);
  } catch (error) {
    console.error("저장된 할 일을 불러오지 못했습니다.", error);
    return tasksFromEventTodos(sourceEvents);
  }
}

function saveTasks() {
  if (demoMode) return;
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  queueCloudSync();
}

function normalizeTaskSettings(settings = {}) {
  const recent = Number(settings.recentCompletedDays);
  return {
    recentCompletedDays: Number.isFinite(recent) && recent >= -1 ? Math.round(recent) : 7
  };
}

function loadTaskSettings() {
  try {
    return normalizeTaskSettings(JSON.parse(localStorage.getItem(TASK_SETTINGS_KEY) || "{}"));
  } catch (error) {
    return normalizeTaskSettings();
  }
}

function saveTaskSettings() {
  if (demoMode) return;
  localStorage.setItem(TASK_SETTINGS_KEY, JSON.stringify(taskSettings));
  queueCloudSync();
}

function removeStoredTravelSummaryImages() {
  let changed = false;
  events = events.map((event) => {
    if (!event.travelPlan?.summaryImage) return event;
    changed = true;
    const { summaryImage, ...travelPlan } = event.travelPlan;
    return { ...event, travelPlan };
  });
  if (changed) saveEvents();
}

function normalizeTravelRouteSteps(rawSteps) {
  if (!Array.isArray(rawSteps)) return [];
  return rawSteps.slice(0, 24).map((raw) => {
    const type = ["walk", "subway", "bus"].includes(raw?.type) ? raw.type : "walk";
    const duration = Number(raw?.durationMinutes);
    const stopCount = Number(raw?.stopCount);
    return {
      type,
      line: String(raw?.line || "").slice(0, 80),
      alternateLines: Array.isArray(raw?.alternateLines)
        ? [...new Set(raw.alternateLines.map((line) => String(line || "").slice(0, 40)).filter(Boolean))].slice(0, 8)
        : [],
      boardStation: String(raw?.boardStation || "").slice(0, 120),
      boardTime: normalizeTime(raw?.boardTime || "") || "",
      direction: String(raw?.direction || "").slice(0, 120),
      nextStation: String(raw?.nextStation || "").slice(0, 120),
      stopCount: Number.isFinite(stopCount) && stopCount >= 0 ? stopCount : null,
      stopUnit: raw?.stopUnit === "정류장" ? "정류장" : "역",
      durationMinutes: Number.isFinite(duration) && duration >= 0 ? duration : null,
      alightStation: String(raw?.alightStation || "").slice(0, 120),
      alightTime: normalizeTime(raw?.alightTime || "") || "",
      fastTransfer: String(raw?.fastTransfer || "").slice(0, 80),
      boardingPosition: String(raw?.boardingPosition || "").slice(0, 80),
      exitDoor: String(raw?.exitDoor || "").slice(0, 80),
      exit: String(raw?.exit || "").slice(0, 40),
      distance: String(raw?.distance || "").slice(0, 40)
    };
  }).filter((step) => step.type === "walk" || step.boardStation || step.line);
}

function normalizeNote(note = {}) {
  const now = new Date().toISOString();
  return {
    id: note.id || crypto.randomUUID(),
    title: String(note.title || ""),
    body: String(note.body || ""),
    createdAt: note.createdAt || now,
    updatedAt: note.updatedAt || note.createdAt || now
  };
}

function loadNotes() {
  try {
    const saved = JSON.parse(localStorage.getItem(NOTES_KEY) || "[]");
    return Array.isArray(saved) ? saved.map(normalizeNote) : [];
  } catch (error) {
    console.error("저장된 노트를 불러오지 못했습니다.", error);
    return [];
  }
}

function saveNotes() {
  if (demoMode) return;
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  queueCloudSync();
}

function loadCategoryOrder() {
  try {
    const saved = JSON.parse(localStorage.getItem(CATEGORY_ORDER_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.error("카테고리 순서를 불러오지 못했습니다.", error);
    return [];
  }
}

function saveCategoryOrder() {
  if (demoMode) return;
  localStorage.setItem(CATEGORY_ORDER_KEY, JSON.stringify(categoryOrder));
  queueCloudSync();
}

function loadHomeLocation() {
  try {
    const saved = JSON.parse(localStorage.getItem(HOME_LOCATION_KEY) || "null");
    if (!saved || !Number.isFinite(Number(saved.latitude)) || !Number.isFinite(Number(saved.longitude))) return null;
    return {
      latitude: Number(saved.latitude),
      longitude: Number(saved.longitude),
      name: String(saved.name || "집"),
      address: String(saved.address || "")
    };
  } catch (error) {
    console.error("저장된 집 위치를 불러오지 못했습니다.", error);
    return null;
  }
}

function loadHomeVisibility() {
  return localStorage.getItem(HOME_VISIBLE_KEY) === "true";
}

function saveHomeSettings() {
  if (demoMode) return;
  if (homeLocation) {
    localStorage.setItem(HOME_LOCATION_KEY, JSON.stringify(homeLocation));
  } else {
    localStorage.removeItem(HOME_LOCATION_KEY);
  }
  localStorage.setItem(HOME_VISIBLE_KEY, String(homeVisible));
  queueCloudSync();
}

function plannerState() {
  return {
    version: 11,
    events,
    tasks,
    taskSettings,
    categoryOrder,
    eventGroups,
    notes,
    homeLocation,
    homeVisible,
    savedAt: new Date().toISOString()
  };
}

function setSyncStatus(message, state = "") {
  if (!syncStatus) return;
  syncStatus.textContent = message;
  syncStatus.dataset.state = state;
}

function demoDate(daysFromToday) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return dateInputValue(date);
}

function demoEvents() {
  return [
    normalizeEventTodos({
      id: "demo-yesterday-book-club",
      title: "독서 모임",
      date: demoDate(-1),
      startTime: "19:00",
      endTime: "20:30",
      locationType: "offline",
      location: "합정동 북카페",
      locationDetail: "2층 모임 공간",
      locationAddress: "서울특별시 마포구 합정동",
      latitude: 37.5495,
      longitude: 126.9139,
      category: "SOCIAL",
      groupId: "demo-group-book-club",
      reservationStatus: "booked",
      notes: "어제 완료된 일정의 회색 표시 예시예요.",
      todos: []
    }),
    normalizeEventTodos({
      id: "demo-online-meeting",
      title: "주간 온라인 미팅",
      date: demoDate(0),
      startTime: "09:30",
      endTime: "10:20",
      locationType: "online",
      url: "https://example.com",
      category: "WORK",
      groupId: "demo-group-team-meeting",
      reservationStatus: "none",
      notes: "로그인하면 나만의 일정으로 바꿀 수 있어요.",
      todos: [{
        id: "demo-agenda",
        title: "회의 안건 정리",
        dueDate: demoDate(0),
        dueTime: "09:00",
        submissionRequired: false,
        completed: true
      }]
    }),
    normalizeEventTodos({
      id: "demo-brunch",
      title: "친구와 브런치",
      date: demoDate(0),
      startTime: "12:00",
      endTime: "13:30",
      locationType: "offline",
      location: "연남동 경의선숲길",
      locationDetail: "홍대입구역 3번 출구 근처",
      locationAddress: "서울특별시 마포구 연남동",
      latitude: 37.56205,
      longitude: 126.92494,
      category: "SOCIAL",
      groupId: "demo-group-brunch",
      reservationStatus: "booked",
      notes: "예약자 이름 확인하기",
      todos: [],
      travelPlan: {
        mode: "traffic",
        originKey: "home",
        originName: "한국과학기술원 도곡캠퍼스",
        targetArrival: "12:00",
        durationMinutes: 73,
        naverDepartureTime: "10:45",
        naverArrivalTime: "11:58",
        manual: false,
        capturedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        routeSteps: [
          {
            type: "walk",
            durationMinutes: 7,
            distance: ""
          },
          {
            type: "bus",
            line: "402",
            alternateLines: ["402"],
            direction: "무교동·개포한신아파트 방면",
            boardStation: "매봉역",
            alightStation: "도곡역3번출구",
            stopCount: 3,
            stopUnit: "정류장",
            durationMinutes: 6
          },
          {
            type: "walk",
            durationMinutes: 4,
            distance: ""
          },
          {
            type: "subway",
            line: "수인분당선",
            direction: "왕십리행",
            nextStation: "한티역",
            boardTime: "11:07",
            alightTime: "11:21",
            boardStation: "도곡역",
            alightStation: "왕십리역",
            stopCount: 7,
            stopUnit: "역",
            durationMinutes: 14,
            fastTransfer: "4-4",
            boardingPosition: "2번"
          },
          {
            type: "walk",
            durationMinutes: 2,
            distance: ""
          },
          {
            type: "subway",
            line: "2호선",
            direction: "외선순환행",
            nextStation: "상왕십리역",
            boardTime: "11:26",
            alightTime: "11:47",
            boardStation: "왕십리역",
            alightStation: "홍대입구역",
            stopCount: 12,
            stopUnit: "역",
            durationMinutes: 21,
            fastTransfer: "6-4, 8-2"
          },
          {
            type: "walk",
            durationMinutes: 10,
            distance: ""
          }
        ]
      }
    }),
    normalizeEventTodos({
      id: "demo-station-pickup",
      title: "서울역에서 친구 마중",
      date: demoDate(0),
      startTime: "15:30",
      endTime: "16:10",
      locationType: "offline",
      location: "서울역",
      locationDetail: "KTX 도착층",
      locationAddress: "서울특별시 용산구 한강대로 405",
      latitude: 37.5558,
      longitude: 126.972,
      category: "LIFE",
      reservationStatus: "none",
      notes: "도착 시간 다시 확인하기",
      todos: [{
        id: "demo-train-time",
        title: "열차 도착 시간 확인",
        dueDate: demoDate(0),
        dueTime: "15:00",
        submissionRequired: false,
        completed: false
      }]
    }),
    normalizeEventTodos({
      id: "demo-exhibition",
      title: "저녁 전시 관람",
      date: demoDate(0),
      startTime: "18:30",
      endTime: "20:00",
      locationType: "offline",
      location: "서울시립미술관",
      locationDetail: "서소문본관",
      locationAddress: "서울특별시 중구 덕수궁길 61",
      latitude: 37.5641,
      longitude: 126.9738,
      category: "LIFE",
      groupId: "demo-group-culture",
      reservationStatus: "needed",
      notes: "이 일정은 데모용 샘플입니다.",
      todos: [{
        id: "demo-ticket",
        title: "입장권 확인",
        dueDate: demoDate(0),
        dueTime: "17:30",
        submissionRequired: false,
        completed: false
      }]
    }),
    normalizeEventTodos({
      id: "demo-fitness",
      title: "필라테스 수업",
      date: demoDate(1),
      startTime: "19:00",
      endTime: "20:00",
      locationType: "offline",
      location: "서초구청",
      locationDetail: "운동 스튜디오",
      locationAddress: "서울특별시 서초구 남부순환로 2584",
      latitude: 37.483625,
      longitude: 127.032683,
      category: "LIFE",
      groupId: "demo-group-fitness",
      reservationStatus: "booked",
      notes: "운동복과 물 챙기기",
      todos: [],
      travelPlan: {
        mode: "traffic",
        originKey: "home",
        originName: "한국과학기술원 도곡캠퍼스",
        targetArrival: "19:00",
        durationMinutes: 23,
        naverDepartureTime: "18:25",
        naverArrivalTime: "18:48",
        manual: false,
        capturedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        routeSteps: [
          {
            type: "walk",
            durationMinutes: 4,
            distance: ""
          },
          {
            type: "bus",
            line: "서초21",
            alternateLines: ["서초21"],
            direction: "양재역4번출구 방면",
            boardStation: "원불교",
            alightStation: "서초구청맞은편",
            stopCount: 2,
            stopUnit: "정류장",
            durationMinutes: 7
          },
          {
            type: "walk",
            durationMinutes: 1,
            distance: ""
          }
        ]
      }
    }),
    normalizeEventTodos({
      id: "demo-online-class",
      title: "온라인 강의 듣기",
      date: demoDate(2),
      startTime: "",
      endTime: "",
      locationType: "online",
      url: "https://example.com/class",
      category: "WORK",
      groupId: "demo-group-self-study",
      reservationStatus: "none",
      notes: "시간이 정해지지 않은 종일 일정 예시예요.",
      todos: [{
        id: "demo-assignment",
        title: "과제 초안 제출",
        dueDate: demoDate(3),
        dueTime: "23:59",
        submissionRequired: true,
        completed: false
      }]
    }),
    normalizeEventTodos({
      id: "demo-hotel-cancellation",
      title: "주말 호텔 예약",
      date: demoDate(3),
      startTime: "15:00",
      endTime: "",
      locationType: "offline",
      location: "홍대입구",
      locationDetail: "예약한 호텔",
      locationAddress: "서울특별시 마포구 동교동",
      latitude: 37.5572,
      longitude: 126.9236,
      category: "LIFE",
      groupId: "demo-group-weekend-trip",
      reservationStatus: "considering",
      reservationRequired: true,
      reservationCompleted: true,
      cancellationDeadline: `${demoDate(1)}T18:00`,
      cancellationNotes: "내일 오후 6시 전까지 취소하면 수수료가 없어요.",
      notes: "일정이 확정되지 않아 취소 여부를 결정해야 해요.",
      todos: []
    }),
    normalizeEventTodos({
      id: "demo-workshop",
      title: "디자인 워크숍",
      date: demoDate(4),
      startTime: "13:00",
      endTime: "17:00",
      locationType: "offline",
      location: "성수동",
      locationDetail: "스튜디오",
      locationAddress: "서울특별시 성동구 성수동2가",
      latitude: 37.5446,
      longitude: 127.0557,
      category: "WORK",
      groupId: "demo-group-self-study",
      reservationStatus: "booked",
      notes: "데모 화면을 자유롭게 둘러보세요.",
      todos: [],
      travelPlan: {
        mode: "traffic",
        originKey: "home",
        originName: "한국과학기술원 도곡캠퍼스",
        targetArrival: "13:00",
        durationMinutes: 51,
        naverDepartureTime: "12:00",
        naverArrivalTime: "12:51",
        manual: false,
        capturedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        routeSteps: [
          {
            type: "walk",
            durationMinutes: 4,
            distance: ""
          },
          {
            type: "bus",
            line: "463",
            alternateLines: ["463"],
            direction: "도곡한신아파트 방면",
            boardStation: "원불교앞",
            alightStation: "역삼역7번출구·GS타워",
            stopCount: 5,
            stopUnit: "정류장",
            durationMinutes: 11
          },
          {
            type: "walk",
            durationMinutes: 4,
            distance: ""
          },
          {
            type: "subway",
            line: "2호선",
            direction: "외선순환행",
            nextStation: "선릉역",
            boardTime: "12:23",
            alightTime: "12:43",
            boardStation: "역삼역",
            alightStation: "성수역",
            stopCount: 10,
            stopUnit: "역",
            durationMinutes: 20,
            fastTransfer: "10-4"
          },
          {
            type: "walk",
            durationMinutes: 7,
            distance: ""
          }
        ]
      }
    })
  ];
}

function activateDemoMode() {
  const today = new Date();
  demoMode = true;
  events = demoEvents();
  tasks = tasksFromEventTodos(events);
  taskSettings = normalizeTaskSettings({ recentCompletedDays: 7 });
  categoryOrder = ["WORK", "SOCIAL", "LIFE"];
  eventGroups = [
    normalizeEventGroup({ id: "demo-group-team-meeting", name: "주간 팀미팅", category: "WORK", order: 0 }),
    normalizeEventGroup({ id: "demo-group-self-study", name: "자기계발", category: "WORK", order: 1 }),
    normalizeEventGroup({ id: "demo-group-book-club", name: "독서모임", category: "SOCIAL", order: 0 }),
    normalizeEventGroup({ id: "demo-group-brunch", name: "브런치 모임", category: "SOCIAL", order: 1 }),
    normalizeEventGroup({ id: "demo-group-culture", name: "문화생활", category: "LIFE", order: 0 }),
    normalizeEventGroup({ id: "demo-group-fitness", name: "운동", category: "LIFE", order: 1 }),
    normalizeEventGroup({ id: "demo-group-weekend-trip", name: "주말 여행", category: "LIFE", order: 2 })
  ];
  notes = [];
  homeLocation = {
    latitude: 37.483542,
    longitude: 127.044011,
    name: "한국과학기술원 도곡캠퍼스",
    address: "서울특별시 강남구 논현로28길 25"
  };
  homeVisible = true;
  selectedCategories = new Set(categoryOrder);
  selectedEventId = null;
  selectedNoteId = null;
  timelineStartDate = dateInputValue(today);
  timelineEndDate = "";
  hasExplicitDateFilter = false;
  selectingCalendarRangeEnd = false;
  selectedMapDate = dateInputValue(today);
  calendarCursor = new Date(today.getFullYear(), today.getMonth(), 1);
  showIdleForm();
  renderAll();
}

function restorePrivateLocalState() {
  if (!demoMode) return;
  demoMode = false;
  events = loadEvents();
  tasks = removeClonedRecurringEventTasks(loadTasks(events), events);
  if (events.some((event) => event.todos?.length)) {
    events = events.map((event) => ({ ...event, todos: [] }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }
  taskSettings = loadTaskSettings();
  categoryOrder = loadCategoryOrder();
  eventGroups = loadEventGroups();
  notes = loadNotes();
  homeLocation = loadHomeLocation();
  homeVisible = loadHomeVisibility() && Boolean(homeLocation);
  selectedCategories = new Set(currentCategories());
  selectedEventId = null;
  selectedNoteId = null;
}

function requireSignIn(message = "로그인하면 내 일정을 추가하고 변경할 수 있어요.") {
  if (currentUser) return true;
  authMessage.textContent = message;
  syncAccountCard.scrollIntoView({ behavior: "smooth", block: "center" });
  syncAccountCard.classList.remove("is-highlighted");
  window.requestAnimationFrame(() => syncAccountCard.classList.add("is-highlighted"));
  window.setTimeout(() => syncAccountCard.classList.remove("is-highlighted"), 900);
  authEmailInput.focus({ preventScroll: true });
  return false;
}

function updateAuthView() {
  const signedIn = Boolean(currentUser);
  authSignedOut.hidden = signedIn;
  authSignedIn.hidden = !signedIn;
  authUserEmail.textContent = currentUser?.email || "로그인됨";
  document.querySelectorAll("[data-auth-required]").forEach((section) => {
    section.hidden = false;
  });
  document.body.classList.toggle("is-demo", !signedIn);
  if (!signedIn) setSyncStatus("");
  if (plannerMap) {
    window.setTimeout(() => {
      plannerMap.invalidateSize();
      renderPlannerMap();
    }, 0);
  }
}

function storePlannerState(state) {
  const incomingEvents = Array.isArray(state?.events) ? state.events : [];
  const incomingTasks = Array.isArray(state?.tasks) ? state.tasks : [];
  const incomingCategoryOrder = Array.isArray(state?.categoryOrder) ? state.categoryOrder : [];
  const incomingEventGroups = Array.isArray(state?.eventGroups) ? state.eventGroups : [];
  const incomingHome = state?.homeLocation;
  const incomingNotes = Array.isArray(state?.notes) ? state.notes : [];

  applyingCloudState = true;
  events = incomingEvents.map((event) => normalizeEventTodos({
    ...event,
    id: event.id || crypto.randomUUID(),
    category: normalizedCategory(event.category || "ETC")
  }));
  tasks = removeClonedRecurringEventTasks(
    mergeTaskLists(tasksFromEventTodos(events), incomingTasks),
    events
  );
  events = events.map((event) => ({ ...event, todos: [] }));
  taskSettings = normalizeTaskSettings(state?.taskSettings);
  categoryOrder = incomingCategoryOrder.map(normalizedCategory);
  eventGroups = incomingEventGroups.map(normalizeEventGroup).filter((group) => group.name);
  notes = incomingNotes.map(normalizeNote);
  homeLocation = incomingHome && Number.isFinite(Number(incomingHome.latitude)) && Number.isFinite(Number(incomingHome.longitude))
    ? {
        latitude: Number(incomingHome.latitude),
        longitude: Number(incomingHome.longitude),
        name: String(incomingHome.name || "집"),
        address: String(incomingHome.address || "")
      }
    : null;
  homeVisible = Boolean(state?.homeVisible && homeLocation);
  selectedCategories = new Set(currentCategories());
  if (!notes.some((note) => note.id === selectedNoteId)) selectedNoteId = null;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  localStorage.setItem(TASK_SETTINGS_KEY, JSON.stringify(taskSettings));
  localStorage.setItem(CATEGORY_ORDER_KEY, JSON.stringify(categoryOrder));
  localStorage.setItem(GROUPS_KEY, JSON.stringify(eventGroups));
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  if (homeLocation) {
    localStorage.setItem(HOME_LOCATION_KEY, JSON.stringify(homeLocation));
  } else {
    localStorage.removeItem(HOME_LOCATION_KEY);
  }
  localStorage.setItem(HOME_VISIBLE_KEY, String(homeVisible));
  applyingCloudState = false;
  showIdleForm();
  renderAll();
}

function mergedPlannerState(localState, cloudState) {
  const mergedEvents = new Map();
  (Array.isArray(localState?.events) ? localState.events : []).forEach((event) => mergedEvents.set(event.id, event));
  (Array.isArray(cloudState?.events) ? cloudState.events : []).forEach((event) => mergedEvents.set(event.id, event));

  const cloudCategories = Array.isArray(cloudState?.categoryOrder) ? cloudState.categoryOrder : [];
  const localCategories = Array.isArray(localState?.categoryOrder) ? localState.categoryOrder : [];
  const mergedNotes = new Map();
  [
    ...(Array.isArray(localState?.notes) ? localState.notes : []),
    ...(Array.isArray(cloudState?.notes) ? cloudState.notes : [])
  ].forEach((rawNote) => {
    const note = normalizeNote(rawNote);
    const existing = mergedNotes.get(note.id);
    if (!existing || String(note.updatedAt) >= String(existing.updatedAt)) mergedNotes.set(note.id, note);
  });
  const mergedTasks = removeClonedRecurringEventTasks(mergeTaskLists(
    tasksFromEventTodos(Array.isArray(localState?.events) ? localState.events : []),
    tasksFromEventTodos(Array.isArray(cloudState?.events) ? cloudState.events : []),
    Array.isArray(localState?.tasks) ? localState.tasks : [],
    Array.isArray(cloudState?.tasks) ? cloudState.tasks : []
  ), [...mergedEvents.values()]);
  const mergedGroups = new Map();
  [
    ...(Array.isArray(localState?.eventGroups) ? localState.eventGroups : []),
    ...(Array.isArray(cloudState?.eventGroups) ? cloudState.eventGroups : [])
  ].forEach((rawGroup) => {
    const group = normalizeEventGroup(rawGroup);
    const existing = mergedGroups.get(group.id);
    if (!existing || group.updatedAt >= existing.updatedAt) mergedGroups.set(group.id, group);
  });
  return {
    version: 11,
    events: [...mergedEvents.values()].map((event) => ({ ...event, todos: [] })),
    tasks: mergedTasks,
    taskSettings: normalizeTaskSettings(cloudState?.taskSettings || localState?.taskSettings),
    categoryOrder: [...new Set([...cloudCategories, ...localCategories])],
    eventGroups: [...mergedGroups.values()],
    notes: [...mergedNotes.values()],
    homeLocation: cloudState?.homeLocation || localState?.homeLocation || null,
    homeVisible: cloudState?.homeLocation
      ? Boolean(cloudState.homeVisible)
      : Boolean(localState?.homeVisible),
    savedAt: new Date().toISOString()
  };
}

function queueCloudSync() {
  if (applyingCloudState || !currentUser || !supabaseClient) return;
  cloudSyncQueued = true;
  window.clearTimeout(cloudSyncTimer);
  setSyncStatus("변경사항 저장 중…", "syncing");
  cloudSyncTimer = window.setTimeout(flushCloudSync, 500);
}

async function pushCloudState() {
  const state = plannerState();
  if (cloudCalendarId) {
    const { data, error } = await supabaseClient
      .from("planner_calendars")
      .update({ state, updated_at: state.savedAt })
      .eq("id", cloudCalendarId)
      .eq("owner_id", currentUser.id)
      .select("id")
      .maybeSingle();
    if (error) throw error;
    if (data?.id) {
      cloudOwnerId = currentUser.id;
      localStorage.setItem(CLOUD_OWNER_KEY, cloudOwnerId);
      return data.id;
    }
    cloudCalendarId = "";
    localStorage.removeItem(CLOUD_CALENDAR_KEY);
  }

  const { data, error } = await supabaseClient
    .from("planner_calendars")
    .insert({ owner_id: currentUser.id, name: "내 일정", state, updated_at: state.savedAt })
    .select("id")
    .single();
  if (error) throw error;
  cloudCalendarId = data.id;
  localStorage.setItem(CLOUD_CALENDAR_KEY, cloudCalendarId);
  cloudOwnerId = currentUser.id;
  localStorage.setItem(CLOUD_OWNER_KEY, cloudOwnerId);
  return cloudCalendarId;
}

async function flushCloudSync() {
  if (!currentUser || !supabaseClient) return;
  if (cloudSyncInFlight) return cloudSyncInFlight;

  cloudSyncInFlight = (async () => {
    try {
      do {
        cloudSyncQueued = false;
        await pushCloudState();
      } while (cloudSyncQueued);
      setSyncStatus(`동기화됨 · ${new Intl.DateTimeFormat("ko-KR", { hour: "2-digit", minute: "2-digit" }).format(new Date())}`, "synced");
    } catch (error) {
      console.error("일정을 동기화하지 못했습니다.", error);
      setSyncStatus("이 기기에 저장됨 · 동기화 실패", "error");
    } finally {
      cloudSyncInFlight = null;
    }
  })();
  return cloudSyncInFlight;
}

async function syncFromCloud() {
  if (!currentUser || !supabaseClient) return;
  setSyncStatus("클라우드 일정 확인 중…", "syncing");
  const { data, error } = await supabaseClient
    .from("planner_calendars")
    .select("id, state")
    .eq("owner_id", currentUser.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw error;

  if (!data) {
    cloudCalendarId = "";
    localStorage.removeItem(CLOUD_CALENDAR_KEY);
    cloudSyncQueued = true;
    await flushCloudSync();
    return;
  }

  const alreadyLinked = cloudOwnerId === currentUser.id && cloudCalendarId === data.id;
  cloudCalendarId = data.id;
  localStorage.setItem(CLOUD_CALENDAR_KEY, cloudCalendarId);
  cloudOwnerId = currentUser.id;
  localStorage.setItem(CLOUD_OWNER_KEY, cloudOwnerId);

  if (alreadyLinked) {
    storePlannerState(data.state || {});
    setSyncStatus("최신 일정으로 동기화됨", "synced");
  } else {
    const merged = mergedPlannerState(plannerState(), data.state || {});
    storePlannerState(merged);
    cloudSyncQueued = true;
    await flushCloudSync();
  }
}

async function handleSignedIn(user) {
  const changedAccount = cloudOwnerId && cloudOwnerId !== user.id;
  restorePrivateLocalState();
  currentUser = user;
  if (changedAccount) {
    cloudCalendarId = "";
    cloudOwnerId = "";
    localStorage.removeItem(CLOUD_CALENDAR_KEY);
    localStorage.removeItem(CLOUD_OWNER_KEY);
  }
  authMessage.textContent = "";
  updateAuthView();
  try {
    await syncFromCloud();
  } catch (error) {
    console.error("클라우드 일정을 불러오지 못했습니다.", error);
    setSyncStatus("이 기기의 일정 사용 중 · 연결 실패", "error");
  }
}

async function sendLoginLink() {
  const email = authEmailInput.value.trim();
  if (!email || !authEmailInput.checkValidity()) {
    authMessage.textContent = "올바른 이메일 주소를 입력해주세요.";
    authEmailInput.focus();
    return;
  }

  authLoginButton.disabled = true;
  authMessage.textContent = "로그인 링크를 보내는 중…";
  const redirectUrl = `${window.location.origin}${window.location.pathname}`;
  const { error } = await supabaseClient.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectUrl,
      shouldCreateUser: true
    }
  });
  authLoginButton.disabled = false;
  authMessage.textContent = error
    ? `로그인 링크를 보내지 못했어요: ${error.message}`
    : "메일을 확인해주세요. 받은 링크는 로그인할 기기에서 열어주세요.";
}

async function initializeCloudSync() {
  const config = window.SERIN_SUPABASE_CONFIG;
  if (!window.supabase?.createClient || !config?.url || !config?.publishableKey) {
    activateDemoMode();
    updateAuthView();
    authMessage.textContent = "동기화 서비스를 불러오지 못했어요. 데모만 둘러볼 수 있습니다.";
    return;
  }

  supabaseClient = window.supabase.createClient(config.url, config.publishableKey);
  authLoginButton.addEventListener("click", sendLoginLink);
  authEmailInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") sendLoginLink();
  });
  authLogoutButton.addEventListener("click", async () => {
    await flushCloudSync();
    await supabaseClient.auth.signOut();
  });
  syncNowButton.addEventListener("click", async () => {
    syncNowButton.disabled = true;
    try {
      await syncFromCloud();
    } catch (error) {
      console.error(error);
      setSyncStatus("동기화 실패 · 다시 시도해주세요", "error");
    } finally {
      syncNowButton.disabled = false;
    }
  });

  supabaseClient.auth.onAuthStateChange((event, session) => {
    window.setTimeout(() => {
      if (session?.user && currentUser?.id !== session.user.id) {
        handleSignedIn(session.user);
      } else if (event === "SIGNED_OUT") {
        currentUser = null;
        activateDemoMode();
        authMessage.textContent = "로그아웃됐어요. 일정은 이 기기에도 남아 있습니다.";
        updateAuthView();
      }
    }, 0);
  });

  window.addEventListener("online", () => {
    if (!currentUser) return;
    cloudSyncQueued = true;
    flushCloudSync();
  });

  const { data: { session }, error } = await supabaseClient.auth.getSession();
  if (error) {
    console.error(error);
    authMessage.textContent = "로그인 상태를 확인하지 못했어요.";
  } else if (session?.user) {
    await handleSignedIn(session.user);
  } else {
    activateDemoMode();
    updateAuthView();
  }
}

