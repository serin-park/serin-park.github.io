const STORAGE_KEY = "serin-schedule-events-v1";
const CATEGORY_ORDER_KEY = "serin-schedule-category-order-v1";
const HOME_LOCATION_KEY = "serin-schedule-home-location-v1";
const HOME_VISIBLE_KEY = "serin-schedule-home-visible-v1";
const NOTES_KEY = "serin-schedule-notes-v1";
const TASKS_KEY = "serin-schedule-tasks-v1";
const TASK_SETTINGS_KEY = "serin-schedule-task-settings-v1";
const GROUPS_KEY = "serin-schedule-groups-v1";
const CLOUD_CALENDAR_KEY = "serin-schedule-cloud-calendar-v1";
const CLOUD_OWNER_KEY = "serin-schedule-cloud-owner-v1";

const form = document.querySelector("#eventForm");
const formCard = document.querySelector(".form-card");
const formTitle = document.querySelector("#formTitle");
const formKicker = document.querySelector("#formKicker");
const formPlaceholder = document.querySelector("#formPlaceholder");
const saveButton = document.querySelector("#saveButton");
const newEventButton = document.querySelector("#newEventButton");
const cancelEditButton = document.querySelector("#cancelEditButton");
const clearButton = document.querySelector("#clearButton");
const exportButton = document.querySelector("#exportButton");
const importInput = document.querySelector("#importInput");
const reservationStatusInputs = document.querySelectorAll('input[name="reservationStatus"]');
const cancellationOptions = document.querySelector("#cancellationOptions");
const addTodoButton = document.querySelector("#addTodoButton");
const todoInputList = document.querySelector("#todoInputList");
const todoEmptyNote = document.querySelector("#todoEmptyNote");
const offlineLocationField = document.querySelector("#offlineLocationField");
const onlineLinkField = document.querySelector("#onlineLinkField");
const regularEventFields = document.querySelector("#regularEventFields");
const travelEventFields = document.querySelector("#travelEventFields");
const categoryInput = document.querySelector("#category");
const classificationList = document.querySelector("#classificationList");
const addClassificationButton = document.querySelector("#addClassificationButton");
const categoryMenuButton = document.querySelector("#categoryMenuButton");
const categoryMenu = document.querySelector("#categoryMenu");
const categoryManagerList = document.querySelector("#categoryManagerList");
const categoryManager = document.querySelector(".category-manager");
const categoryManagerEditButton = document.querySelector("#categoryManagerEditButton");
const eventGroupInput = document.querySelector("#eventGroupInput");
const eventGroupOptions = document.querySelector("#eventGroupOptions");
const groupManagerList = document.querySelector("#groupManagerList");
const eventRepeatInput = document.querySelector("#eventRepeatInput");
const recurrenceOptions = document.querySelector("#recurrenceOptions");
const recurrenceFrequency = document.querySelector("#recurrenceFrequency");
const recurrenceInterval = document.querySelector("#recurrenceInterval");
const recurrenceEndDate = document.querySelector("#recurrenceEndDate");
const recurrenceWeekdays = document.querySelector("#recurrenceWeekdays");
const recurrenceMasterNote = document.querySelector("#recurrenceMasterNote");
const timelineView = document.querySelector("#timelineView");
const categoriesView = document.querySelector("#categoriesView");
const tasksView = document.querySelector("#tasksView");
const taskForm = document.querySelector("#taskForm");
const taskTitleInput = document.querySelector("#taskTitleInput");
const taskDueDateInput = document.querySelector("#taskDueDateInput");
const taskDueTimeInput = document.querySelector("#taskDueTimeInput");
const taskEventSelect = document.querySelector("#taskEventSelect");
const taskParentSelect = document.querySelector("#taskParentSelect");
const taskSubmissionInput = document.querySelector("#taskSubmissionInput");
const taskRepeatInput = document.querySelector("#taskRepeatInput");
const taskRepeatOptions = document.querySelector("#taskRepeatOptions");
const taskRepeatFrequency = document.querySelector("#taskRepeatFrequency");
const taskRepeatInterval = document.querySelector("#taskRepeatInterval");
const taskRepeatEndDate = document.querySelector("#taskRepeatEndDate");
const taskRepeatWeekdays = document.querySelector("#taskRepeatWeekdays");
const taskMemoInput = document.querySelector("#taskMemoInput");
const taskChildButton = document.querySelector("#taskChildButton");
const taskArchiveButton = document.querySelector("#taskArchiveButton");
const taskDeleteButton = document.querySelector("#taskDeleteButton");
const notesView = document.querySelector("#notesView");
const notesList = document.querySelector("#notesList");
const newNoteButton = document.querySelector("#newNoteButton");
const noteEditorEmpty = document.querySelector("#noteEditorEmpty");
const noteForm = document.querySelector("#noteForm");
const noteIdInput = document.querySelector("#noteId");
const noteTitleInput = document.querySelector("#noteTitle");
const noteBodyInput = document.querySelector("#noteBody");
const noteSaveStatus = document.querySelector("#noteSaveStatus");
const deleteNoteButton = document.querySelector("#deleteNoteButton");
const travelDialog = document.querySelector("#travelDialog");
const travelForm = document.querySelector("#travelForm");
const travelDialogTitle = document.querySelector("#travelDialogTitle");
const travelCloseButton = document.querySelector("#travelCloseButton");
const travelOriginSelect = document.querySelector("#travelOriginSelect");
const travelDestinationLabel = document.querySelector("#travelDestinationLabel");
const travelDuration = document.querySelector("#travelDuration");
const travelRecommendedDeparture = document.querySelector("#travelRecommendedDeparture");
const travelHelper = document.querySelector("#travelHelper");
const travelStepsPreview = document.querySelector("#travelStepsPreview");
const travelNaverLink = document.querySelector("#travelNaverLink");
const travelManualToggle = document.querySelector("#travelManualToggle");
const travelManualPanel = document.querySelector("#travelManualPanel");
const travelClearButton = document.querySelector("#travelClearButton");
const travelSaveButton = document.querySelector("#travelSaveButton");
const calendarPrevButton = document.querySelector("#calendarPrevButton");
const calendarNextButton = document.querySelector("#calendarNextButton");
const calendarMonthLabel = document.querySelector("#calendarMonthLabel");
const calendarTodayButton = document.querySelector("#calendarTodayButton");
const calendarThisWeekButton = document.querySelector("#calendarThisWeekButton");
const calendarNextWeekButton = document.querySelector("#calendarNextWeekButton");
const calendarFilterBar = document.querySelector("#calendarFilterBar");
const calendarFilterSummary = document.querySelector("#calendarFilterSummary");
const calendarFilterResetButton = document.querySelector("#calendarFilterResetButton");
const miniCalendarGrid = document.querySelector("#miniCalendarGrid");
const mapDateKicker = document.querySelector("#mapDateKicker");
const mapDateLabel = document.querySelector("#mapDateLabel");
const mapEventCount = document.querySelector("#mapEventCount");
const plannerMapPanel = document.querySelector(".planner-map-panel");
const plannerMapContent = document.querySelector("#plannerMapContent");
const plannerMapEmpty = document.querySelector("#plannerMapEmpty");
const upcomingTravelCard = document.querySelector("#upcomingTravelCard");
const upcomingTravelTitle = document.querySelector("#upcomingTravelTitle");
const upcomingTravelDate = document.querySelector("#upcomingTravelDate");
const upcomingTravelRoute = document.querySelector("#upcomingTravelRoute");
const upcomingTravelSteps = document.querySelector("#upcomingTravelSteps");
const homeMapToggle = document.querySelector("#homeMapToggle");
const homeLocationButton = document.querySelector("#homeLocationButton");
const homeLocationEditor = document.querySelector("#homeLocationEditor");
const homeLocationCloseButton = document.querySelector("#homeLocationCloseButton");
const homeLocationInput = document.querySelector("#homeLocationInput");
const homeLocationSearchButton = document.querySelector("#homeLocationSearchButton");
const homeLocationStatus = document.querySelector("#homeLocationStatus");
const homeLocationResults = document.querySelector("#homeLocationResults");
const homeLocationRemoveButton = document.querySelector("#homeLocationRemoveButton");
const locationInput = document.querySelector("#location");
const locationDetailInput = document.querySelector("#locationDetail");
const locationSearchButton = document.querySelector("#locationSearchButton");
const locationSearchStatus = document.querySelector("#locationSearchStatus");
const locationSearchResults = document.querySelector("#locationSearchResults");
const departureLocationInput = document.querySelector("#departureLocation");
const departureLocationDetailInput = document.querySelector("#departureLocationDetail");
const departureLocationSearchButton = document.querySelector("#departureLocationSearchButton");
const departureLocationSearchStatus = document.querySelector("#departureLocationSearchStatus");
const departureLocationSearchResults = document.querySelector("#departureLocationSearchResults");
const destinationLocationInput = document.querySelector("#destinationLocation");
const destinationLocationDetailInput = document.querySelector("#destinationLocationDetail");
const destinationLocationSearchButton = document.querySelector("#destinationLocationSearchButton");
const destinationLocationSearchStatus = document.querySelector("#destinationLocationSearchStatus");
const destinationLocationSearchResults = document.querySelector("#destinationLocationSearchResults");
const authSignedOut = document.querySelector("#authSignedOut");
const authSignedIn = document.querySelector("#authSignedIn");
const authEmailInput = document.querySelector("#authEmailInput");
const authLoginButton = document.querySelector("#authLoginButton");
const authUserEmail = document.querySelector("#authUserEmail");
const authLogoutButton = document.querySelector("#authLogoutButton");
const authMessage = document.querySelector("#authMessage");
const syncStatus = document.querySelector("#syncStatus");
const syncNowButton = document.querySelector("#syncNowButton");
const syncAccountCard = document.querySelector("#syncAccountCard");

let events = loadEvents();
let tasks = removeClonedRecurringEventTasks(loadTasks(events), events);
localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
if (events.some((event) => event.todos?.length)) {
  events = events.map((event) => ({ ...event, todos: [] }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}
let taskSettings = loadTaskSettings();
let categoryOrder = loadCategoryOrder();
let eventGroups = loadEventGroups();
let notes = loadNotes();
let selectedCategories = new Set(currentCategories());
let excludedClassificationKeys = new Set();
let classificationAllCleared = false;
let classificationManagerEditing = false;
let draggedCategoryItem = null;
let draggedCategoryContainer = null;
let selectedEventId = null;
let selectedNoteId = null;
let travelEventId = null;
let travelManualMode = false;
let formMode = "idle";
let timelineStartDate = dateInputValue(new Date());
let timelineEndDate = "";
let hasExplicitDateFilter = false;
let selectingCalendarRangeEnd = false;
let selectedMapDate = dateInputValue(new Date());
let calendarCursor = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let homeLocation = loadHomeLocation();
let homeVisible = loadHomeVisibility() && Boolean(homeLocation);
let selectedLocation = null;
let selectedDepartureLocation = null;
let selectedDestinationLocation = null;
let plannerMap = null;
let plannerMapMarkers = null;
let locationSearchController = null;
let locationSearchKind = null;
let homeSearchController = null;
let lastLocationSearchAt = 0;
let supabaseClient = null;
let currentUser = null;
let cloudCalendarId = localStorage.getItem(CLOUD_CALENDAR_KEY) || "";
let cloudOwnerId = localStorage.getItem(CLOUD_OWNER_KEY) || "";
let cloudSyncTimer = null;
let applyingCloudState = false;
let cloudSyncInFlight = null;
let cloudSyncQueued = false;
let demoMode = false;
let taskViewMode = "active";
let selectedTaskId = null;
let archiveTaskQuery = "";
let archiveTaskStartDate = "";
let archiveTaskEndDate = "";
let archiveTaskStatus = "all";
let archiveTaskDateBasis = "any";

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
      category: "ERRAND",
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
      category: "HEALTH",
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
      category: "STUDY",
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
      category: "TRAVEL",
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
      category: "STUDY",
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
  categoryOrder = ["WORK", "SOCIAL", "ERRAND", "LIFE", "HEALTH", "STUDY", "TRAVEL"];
  eventGroups = [];
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

function normalizedCategory(value) {
  return String(value || "").trim() || "MISC";
}

function normalizeTime(value) {
  const raw = value.trim();
  if (!raw) return "";

  const match = raw.match(/^(\d{1,2}):?(\d{2})$/);
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return null;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function normalizeUrl(value) {
  const raw = value.trim();
  if (!raw) return "";

  try {
    const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const url = new URL(candidate);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch (error) {
    return null;
  }
}

function isTravelEvent(event) {
  return event?.eventKind === "travel";
}

function inferredLocationType(event) {
  if (isTravelEvent(event)) return "offline";
  if (event.locationType === "online" || event.locationType === "offline") {
    return event.locationType;
  }
  return event.url || /온라인/i.test(event.location || "") ? "online" : "offline";
}

function inferredReservationStatus(event) {
  if (["none", "needed", "booked", "considering"].includes(event.reservationStatus)) {
    return event.reservationStatus;
  }
  if (!event.reservationRequired) return "none";
  return event.reservationCompleted ? "booked" : "needed";
}

function currentReservationStatus() {
  return document.querySelector('input[name="reservationStatus"]:checked')?.value || "none";
}

function normalizeEventTodos(event) {
  let todos = Array.isArray(event.todos) ? event.todos : [];
  const storedLocation = String(event.location || "");
  const compactLocation = event.locationAddress && storedLocation === event.locationAddress
    ? storedLocation.split(",")[0].trim() || storedLocation
    : storedLocation;
  if (!todos.length && event.submissionRequired) {
    const [dueDate = "", dueTime = ""] = (event.submissionDeadline || "").split("T");
    todos = [{
      id: `legacy-submission-${event.id}`,
      title: event.submissionItem || "제출",
      dueDate,
      dueTime: dueTime.slice(0, 5),
      submissionRequired: true,
      completed: Boolean(event.submissionCompleted)
    }];
  }

  return {
    ...event,
    groupId: String(event.groupId || ""),
    classifications: normalizeClassificationLinks(event.classifications, {
      category: event.category || "MISC",
      groupId: event.groupId
    }),
    recurrenceSeriesId: String(event.recurrenceSeriesId || ""),
    recurrenceMasterId: String(event.recurrenceMasterId || ""),
    recurrenceException: Boolean(event.recurrenceException),
    recurrenceRule: event.recurrenceRule && typeof event.recurrenceRule === "object" ? {
      frequency: ["daily", "weekly", "monthly"].includes(event.recurrenceRule.frequency) ? event.recurrenceRule.frequency : "weekly",
      interval: Math.max(1, Number(event.recurrenceRule.interval) || 1),
      weekdays: Array.isArray(event.recurrenceRule.weekdays) ? event.recurrenceRule.weekdays.map(Number).filter((day) => day >= 0 && day <= 6) : [],
      endDate: String(event.recurrenceRule.endDate || "")
    } : null,
    eventKind: isTravelEvent(event) ? "travel" : "regular",
    location: compactLocation,
    locationDetail: String(event.locationDetail || ""),
    departureLocation: String(event.departureLocation || ""),
    departureLocationDetail: String(event.departureLocationDetail || ""),
    departureLocationAddress: String(event.departureLocationAddress || ""),
    departureLatitude: event.departureLatitude ?? null,
    departureLongitude: event.departureLongitude ?? null,
    destinationLocation: String(event.destinationLocation || ""),
    destinationLocationDetail: String(event.destinationLocationDetail || ""),
    destinationLocationAddress: String(event.destinationLocationAddress || ""),
    destinationLatitude: event.destinationLatitude ?? null,
    destinationLongitude: event.destinationLongitude ?? null,
    todos: todos.map((todo) => ({
      id: todo.id || crypto.randomUUID(),
      title: String(todo.title || ""),
      dueDate: String(todo.dueDate || ""),
      dueTime: String(todo.dueTime || "").slice(0, 5),
      submissionRequired: Boolean(todo.submissionRequired),
      completed: Boolean(todo.completed)
    }))
  };
}

function currentCategories() {
  return [...new Set([
    ...events.flatMap((event) => event.classifications?.map((link) => link.category) || [normalizedCategory(event.category || "MISC")]),
    ...tasks.flatMap((task) => task.classifications?.map((link) => link.category) || []),
    ...eventGroups.map((group) => group.category),
    ...categoryOrder
  ])];
}

function eventClassificationLinks(event) {
  return normalizeClassificationLinks(event?.classifications, {
    category: event?.category || "MISC",
    groupId: event?.groupId || ""
  });
}

function taskClassificationLinks(task) {
  const linkedEvent = taskLinkedEvent(task);
  return linkedEvent
    ? eventClassificationLinks(linkedEvent)
    : normalizeClassificationLinks(task?.classifications, {
        category: task?.category || "MISC",
        groupId: task?.groupId || ""
      });
}

function classificationKey(link = {}) {
  return `${normalizedCategory(link.category || "MISC")}::${String(link.groupId || "")}`;
}

function matchesClassificationFilter(links) {
  return normalizeClassificationLinks(links).some((link) => !excludedClassificationKeys.has(classificationKey(link)));
}

function eventMatchesClassificationFilter(event) {
  return matchesClassificationFilter(eventClassificationLinks(event));
}

function taskMatchesClassificationFilter(task) {
  return matchesClassificationFilter(taskClassificationLinks(task));
}

function visibleClassificationLinks() {
  const links = [];
  events.filter((event) => dateMatchesActiveFilter(event.date)).forEach((event) => links.push(...eventClassificationLinks(event)));
  tasks.filter((task) => taskMatchesCalendar(task)).forEach((task) => links.push(...taskClassificationLinks(task)));
  const unique = new Map();
  links.forEach((link) => unique.set(classificationKey(link), link));
  return [...unique.values()];
}

function renderClassificationFilterToolbar() {
  const toolbar = element("div", "category-filter-toolbar classification-filter-toolbar");
  const header = element("div", "category-filter-header");
  header.append(element("strong", "", "분류 필터"), element("span", "", "선택한 날짜에 있는 분류만 표시"));
  const actions = element("div", "category-filter-actions");
  const selectAll = element("button", "text-button", "모두 선택");
  const clearAll = element("button", "text-button", "모두 해제");
  selectAll.type = clearAll.type = "button";
  selectAll.addEventListener("click", () => {
    excludedClassificationKeys.clear();
    classificationAllCleared = false;
    renderAll();
  });
  clearAll.addEventListener("click", () => {
    visibleClassificationLinks().forEach((link) => excludedClassificationKeys.add(classificationKey(link)));
    classificationAllCleared = true;
    renderAll();
  });
  actions.append(selectAll, clearAll);
  header.append(actions);
  toolbar.append(header);

  const links = visibleClassificationLinks();
  if (classificationAllCleared) links.forEach((link) => excludedClassificationKeys.add(classificationKey(link)));
  const byCategory = new Map();
  links.forEach((link) => {
    if (!byCategory.has(link.category)) byCategory.set(link.category, []);
    byCategory.get(link.category).push(link);
  });
  const tree = element("div", "classification-filter-tree");
  orderedCategories().filter((category) => byCategory.has(category)).forEach((category) => {
    const categoryLinks = byCategory.get(category);
    const node = element("div", "classification-filter-node");
    const categoryKeys = categoryLinks.map(classificationKey);
    const activeCount = categoryKeys.filter((key) => !excludedClassificationKeys.has(key)).length;
    const categoryButton = element(
      "button",
      `category-filter-button classification-category-filter${activeCount ? " is-active" : ""}${activeCount && activeCount < categoryKeys.length ? " is-mixed" : ""}`,
      `#${category}`
    );
    categoryButton.type = "button";
    categoryButton.setAttribute("aria-pressed", String(activeCount === categoryKeys.length));
    categoryButton.addEventListener("click", () => {
      const turnOn = activeCount !== categoryKeys.length;
      categoryKeys.forEach((key) => turnOn ? excludedClassificationKeys.delete(key) : excludedClassificationKeys.add(key));
      classificationAllCleared = false;
      renderAll();
    });
    node.append(categoryButton);

    const groupList = element("div", "classification-filter-groups");
    categoryLinks
      .sort((a, b) => {
        const first = groupForId(a.groupId)?.order ?? Number.MAX_SAFE_INTEGER;
        const second = groupForId(b.groupId)?.order ?? Number.MAX_SAFE_INTEGER;
        return first - second;
      })
      .forEach((link) => {
        const key = classificationKey(link);
        const group = groupForId(link.groupId);
        const button = element("button", `classification-group-filter${excludedClassificationKeys.has(key) ? "" : " is-active"}`, group?.name || "그룹 없음");
        button.type = "button";
        button.setAttribute("aria-pressed", String(!excludedClassificationKeys.has(key)));
        button.addEventListener("click", () => {
          if (excludedClassificationKeys.has(key)) excludedClassificationKeys.delete(key);
          else excludedClassificationKeys.add(key);
          classificationAllCleared = false;
          renderAll();
        });
        groupList.append(button);
      });
    node.append(groupList);
    tree.append(node);
  });
  toolbar.append(tree);
  return toolbar;
}

function eventLocationLabel(event) {
  if (isTravelEvent(event)) {
    const departure = [event.departureLocation, event.departureLocationDetail]
      .map((part) => String(part || "").trim())
      .filter(Boolean)
      .join(" · ");
    const destination = [event.destinationLocation, event.destinationLocationDetail]
      .map((part) => String(part || "").trim())
      .filter(Boolean)
      .join(" · ");
    return [departure, destination].filter(Boolean).join(" → ");
  }
  return [event.location, event.locationDetail]
    .map((part) => String(part || "").trim())
    .filter(Boolean)
    .join(" · ");
}

function orderedCategories() {
  const categories = currentCategories();
  const categorySet = new Set(categories);
  const previousOrder = [...categoryOrder];

  categoryOrder = categoryOrder.filter((category) => categorySet.has(category));
  categories.forEach((category) => {
    if (!categoryOrder.includes(category)) {
      categoryOrder.push(category);
      selectedCategories.add(category);
    }
  });

  [...selectedCategories].forEach((category) => {
    if (!categorySet.has(category)) selectedCategories.delete(category);
  });

  if (JSON.stringify(previousOrder) !== JSON.stringify(categoryOrder)) {
    saveCategoryOrder();
  }
  return [...categoryOrder];
}

function sortEvents(items) {
  return [...items].sort((a, b) => {
    const dateComparison = a.date.localeCompare(b.date);
    if (dateComparison) return dateComparison;
    if (Boolean(a.startTime) !== Boolean(b.startTime)) return a.startTime ? 1 : -1;
    return (a.startTime || "").localeCompare(b.startTime || "");
  });
}

function formatDate(dateString, options = {}) {
  if (!dateString) return "기한 없음";
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat("ko-KR", options).format(date);
}

function compactDate(dateString, { includeWeekday = true } = {}) {
  if (!dateString) return "기한 없음";
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if ([year, month, day].some((value) => !Number.isFinite(value)) || Number.isNaN(date.getTime())) {
    return dateString;
  }
  const dateText = `${month}. ${day}.`;
  if (!includeWeekday) return dateText;
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  return `${dateText} (${weekday})`;
}

function viewDate(dateString, { includeWeekday = true } = {}) {
  const date = element(
    "time",
    `view-date${dateString === dateInputValue(new Date()) ? " is-today" : ""}`,
    compactDate(dateString, { includeWeekday })
  );
  date.dateTime = dateString;
  return date;
}

function dateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addCalendarDays(date, amount) {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + amount);
  return next;
}

function recurrenceDates(startDate, rule) {
  if (!startDate || !rule?.endDate || rule.endDate < startDate) return [];
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${rule.endDate}T00:00:00`);
  const interval = Math.max(1, Number(rule.interval) || 1);
  const weekdays = new Set((rule.weekdays || []).map(Number));
  const dates = [];
  for (let cursor = new Date(start); cursor <= end && dates.length < 500; cursor = addCalendarDays(cursor, 1)) {
    const elapsedDays = Math.round((cursor - start) / 86400000);
    let matches = false;
    if (rule.frequency === "daily") matches = elapsedDays % interval === 0;
    else if (rule.frequency === "monthly") {
      const elapsedMonths = (cursor.getFullYear() - start.getFullYear()) * 12 + cursor.getMonth() - start.getMonth();
      matches = elapsedMonths % interval === 0 && cursor.getDate() === start.getDate();
    } else {
      const elapsedWeeks = Math.floor(elapsedDays / 7);
      matches = elapsedWeeks % interval === 0 && (weekdays.size ? weekdays.has(cursor.getDay()) : cursor.getDay() === start.getDay());
    }
    if (matches) dates.push(dateInputValue(cursor));
  }
  return dates;
}

function recurrenceSeriesEvents(event) {
  if (!event?.recurrenceSeriesId) return [];
  return events
    .filter((item) => item.recurrenceSeriesId === event.recurrenceSeriesId)
    .sort((a, b) => a.date.localeCompare(b.date) || String(a.createdAt).localeCompare(String(b.createdAt)));
}

function recurrenceMasterFor(event) {
  const series = recurrenceSeriesEvents(event);
  return series.find((item) => item.id === event?.recurrenceMasterId) || series[0] || event;
}

function currentEventRecurrenceRule() {
  return {
    frequency: recurrenceFrequency.value,
    interval: Math.max(1, Number(recurrenceInterval.value) || 1),
    weekdays: [...recurrenceWeekdays.querySelectorAll('input[type="checkbox"]:checked')].map((input) => Number(input.value)),
    endDate: recurrenceEndDate.value
  };
}

function syncEventRecurrenceFields({ initialize = false } = {}) {
  const active = eventRepeatInput.checked;
  recurrenceOptions.hidden = !active;
  recurrenceEndDate.required = active;
  recurrenceWeekdays.hidden = recurrenceFrequency.value !== "weekly";
  if (!active || !initialize) return;
  const startValue = document.querySelector("#date").value;
  if (startValue && !recurrenceEndDate.value) {
    const start = new Date(`${startValue}T00:00:00`);
    const end = new Date(start.getFullYear(), start.getMonth() + 3, start.getDate());
    recurrenceEndDate.value = dateInputValue(end);
  }
  if (startValue && recurrenceFrequency.value === "weekly" && !recurrenceWeekdays.querySelector('input:checked')) {
    const weekday = new Date(`${startValue}T00:00:00`).getDay();
    const checkbox = recurrenceWeekdays.querySelector(`input[value="${weekday}"]`);
    if (checkbox) checkbox.checked = true;
  }
}

function setRecurrenceEditingState(event = null) {
  const master = recurrenceMasterFor(event);
  const isSeriesInstance = Boolean(event?.recurrenceSeriesId);
  const isMaster = !isSeriesInstance || master?.id === event?.id;
  eventRepeatInput.disabled = isSeriesInstance && !isMaster;
  [recurrenceFrequency, recurrenceInterval, recurrenceEndDate].forEach((control) => { control.disabled = isSeriesInstance && !isMaster; });
  recurrenceWeekdays.querySelectorAll("input").forEach((control) => { control.disabled = isSeriesInstance && !isMaster; });
  recurrenceMasterNote.hidden = !isSeriesInstance || isMaster;
  recurrenceMasterNote.textContent = isSeriesInstance && !isMaster
    ? `반복 설정은 첫 일정 ${compactDate(master.date)}에서 변경할 수 있어요.`
    : "";
}

const RECURRING_SHARED_FIELDS = [
  "title", "startTime", "endTime", "eventKind", "locationType", "location", "locationDetail",
  "locationAddress", "latitude", "longitude", "departureLocation", "departureLocationDetail",
  "departureLocationAddress", "departureLatitude", "departureLongitude", "destinationLocation",
  "destinationLocationDetail", "destinationLocationAddress", "destinationLatitude", "destinationLongitude",
  "url", "category", "groupId", "classifications", "reservationStatus", "reservationRequired",
  "reservationCompleted", "cancellationDeadline", "cancellationNotes"
];

function recurringSharedChanged(before, after) {
  return RECURRING_SHARED_FIELDS.some((key) => JSON.stringify(before?.[key] ?? null) !== JSON.stringify(after?.[key] ?? null));
}

function copyRecurringSharedFields(target, source) {
  const next = { ...target };
  RECURRING_SHARED_FIELDS.forEach((key) => { next[key] = source[key]; });
  return next;
}

function dateMatchesActiveFilter(date) {
  if (timelineStartDate && date < timelineStartDate) return false;
  if (timelineEndDate && date > timelineEndDate) return false;
  return true;
}

function dateMatchesTimelineFilter(date) {
  if (demoMode && !hasExplicitDateFilter) {
    return date >= demoDate(-1);
  }
  return dateMatchesActiveFilter(date);
}

function resetCalendarDateFilter() {
  const today = dateInputValue(new Date());
  timelineStartDate = today;
  timelineEndDate = "";
  hasExplicitDateFilter = false;
  selectingCalendarRangeEnd = false;
  selectedMapDate = today;
  calendarCursor = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  renderAll();
}

function selectTodayInCalendar() {
  const now = new Date();
  const today = dateInputValue(now);
  if (hasExplicitDateFilter && timelineStartDate === today && timelineEndDate === today) {
    resetCalendarDateFilter();
    return;
  }
  timelineStartDate = today;
  timelineEndDate = today;
  hasExplicitDateFilter = true;
  selectingCalendarRangeEnd = false;
  selectedMapDate = today;
  calendarCursor = new Date(now.getFullYear(), now.getMonth(), 1);
  renderAll();
}

function calendarWeekRange(weeksAhead = 0) {
  const today = new Date();
  const mondayOffset = (today.getDay() + 6) % 7;
  const start = new Date(today);
  start.setDate(today.getDate() - mondayOffset + (weeksAhead * 7));
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start: dateInputValue(start), end: dateInputValue(end), startDate: start };
}

function selectWeekInCalendar(weeksAhead) {
  const range = calendarWeekRange(weeksAhead);
  if (hasExplicitDateFilter && timelineStartDate === range.start && timelineEndDate === range.end) {
    resetCalendarDateFilter();
    return;
  }
  timelineStartDate = range.start;
  timelineEndDate = range.end;
  hasExplicitDateFilter = true;
  selectingCalendarRangeEnd = false;
  selectedMapDate = weeksAhead === 0 ? dateInputValue(new Date()) : range.start;
  const mapDate = new Date(`${selectedMapDate}T00:00:00`);
  calendarCursor = new Date(mapDate.getFullYear(), mapDate.getMonth(), 1);
  renderAll();
}

function syncCalendarPresetButton(button, active) {
  button.classList.toggle("is-active", active);
  button.setAttribute("aria-pressed", String(active));
}

function selectCalendarFilterDate(value, date) {
  if (hasExplicitDateFilter && timelineStartDate === value && timelineEndDate === value) {
    resetCalendarDateFilter();
    return;
  }

  selectedMapDate = value;
  calendarCursor = new Date(date.getFullYear(), date.getMonth(), 1);

  if (!hasExplicitDateFilter || !selectingCalendarRangeEnd) {
    timelineStartDate = value;
    timelineEndDate = value;
    hasExplicitDateFilter = true;
    selectingCalendarRangeEnd = true;
  } else {
    const firstDate = timelineStartDate;
    timelineStartDate = firstDate < value ? firstDate : value;
    timelineEndDate = firstDate < value ? value : firstDate;
    selectingCalendarRangeEnd = false;
  }
  renderAll();
}

function mapPoint(name, detail, latitude, longitude, role = "location") {
  if (latitude === null || latitude === undefined || latitude === "") return null;
  if (longitude === null || longitude === undefined || longitude === "") return null;
  if (!Number.isFinite(Number(latitude)) || !Number.isFinite(Number(longitude))) return null;
  return {
    name: String(name || "장소"),
    detail: String(detail || ""),
    latitude: Number(latitude),
    longitude: Number(longitude),
    role
  };
}

function eventStartMapPoint(event) {
  if (!event) return null;
  if (isTravelEvent(event)) {
    return mapPoint(
      event.departureLocation,
      event.departureLocationDetail,
      event.departureLatitude,
      event.departureLongitude,
      "departure"
    );
  }
  if (inferredLocationType(event) !== "offline") return null;
  return mapPoint(event.location, event.locationDetail, event.latitude, event.longitude);
}

function eventEndMapPoint(event) {
  if (!event) return null;
  if (isTravelEvent(event)) {
    return mapPoint(
      event.destinationLocation,
      event.destinationLocationDetail,
      event.destinationLatitude,
      event.destinationLongitude,
      "destination"
    );
  }
  return eventStartMapPoint(event);
}

function eventMapPoints(event) {
  const start = eventStartMapPoint(event);
  const end = eventEndMapPoint(event);
  if (!start) return end ? [end] : [];
  if (!end) return [start];
  if (start.latitude === end.latitude && start.longitude === end.longitude) return [start];
  return [start, end];
}

function hasMapCoordinates(event) {
  return Boolean(eventEndMapPoint(event));
}

function initializePlannerMap() {
  if (!window.L) {
    plannerMapEmpty.hidden = false;
    plannerMapEmpty.textContent = "지도를 불러오지 못했어요. 인터넷 연결을 확인해주세요.";
    return;
  }

  plannerMap = window.L.map("plannerMap", {
    zoomControl: true,
    scrollWheelZoom: false
  }).setView([36.35, 127.8], 6);

  window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(plannerMap);

  plannerMapMarkers = window.L.layerGroup().addTo(plannerMap);
  window.setTimeout(() => plannerMap.invalidateSize(), 0);
}

function shiftCalendarMonth(offset) {
  calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() + offset, 1);
  renderPlannerOverview();
}

function renderMiniCalendar() {
  miniCalendarGrid.replaceChildren();
  const year = calendarCursor.getFullYear();
  const month = calendarCursor.getMonth();
  calendarMonthLabel.textContent = `${year}년 ${month + 1}월`;

  const calendarStart = new Date(year, month, 1);
  calendarStart.setDate(calendarStart.getDate() - calendarStart.getDay());
  const today = dateInputValue(new Date());
  const thisWeek = calendarWeekRange(0);
  const nextWeek = calendarWeekRange(1);
  syncCalendarPresetButton(calendarTodayButton, hasExplicitDateFilter && timelineStartDate === today && timelineEndDate === today);
  syncCalendarPresetButton(calendarThisWeekButton, hasExplicitDateFilter && timelineStartDate === thisWeek.start && timelineEndDate === thisWeek.end);
  syncCalendarPresetButton(calendarNextWeekButton, hasExplicitDateFilter && timelineStartDate === nextWeek.start && timelineEndDate === nextWeek.end);
  calendarFilterBar.hidden = !hasExplicitDateFilter;
  calendarFilterSummary.textContent = timelineStartDate === timelineEndDate
      ? `${compactDate(timelineStartDate)}${selectingCalendarRangeEnd ? " · 종료일 선택" : ""}`
      : `${compactDate(timelineStartDate)} – ${compactDate(timelineEndDate)}`;
  const offlineDates = new Set(events
    .filter((event) => inferredLocationType(event) === "offline")
    .map((event) => event.date));

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(calendarStart);
    date.setDate(calendarStart.getDate() + index);
    const value = dateInputValue(date);
    const button = element("button", "calendar-day", String(date.getDate()));
    button.type = "button";
    button.dataset.date = value;
    button.setAttribute("aria-label", formatDate(value, { year: "numeric", month: "long", day: "numeric", weekday: "long" }));
    button.classList.toggle("is-outside", date.getMonth() !== month);
    button.classList.toggle("is-today", value === today);
    const isInRange = hasExplicitDateFilter && value >= timelineStartDate && value <= timelineEndDate;
    const isRangeEdge = isInRange && (value === timelineStartDate || value === timelineEndDate);
    button.classList.toggle("is-in-range", isInRange);
    button.classList.toggle("is-range-edge", isRangeEdge);
    button.classList.toggle("is-selected", !hasExplicitDateFilter && value === selectedMapDate);
    button.classList.toggle("has-offline-events", offlineDates.has(value));
    button.addEventListener("click", () => selectCalendarFilterDate(value, date));
    miniCalendarGrid.append(button);
  }
}

function mapPopupForEvent(event, point, { showDate = false } = {}) {
  const popup = element("div", "map-popup-content");
  const time = event.startTime || "All day";
  const pointRole = point.role === "departure" ? "출발" : point.role === "destination" ? "도착" : "";
  const popupHeading = [
    showDate ? compactDate(event.date) : "",
    time,
    event.title,
    pointRole
  ].filter(Boolean).join(" · ");
  popup.append(
    element("strong", "", popupHeading),
    element("span", "", [point.name, point.detail].filter(Boolean).join(" · ") || "장소 정보 없음")
  );

  const links = element("div", "map-popup-links");
  const coordinates = `${point.latitude},${point.longitude}`;
  const googleLink = element("a", "", "Google 지도");
  googleLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coordinates)}`;
  googleLink.target = "_blank";
  googleLink.rel = "noreferrer";
  const appleLink = element("a", "", "Apple 지도");
  appleLink.href = `https://maps.apple.com/?ll=${encodeURIComponent(coordinates)}&q=${encodeURIComponent(point.name || event.title)}`;
  appleLink.target = "_blank";
  appleLink.rel = "noreferrer";
  links.append(googleLink, appleLink);
  popup.append(links);
  return popup;
}

function travelDepartureDate(event) {
  const plan = event?.travelPlan;
  if (!plan || !event.date) return null;

  const eventStart = event.startTime
    ? new Date(`${event.date}T${event.startTime}:00`)
    : null;
  if (plan.naverDepartureTime) {
    const departure = new Date(`${event.date}T${plan.naverDepartureTime}:00`);
    if (eventStart && departure > eventStart) departure.setDate(departure.getDate() - 1);
    return Number.isNaN(departure.getTime()) ? null : departure;
  }

  const duration = Number(plan.durationMinutes);
  if (!eventStart || !Number.isFinite(duration)) return null;
  return new Date(eventStart.getTime() - duration * 60 * 1000);
}

function nextUpcomingTravelEvent() {
  const now = new Date();
  return events
    .map((event) => ({ event, departure: travelDepartureDate(event) }))
    .filter(({ event, departure }) => (
      event.travelPlan
      && departure
      && departure >= now
      && (hasExplicitDateFilter
        ? dateMatchesActiveFilter(event.date)
        : event.date === selectedMapDate)
    ))
    .sort((a, b) => a.departure - b.departure)[0] || null;
}

function renderUpcomingTravel() {
  const upcoming = nextUpcomingTravelEvent();
  const today = dateInputValue(new Date());
  const layoutChanged = plannerMapContent.classList.contains("has-upcoming-travel") !== Boolean(upcoming);
  plannerMapContent.classList.toggle("has-upcoming-travel", Boolean(upcoming));
  plannerMapPanel.classList.toggle("has-upcoming-travel", Boolean(upcoming));
  upcomingTravelCard.classList.toggle("is-today", Boolean(upcoming && upcoming.event.date === today));
  upcomingTravelCard.hidden = !upcoming;
  if (layoutChanged && plannerMap) {
    window.setTimeout(() => plannerMap.invalidateSize(), 0);
  }
  if (!upcoming) {
    upcomingTravelSteps.replaceChildren();
    return;
  }

  const { event, departure } = upcoming;
  const plan = event.travelPlan;
  const destination = eventStartMapPoint(event);
  const departureClock = `${String(departure.getHours()).padStart(2, "0")}:${String(departure.getMinutes()).padStart(2, "0")}`;
  upcomingTravelTitle.textContent = event.title;
  upcomingTravelDate.textContent = compactDate(event.date);
  upcomingTravelRoute.replaceChildren(
    element("strong", "", plan.originName || "출발지"),
    document.createTextNode(` → ${destination?.name || event.location || event.title}`)
  );
  renderTravelRouteSteps(upcomingTravelSteps, plan);
  if (upcomingTravelSteps.hidden) {
    upcomingTravelSteps.hidden = false;
    const duration = Number(plan.durationMinutes);
    upcomingTravelSteps.append(element(
      "span",
      "planner-upcoming-travel-empty",
      Number.isFinite(duration) ? `예상 소요 ${duration}분 · ${departureClock} 출발` : `${departureClock} 출발`
    ));
  }
}

function renderPlannerMap() {
  const mapStartDate = hasExplicitDateFilter ? timelineStartDate : selectedMapDate;
  const mapEndDate = hasExplicitDateFilter ? timelineEndDate : selectedMapDate;
  const isMapRange = mapStartDate !== mapEndDate;
  mapDateKicker.textContent = isMapRange ? "SELECTED RANGE" : "SELECTED DATE";
  mapDateLabel.textContent = isMapRange
    ? `${compactDate(mapStartDate)} – ${compactDate(mapEndDate)}`
    : compactDate(mapStartDate);
  const offlineEvents = sortEvents(events.filter((event) => (
    event.date >= mapStartDate &&
    event.date <= mapEndDate &&
    inferredLocationType(event) === "offline"
  )));
  const mappedEvents = offlineEvents.filter((event) => eventMapPoints(event).length);
  const mappedPointCount = mappedEvents.reduce((count, event) => count + eventMapPoints(event).length, 0);
  const expectedPointCount = offlineEvents.reduce((count, event) => count + (isTravelEvent(event) ? 2 : 1), 0);
  const unmappedCount = expectedPointCount - mappedPointCount;
  const showHome = homeVisible && Boolean(homeLocation);
  mapEventCount.textContent = offlineEvents.length
    ? `${mappedPointCount}곳${unmappedCount ? ` · 위치 미설정 ${unmappedCount}` : ""}${showHome ? " · 집" : ""}`
    : `일정 없음${showHome ? " · 집" : ""}`;
  homeMapToggle.checked = showHome;
  homeLocationRemoveButton.hidden = !homeLocation;

  if (!plannerMap || !plannerMapMarkers) return;
  plannerMapMarkers.clearLayers();

  const coordinates = [];
  mappedEvents.forEach((event) => {
    eventMapPoints(event).forEach((mapLocation) => {
      const point = [mapLocation.latitude, mapLocation.longitude];
      coordinates.push(point);
      window.L.circleMarker(point, {
        radius: 7,
        color: "#ffffff",
        weight: 2,
        fillColor: mapLocation.role === "departure" ? "#34c759" : "#0071e3",
        fillOpacity: 0.95
      }).bindPopup(mapPopupForEvent(event, mapLocation, { showDate: isMapRange })).addTo(plannerMapMarkers);
    });
  });

  if (showHome) {
    const homePoint = [homeLocation.latitude, homeLocation.longitude];
    coordinates.push(homePoint);
    const homeIcon = window.L.divIcon({
      className: "",
      html: '<span class="home-map-marker" aria-hidden="true">⌂</span>',
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
    window.L.marker(homePoint, { icon: homeIcon })
      .bindPopup(element("strong", "", "집"))
      .addTo(plannerMapMarkers);
  }

  if (!coordinates.length) {
    plannerMapEmpty.hidden = false;
    plannerMapEmpty.textContent = offlineEvents.length
      ? `${isMapRange ? "선택한 기간의" : "이 날짜의"} 오프라인 일정은 아직 지도 위치가 설정되지 않았어요. 일정을 열어 장소를 검색해주세요.`
      : `${isMapRange ? "선택한 기간에는" : "이 날짜에는"} 지도에 표시할 오프라인 일정이 없어요.`;
    plannerMap.setView([36.35, 127.8], 6);
  } else {
    plannerMapEmpty.hidden = true;
    if (coordinates.length === 1) {
      plannerMap.setView(coordinates[0], 14);
    } else {
      plannerMap.fitBounds(coordinates, { padding: [32, 32], maxZoom: 14 });
    }
  }
  window.setTimeout(() => plannerMap.invalidateSize(), 0);
}

function renderPlannerOverview() {
  renderMiniCalendar();
  renderUpcomingTravel();
  renderPlannerMap();
}

function isEventElapsed(event) {
  const today = dateInputValue(new Date());
  if (event.date < today) return true;
  if (event.date > today) return false;
  if (demoMode) return false;

  const comparisonTime = event.endTime || event.startTime;
  if (!comparisonTime) return false;
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  return comparisonTime < currentTime;
}

function isTodoDeadlineElapsed(todo) {
  if (!todo.dueDate) return false;
  const today = dateInputValue(new Date());
  if (todo.dueDate < today) return true;
  if (todo.dueDate > today || !todo.dueTime) return false;
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  return todo.dueTime < currentTime;
}

function formatDeadline(value) {
  if (!value) return "기한 미정";
  const [datePart, timePart = ""] = value.split("T");
  if (!timePart) return compactDate(datePart);
  return `${compactDate(datePart)} · ${timePart.slice(0, 5)}`;
}

function splitSubmissionDeadline(value) {
  if (!value) return { date: "", time: "" };
  const [date, time = ""] = value.split("T");
  return { date, time: time.slice(0, 5) };
}

function cancellationDeadlineSortValue(event) {
  if (!event.cancellationDeadline) return `${event.date}T23:59`;
  return event.cancellationDeadline.includes("T")
    ? event.cancellationDeadline
    : `${event.cancellationDeadline}T23:59`;
}

function deadlineDayLabel(value) {
  if (!value) return "기한 미정";
  const [datePart] = value.split("T");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDay = new Date(`${datePart}T00:00:00`);
  const daysLeft = Math.round((deadlineDay - today) / 86400000);

  if (daysLeft === 0) return "D-Day";
  return daysLeft > 0 ? `D-${daysLeft}` : `D+${Math.abs(daysLeft)}`;
}

function formatTime(event) {
  if (!event.startTime) return "All day";
  return event.endTime ? `${event.startTime}–${event.endTime}` : event.startTime;
}

function parseClockMinutes(value) {
  const normalized = normalizeTime(String(value || ""));
  if (!normalized) return null;
  const [hours, minutes] = normalized.split(":").map(Number);
  return hours * 60 + minutes;
}

function clockLabel(totalMinutes) {
  if (!Number.isFinite(totalMinutes)) return "—";
  const dayOffset = Math.floor(totalMinutes / 1440);
  const wrapped = ((totalMinutes % 1440) + 1440) % 1440;
  const label = `${String(Math.floor(wrapped / 60)).padStart(2, "0")}:${String(wrapped % 60).padStart(2, "0")}`;
  if (dayOffset < 0) return `전날 ${label}`;
  if (dayOffset > 0) return `다음 날 ${label}`;
  return label;
}

function travelOriginCandidates(targetEvent) {
  const earlierEvents = events
    .filter((event) => (
      event.id !== targetEvent.id &&
      event.date === targetEvent.date &&
      inferredLocationType(event) === "offline" &&
      eventEndMapPoint(event) &&
      (event.endTime || event.startTime || "00:00") <= (targetEvent.startTime || "23:59")
    ))
    .sort((a, b) => (b.endTime || b.startTime || "00:00").localeCompare(a.endTime || a.startTime || "00:00"))
    .map((event) => {
      const endpoint = eventEndMapPoint(event);
      return {
        key: `event:${event.id}`,
        name: endpoint.name || event.title,
        label: `${event.endTime || event.startTime || "시간 미정"} · ${event.title} (${endpoint.name || "장소"})`,
        latitude: endpoint.latitude,
        longitude: endpoint.longitude
      };
    });

  if (homeLocation) {
    earlierEvents.push({
      key: "home",
      name: homeLocation.name || "집",
      label: `집 · ${homeLocation.name || homeLocation.address || "저장된 위치"}`,
      latitude: Number(homeLocation.latitude),
      longitude: Number(homeLocation.longitude)
    });
  }
  return earlierEvents;
}

function selectedTravelOrigin() {
  return travelOriginCandidates(events.find((event) => event.id === travelEventId) || {})
    .find((origin) => origin.key === travelOriginSelect.value) || null;
}

function selectedTravelMode() {
  return travelForm.querySelector('input[name="travelMode"]:checked')?.value || "traffic";
}

function updateTravelLinks() {
  const event = events.find((item) => item.id === travelEventId);
  const origin = selectedTravelOrigin();
  const destination = eventStartMapPoint(event);
  if (!event || !origin || !destination) {
    travelNaverLink.removeAttribute("href");
    delete travelNaverLink.dataset.eventId;
    return;
  }

  const mode = selectedTravelMode();
  const destinationName = destination.name || event.title;
  const naverMode = { traffic: "transit", car: "car", walk: "walk", bicycle: "bicycle" }[mode];
  const naverPoint = (name, latitude, longitude) => {
    const latitudeNumber = Math.max(-85.05112878, Math.min(85.05112878, Number(latitude)));
    const longitudeNumber = Number(longitude);
    const worldExtent = 20037508.34;
    const x = longitudeNumber * worldExtent / 180;
    const mercatorLatitude = Math.log(Math.tan((90 + latitudeNumber) * Math.PI / 360)) / (Math.PI / 180);
    const y = mercatorLatitude * worldExtent / 180;
    return `${x},${y},${encodeURIComponent(name)},,PLACE_POI`;
  };
  const naverOrigin = naverPoint(origin.name, origin.latitude, origin.longitude);
  const naverDestination = naverPoint(destinationName, destination.latitude, destination.longitude);
  const naverRoute = naverMode === "transit" ? "transit/1" : naverMode;
  const naverUrl = new URL(`https://map.naver.com/p/directions/${naverOrigin}/${naverDestination}/-/${naverRoute}`);
  if (/^\d{4}-\d{2}-\d{2}$/.test(event.date || "")) {
    const now = new Date();
    const currentTime = [now.getHours(), now.getMinutes()]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");
    naverUrl.searchParams.set("departureTime", `${event.date}T${currentTime}:00`);
  }
  travelNaverLink.href = naverUrl.toString();
  travelNaverLink.target = "_blank";
  travelNaverLink.rel = "noopener noreferrer";
  travelNaverLink.textContent = "네이버지도에서 확인 ↗";
  travelNaverLink.dataset.eventId = event.id;
  travelNaverLink.dataset.eventTitle = event.title;
  travelNaverLink.dataset.originKey = origin.key;
  travelNaverLink.dataset.originName = origin.name;
  travelNaverLink.dataset.targetArrival = event.startTime || "";
  travelNaverLink.dataset.eventDate = event.date || "";
}

function updateTravelCalculations() {
  const event = events.find((item) => item.id === travelEventId);
  const targetMinutes = parseClockMinutes(event?.startTime || "");
  const durationMinutes = Number(travelDuration.value);
  const hasDuration = travelDuration.value !== "" && Number.isFinite(durationMinutes) && durationMinutes >= 0;
  const recommended = targetMinutes !== null && hasDuration
    ? targetMinutes - durationMinutes
    : null;
  travelRecommendedDeparture.textContent = clockLabel(recommended);
}

function setTravelManualMode(active) {
  travelManualMode = Boolean(active);
  travelManualPanel.hidden = !travelManualMode;
  travelManualToggle.setAttribute("aria-expanded", String(travelManualMode));
  travelManualToggle.textContent = travelManualMode ? "수동 입력 취소" : "수동 입력";
  travelManualToggle.classList.toggle("is-active", travelManualMode);
  const event = events.find((item) => item.id === travelEventId);
  if (travelManualMode) {
    travelHelper.textContent = event?.startTime
      ? `${event.startTime} 일정 시작에 맞춰 출발 시간을 계산해요.`
      : "수동 계산을 사용하려면 일정에 시작 시각을 먼저 입력해주세요.";
    updateTravelCalculations();
  } else {
    const saved = event?.travelPlan;
    travelHelper.textContent = saved?.naverDepartureTime
      ? `네이버지도에서 ${saved.durationMinutes}분 경로를 가져왔어요 · ${saved.naverDepartureTime} 출발${saved.naverArrivalTime ? ` · ${saved.naverArrivalTime} 도착` : ""}.`
      : "네이버지도에서 원하는 경로와 출발 시각을 고른 뒤 가져오세요.";
  }
}

function travelStationTerminal(time, station, suffix, note = "", showTime = true) {
  const terminal = element("div", "travel-step-terminal");
  const main = element("div", `travel-step-terminal-main${showTime ? "" : " is-no-time"}`);
  if (showTime) main.append(element("time", "travel-step-time", time || "—"));
  main.append(element("strong", "", station || "역 정보 없음"), element("span", "travel-step-suffix", suffix));
  terminal.append(main);
  if (note) terminal.append(element("span", "travel-terminal-note", note));
  return terminal;
}

function renderTravelRouteSteps(container, plan = {}) {
  container.replaceChildren();
  const steps = normalizeTravelRouteSteps(plan.routeSteps);
  container.hidden = !steps.length;
  if (!steps.length) return;

  const boundary = element("div", "travel-route-boundary");
  boundary.append(
    element("strong", "", `${plan.naverDepartureTime || "—"} 출발`),
    element("span", "", `${plan.naverArrivalTime || "—"} 도착`)
  );
  container.append(boundary);

  steps.forEach((step) => {
    const item = element("article", `travel-route-step is-${step.type}`);
    const icon = element("span", "travel-step-icon", { walk: "🚶", subway: "🚇", bus: "🚌" }[step.type]);
    const body = element("div", "travel-step-body");

    if (step.type === "walk") {
      body.append(element("strong", "travel-step-heading", "도보"));
      const movement = [
        Number.isFinite(step.durationMinutes) ? `${step.durationMinutes}분` : "",
        step.distance
      ].filter(Boolean).join(" · ");
      const details = [movement, step.exit ? `(${step.exit})` : ""].filter(Boolean).join(" ");
      if (details) body.append(element("span", "travel-step-detail", details));
    } else {
      const heading = element("div", "travel-step-heading");
      const lines = step.type === "bus" && step.alternateLines.length
        ? step.alternateLines
        : [step.line || (step.type === "bus" ? "버스" : "지하철")];
      heading.append(element("span", `travel-line-badge is-${step.type}`, lines.join(" · ")));
      const headingDetail = step.type === "bus"
        ? (step.nextStation ? `${step.nextStation} 방면` : step.direction)
        : [step.direction, step.nextStation ? `(${step.nextStation} 방면)` : ""].filter(Boolean).join(" ");
      if (headingDetail) heading.append(element("span", "travel-heading-detail", headingDetail));
      body.append(heading);
      const movement = [
        Number.isFinite(step.stopCount) ? `${step.stopCount}개 ${step.stopUnit}` : "",
        Number.isFinite(step.durationMinutes) ? `${step.durationMinutes}분` : ""
      ].filter(Boolean).join(" · ");
      const stations = element("div", "travel-step-stations");
      const journey = element("div", "travel-step-journey");
      journey.append(element("span", "travel-station-arrow", "→"));
      if (movement) journey.append(element("span", "travel-journey-detail", movement));
      const boardingNote = [
        step.fastTransfer ? `빠른 환승 ${step.fastTransfer}` : "",
        step.boardingPosition ? `타는 곳 ${step.boardingPosition}` : ""
      ].filter(Boolean).join(" · ");
      const showTransitTimes = step.type !== "bus";
      stations.append(
        travelStationTerminal(step.boardTime, step.boardStation, "승차", boardingNote, showTransitTimes),
        journey,
        travelStationTerminal(step.alightTime, step.alightStation, "하차", step.exit, showTransitTimes)
      );
      body.append(stations);
    }

    item.append(icon, body);
    container.append(item);
  });
}

function openTravelPlanner(eventId) {
  const event = events.find((item) => item.id === eventId);
  if (!event || inferredLocationType(event) !== "offline") return;
  const destination = eventStartMapPoint(event);
  if (!destination) {
    window.alert(isTravelEvent(event)
      ? "먼저 일정 보기에서 출발 장소를 검색해 지도 위치를 저장해주세요."
      : "먼저 일정 보기에서 장소를 검색해 지도 위치를 저장해주세요.");
    return;
  }

  const origins = travelOriginCandidates(event);
  if (!origins.length) {
    window.alert("출발지로 사용할 이전 일정이나 집 위치가 없어요. 지도 위의 ‘집 설정’에서 집 위치를 먼저 저장해주세요.");
    return;
  }

  travelEventId = event.id;
  travelDialogTitle.textContent = `${event.title} 출발 시간`;
  const destinationLabel = [destination.name, destination.detail].filter(Boolean).join(" · ") || event.title;
  travelDestinationLabel.textContent = [event.startTime, destinationLabel].filter(Boolean).join(" · ");
  travelOriginSelect.replaceChildren();
  origins.forEach((origin) => {
    const option = element("option", "", origin.label);
    option.value = origin.key;
    travelOriginSelect.append(option);
  });

  const saved = event.travelPlan || {};
  travelOriginSelect.value = origins.some((origin) => origin.key === saved.originKey)
    ? saved.originKey
    : origins[0].key;
  const mode = ["traffic", "car", "walk", "bicycle"].includes(saved.mode) ? saved.mode : "traffic";
  travelForm.querySelector(`input[name="travelMode"][value="${mode}"]`).checked = true;
  travelDuration.value = Number.isFinite(Number(saved.durationMinutes)) ? saved.durationMinutes : "";
  travelClearButton.hidden = !event.travelPlan;
  travelHelper.textContent = saved.naverDepartureTime
    ? `네이버지도에서 ${saved.durationMinutes}분 경로를 가져왔어요 · ${saved.naverDepartureTime} 출발${saved.naverArrivalTime ? ` · ${saved.naverArrivalTime} 도착` : ""}.`
    : "네이버지도에서 원하는 경로와 출발 시각을 고른 뒤 가져오세요.";
  renderTravelRouteSteps(travelStepsPreview, saved);
  setTravelManualMode(Boolean(saved.manual || (saved.durationMinutes !== undefined && !saved.naverDepartureTime)));
  updateTravelLinks();
  travelDialog.showModal();
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function syncTodoEmptyState() {
  todoEmptyNote.hidden = todoInputList.childElementCount > 0;
}

function addTodoInput(todo = {}, focusTitle = false) {
  const item = element("div", "todo-input-item");
  item.dataset.todoId = todo.id || crypto.randomUUID();
  item.dataset.completed = String(Boolean(todo.completed));
  item.dataset.completedAt = todo.completedAt || "";
  item.dataset.archivedAt = todo.archivedAt || "";
  item.dataset.memo = todo.memo || "";
  item.dataset.createdAt = todo.createdAt || "";

  const titleRow = element("div", "todo-title-row");
  const titleField = element("label", "todo-title-field");
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.className = "todo-title-input";
  titleInput.placeholder = "할 일 입력";
  titleInput.setAttribute("aria-label", "할 일");
  titleInput.value = todo.title || "";
  titleInput.required = true;
  titleField.append(titleInput);

  const removeButton = element("button", "todo-remove-button", "삭제");
  removeButton.type = "button";
  removeButton.setAttribute("aria-label", "할 일 항목 삭제");
  removeButton.addEventListener("click", () => {
    item.remove();
    syncTodoEmptyState();
  });
  titleRow.append(titleField, removeButton);

  const metaRow = element("div", "todo-meta-row");
  const dateField = element("label", "todo-compact-field");
  const dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInput.className = "todo-due-date";
  dateInput.setAttribute("aria-label", "완료 날짜");
  dateInput.value = todo.dueDate || "";
  dateField.append(dateInput);

  const timeField = element("label", "todo-compact-field todo-time-field");
  const timeInput = document.createElement("input");
  timeInput.type = "text";
  timeInput.className = "todo-due-time";
  timeInput.inputMode = "numeric";
  timeInput.maxLength = 5;
  timeInput.pattern = "(?:[01]?[0-9]|2[0-3]):?[0-5][0-9]";
  timeInput.placeholder = "23:59";
  timeInput.setAttribute("aria-label", "완료 시간");
  timeInput.value = todo.dueTime || "";
  timeInput.addEventListener("blur", () => {
    const normalized = normalizeTime(timeInput.value);
    if (normalized !== null) timeInput.value = normalized;
  });
  timeField.append(timeInput);

  const submissionLabel = element("label", "check-line todo-submission-check");
  const submissionInput = document.createElement("input");
  submissionInput.type = "checkbox";
  submissionInput.className = "todo-submission-required";
  submissionInput.checked = Boolean(todo.submissionRequired);
  submissionLabel.append(submissionInput, element("span", "", "제출 필요"));
  metaRow.append(dateField, timeField, submissionLabel);

  item.append(titleRow, metaRow);
  todoInputList.append(item);
  syncTodoEmptyState();
  if (focusTitle) titleInput.focus();
}

function renderTodoInputs(todos = []) {
  todoInputList.replaceChildren();
  todos.forEach((todo) => addTodoInput(todo));
  syncTodoEmptyState();
}

function collectTodoInputs() {
  const todos = [];
  for (const item of todoInputList.querySelectorAll(".todo-input-item")) {
    const dueDate = item.querySelector(".todo-due-date").value;
    const dueTime = normalizeTime(item.querySelector(".todo-due-time").value);
    if (dueTime === null) return { error: "할 일 시간은 24시간제로 입력해주세요. 예: 09:00, 16:30" };
    if (dueTime && !dueDate) return { error: "할 일 완료 시간을 입력하려면 완료 날짜도 선택해주세요." };
    todos.push({
      id: item.dataset.todoId,
      title: item.querySelector(".todo-title-input").value.trim(),
      dueDate,
      dueTime,
      submissionRequired: item.querySelector(".todo-submission-required").checked,
      completed: item.dataset.completed === "true",
      completedAt: item.dataset.completedAt || "",
      archivedAt: item.dataset.archivedAt || "",
      memo: item.dataset.memo || "",
      createdAt: item.dataset.createdAt || ""
    });
  }
  return { todos };
}

function eventTasks(eventId) {
  return tasks.filter((task) => task.eventId === eventId && !isArchivedTask(task));
}

function syncEventTasks(eventId, formTodos) {
  const now = new Date().toISOString();
  const linkedEvent = events.find((event) => event.id === eventId);
  const incomingIds = new Set(formTodos.map((todo) => todo.id));
  tasks = tasks.filter((task) => task.eventId !== eventId || isArchivedTask(task) || incomingIds.has(task.id));
  formTodos.forEach((todo) => {
    const existing = tasks.find((task) => task.id === todo.id);
    const completedAt = todo.completed
      ? todo.completedAt || existing?.completedAt || now
      : "";
    const next = normalizeTask({
      ...existing,
      ...todo,
      eventId,
      groupId: linkedEvent?.groupId || existing?.groupId || "",
      classifications: linkedEvent ? eventClassificationLinks(linkedEvent) : existing?.classifications,
      completedAt,
      createdAt: todo.createdAt || existing?.createdAt || now,
      updatedAt: now
    });
    tasks = existing
      ? tasks.map((task) => task.id === next.id ? next : task)
      : [...tasks, next];
  });
}

function emptyState(title, description) {
  const box = element("div", "empty-state");
  box.append(element("strong", "", title), element("p", "", description));
  return box;
}

function statusPill(label, completed) {
  return element(
    "span",
    `status-pill ${completed ? "is-done" : "is-pending"}`,
    `${completed ? "✓" : "•"} ${label}`
  );
}

function reservationStatusPill(event) {
  const status = inferredReservationStatus(event);
  if (status === "none") return null;
  if (status === "needed") return statusPill("예약 필요", false);
  if (status === "booked") return statusPill("예약 완료", true);

  const label = `취소 고려 • ${deadlineDayLabel(event.cancellationDeadline)}`;
  return element("span", "status-pill is-alert", `! ${label}`);
}

function eventCard(event, { showDate = false, showCategory = true, stackDateTime = false, dimmed = false, elapsed = false } = {}) {
  const card = element(
    "details",
    `compact-event${stackDateTime ? " is-stacked" : ""}${dimmed ? " is-dimmed" : ""}${elapsed ? " is-elapsed" : ""}`
  );
  card.dataset.eventId = event.id;
  card.open = selectedEventId === event.id;
  const summary = element("summary", "compact-event-summary");
  const primary = element("span", "compact-event-primary");
  const routeNames = isTravelEvent(event)
    ? [event.departureLocation, event.destinationLocation].filter(Boolean).join(" → ")
    : "";
  const displayedTitle = routeNames ? `${event.title} · ${routeNames}` : event.title;
  if (stackDateTime) {
    const subline = element("span", "compact-event-subline");
    subline.append(viewDate(event.date), document.createTextNode(` · ${event.startTime || "All day"}`));
    primary.append(
      element("span", "compact-event-title", displayedTitle),
      subline
    );
  } else {
    if (showDate) {
      const date = viewDate(event.date);
      date.classList.add("compact-event-date");
      primary.append(date);
    }
    primary.append(
      element("span", `compact-event-time${event.startTime ? "" : " is-all-day"}`, event.startTime || "All day"),
      element("span", "compact-event-divider", "—"),
      element("span", "compact-event-title", displayedTitle)
    );
  }

  const meta = element("span", "compact-event-meta");
  const reservationPill = reservationStatusPill(event);
  if (reservationPill) meta.append(reservationPill);
  const classificationLinks = eventClassificationLinks(event);
  classificationLinks.forEach((link) => {
    const linkedGroup = groupForId(link.groupId);
    if (linkedGroup) meta.append(element("span", "group-pill", linkedGroup.name));
    if (showCategory) meta.append(element("span", "category-pill", link.category));
  });
  summary.append(primary, meta);
  card.append(summary);

  const expanded = element("div", "event-expanded");
  const info = element("div", "event-expanded-info");
  const dateInfo = element("div", "event-info-item");
  const dateValue = element("strong");
  dateValue.append(viewDate(event.date), document.createTextNode(` · ${formatTime(event)}`));
  dateInfo.append(
    element("span", "", isTravelEvent(event) ? "이동 시간" : "일시"),
    dateValue
  );
  info.append(dateInfo);

  const eventGroup = groupForId(event.groupId);
  if (eventGroup) {
    const groupInfo = element("div", "event-info-item");
    groupInfo.append(element("span", "", "그룹"), element("strong", "", eventGroup.name));
    info.append(groupInfo);
  }

  const locationType = inferredLocationType(event);
  const locationText = locationType === "online" ? "온라인" : eventLocationLabel(event);
  if (locationText) {
    const locationInfo = element("div", "event-info-item");
    locationInfo.append(element("span", "", isTravelEvent(event) ? "경로" : "위치"), element("strong", "", locationText));
    info.append(locationInfo);
  }
  expanded.append(info);

  const safeUrl = normalizeUrl(event.url || "");
  if (safeUrl) {
    const link = element("a", "event-link", "링크 열기 ↗");
    link.href = safeUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    expanded.append(link);
  }

  const statuses = element("div", "status-list");
  const expandedReservationPill = reservationStatusPill(event);
  if (expandedReservationPill) statuses.append(expandedReservationPill);
  if (statuses.childElementCount) expanded.append(statuses);

  if (inferredReservationStatus(event) === "considering" && event.cancellationNotes) {
    const cancellationNotes = element("div", "event-notes cancellation-notes");
    cancellationNotes.append(element("strong", "", "취소 관련 메모"), element("p", "", event.cancellationNotes));
    expanded.append(cancellationNotes);
  }

  if (event.notes) {
    const notes = element("div", "event-notes");
    notes.append(element("strong", "", "기타 내용"), element("p", "", event.notes));
    expanded.append(notes);
  }

  if (event.travelPlan?.durationMinutes !== undefined && event.travelPlan?.durationMinutes !== "") {
    const travelSummary = element("div", "event-notes travel-plan-summary");
    const duration = Number(event.travelPlan.durationMinutes);
    const durationText = duration >= 60
      ? `${Math.floor(duration / 60)}시간${duration % 60 ? ` ${duration % 60}분` : ""}`
      : `${duration}분`;
    const target = parseClockMinutes(event.travelPlan.targetArrival);
    const departure = event.travelPlan.naverDepartureTime || (target !== null
      ? clockLabel(target - duration)
      : event.travelPlan.departureTime || "시간 미정");
    travelSummary.append(
      element("strong", "", "이동 계획"),
      element("p", "", `${departure} 출발 · 예상 ${durationText}`)
    );
    if (event.travelPlan.naverArrivalTime) {
      const capturedTimes = [
        event.travelPlan.naverArrivalTime ? `${event.travelPlan.naverArrivalTime} 도착` : ""
      ].filter(Boolean).join(" · ");
      travelSummary.append(element("p", "", `네이버 확인 · ${capturedTimes}`));
    }
    const routeSteps = element("section", "travel-steps-preview compact-travel-steps");
    renderTravelRouteSteps(routeSteps, event.travelPlan);
    if (!routeSteps.hidden) travelSummary.append(routeSteps);
    expanded.append(travelSummary);
  }

  const actions = element("div", "event-actions");
  if (inferredLocationType(event) === "offline") {
    const travelButton = element("button", "travel-check-button", "출발 시간 확인");
    travelButton.type = "button";
    travelButton.addEventListener("click", () => openTravelPlanner(event.id));
    actions.append(travelButton);
  }
  const detailButton = element("button", "detail-button", "자세히 보기");
  detailButton.type = "button";
  detailButton.addEventListener("click", () => {
    showEventInForm(event.id, "view");
    formCard.scrollIntoView({ behavior: "smooth", block: "start" });
    formCard.classList.remove("is-highlighted");
    window.requestAnimationFrame(() => formCard.classList.add("is-highlighted"));
    window.setTimeout(() => formCard.classList.remove("is-highlighted"), 900);
  });

  const deleteButton = element("button", "icon-button", "삭제");
  deleteButton.type = "button";
  deleteButton.addEventListener("click", () => deleteEvent(event.id));
  actions.append(detailButton, deleteButton);
  expanded.append(actions);
  card.append(expanded);

  card.addEventListener("toggle", () => {
    if (!card.open) return;
    selectedEventId = event.id;
    card.closest(".view-panel")?.querySelectorAll(".compact-event[open]").forEach((openCard) => {
      if (openCard !== card) openCard.open = false;
    });
    showEventInForm(event.id, "view");
  });

  return card;
}

function syncTimelineLinkedHighlights() {
  timelineView.querySelectorAll(".compact-event.is-linked-highlight").forEach((card) => {
    card.classList.remove("is-linked-highlight");
  });
  timelineView.querySelectorAll(".submission-deadline-event[open]").forEach((submissionCard) => {
    const linkedEventId = submissionCard.dataset.linkedEventId;
    if (!linkedEventId) return;
    [...timelineView.querySelectorAll(".compact-event[data-event-id]")]
      .find((eventCardElement) => eventCardElement.dataset.eventId === linkedEventId)
      ?.classList.add("is-linked-highlight");
  });
}

function submissionTimelineCard(event, todo, { dimmed = false } = {}) {
  const elapsed = isTodoDeadlineElapsed(todo);
  const card = element(
    "details",
    `compact-event submission-deadline-event${dimmed ? " is-dimmed" : ""}${elapsed ? " is-elapsed" : ""}`
  );
  if (event) card.dataset.linkedEventId = event.id;
  const summary = element("summary", "compact-event-summary");
  const primary = element("span", "compact-event-primary submission-event-primary");
  const time = element(
    "span",
    `compact-event-time${todo.dueTime ? "" : " is-all-day"}`,
    todo.dueTime || "All day"
  );
  const copy = element("span", "submission-event-copy");
  copy.append(
    element(
      "span",
      `submission-event-title${todo.completed ? " is-completed" : ""}`,
      `${todo.completed ? "✓ 제출 완료" : "! 제출 필요"} • ${deadlineDayLabel(todo.dueDate)}`
    ),
    element("span", "compact-event-subline", [todo.title, event?.title].filter(Boolean).join(" · "))
  );
  primary.append(time, element("span", "compact-event-divider", "—"), copy);
  const meta = element("span", "compact-event-meta");
  if (event) eventClassificationLinks(event).forEach((link) => meta.append(element("span", "category-pill", link.category)));
  summary.append(primary, meta);
  card.append(summary);

  const expanded = element("div", "event-expanded");
  const info = element("div", "event-expanded-info");
  const deadlineInfo = element("div", "event-info-item");
  const deadlineValue = element("strong");
  deadlineValue.append(viewDate(todo.dueDate), document.createTextNode(` · ${todo.dueTime || "시간 미정"}`));
  deadlineInfo.append(
    element("span", "", "제출 기한"),
    deadlineValue
  );
  const linkedEventInfo = element("div", "event-info-item");
  linkedEventInfo.append(
    element("span", "", "연결 일정"),
    element("strong", "linked-event-title", event?.title || "연결 안 함")
  );
  info.append(deadlineInfo, linkedEventInfo);
  expanded.append(info);

  const actions = element("div", "event-actions");
  const detailButton = element("button", "detail-button", event ? "연결 일정 보기" : "할 일 보기");
  detailButton.type = "button";
  detailButton.addEventListener("click", () => {
    if (event) {
      showEventInForm(event.id, "view");
      formCard.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      openTaskPanel(todo.id);
    }
  });
  actions.append(detailButton);
  expanded.append(actions);
  card.append(expanded);

  card.addEventListener("toggle", () => {
    if (card.open && event) {
      selectedEventId = event.id;
      card.closest(".view-panel")?.querySelectorAll(".compact-event[open]").forEach((openCard) => {
        if (openCard !== card) openCard.open = false;
      });
      showEventInForm(event.id, "view");
    }
    window.requestAnimationFrame(syncTimelineLinkedHighlights);
  });
  return card;
}

function renderTimeline() {
  timelineView.replaceChildren();
  timelineView.append(renderClassificationFilterToolbar());

  const timelineEntries = [];
  events.forEach((event) => {
    timelineEntries.push({ kind: "event", date: event.date, time: event.startTime || "", event });
  });
  tasks
    .filter((todo) => todo.submissionRequired && todo.dueDate && !isArchivedTask(todo))
    .forEach((todo) => {
      timelineEntries.push({ kind: "submission", date: todo.dueDate, time: todo.dueTime || "", event: taskLinkedEvent(todo), todo });
    });

  const sorted = timelineEntries.filter((entry) => (
    dateMatchesTimelineFilter(entry.date)
    && (entry.kind === "submission" ? taskMatchesClassificationFilter(entry.todo) : eventMatchesClassificationFilter(entry.event))
  )).sort((a, b) => {
    const dateComparison = a.date.localeCompare(b.date);
    if (dateComparison) return dateComparison;
    if (Boolean(a.time) !== Boolean(b.time)) return a.time ? 1 : -1;
    return a.time.localeCompare(b.time);
  });

  if (!sorted.length) {
    const hasDateFilter = timelineStartDate || timelineEndDate;
    timelineView.append(emptyState(
      hasDateFilter ? "이 기간에는 일정이 없어요" : "아직 일정이 없어요",
      hasDateFilter ? "위 달력에서 다른 날짜나 범위를 선택해보세요." : "왼쪽 입력란에서 첫 일정을 추가해보세요."
    ));
    return;
  }

  const byDate = sorted.reduce((groups, entry) => {
    if (!groups[entry.date]) groups[entry.date] = [];
    groups[entry.date].push(entry);
    return groups;
  }, {});

  Object.entries(byDate).forEach(([date, dateEntries]) => {
    const group = element("section", "date-group");
    const label = element("div", `date-label${date === dateInputValue(new Date()) ? " is-today" : ""}`);
    const dateObject = new Date(`${date}T00:00:00`);
    label.append(
      element("strong", "", compactDate(date, { includeWeekday: false })),
      element("span", "", `(${["일", "월", "화", "수", "목", "금", "토"][dateObject.getDay()]})`)
    );

    const list = element("div", "date-events");
    dateEntries.forEach((entry) => {
      const { event } = entry;
      if (entry.kind === "submission") {
        list.append(submissionTimelineCard(event, entry.todo));
      } else {
        list.append(eventCard(event, { elapsed: isEventElapsed(event) }));
      }
    });
    group.append(label, list);
    timelineView.append(group);
  });
}

function renderCategories() {
  categoriesView.replaceChildren();
  categoriesView.append(renderClassificationFilterToolbar());
  const categories = orderedCategories();
  const visibleEvents = events.filter((event) => dateMatchesActiveFilter(event.date) && eventMatchesClassificationFilter(event));

  if (!categories.length) {
    categoriesView.append(emptyState("표시할 카테고리가 없어요", "일정을 추가하면 카테고리 카드가 자동으로 생깁니다."));
    return;
  }

  const grouped = sortEvents(visibleEvents).reduce((groups, event) => {
    eventClassificationLinks(event).forEach((link) => {
      if (!groups[link.category]) groups[link.category] = [];
      groups[link.category].push(event);
    });
    return groups;
  }, {});

  const grid = element("div", "category-grid");
  categories
    .filter((category) => grouped[category]?.length)
    .forEach((category) => {
      const categoryEvents = grouped[category] || [];
      const card = element("article", "category-card");
      const heading = element("div", "category-heading");
      heading.append(
        element("h2", "", category),
        element("span", "", `${categoryEvents.length}개`)
      );

      const list = element("div", "category-events");
      categoryEvents.forEach((event) => {
        list.append(eventCard(event, {
          showCategory: false,
          stackDateTime: true,
          elapsed: isEventElapsed(event)
        }));
      });

      card.append(heading, list);
      grid.append(card);
    });

  if (grid.childElementCount) {
    categoriesView.append(grid);
  } else {
    categoriesView.append(emptyState(
      "선택한 조건에 일정이 없어요",
      "날짜나 분류 필터를 바꿔보세요."
    ));
  }
}

function renderCategoryControls() {
  categoryManagerList.replaceChildren();
  categoryManager.classList.toggle("is-editing", classificationManagerEditing);
  categoryManagerEditButton.textContent = classificationManagerEditing ? "완료" : "수정";
  const categories = orderedCategories();

  renderCategoryMenu(categories);

  categories.forEach((category) => {
    const node = element("section", "classification-manager-node");
    node.dataset.category = category;
    const row = element("div", "category-manager-row");
    const dragHandle = element("button", "category-drag-handle", "⠿");
    dragHandle.type = "button";
    dragHandle.draggable = true;
    dragHandle.title = `${category} 순서 변경`;
    dragHandle.setAttribute("aria-label", `${category} 카테고리 순서 변경`);
    row.classList.toggle("is-viewing", !classificationManagerEditing);
    row.append(dragHandle);
    if (classificationManagerEditing) {
      const input = document.createElement("input");
      input.type = "text";
      input.value = category;
      input.setAttribute("aria-label", `${category} 카테고리 새 이름`);
      const button = element("button", "", "변경");
      button.type = "button";
      button.addEventListener("click", () => renameCategory(category, input.value));
      const remove = element("button", "category-manager-delete", "삭제");
      remove.type = "button";
      remove.disabled = category === "MISC";
      remove.title = category === "MISC" ? "MISC는 기본 카테고리라 삭제할 수 없어요." : `${category} 카테고리 삭제`;
      remove.addEventListener("click", () => deleteCategory(category));
      input.addEventListener("keydown", (keyEvent) => {
        if (keyEvent.key === "Enter") {
          keyEvent.preventDefault();
          renameCategory(category, input.value);
        }
      });
      row.append(input, button, remove);
    } else {
      row.append(element("strong", "category-manager-name", category));
    }

    const groupList = element("div", "classification-manager-groups");
    groupsForCategory(category).forEach((group) => {
      const groupRow = element("div", "group-manager-row");
      groupRow.dataset.groupId = group.id;
      const groupDrag = element("button", "group-drag-handle", "⠿");
      groupDrag.type = "button";
      groupDrag.draggable = true;
      groupDrag.setAttribute("aria-label", `${group.name} 그룹 이동`);
      groupRow.classList.toggle("is-viewing", !classificationManagerEditing);
      groupRow.append(groupDrag);
      if (classificationManagerEditing) {
        const groupInput = document.createElement("input");
        groupInput.type = "text";
        groupInput.value = group.name;
        const groupSave = element("button", "", "변경");
        groupSave.type = "button";
        groupSave.addEventListener("click", () => renameEventGroup(group.id, groupInput.value));
        const groupRemove = element("button", "group-manager-delete", "삭제");
        groupRemove.type = "button";
        groupRemove.addEventListener("click", () => deleteEventGroup(group.id));
        groupRow.append(groupInput, groupSave, groupRemove);
      } else {
        groupRow.append(element("span", "group-manager-name", group.name));
      }
      groupList.append(groupRow);
    });
    if (!groupList.childElementCount) groupList.append(element("span", "classification-group-empty", "그룹 없음"));
    if (classificationManagerEditing) {
      const addGroup = element("button", "classification-manager-add", "+ 그룹 추가");
      addGroup.type = "button";
      addGroup.addEventListener("click", () => {
        const name = window.prompt(`#${category}에 추가할 그룹 이름을 입력해주세요.`);
        if (!name?.trim()) return;
        ensureEventGroup(name, category);
        saveEventGroups();
        renderAll();
      });
      groupList.append(addGroup);
    }
    node.append(row, groupList);
    categoryManagerList.append(node);
  });

  if (!categories.length) {
    categoryManagerList.append(element("span", "category-manager-empty", "일정을 추가하면 카테고리가 생겨요."));
  }

  if (classificationManagerEditing) {
    const addCategoryRow = element("div", "classification-category-add");
    const addCategoryInput = document.createElement("input");
    addCategoryInput.type = "text";
    addCategoryInput.placeholder = "카테고리 이름";
    addCategoryInput.setAttribute("aria-label", "새 카테고리 이름");
    const addCategoryButton = element("button", "", "+ 추가");
    addCategoryButton.type = "button";
    const createCategory = () => {
      const category = normalizedCategory(addCategoryInput.value);
      if (!addCategoryInput.value.trim()) return;
      if (!categoryOrder.includes(category)) categoryOrder.push(category);
      selectedCategories.add(category);
      saveCategoryOrder();
      renderAll();
    };
    addCategoryButton.addEventListener("click", createCategory);
    addCategoryInput.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      createCategory();
    });
    addCategoryRow.append(addCategoryInput, addCategoryButton);
    categoryManagerList.append(addCategoryRow);
  }

  setupCategoryDragSorting(categoryManagerList);
  setupGroupDragSorting(categoryManagerList);
}

function setupGroupDragSorting(container) {
  if (container.dataset.groupDragReady === "true") return;
  container.dataset.groupDragReady = "true";
  let draggedGroup = null;

  container.addEventListener("dragstart", (dragEvent) => {
    const row = dragEvent.target.closest("[data-group-id]");
    if (!row) return;
    draggedGroup = row;
    row.classList.add("is-dragging");
    dragEvent.dataTransfer.effectAllowed = "move";
    dragEvent.dataTransfer.setData("text/plain", row.dataset.groupId);
    dragEvent.stopPropagation();
  });
  container.addEventListener("dragover", (dragEvent) => {
    if (!draggedGroup) return;
    const node = dragEvent.target.closest(".classification-manager-node");
    if (!node) return;
    dragEvent.preventDefault();
    const list = node.querySelector(".classification-manager-groups");
    list.querySelector(".classification-group-empty")?.remove();
    const target = dragEvent.target.closest("[data-group-id]");
    if (target && target !== draggedGroup) {
      const before = dragEvent.clientY < target.getBoundingClientRect().top + target.offsetHeight / 2;
      list.insertBefore(draggedGroup, before ? target : target.nextSibling);
    } else if (!target) {
      list.append(draggedGroup);
    }
  });
  container.addEventListener("dragend", () => {
    if (!draggedGroup) return;
    const now = new Date().toISOString();
    container.querySelectorAll(".classification-manager-node").forEach((node) => {
      [...node.querySelectorAll("[data-group-id]")].forEach((row, order) => {
        eventGroups = eventGroups.map((group) => group.id === row.dataset.groupId
          ? { ...group, category: node.dataset.category, order, updatedAt: now }
          : group);
      });
    });
    const groupCategories = new Map(eventGroups.map((group) => [group.id, group.category]));
    events = events.map((event) => {
      const classifications = eventClassificationLinks(event).map((link) => groupCategories.has(link.groupId)
        ? { ...link, category: groupCategories.get(link.groupId) }
        : link);
      return { ...event, classifications, category: classifications[0]?.category || "MISC" };
    });
    tasks = tasks.map((task) => ({
      ...task,
      classifications: normalizeClassificationLinks(task.classifications, task).map((link) => groupCategories.has(link.groupId)
        ? { ...link, category: groupCategories.get(link.groupId) }
        : link),
      updatedAt: now
    }));
    draggedGroup.classList.remove("is-dragging");
    draggedGroup = null;
    saveEventGroups();
    saveEvents();
    saveTasks();
    renderAll();
  });
}

function groupForId(id) {
  return eventGroups.find((group) => group.id === id) || null;
}

function groupsForCategory(category = "") {
  const normalized = category ? normalizedCategory(category) : "";
  return [...eventGroups]
    .filter((group) => !normalized || group.category === normalized)
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "ko-KR"));
}

function renderEventGroupOptions() {
  eventGroupOptions.replaceChildren();
  groupsForCategory(categoryInput.value).forEach((group) => {
    const option = document.createElement("option");
    option.value = group.name;
    option.label = `${group.category} · ${group.name}`;
    eventGroupOptions.append(option);
  });
}

function ensureEventGroup(name, category) {
  const cleanName = String(name || "").trim().slice(0, 80);
  if (!cleanName) return null;
  const cleanCategory = normalizedCategory(category);
  const existing = eventGroups.find((group) => (
    group.category === cleanCategory && group.name.toLocaleLowerCase("ko-KR") === cleanName.toLocaleLowerCase("ko-KR")
  ));
  if (existing) return existing;
  const now = new Date().toISOString();
  const group = normalizeEventGroup({ name: cleanName, category: cleanCategory, createdAt: now, updatedAt: now });
  eventGroups.push(group);
  return group;
}

function addClassificationInput(link = {}, focus = false) {
  const row = element("div", "classification-row");
  const categorySelect = document.createElement("select");
  categorySelect.className = "classification-category";
  categorySelect.setAttribute("aria-label", "카테고리");
  const categories = orderedCategories();
  const requestedCategory = normalizedCategory(link.category || categories[0] || "MISC");
  [...new Set([...categories, requestedCategory, "MISC"])].forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = `#${category}`;
    categorySelect.append(option);
  });
  categorySelect.value = requestedCategory;

  const groupInput = document.createElement("input");
  groupInput.className = "classification-group";
  groupInput.type = "text";
  groupInput.placeholder = "그룹 없음";
  groupInput.autocomplete = "off";
  groupInput.setAttribute("aria-label", "그룹");
  const groupListId = `classification-groups-${crypto.randomUUID()}`;
  const dataList = document.createElement("datalist");
  dataList.id = groupListId;
  groupInput.setAttribute("list", groupListId);

  const updateGroupChoices = () => {
    dataList.replaceChildren();
    groupsForCategory(categorySelect.value).forEach((group) => {
      const option = document.createElement("option");
      option.value = group.name;
      dataList.append(option);
    });
  };
  updateGroupChoices();
  const linkedGroup = groupForId(link.groupId);
  groupInput.value = linkedGroup?.name || "";
  categorySelect.addEventListener("change", () => {
    groupInput.value = "";
    updateGroupChoices();
  });

  const remove = element("button", "classification-remove", "삭제");
  remove.type = "button";
  remove.addEventListener("click", () => {
    row.remove();
    if (!classificationList.childElementCount) addClassificationInput({ category: "MISC" });
  });
  row.append(categorySelect, groupInput, remove, dataList);
  classificationList.append(row);
  if (focus) categorySelect.focus({ preventScroll: true });
}

function renderClassificationInputs(links = []) {
  classificationList.replaceChildren();
  const normalized = normalizeClassificationLinks(links, { category: "MISC" });
  normalized.forEach((link) => addClassificationInput(link));
}

function collectClassificationInputs() {
  const links = [...classificationList.querySelectorAll(".classification-row")].map((row) => {
    const category = normalizedCategory(row.querySelector(".classification-category")?.value || "MISC");
    const groupName = row.querySelector(".classification-group")?.value.trim() || "";
    const group = ensureEventGroup(groupName, category);
    return { category, groupId: group?.id || "" };
  });
  return normalizeClassificationLinks(links, { category: "MISC" });
}

function renameEventGroup(id, requestedName) {
  if (!requireSignIn("로그인하면 그룹을 변경할 수 있어요.")) return;
  const group = groupForId(id);
  const name = String(requestedName || "").trim().slice(0, 80);
  if (!group || !name) return window.alert("새 그룹 이름을 입력해주세요.");
  if (name !== group.name && !window.confirm(`그룹 이름을 “${name}”(으)로 바꾸면 이 그룹에 연결된 모든 일정과 할 일에 함께 표시됩니다. 변경할까요?`)) return;
  const duplicate = eventGroups.find((item) => item.id !== id && item.category === group.category && item.name === name);
  if (duplicate) {
    if (!window.confirm(`이미 “${name}” 그룹이 있어요. 두 그룹을 합칠까요?`)) return;
    events = events.map((event) => ({
      ...event,
      groupId: event.groupId === id ? duplicate.id : event.groupId,
      classifications: eventClassificationLinks(event).map((link) => link.groupId === id ? { ...link, groupId: duplicate.id } : link)
    }));
    tasks = tasks.map((task) => ({
      ...task,
      groupId: task.groupId === id ? duplicate.id : task.groupId,
      classifications: normalizeClassificationLinks(task.classifications, task).map((link) => link.groupId === id ? { ...link, groupId: duplicate.id } : link)
    }));
    eventGroups = eventGroups.filter((item) => item.id !== id);
  } else {
    eventGroups = eventGroups.map((item) => item.id === id ? { ...item, name, updatedAt: new Date().toISOString() } : item);
  }
  saveEventGroups();
  saveEvents();
  saveTasks();
  renderAll();
}

function deleteEventGroup(id) {
  if (!requireSignIn("로그인하면 그룹을 삭제할 수 있어요.")) return;
  const group = groupForId(id);
  if (!group || !window.confirm(`“${group.name}” 그룹을 삭제할까요? 일정과 할 일은 삭제되지 않아요.`)) return;
  const now = new Date().toISOString();
  events = events.map((event) => ({
    ...event,
    groupId: event.groupId === id ? "" : event.groupId,
    classifications: eventClassificationLinks(event).map((link) => link.groupId === id ? { ...link, groupId: "" } : link)
  }));
  tasks = tasks.map((task) => ({
    ...task,
    groupId: task.groupId === id ? "" : task.groupId,
    classifications: normalizeClassificationLinks(task.classifications, task).map((link) => link.groupId === id ? { ...link, groupId: "" } : link),
    updatedAt: now
  }));
  eventGroups = eventGroups.filter((item) => item.id !== id);
  saveEventGroups();
  saveEvents();
  saveTasks();
  renderAll();
}

function renderEventGroupControls() {
  renderEventGroupOptions();
  groupManagerList.replaceChildren();
  const groups = [...eventGroups].sort((a, b) => (
    a.category.localeCompare(b.category, "ko-KR") || a.name.localeCompare(b.name, "ko-KR")
  ));
  groups.forEach((group) => {
    const row = element("div", "group-manager-row");
    const category = element("span", "group-manager-category", group.category);
    const input = document.createElement("input");
    input.type = "text";
    input.value = group.name;
    input.setAttribute("aria-label", `${group.name} 그룹 새 이름`);
    const save = element("button", "", "변경");
    save.type = "button";
    save.addEventListener("click", () => renameEventGroup(group.id, input.value));
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        renameEventGroup(group.id, input.value);
      }
    });
    const remove = element("button", "group-manager-delete", "삭제");
    remove.type = "button";
    remove.addEventListener("click", () => deleteEventGroup(group.id));
    row.append(category, input, save, remove);
    groupManagerList.append(row);
  });
  if (!groups.length) groupManagerList.append(element("span", "category-manager-empty", "그룹을 지정한 일정을 저장하면 여기에 생겨요."));
}

function renderCategoryMenu(categories = orderedCategories()) {
  categoryMenu.replaceChildren();
  const currentValue = categoryInput.value.trim() ? normalizedCategory(categoryInput.value) : "";
  const visibleCategories = categories.length ? categories : ["ETC"];

  visibleCategories.forEach((category) => {
    const option = element("button", "category-menu-option");
    option.type = "button";
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", String(currentValue === category));

    const check = element("span", "category-menu-check", currentValue === category ? "✓" : "");
    check.setAttribute("aria-hidden", "true");
    option.append(check, element("span", "", category));
    option.addEventListener("click", () => {
      categoryInput.value = category;
      renderEventGroupOptions();
      categoryInput.focus({ preventScroll: true });
      closeCategoryMenu();
    });
    categoryMenu.append(option);
  });

  categoryMenu.append(element("p", "category-menu-hint", "새 카테고리는 칸에 직접 입력할 수 있어요."));
}

function openCategoryMenu() {
  renderCategoryMenu();
  categoryMenu.hidden = false;
  categoryInput.setAttribute("aria-expanded", "true");
}

function closeCategoryMenu() {
  categoryMenu.hidden = true;
  categoryInput.setAttribute("aria-expanded", "false");
}

function setupCategoryDragSorting(container) {
  if (container.dataset.dragReady === "true") return;
  container.dataset.dragReady = "true";

  container.addEventListener("dragstart", (dragEvent) => {
    if (dragEvent.target.closest("[data-group-id]")) return;
    const item = dragEvent.target.closest("[data-category]");
    if (!item || !container.contains(item)) return;
    if (!requireSignIn("로그인하면 카테고리 순서를 변경할 수 있어요.")) {
      dragEvent.preventDefault();
      return;
    }
    draggedCategoryItem = item;
    draggedCategoryContainer = container;
    dragEvent.dataTransfer.effectAllowed = "move";
    dragEvent.dataTransfer.setData("text/plain", item.dataset.category);
    window.requestAnimationFrame(() => item.classList.add("is-dragging"));
  });

  container.addEventListener("dragover", (dragEvent) => {
    if (!draggedCategoryItem || draggedCategoryContainer !== container) return;
    dragEvent.preventDefault();
    dragEvent.dataTransfer.dropEffect = "move";

    const target = dragEvent.target.closest("[data-category]");
    if (!target || target === draggedCategoryItem || !container.contains(target)) return;

    const box = target.getBoundingClientRect();
    const isWrappedRow = container.classList.contains("category-filter-list");
    const shouldInsertAfter = isWrappedRow
      ? (dragEvent.clientY > box.bottom ||
        (dragEvent.clientY >= box.top && dragEvent.clientX > box.left + box.width / 2))
      : dragEvent.clientY > box.top + box.height / 2;

    container.insertBefore(draggedCategoryItem, shouldInsertAfter ? target.nextSibling : target);
  });

  container.addEventListener("drop", (dropEvent) => {
    if (draggedCategoryContainer === container) dropEvent.preventDefault();
  });

  container.addEventListener("dragend", () => {
    if (!draggedCategoryItem || draggedCategoryContainer !== container) return;
    draggedCategoryItem.classList.remove("is-dragging");
    categoryOrder = [...container.querySelectorAll("[data-category]")]
      .map((item) => item.dataset.category);
    saveCategoryOrder();
    draggedCategoryItem = null;
    draggedCategoryContainer = null;
    renderAll();
  });
}

function reservationTaskItem(event) {
  const item = element(
    "div",
    `task-item${isEventElapsed(event) ? " is-elapsed" : ""}`
  );
  const label = element("div", "task-check");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = false;
  checkbox.setAttribute("aria-label", `${event.title} 예약 완료`);
  checkbox.addEventListener("change", () => updateReservationTask(event.id, checkbox.checked));

  const copy = element("span", "task-copy");
  const scheduleLine = element("span");
  scheduleLine.append(viewDate(event.date), document.createTextNode(" · 예약"));
  copy.append(
    element("strong", "", event.title),
    scheduleLine
  );
  label.append(checkbox, copy);
  item.append(label, element("span", "category-pill", event.category));
  return item;
}

function taskLinkedEvent(task) {
  return events.find((event) => event.id === task.eventId) || null;
}

function taskLinkedGroup(task) {
  return groupForId(task.groupId);
}

function taskRelevantDates(task) {
  const linked = taskLinkedEvent(task);
  const groupIds = new Set(taskClassificationLinks(task).map((link) => link.groupId).filter(Boolean));
  const groupDates = groupIds.size
    ? events.filter((event) => eventClassificationLinks(event).some((link) => groupIds.has(link.groupId))).map((event) => event.date)
    : [];
  return [...new Set([task.dueDate, linked?.date, ...groupDates].filter(Boolean))];
}

function taskMatchesCalendar(task) {
  const dates = taskRelevantDates(task);
  if (!hasExplicitDateFilter) return true;
  return dates.some((date) => dateMatchesActiveFilter(date));
}

function taskCompletedAt(task) {
  return task.completedAt ? new Date(task.completedAt) : null;
}

function isRecentlyCompletedTask(task) {
  if (!task.completed || task.archivedAt) return false;
  const days = taskSettings.recentCompletedDays;
  if (days === -1) return true;
  if (days === 0) return false;
  const completedAt = taskCompletedAt(task);
  if (!completedAt || Number.isNaN(completedAt.getTime())) return false;
  return Date.now() - completedAt.getTime() < days * 24 * 60 * 60 * 1000;
}

function isArchivedTask(task) {
  return Boolean(task.archivedAt) || (task.completed && !isRecentlyCompletedTask(task));
}

function taskSortValue(task) {
  return `${task.dueDate || "9999-12-31"}T${task.dueTime || "23:59"}-${task.createdAt}`;
}

function todoTaskItem(todo, options = {}) {
  const event = taskLinkedEvent(todo);
  const group = taskLinkedGroup(todo);
  const depth = Math.max(0, Number(options.depth) || 0);
  const item = element("div", `task-item task-record${todo.completed ? " is-done" : ""}${depth ? " is-child" : ""}`);
  item.style.setProperty("--task-depth", String(depth));
  const label = element("div", "task-check");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;
  checkbox.setAttribute("aria-label", `${todo.title} 완료`);
  checkbox.addEventListener("change", () => updateTodoTask(todo.id, checkbox.checked));

  const copy = element("span", "task-copy");
  const deadline = todo.dueDate
    ? formatDeadline(`${todo.dueDate}${todo.dueTime ? `T${todo.dueTime}` : ""}`)
    : "기한 없음";
  const todoScheduleLine = element("span");
  if (event) todoScheduleLine.append(document.createTextNode(`${event.title} · `));
  else if (group) todoScheduleLine.append(document.createTextNode(`${group.name} 그룹 · `));
  if (todo.dueDate) {
    todoScheduleLine.append(
      viewDate(todo.dueDate),
      document.createTextNode(todo.dueTime ? ` · ${todo.dueTime}` : "")
    );
  } else {
    todoScheduleLine.append(document.createTextNode(deadline));
  }
  copy.append(
    element("strong", "", todo.title),
    todoScheduleLine
  );
  label.append(checkbox, copy);

  const pills = element("span", "task-pills");
  if (todo.submissionRequired) pills.append(element("span", "submission-pill", "제출 필요"));
  if (todo.repeatSeriesId) pills.append(element("span", "group-pill", "반복"));
  if (event || group) pills.append(element("span", "category-pill", event?.category || group.category));
  if (options.archived) pills.append(element("span", "task-archive-pill", todo.archivedAt ? "보관" : "완료"));
  item.append(label, pills);
  item.addEventListener("click", (clickEvent) => {
    if (clickEvent.target === checkbox) return;
    openTaskPanel(todo.id);
  });
  return item;
}

function hierarchicalTasks(list) {
  const byParent = new Map();
  const ids = new Set(list.map((task) => task.id));
  list.forEach((task) => {
    const parentId = task.parentTaskId && ids.has(task.parentTaskId) ? task.parentTaskId : "";
    if (!byParent.has(parentId)) byParent.set(parentId, []);
    byParent.get(parentId).push(task);
  });
  byParent.forEach((children) => children.sort((a, b) => taskSortValue(a).localeCompare(taskSortValue(b))));
  const ordered = [];
  const visit = (parentId, depth, visited = new Set()) => {
    (byParent.get(parentId) || []).forEach((task) => {
      if (visited.has(task.id)) return;
      const nextVisited = new Set(visited).add(task.id);
      ordered.push({ task, depth });
      visit(task.id, depth + 1, nextVisited);
    });
  };
  visit("", 0);
  return ordered;
}

function cancellationTaskItem(event) {
  const item = element(
    "div",
    `task-item cancellation-task-item${isEventElapsed(event) ? " is-elapsed" : ""}`
  );
  const content = element("div", "task-check");
  content.append(element("span", "task-alert-icon", "!"));
  const copy = element("span", "task-copy");
  copy.append(
    element("strong", "", "예약 취소 결정"),
    element("span", "", `${event.title} · ${deadlineDayLabel(event.cancellationDeadline)}`)
  );
  content.append(copy);
  item.append(content, element("span", "category-pill", event.category));
  item.addEventListener("click", () => {
    showEventInForm(event.id, "view");
    formCard.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  return item;
}

function renderTasks() {
  tasksView.replaceChildren();
  tasksView.append(renderClassificationFilterToolbar());
  const visibleEvents = events.filter((event) => dateMatchesActiveFilter(event.date) && eventMatchesClassificationFilter(event));
  const reservationTasks = sortEvents(visibleEvents.filter((event) => inferredReservationStatus(event) === "needed"));
  const cancellationTasks = [...visibleEvents]
    .filter((event) => inferredReservationStatus(event) === "considering")
    .sort((a, b) => cancellationDeadlineSortValue(a).localeCompare(cancellationDeadlineSortValue(b)));
  const switcher = element("div", "task-view-switch");
  [["active", "진행 중"], ["archive", "보관됨"]].forEach(([value, labelText]) => {
    const button = element("button", value === taskViewMode ? "is-active" : "", labelText);
    button.type = "button";
    button.addEventListener("click", () => {
      taskViewMode = value;
      renderTasks();
    });
    switcher.append(button);
  });
  tasksView.append(switcher);

  if (taskViewMode === "archive") {
    renderTaskArchive();
    return;
  }

  const activeTasks = tasks.filter((task) => !task.completed && !task.archivedAt && taskMatchesCalendar(task) && taskMatchesClassificationFilter(task)).sort((a, b) => taskSortValue(a).localeCompare(taskSortValue(b)));
  const recentTasks = tasks.filter((task) => isRecentlyCompletedTask(task) && taskMatchesCalendar(task) && taskMatchesClassificationFilter(task)).sort((a, b) => String(b.completedAt).localeCompare(String(a.completedAt)));

  {
    const section = element("section", "task-section");
    const title = element("div", "task-section-heading task-main-heading");
    const newButton = element("button", "task-add-circle", "+");
    newButton.type = "button";
    newButton.setAttribute("aria-label", "새 할 일 추가");
    newButton.addEventListener("click", () => openTaskPanel());
    title.append(element("h2", "", "To Do"), newButton);
    section.append(title);
    const list = element("div", "task-list");
    hierarchicalTasks(activeTasks).forEach(({ task, depth }) => list.append(todoTaskItem(task, { depth })));
    if (activeTasks.length) {
      section.append(list);
    } else {
      section.append(emptyState("진행 중인 할 일이 없어요", "오른쪽의 +를 눌러 새 할 일을 추가해보세요."));
    }
    tasksView.append(section);
  }

  if (recentTasks.length) {
    const section = element("section", "task-section recent-task-section");
    const title = element("div", "task-section-heading");
    title.append(element("h2", "", "최근 완료"), recentCompletedSetting());
    section.append(title);
    const list = element("div", "task-list");
    hierarchicalTasks(recentTasks).forEach(({ task, depth }) => list.append(todoTaskItem(task, { depth })));
    section.append(list);
    tasksView.append(section);
  } else {
    tasksView.append(recentCompletedSetting(true));
  }

  if (reservationTasks.length) {
    const section = element("section", "task-section cancellation-task-section");
    section.append(element("h2", "", "예약 필요"));
    const list = element("div", "task-list");
    reservationTasks.forEach((event) => list.append(reservationTaskItem(event)));
    section.append(list);
    tasksView.append(section);
  }

  if (cancellationTasks.length) {
    const section = element("section", "task-section");
    section.append(element("h2", "", "취소 고려"));
    const list = element("div", "task-list");
    cancellationTasks.forEach((event) => list.append(cancellationTaskItem(event)));
    section.append(list);
    tasksView.append(section);
  }
}

function recentCompletedSetting(compact = false) {
  const control = element("label", `recent-completed-setting${compact ? " is-standalone" : ""}`);
  control.append(element("span", "", "완료 항목 표시"));
  const select = document.createElement("select");
  const choices = [[0, "표시 안 함"], [3, "3일"], [7, "7일"], [14, "14일"], [30, "30일"], [-1, "계속"]];
  const known = choices.some(([value]) => value === taskSettings.recentCompletedDays);
  [...choices, ...(known ? [] : [[taskSettings.recentCompletedDays, `${taskSettings.recentCompletedDays}일`]])].forEach(([value, labelText]) => {
    const option = document.createElement("option");
    option.value = String(value);
    option.textContent = labelText;
    option.selected = value === taskSettings.recentCompletedDays;
    select.append(option);
  });
  const custom = document.createElement("option");
  custom.value = "custom";
  custom.textContent = "직접 설정…";
  select.append(custom);
  select.addEventListener("change", () => {
    if (select.value === "custom") {
      const requested = window.prompt("최근 완료 항목을 며칠 동안 보여줄까요?", "7");
      const days = Number(requested);
      if (!Number.isFinite(days) || days < 0) return renderTasks();
      taskSettings.recentCompletedDays = Math.round(days);
    } else {
      taskSettings.recentCompletedDays = Number(select.value);
    }
    saveTaskSettings();
    renderTasks();
  });
  control.append(select);
  return control;
}

function archivedTaskDate(task, basis) {
  const event = taskLinkedEvent(task);
  if (basis === "due") return task.dueDate || "";
  if (basis === "completed") return task.completedAt ? dateInputValue(new Date(task.completedAt)) : "";
  if (basis === "archived") return task.archivedAt ? dateInputValue(new Date(task.archivedAt)) : "";
  if (basis === "event") return event?.date || "";
  return "";
}

function renderTaskArchive() {
  const filters = element("div", "task-archive-filters");
  const query = document.createElement("input");
  query.className = "task-archive-query";
  query.type = "search";
  query.placeholder = "할 일·메모·연결 일정 검색";
  query.value = archiveTaskQuery;
  const basis = document.createElement("select");
  [["any", "모든 날짜"], ["due", "완료 기한"], ["completed", "완료일"], ["archived", "보관일"], ["event", "일정일"]].forEach(([value, labelText]) => {
    const option = document.createElement("option"); option.value = value; option.textContent = labelText; option.selected = archiveTaskDateBasis === value; basis.append(option);
  });
  const start = document.createElement("input"); start.type = "date"; start.value = archiveTaskStartDate; start.setAttribute("aria-label", "검색 시작 날짜");
  const end = document.createElement("input"); end.type = "date"; end.value = archiveTaskEndDate; end.setAttribute("aria-label", "검색 끝 날짜");
  const status = document.createElement("select");
  [["all", "모든 상태"], ["completed", "완료"], ["open", "미완료"]].forEach(([value, labelText]) => {
    const option = document.createElement("option"); option.value = value; option.textContent = labelText; option.selected = archiveTaskStatus === value; status.append(option);
  });
  const reset = element("button", "task-filter-reset", "초기화"); reset.type = "button";
  filters.append(query, basis, start, element("span", "task-date-separator", "–"), end, status, reset);
  tasksView.append(filters);

  const refresh = () => {
    archiveTaskQuery = query.value.trim(); archiveTaskDateBasis = basis.value; archiveTaskStartDate = start.value; archiveTaskEndDate = end.value; archiveTaskStatus = status.value; renderTasks();
  };
  query.addEventListener("input", () => {
    archiveTaskQuery = query.value.trim();
    const cursor = query.selectionStart;
    renderTasks();
    const replacement = tasksView.querySelector(".task-archive-query");
    replacement?.focus();
    replacement?.setSelectionRange(cursor, cursor);
  });
  [basis, start, end, status].forEach((input) => input.addEventListener("change", refresh));
  reset.addEventListener("click", () => {
    archiveTaskQuery = ""; archiveTaskDateBasis = "any"; archiveTaskStartDate = ""; archiveTaskEndDate = ""; archiveTaskStatus = "all"; renderTasks();
  });

  const needle = archiveTaskQuery.toLocaleLowerCase("ko-KR");
  const archived = tasks.filter(isArchivedTask).filter((task) => {
    if (!taskMatchesClassificationFilter(task)) return false;
    const event = taskLinkedEvent(task);
    const group = taskLinkedGroup(task);
    if (needle && ![task.title, task.memo, event?.title, group?.name, group?.category].filter(Boolean).join(" ").toLocaleLowerCase("ko-KR").includes(needle)) return false;
    if (archiveTaskStatus === "completed" && !task.completed) return false;
    if (archiveTaskStatus === "open" && task.completed) return false;
    if (archiveTaskStartDate || archiveTaskEndDate) {
      const dates = archiveTaskDateBasis === "any"
        ? ["due", "completed", "archived", "event"].map((value) => archivedTaskDate(task, value)).filter(Boolean)
        : [archivedTaskDate(task, archiveTaskDateBasis)].filter(Boolean);
      if (!dates.some((date) => (!archiveTaskStartDate || date >= archiveTaskStartDate) && (!archiveTaskEndDate || date <= archiveTaskEndDate))) return false;
    }
    return true;
  }).sort((a, b) => String(b.archivedAt || b.completedAt).localeCompare(String(a.archivedAt || a.completedAt)));

  if (!archived.length) {
    tasksView.append(emptyState("조건에 맞는 보관 항목이 없어요", "완료된 지 오래된 항목이나 직접 보관한 항목이 여기에 모입니다."));
    return;
  }
  const list = element("div", "task-list task-archive-list");
  hierarchicalTasks(archived).forEach(({ task, depth }) => list.append(todoTaskItem(task, { archived: true, depth })));
  tasksView.append(list);
}

function noteTimestamp(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function showNoteEditor(note = null) {
  noteEditorEmpty.hidden = true;
  noteForm.hidden = false;
  noteIdInput.value = note?.id || "";
  noteTitleInput.value = note?.title || "";
  noteBodyInput.value = note?.body || "";
  noteSaveStatus.textContent = note?.updatedAt ? `${noteTimestamp(note.updatedAt)} 수정` : "새 노트";
  deleteNoteButton.hidden = !note;
}

function showEmptyNoteEditor() {
  noteForm.hidden = true;
  noteEditorEmpty.hidden = false;
  noteIdInput.value = "";
  noteTitleInput.value = "";
  noteBodyInput.value = "";
  noteSaveStatus.textContent = "";
}

function renderNotes() {
  notesList.replaceChildren();
  const sortedNotes = [...notes].sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));

  if (!sortedNotes.length) {
    notesList.append(element("p", "notes-list-empty", "아직 작성한 노트가 없어요."));
  } else {
    sortedNotes.forEach((note) => {
      const button = element("button", `note-list-item${note.id === selectedNoteId ? " is-active" : ""}`);
      button.type = "button";
      const preview = note.body.trim().replace(/\s+/g, " ") || "내용 없음";
      button.append(
        element("strong", "", note.title.trim() || "제목 없는 노트"),
        element("span", "note-list-preview", preview),
        element("time", "", noteTimestamp(note.updatedAt))
      );
      button.addEventListener("click", () => {
        selectedNoteId = note.id;
        renderNotes();
        showNoteEditor(note);
      });
      notesList.append(button);
    });
  }

  const selectedNote = notes.find((note) => note.id === selectedNoteId);
  if (selectedNote) showNoteEditor(selectedNote);
  else if (noteForm.hidden || noteIdInput.value) showEmptyNoteEditor();
}

function renderAll() {
  removeStoredTravelSummaryImages();
  renderTimeline();
  renderCategories();
  renderTasks();
  renderNotes();
  renderCategoryControls();
  renderPlannerOverview();
}

function locationSearchControls(kind = "regular") {
  if (kind === "departure") {
    return {
      input: departureLocationInput,
      button: departureLocationSearchButton,
      status: departureLocationSearchStatus,
      results: departureLocationSearchResults
    };
  }
  if (kind === "destination") {
    return {
      input: destinationLocationInput,
      button: destinationLocationSearchButton,
      status: destinationLocationSearchStatus,
      results: destinationLocationSearchResults
    };
  }
  return {
    input: locationInput,
    button: locationSearchButton,
    status: locationSearchStatus,
    results: locationSearchResults
  };
}

function selectedLocationFor(kind = "regular") {
  if (kind === "departure") return selectedDepartureLocation;
  if (kind === "destination") return selectedDestinationLocation;
  return selectedLocation;
}

function setSelectedLocationFor(kind, value) {
  if (kind === "departure") selectedDepartureLocation = value;
  else if (kind === "destination") selectedDestinationLocation = value;
  else selectedLocation = value;
}

function clearLocationSearchResults(kind = "regular") {
  const { results } = locationSearchControls(kind);
  results.hidden = true;
  results.replaceChildren();
}

function clearAllLocationSearchResults() {
  ["regular", "departure", "destination"].forEach(clearLocationSearchResults);
}

function locationResultName(result) {
  return result.name
    || result.namedetails?.name
    || result.address?.amenity
    || result.address?.building
    || result.address?.shop
    || result.display_name?.split(",")[0]
    || "검색된 장소";
}

function selectLocationResult(result, kind = "regular") {
  const latitude = Number(result.lat);
  const longitude = Number(result.lon);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;

  const selected = {
    latitude,
    longitude,
    name: locationResultName(result),
    address: result.display_name || locationResultName(result)
  };
  const controls = locationSearchControls(kind);
  setSelectedLocationFor(kind, selected);
  locationSearchController?.abort();
  locationSearchController = null;
  locationSearchKind = null;
  controls.button.disabled = false;
  controls.input.value = selected.name;
  controls.status.textContent = "지도 위치가 선택됐어요.";
  clearLocationSearchResults(kind);
  controls.input.focus({ preventScroll: true });
}

function renderLocationSearchResults(results, kind = "regular") {
  const controls = locationSearchControls(kind);
  controls.results.replaceChildren();
  if (!results.length) {
    controls.results.append(element("p", "category-menu-hint", "검색 결과가 없어요. 장소명을 더 구체적으로 입력해보세요."));
  } else {
    results.forEach((result) => {
      const button = element("button", "location-result-button");
      button.type = "button";
      button.append(
        element("strong", "", locationResultName(result)),
        element("span", "", result.display_name || "")
      );
      button.addEventListener("click", () => selectLocationResult(result, kind));
      controls.results.append(button);
    });
  }
  controls.results.hidden = false;
}

async function requestNominatim(query, controller) {
  // Nominatim's public service permits at most one request per second.
  const waitTime = Math.max(0, 1100 - (Date.now() - lastLocationSearchAt));
  if (waitTime) await new Promise((resolve) => window.setTimeout(resolve, waitTime));
  if (controller.signal.aborted) return [];

  const parameters = new URLSearchParams({
    format: "jsonv2",
    q: query,
    limit: "8",
    countrycodes: "kr",
    addressdetails: "1",
    namedetails: "1",
    "accept-language": "ko-KR,ko"
  });
  lastLocationSearchAt = Date.now();
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${parameters}`, {
    signal: controller.signal,
    headers: { Accept: "application/json" }
  });
  if (!response.ok) throw new Error(`장소 검색 실패: ${response.status}`);
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

async function searchLocation(kind = "regular") {
  const controls = locationSearchControls(kind);
  const query = controls.input.value.trim();
  if (query.length < 2) {
    controls.status.textContent = query ? "두 글자 이상 입력하면 장소를 찾아드려요." : "";
    clearLocationSearchResults(kind);
    return;
  }

  resetLocationSearch();
  const controller = new AbortController();
  locationSearchController = controller;
  locationSearchKind = kind;
  controls.button.disabled = true;
  controls.status.textContent = "장소를 검색하고 있어요…";
  clearLocationSearchResults(kind);

  try {
    const results = await requestNominatim(query, controller);
    if (controller.signal.aborted) return;
    renderLocationSearchResults(results, kind);
    controls.status.textContent = results.length
      ? "검색 결과에서 정확한 장소를 선택해주세요."
      : "검색 결과가 없어요. 장소명이나 주소를 바꿔보세요.";
  } catch (error) {
    if (error.name === "AbortError") return;
    console.error(error);
    controls.status.textContent = "장소를 검색하지 못했어요. 잠시 후 다시 시도해주세요.";
  } finally {
    if (locationSearchController === controller) {
      locationSearchController = null;
      locationSearchKind = null;
      controls.button.disabled = false;
    }
  }
}

function resetLocationSearch() {
  locationSearchController?.abort();
  locationSearchController = null;
  locationSearchKind = null;
  ["regular", "departure", "destination"].forEach((kind) => {
    locationSearchControls(kind).button.disabled = false;
  });
}

function clearHomeLocationResults() {
  homeLocationResults.hidden = true;
  homeLocationResults.replaceChildren();
}

function selectHomeLocation(result) {
  const latitude = Number(result.lat);
  const longitude = Number(result.lon);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;

  homeLocation = {
    latitude,
    longitude,
    name: locationResultName(result),
    address: result.display_name || locationResultName(result)
  };
  homeVisible = true;
  saveHomeSettings();
  homeMapToggle.checked = true;
  homeLocationInput.value = homeLocation.name;
  homeLocationStatus.textContent = "집 위치가 이 브라우저에 저장됐어요.";
  homeLocationRemoveButton.hidden = false;
  clearHomeLocationResults();
  renderPlannerMap();
}

function renderHomeLocationResults(results) {
  homeLocationResults.replaceChildren();
  if (!results.length) {
    homeLocationResults.append(element("p", "category-menu-hint", "검색 결과가 없어요. 주소를 더 구체적으로 입력해보세요."));
  } else {
    results.forEach((result) => {
      const button = element("button", "location-result-button");
      button.type = "button";
      button.append(
        element("strong", "", locationResultName(result)),
        element("span", "", result.display_name || "")
      );
      button.addEventListener("click", () => selectHomeLocation(result));
      homeLocationResults.append(button);
    });
  }
  homeLocationResults.hidden = false;
}

async function searchHomeLocation() {
  const query = homeLocationInput.value.trim();
  if (query.length < 2) {
    homeLocationStatus.textContent = query ? "두 글자 이상 입력해주세요." : "";
    clearHomeLocationResults();
    return;
  }

  homeSearchController?.abort();
  const controller = new AbortController();
  homeSearchController = controller;
  homeLocationSearchButton.disabled = true;
  homeLocationStatus.textContent = "집 위치를 검색하고 있어요…";
  clearHomeLocationResults();

  try {
    const results = await requestNominatim(query, controller);
    if (controller.signal.aborted) return;
    renderHomeLocationResults(results);
    homeLocationStatus.textContent = results.length
      ? "검색 결과를 선택하면 집 위치로 저장돼요."
      : "검색 결과가 없어요. 주소를 바꿔보세요.";
  } catch (error) {
    if (error.name === "AbortError") return;
    console.error(error);
    homeLocationStatus.textContent = "집 위치를 검색하지 못했어요. 잠시 후 다시 시도해주세요.";
  } finally {
    if (homeSearchController === controller) {
      homeSearchController = null;
      homeLocationSearchButton.disabled = false;
    }
  }
}

function openHomeLocationEditor() {
  homeLocationEditor.hidden = false;
  homeLocationInput.value = homeLocation?.name || "";
  homeLocationStatus.textContent = homeLocation
    ? "집 위치가 저장되어 있어요. 새로 검색해 변경할 수 있어요."
    : "검색 결과를 선택하면 이 브라우저에만 저장돼요.";
  homeLocationRemoveButton.hidden = !homeLocation;
  clearHomeLocationResults();
  homeLocationInput.focus({ preventScroll: true });
}

function closeHomeLocationEditor() {
  homeSearchController?.abort();
  homeSearchController = null;
  homeLocationSearchButton.disabled = false;
  homeLocationEditor.hidden = true;
  clearHomeLocationResults();
}

function syncLocationFields() {
  const eventKind = document.querySelector('input[name="eventKind"]:checked')?.value || "regular";
  const locationType = document.querySelector('input[name="locationType"]:checked')?.value || "offline";
  regularEventFields.hidden = eventKind === "travel";
  travelEventFields.hidden = eventKind !== "travel";
  offlineLocationField.hidden = eventKind === "travel" || locationType !== "offline";
  onlineLinkField.hidden = eventKind === "travel" || locationType !== "online";
}

function syncConditionalFields() {
  const cancellationDeadlineDate = document.querySelector("#cancellationDeadlineDate");
  const consideringCancellation = currentReservationStatus() === "considering";
  cancellationOptions.hidden = !consideringCancellation;
  cancellationDeadlineDate.required = consideringCancellation;

  if (!consideringCancellation) {
    cancellationDeadlineDate.value = "";
    document.querySelector("#cancellationDeadlineTime").value = "";
    document.querySelector("#cancellationNotes").value = "";
  }
}

function clearFormValues() {
  closeCategoryMenu();
  resetLocationSearch();
  selectedLocation = null;
  selectedDepartureLocation = null;
  selectedDestinationLocation = null;
  locationSearchStatus.textContent = "";
  departureLocationSearchStatus.textContent = "";
  destinationLocationSearchStatus.textContent = "";
  clearAllLocationSearchResults();
  form.reset();
  document.querySelector("#eventId").value = "";
  eventGroupInput.value = "";
  renderClassificationInputs([{ category: "MISC", groupId: "" }]);
  eventRepeatInput.checked = false;
  recurrenceFrequency.value = "weekly";
  recurrenceInterval.value = "1";
  recurrenceEndDate.value = "";
  recurrenceWeekdays.querySelectorAll('input[type="checkbox"]').forEach((input) => { input.checked = false; });
  setRecurrenceEditingState();
  renderTodoInputs();
  syncLocationFields();
  syncConditionalFields();
  syncEventRecurrenceFields();
  renderEventGroupOptions();
}

function applyFormMode(mode) {
  formMode = mode;
  const isIdle = mode === "idle";
  const isViewing = mode === "view";
  const isCreating = mode === "create";
  const isTask = mode === "task";

  form.hidden = isIdle || isTask;
  taskForm.hidden = !isTask;
  formPlaceholder.hidden = !isIdle;
  form.classList.toggle("is-viewing", isViewing);
  saveButton.hidden = isIdle || isViewing || isTask;
  newEventButton.hidden = isCreating || mode === "edit" || isTask;
  cancelEditButton.hidden = isIdle || isViewing;
  cancelEditButton.textContent = isTask ? "닫기" : "취소";

  formKicker.textContent = isTask ? (selectedTaskId ? "SELECTED TASK" : "NEW TASK") : isCreating ? "NEW EVENT" : isViewing ? "SELECTED EVENT" : mode === "edit" ? "EDIT EVENT" : "EVENT";
  formTitle.textContent = isTask ? (selectedTaskId ? "할 일 보기" : "할 일 추가") : isCreating ? "일정 추가" : isViewing ? "일정 보기" : mode === "edit" ? "일정 수정" : "일정 보기";
  saveButton.textContent = isCreating ? "일정 저장" : "변경 저장";
}

function showIdleForm() {
  selectedEventId = null;
  selectedTaskId = null;
  clearFormValues();
  applyFormMode("idle");
}

function startNewEvent() {
  if (!requireSignIn("로그인하면 새 일정을 추가할 수 있어요.")) return;
  selectedEventId = null;
  selectedTaskId = null;
  clearFormValues();
  applyFormMode("create");
  renderAll();
  document.querySelector("#title").focus();
}

function showEventInForm(id, mode = "view") {
  const event = events.find((item) => item.id === id);
  if (!event) return;

  selectedTaskId = null;
  selectedEventId = event.id;
  document.querySelector("#eventId").value = event.id;
  document.querySelector("#title").value = event.title;
  document.querySelector("#date").value = event.date;
  document.querySelector("#startTime").value = event.startTime || "";
  document.querySelector("#endTime").value = event.endTime || "";
  document.querySelector(`input[name="eventKind"][value="${isTravelEvent(event) ? "travel" : "regular"}"]`).checked = true;
  const locationType = inferredLocationType(event);
  document.querySelector(`input[name="locationType"][value="${locationType}"]`).checked = true;
  document.querySelector("#location").value = event.location || "";
  locationDetailInput.value = event.locationDetail || "";
  selectedLocation = hasMapCoordinates(event)
    && !isTravelEvent(event)
    ? {
        latitude: Number(event.latitude),
        longitude: Number(event.longitude),
        name: event.location || "장소",
        address: event.locationAddress || event.location || ""
      }
    : null;
  locationSearchStatus.textContent = selectedLocation ? "지도 위치가 저장된 일정이에요." : "";
  departureLocationInput.value = event.departureLocation || "";
  departureLocationDetailInput.value = event.departureLocationDetail || "";
  selectedDepartureLocation = eventStartMapPoint(event) && isTravelEvent(event)
    ? {
        latitude: Number(event.departureLatitude),
        longitude: Number(event.departureLongitude),
        name: event.departureLocation || "출발 장소",
        address: event.departureLocationAddress || event.departureLocation || ""
      }
    : null;
  departureLocationSearchStatus.textContent = selectedDepartureLocation ? "지도 위치가 저장된 출발지예요." : "";
  destinationLocationInput.value = event.destinationLocation || "";
  destinationLocationDetailInput.value = event.destinationLocationDetail || "";
  selectedDestinationLocation = eventEndMapPoint(event) && isTravelEvent(event)
    ? {
        latitude: Number(event.destinationLatitude),
        longitude: Number(event.destinationLongitude),
        name: event.destinationLocation || "도착 장소",
        address: event.destinationLocationAddress || event.destinationLocation || ""
      }
    : null;
  destinationLocationSearchStatus.textContent = selectedDestinationLocation ? "지도 위치가 저장된 도착지예요." : "";
  clearAllLocationSearchResults();
  document.querySelector("#url").value = event.url || "";
  document.querySelector("#category").value = event.category || "ETC";
  eventGroupInput.value = groupForId(event.groupId)?.name || "";
  renderClassificationInputs(event.classifications);
  eventRepeatInput.checked = Boolean(event.recurrenceSeriesId && event.recurrenceRule);
  recurrenceFrequency.value = event.recurrenceRule?.frequency || "weekly";
  recurrenceInterval.value = String(event.recurrenceRule?.interval || 1);
  recurrenceEndDate.value = event.recurrenceRule?.endDate || "";
  recurrenceWeekdays.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    input.checked = Boolean(event.recurrenceRule?.weekdays?.includes(Number(input.value)));
  });
  setRecurrenceEditingState(event);
  document.querySelector("#notes").value = event.notes || "";
  const reservationStatus = inferredReservationStatus(event);
  document.querySelector(`input[name="reservationStatus"][value="${reservationStatus}"]`).checked = true;
  const cancellationDeadline = splitSubmissionDeadline(event.cancellationDeadline || "");
  document.querySelector("#cancellationDeadlineDate").value = cancellationDeadline.date;
  document.querySelector("#cancellationDeadlineTime").value = cancellationDeadline.time;
  document.querySelector("#cancellationNotes").value = event.cancellationNotes || "";
  renderTodoInputs(eventTasks(event.id));

  syncLocationFields();
  syncConditionalFields();
  syncEventRecurrenceFields();
  renderEventGroupOptions();
  applyFormMode(mode);
}

function activateEventEditing(target) {
  if (!requireSignIn("로그인하면 일정을 변경할 수 있어요.")) return;
  if (formMode !== "view") return;
  applyFormMode("edit");

  const control = target.matches?.("input, textarea")
    ? target
    : target.closest?.("label")?.querySelector("input, textarea");
  (control || document.querySelector("#title")).focus({ preventScroll: true });
}

function cancelFormEditing() {
  if (formMode === "task") {
    showIdleForm();
    return;
  }
  if (selectedEventId && events.some((event) => event.id === selectedEventId)) {
    showEventInForm(selectedEventId, "view");
  } else {
    showIdleForm();
  }
}

function deleteEvent(id) {
  if (!requireSignIn("로그인하면 일정을 삭제할 수 있어요.")) return;
  const event = events.find((item) => item.id === id);
  if (!event || !window.confirm(`“${event.title}” 일정을 삭제할까요?`)) return;
  events = events.filter((item) => item.id !== id);
  const now = new Date().toISOString();
  tasks = tasks.map((task) => task.eventId === id ? { ...task, eventId: "", updatedAt: now } : task);
  if (selectedEventId === id) showIdleForm();
  saveEvents();
  saveTasks();
  renderAll();
}

function populateTaskEventOptions(task = null) {
  taskEventSelect.replaceChildren();
  const none = document.createElement("option");
  none.value = "";
  none.textContent = "연결 안 함";
  taskEventSelect.append(none);

  if (eventGroups.length) {
    const groupOptions = document.createElement("optgroup");
    groupOptions.label = "그룹";
    [...eventGroups].sort((a, b) => a.name.localeCompare(b.name, "ko-KR")).forEach((group) => {
      const option = document.createElement("option");
      option.value = `group:${group.id}`;
      option.textContent = `${group.name} · ${group.category}`;
      groupOptions.append(option);
    });
    taskEventSelect.append(groupOptions);
  }

  const yesterday = dateInputValue(new Date(Date.now() - 86400000));
  const linkedEventId = task?.eventId || "";
  const eventOptions = document.createElement("optgroup");
  eventOptions.label = "개별 일정 · 어제 이후";
  sortEvents(events.filter((event) => event.date >= yesterday || event.id === linkedEventId)).forEach((event) => {
    const option = document.createElement("option");
    option.value = `event:${event.id}`;
    option.textContent = `${compactDate(event.date)} · ${event.title}`;
    eventOptions.append(option);
  });
  taskEventSelect.append(eventOptions);
  taskEventSelect.value = task?.groupId
    ? `group:${task.groupId}`
    : task?.eventId ? `event:${task.eventId}` : "";
}

function populateTaskParentOptions(task = null) {
  taskParentSelect.replaceChildren();
  const none = document.createElement("option");
  none.value = "";
  none.textContent = "상위 항목 없음";
  taskParentSelect.append(none);
  const excludedIds = new Set([task?.id].filter(Boolean));
  if (task) {
    let changed = true;
    while (changed) {
      changed = false;
      tasks.forEach((item) => {
        if (item.parentTaskId && excludedIds.has(item.parentTaskId) && !excludedIds.has(item.id)) {
          excludedIds.add(item.id);
          changed = true;
        }
      });
    }
  }
  tasks
    .filter((item) => !excludedIds.has(item.id) && !isArchivedTask(item))
    .sort((a, b) => taskSortValue(a).localeCompare(taskSortValue(b)))
    .forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.title;
      taskParentSelect.append(option);
    });
  taskParentSelect.value = task?.parentTaskId || "";
}

function currentTaskRepeatRule() {
  return {
    frequency: taskRepeatFrequency.value,
    interval: Math.max(1, Number(taskRepeatInterval.value) || 1),
    weekdays: [...taskRepeatWeekdays.querySelectorAll('input[type="checkbox"]:checked')].map((input) => Number(input.value)),
    endDate: taskRepeatEndDate.value
  };
}

function syncTaskRepeatFields({ initialize = false } = {}) {
  const active = taskRepeatInput.checked;
  taskRepeatOptions.hidden = !active;
  taskRepeatEndDate.required = active;
  taskRepeatWeekdays.hidden = taskRepeatFrequency.value !== "weekly";
  if (!active || !initialize) return;
  if (taskDueDateInput.value && !taskRepeatEndDate.value) {
    const start = new Date(`${taskDueDateInput.value}T00:00:00`);
    taskRepeatEndDate.value = dateInputValue(new Date(start.getFullYear(), start.getMonth() + 3, start.getDate()));
  }
  if (taskDueDateInput.value && taskRepeatFrequency.value === "weekly" && !taskRepeatWeekdays.querySelector('input:checked')) {
    const weekday = new Date(`${taskDueDateInput.value}T00:00:00`).getDay();
    const checkbox = taskRepeatWeekdays.querySelector(`input[value="${weekday}"]`);
    if (checkbox) checkbox.checked = true;
  }
}

function openTaskPanel(id = null, options = {}) {
  if (!requireSignIn("로그인하면 할 일을 추가하거나 변경할 수 있어요.")) return;
  const task = id ? tasks.find((item) => item.id === id) : null;
  selectedEventId = null;
  selectedTaskId = task?.id || null;
  taskTitleInput.value = task?.title || "";
  taskDueDateInput.value = task?.dueDate || "";
  taskDueTimeInput.value = task?.dueTime || "";
  taskSubmissionInput.checked = Boolean(task?.submissionRequired);
  taskRepeatInput.checked = Boolean(task?.repeatSeriesId && task?.repeatRule);
  taskRepeatFrequency.value = task?.repeatRule?.frequency || "weekly";
  taskRepeatInterval.value = String(task?.repeatRule?.interval || 1);
  taskRepeatEndDate.value = task?.repeatRule?.endDate || "";
  taskRepeatWeekdays.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    input.checked = Boolean(task?.repeatRule?.weekdays?.includes(Number(input.value)));
  });
  syncTaskRepeatFields();
  taskMemoInput.value = task?.memo || "";
  populateTaskEventOptions(task);
  populateTaskParentOptions(task);
  if (!task && options.parentTaskId) taskParentSelect.value = options.parentTaskId;
  taskChildButton.hidden = !task;
  taskArchiveButton.hidden = !task;
  taskDeleteButton.hidden = !task;
  taskArchiveButton.textContent = task && isArchivedTask(task) ? "보관 해제" : "보관";
  applyFormMode("task");
  formCard.scrollIntoView({ behavior: "smooth", block: "start" });
  if (!task) taskTitleInput.focus();
}

function updateTodoTask(todoId, completed) {
  if (!requireSignIn("로그인하면 할 일 상태를 변경할 수 있어요.")) {
    renderAll();
    return;
  }
  const now = new Date().toISOString();
  tasks = tasks.map((task) => task.id === todoId ? {
    ...task,
    completed,
    completedAt: completed ? now : "",
    updatedAt: now
  } : task);
  saveTasks();
  renderAll();
  if (selectedEventId && formMode === "view") showEventInForm(selectedEventId, "view");
}

function updateReservationTask(id, completed) {
  if (!requireSignIn("로그인하면 예약 상태를 변경할 수 있어요.")) {
    renderAll();
    return;
  }
  events = events.map((event) => event.id === id
    ? {
        ...event,
        reservationStatus: completed ? "booked" : "needed",
        reservationRequired: true,
        reservationCompleted: completed
      }
    : event);
  saveEvents();
  renderAll();
}

function renameCategory(oldName, requestedName) {
  if (!requireSignIn("로그인하면 카테고리를 변경할 수 있어요.")) return;
  const newName = normalizedCategory(requestedName);
  if (!requestedName.trim()) {
    window.alert("새 카테고리 이름을 입력해주세요.");
    return;
  }
  if (newName === oldName) return;

  if (!window.confirm(`카테고리 이름을 “${newName}”(으)로 바꾸면 연결된 모든 그룹·일정·할 일에 일괄 적용됩니다. 변경할까요?`)) return;

  const willMerge = currentCategories().some((category) => category === newName && category !== oldName);
  if (willMerge && !window.confirm(`이미 “${newName}” 카테고리가 있어요. 두 카테고리를 합칠까요?`)) return;

  const wasSelected = selectedCategories.has(oldName) || selectedCategories.has(newName);
  events = events.map((event) => {
    const classifications = eventClassificationLinks(event).map((link) => link.category === oldName ? { ...link, category: newName } : link);
    return {
      ...event,
      category: event.category === oldName ? newName : event.category,
      classifications: normalizeClassificationLinks(classifications, event)
    };
  });
  tasks = tasks.map((task) => ({
    ...task,
    classifications: normalizeClassificationLinks(task.classifications, task).map((link) => link.category === oldName ? { ...link, category: newName } : link)
  }));
  eventGroups = eventGroups.map((group) => group.category === oldName ? { ...group, category: newName, updatedAt: new Date().toISOString() } : group);
  categoryOrder = categoryOrder
    .map((category) => category === oldName ? newName : category)
    .filter((category, index, list) => list.indexOf(category) === index);
  selectedCategories.delete(oldName);
  if (wasSelected) selectedCategories.add(newName);
  if (normalizedCategory(document.querySelector("#category").value) === oldName) {
    document.querySelector("#category").value = newName;
  }
  saveEvents();
  saveTasks();
  saveEventGroups();
  saveCategoryOrder();
  renderAll();
}

function deleteCategory(category) {
  if (!requireSignIn("로그인하면 카테고리를 삭제할 수 있어요.")) return;
  if (category === "MISC") {
    window.alert("MISC는 분류가 지정되지 않은 항목에 쓰이는 기본 카테고리라 삭제할 수 없어요.");
    return;
  }
  if (!window.confirm(`“${category}” 카테고리를 삭제할까요?\n\n연결된 그룹·일정·할 일은 삭제되지 않고 MISC로 이동합니다.`)) return;

  const now = new Date().toISOString();
  eventGroups = eventGroups.map((group) => group.category === category
    ? { ...group, category: "MISC", updatedAt: now }
    : group);
  events = events.map((event) => {
    const classifications = eventClassificationLinks(event).map((link) => link.category === category
      ? { ...link, category: "MISC" }
      : link);
    const normalized = normalizeClassificationLinks(classifications, { category: "MISC" });
    return {
      ...event,
      category: event.category === category ? normalized[0]?.category || "MISC" : event.category,
      classifications: normalized
    };
  });
  tasks = tasks.map((task) => ({
    ...task,
    classifications: normalizeClassificationLinks(
      taskClassificationLinks(task).map((link) => link.category === category ? { ...link, category: "MISC" } : link),
      { category: "MISC", groupId: task.groupId }
    ),
    updatedAt: now
  }));
  categoryOrder = categoryOrder
    .filter((item) => item !== category)
    .filter((item, index, list) => list.indexOf(item) === index);
  if (!categoryOrder.includes("MISC")) categoryOrder.push("MISC");
  selectedCategories.delete(category);
  selectedCategories.add("MISC");
  excludedClassificationKeys.clear();
  classificationAllCleared = false;
  saveEventGroups();
  saveEvents();
  saveTasks();
  saveCategoryOrder();
  renderAll();
}

form.addEventListener("submit", (submitEvent) => {
  submitEvent.preventDefault();
  if (!requireSignIn("로그인하면 일정을 저장할 수 있어요.")) return;
  const id = document.querySelector("#eventId").value;
  const existingEvent = id ? events.find((item) => item.id === id) : null;
  const startTime = normalizeTime(document.querySelector("#startTime").value);
  const endTime = normalizeTime(document.querySelector("#endTime").value);
  const reservationStatus = currentReservationStatus();
  const cancellationDeadlineDate = document.querySelector("#cancellationDeadlineDate").value;
  const cancellationDeadlineTime = normalizeTime(document.querySelector("#cancellationDeadlineTime").value);
  const todoResult = collectTodoInputs();
  const eventKind = document.querySelector('input[name="eventKind"]:checked')?.value || "regular";
  const isTravel = eventKind === "travel";
  const locationType = isTravel ? "offline" : document.querySelector('input[name="locationType"]:checked').value;
  const typedLocation = !isTravel && locationType === "offline" ? locationInput.value.trim() : "";
  const departureLocation = isTravel ? selectedDepartureLocation?.name || departureLocationInput.value.trim() : "";
  const destinationLocation = isTravel ? selectedDestinationLocation?.name || destinationLocationInput.value.trim() : "";
  const location = isTravel ? destinationLocation : locationType === "offline" ? selectedLocation?.name || typedLocation : "";
  const url = !isTravel && locationType === "online" ? normalizeUrl(document.querySelector("#url").value) : "";
  const classifications = collectClassificationInputs();
  const category = classifications[0]?.category || "MISC";
  const existingSeriesMaster = existingEvent ? recurrenceMasterFor(existingEvent) : null;
  const editingNonMasterInstance = Boolean(existingEvent?.recurrenceSeriesId && existingSeriesMaster?.id !== existingEvent.id);
  const repeatRule = editingNonMasterInstance
    ? existingEvent.recurrenceRule
    : eventRepeatInput.checked ? currentEventRecurrenceRule() : null;

  if (startTime === null || endTime === null || cancellationDeadlineTime === null) {
    window.alert("시간은 24시간제로 입력해주세요. 예: 09:00, 16:30");
    return;
  }

  if (todoResult.error) {
    window.alert(todoResult.error);
    return;
  }

  if (isTravel && (!startTime || !endTime || !departureLocation || !destinationLocation)) {
    window.alert("이동 일정에는 출발·도착 시간과 두 장소를 모두 입력해주세요.");
    return;
  }

  if (reservationStatus === "considering" && !cancellationDeadlineDate) {
    window.alert("취소 고려 상태에서는 무료 취소 날짜를 선택해주세요.");
    return;
  }

  if (cancellationDeadlineTime && !cancellationDeadlineDate) {
    window.alert("무료 취소 시간을 입력하려면 날짜도 선택해주세요.");
    return;
  }

  if (url === null) {
    window.alert("링크 주소를 확인해주세요. 예: https://zoom.us/...");
    return;
  }

  if (repeatRule && (!repeatRule.endDate || repeatRule.endDate < document.querySelector("#date").value)) {
    window.alert("반복 일정의 종료일은 시작 날짜 이후로 선택해주세요.");
    return;
  }

  if (repeatRule?.frequency === "weekly" && !repeatRule.weekdays.length) {
    window.alert("매주 반복할 요일을 하나 이상 선택해주세요.");
    return;
  }

  let group = groupForId(classifications[0]?.groupId);
  if (repeatRule && !group) {
    group = ensureEventGroup(document.querySelector("#title").value.trim(), category);
    classifications[0] = { category, groupId: group.id };
  }
  const recurrenceSeriesId = repeatRule
    ? existingEvent?.recurrenceSeriesId || crypto.randomUUID()
    : "";
  const recurrenceMasterId = repeatRule
    ? existingEvent?.recurrenceMasterId || existingSeriesMaster?.id || ""
    : "";

  const event = {
    id: id || crypto.randomUUID(),
    title: document.querySelector("#title").value.trim(),
    date: document.querySelector("#date").value,
    startTime,
    endTime,
    eventKind,
    locationType,
    location,
    locationDetail: !isTravel && locationType === "offline" ? locationDetailInput.value.trim() : "",
    locationAddress: !isTravel && locationType === "offline" ? selectedLocation?.address || "" : "",
    latitude: !isTravel && locationType === "offline" ? selectedLocation?.latitude ?? null : null,
    longitude: !isTravel && locationType === "offline" ? selectedLocation?.longitude ?? null : null,
    departureLocation,
    departureLocationDetail: isTravel ? departureLocationDetailInput.value.trim() : "",
    departureLocationAddress: isTravel ? selectedDepartureLocation?.address || "" : "",
    departureLatitude: isTravel ? selectedDepartureLocation?.latitude ?? null : null,
    departureLongitude: isTravel ? selectedDepartureLocation?.longitude ?? null : null,
    destinationLocation,
    destinationLocationDetail: isTravel ? destinationLocationDetailInput.value.trim() : "",
    destinationLocationAddress: isTravel ? selectedDestinationLocation?.address || "" : "",
    destinationLatitude: isTravel ? selectedDestinationLocation?.latitude ?? null : null,
    destinationLongitude: isTravel ? selectedDestinationLocation?.longitude ?? null : null,
    url,
    category,
    groupId: group?.id || "",
    classifications,
    recurrenceSeriesId,
    recurrenceMasterId,
    recurrenceException: existingEvent?.recurrenceException || false,
    recurrenceRule: repeatRule,
    notes: document.querySelector("#notes").value.trim(),
    reservationStatus,
    reservationRequired: reservationStatus !== "none",
    reservationCompleted: reservationStatus === "booked" || reservationStatus === "considering",
    cancellationDeadline: reservationStatus === "considering" && cancellationDeadlineDate
      ? `${cancellationDeadlineDate}${cancellationDeadlineTime ? `T${cancellationDeadlineTime}` : ""}`
      : "",
    cancellationNotes: reservationStatus === "considering"
      ? document.querySelector("#cancellationNotes").value.trim()
      : "",
    todos: [],
    travelPlan: existingEvent?.travelPlan || null,
    createdAt: id
      ? existingEvent?.createdAt || new Date().toISOString()
      : new Date().toISOString()
  };

  if (event.startTime && event.endTime && event.endTime < event.startTime) {
    window.alert("종료 시간은 시작 시간보다 늦게 설정해주세요.");
    return;
  }

  const shouldGenerateSeries = Boolean(repeatRule && !existingEvent?.recurrenceSeriesId);
  const seriesDates = shouldGenerateSeries
    ? [...new Set([event.date, ...recurrenceDates(event.date, repeatRule)])].sort()
    : [event.date];
  const instances = seriesDates.map((date, index) => ({
    ...event,
    id: index === 0 ? event.id : crypto.randomUUID(),
    date,
    recurrenceMasterId: repeatRule ? recurrenceMasterId || event.id : "",
    createdAt: index === 0 ? event.createdAt : new Date().toISOString()
  }));

  if (id && existingEvent?.recurrenceSeriesId) {
    const master = recurrenceMasterFor(existingEvent);
    const isMaster = master.id === existingEvent.id;
    const sharedChanged = recurringSharedChanged(existingEvent, event);
    const applyToFollowing = sharedChanged && window.confirm(
      "반복 일정입니다. 이 일정 이후의 모든 일정에 변경사항을 일괄 적용할까요?\n\n취소를 누르면 이 일정만 변경됩니다."
    );

    events = events.map((item) => {
      if (item.id === id) return { ...event, recurrenceException: sharedChanged && !applyToFollowing && !isMaster };
      if (applyToFollowing && item.recurrenceSeriesId === existingEvent.recurrenceSeriesId && item.date >= existingEvent.date && !item.recurrenceException) {
        return copyRecurringSharedFields(item, event);
      }
      return item;
    });

    if (isMaster && !repeatRule) {
      events = events.map((item) => item.recurrenceSeriesId === existingEvent.recurrenceSeriesId
        ? {
            ...item,
            recurrenceSeriesId: "",
            recurrenceMasterId: "",
            recurrenceException: false,
            recurrenceRule: null
          }
        : item);
    } else if (isMaster && repeatRule) {
      const desiredDates = new Set(recurrenceDates(event.date, repeatRule));
      const removedIds = events
        .filter((item) => item.recurrenceSeriesId === event.recurrenceSeriesId && !desiredDates.has(item.date) && !item.recurrenceException)
        .map((item) => item.id);
      events = events.filter((item) => !removedIds.includes(item.id));
      const datesInSeries = new Set(events.filter((item) => item.recurrenceSeriesId === event.recurrenceSeriesId).map((item) => item.date));
      desiredDates.forEach((date) => {
        if (datesInSeries.has(date)) return;
        events.push({
          ...event,
          id: crypto.randomUUID(),
          date,
          recurrenceMasterId: event.id,
          recurrenceException: false,
          travelPlan: null,
          createdAt: new Date().toISOString()
        });
      });
      events = events.map((item) => item.recurrenceSeriesId === event.recurrenceSeriesId
        ? { ...item, recurrenceRule: repeatRule, recurrenceMasterId: event.id }
        : item);
      const now = new Date().toISOString();
      tasks = tasks.map((task) => removedIds.includes(task.eventId) ? { ...task, eventId: "", updatedAt: now } : task);
    }
  } else {
    if (id) events = events.map((item) => item.id === id ? instances[0] : item);
    else events.push(instances[0]);
    if (instances.length > 1) events.push(...instances.slice(1));
  }

  instances.forEach((instance, index) => {
    syncEventTasks(instance.id, index === 0 ? todoResult.todos : []);
  });
  tasks = tasks.map((task) => {
    const linkedEvent = events.find((item) => item.id === task.eventId);
    return linkedEvent
      ? {
          ...task,
          groupId: linkedEvent.groupId || "",
          classifications: eventClassificationLinks(linkedEvent)
        }
      : task;
  });
  saveEventGroups();
  saveEvents();
  saveTasks();
  selectedEventId = event.id;
  selectedMapDate = event.date;
  calendarCursor = new Date(`${event.date}T00:00:00`);
  calendarCursor.setDate(1);
  renderAll();
  showEventInForm(event.id, "view");
});

reservationStatusInputs.forEach((input) => input.addEventListener("change", syncConditionalFields));
addTodoButton.addEventListener("click", () => addTodoInput({}, true));
addClassificationButton.addEventListener("click", () => addClassificationInput({ category: orderedCategories()[0] || "MISC" }, true));
newEventButton.addEventListener("click", startNewEvent);
cancelEditButton.addEventListener("click", cancelFormEditing);
calendarPrevButton.addEventListener("click", () => shiftCalendarMonth(-1));
calendarNextButton.addEventListener("click", () => shiftCalendarMonth(1));
calendarTodayButton.addEventListener("click", selectTodayInCalendar);
calendarThisWeekButton.addEventListener("click", () => selectWeekInCalendar(0));
calendarNextWeekButton.addEventListener("click", () => selectWeekInCalendar(1));
function bindLocationSearchField(kind) {
  const controls = locationSearchControls(kind);
  controls.button.addEventListener("click", () => searchLocation(kind));
  controls.input.addEventListener("input", () => {
    const selected = selectedLocationFor(kind);
    if (selected && controls.input.value.trim() !== selected.name) {
      setSelectedLocationFor(kind, null);
      controls.status.textContent = "주소가 바뀌었어요. 다시 검색해 위치를 선택해주세요.";
    } else {
      controls.status.textContent = controls.input.value.trim().length >= 2
        ? "지도에 표시하려면 검색해주세요. 검색하지 않아도 저장할 수 있어요."
        : "";
    }
    clearLocationSearchResults(kind);
    resetLocationSearch();
  });
  controls.input.addEventListener("keydown", (keyEvent) => {
    if (keyEvent.key === "Enter") {
      keyEvent.preventDefault();
      searchLocation(kind);
    }
    if (keyEvent.key === "Escape") {
      resetLocationSearch();
      clearLocationSearchResults(kind);
    }
  });
}

["regular", "departure", "destination"].forEach(bindLocationSearchField);
homeMapToggle.addEventListener("change", () => {
  if (!requireSignIn("로그인하면 집 위치 표시를 변경할 수 있어요.")) {
    homeMapToggle.checked = false;
    return;
  }
  if (homeMapToggle.checked && !homeLocation) {
    homeVisible = false;
    homeMapToggle.checked = false;
    openHomeLocationEditor();
    homeLocationStatus.textContent = "먼저 집 위치를 검색해서 선택해주세요.";
    return;
  }
  homeVisible = homeMapToggle.checked;
  saveHomeSettings();
  renderPlannerMap();
});
homeLocationButton.addEventListener("click", () => {
  if (!requireSignIn("로그인하면 집 위치를 설정할 수 있어요.")) return;
  if (homeLocationEditor.hidden) openHomeLocationEditor();
  else closeHomeLocationEditor();
});
homeLocationCloseButton.addEventListener("click", closeHomeLocationEditor);
homeLocationSearchButton.addEventListener("click", searchHomeLocation);
homeLocationInput.addEventListener("input", () => {
  homeSearchController?.abort();
  homeSearchController = null;
  homeLocationSearchButton.disabled = false;
  homeLocationStatus.textContent = homeLocationInput.value.trim().length >= 2
    ? "검색 버튼을 누르거나 Enter를 입력해주세요."
    : "";
  clearHomeLocationResults();
});
homeLocationInput.addEventListener("keydown", (keyEvent) => {
  if (keyEvent.key === "Enter") {
    keyEvent.preventDefault();
    searchHomeLocation();
  }
  if (keyEvent.key === "Escape") closeHomeLocationEditor();
});
homeLocationRemoveButton.addEventListener("click", () => {
  if (!requireSignIn("로그인하면 집 위치를 삭제할 수 있어요.")) return;
  if (!window.confirm("이 브라우저에 저장된 집 위치를 삭제할까요?")) return;
  homeLocation = null;
  homeVisible = false;
  saveHomeSettings();
  homeMapToggle.checked = false;
  closeHomeLocationEditor();
  renderPlannerMap();
});
categoryInput.addEventListener("focus", openCategoryMenu);
categoryInput.addEventListener("click", openCategoryMenu);
categoryInput.addEventListener("input", () => {
  renderCategoryMenu();
  renderEventGroupOptions();
});
categoryInput.addEventListener("keydown", (keyEvent) => {
  if (keyEvent.key === "Escape") {
    closeCategoryMenu();
    categoryInput.blur();
  }
});
categoryMenuButton.addEventListener("click", () => {
  if (categoryMenu.hidden) {
    categoryInput.focus({ preventScroll: true });
    openCategoryMenu();
  } else {
    closeCategoryMenu();
  }
});
document.addEventListener("pointerdown", (pointerEvent) => {
  if (!pointerEvent.target.closest(".category-picker")) closeCategoryMenu();
  if (!pointerEvent.target.closest(".location-search-field")) clearAllLocationSearchResults();
  if (!pointerEvent.target.closest(".home-location-editor") && !pointerEvent.target.closest("#homeLocationButton")) {
    closeHomeLocationEditor();
  }
});
document.querySelectorAll('input[name="locationType"]').forEach((input) => {
  input.addEventListener("change", syncLocationFields);
});
document.querySelectorAll('input[name="eventKind"]').forEach((input) => {
  input.addEventListener("change", syncLocationFields);
});
eventRepeatInput.addEventListener("change", () => syncEventRecurrenceFields({ initialize: true }));
recurrenceFrequency.addEventListener("change", () => syncEventRecurrenceFields({ initialize: true }));
document.querySelector("#date").addEventListener("change", () => {
  if (eventRepeatInput.checked) syncEventRecurrenceFields({ initialize: true });
});

form.addEventListener("click", (clickEvent) => {
  if (formMode !== "view") return;
  if (!currentUser) {
    clickEvent.preventDefault();
    clickEvent.stopPropagation();
    requireSignIn("로그인하면 이 일정을 변경할 수 있어요.");
    return;
  }
  activateEventEditing(clickEvent.target);
}, true);

form.addEventListener("keydown", (keyEvent) => {
  if (formMode !== "view" || keyEvent.key === "Tab") return;
  if (!currentUser) {
    keyEvent.preventDefault();
    keyEvent.stopPropagation();
    requireSignIn("로그인하면 이 일정을 변경할 수 있어요.");
    return;
  }
  keyEvent.preventDefault();
  if (keyEvent.key === "Enter" || keyEvent.key === " ") {
    activateEventEditing(keyEvent.target);
  }
}, true);

["#startTime", "#endTime", "#cancellationDeadlineTime"].forEach((selector) => {
  document.querySelector(selector).addEventListener("blur", (blurEvent) => {
    const normalized = normalizeTime(blurEvent.target.value);
    if (normalized !== null) blurEvent.target.value = normalized;
  });
});

document.querySelectorAll(".view-tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".view-tab").forEach((tab) => {
      const active = tab === button;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    document.querySelectorAll("[data-panel]").forEach((panel) => {
      panel.hidden = panel.dataset.panel !== button.dataset.view;
    });
  });
});

newNoteButton.addEventListener("click", () => {
  if (!requireSignIn("로그인하면 새 노트를 작성할 수 있어요.")) return;
  selectedNoteId = null;
  renderNotes();
  showNoteEditor();
  noteTitleInput.focus();
});

noteForm.addEventListener("submit", (submitEvent) => {
  submitEvent.preventDefault();
  if (!requireSignIn("로그인하면 노트를 저장할 수 있어요.")) return;
  const now = new Date().toISOString();
  const existing = notes.find((note) => note.id === noteIdInput.value);
  const note = normalizeNote({
    id: existing?.id || crypto.randomUUID(),
    title: noteTitleInput.value.trim(),
    body: noteBodyInput.value,
    createdAt: existing?.createdAt || now,
    updatedAt: now
  });

  if (existing) {
    notes = notes.map((item) => item.id === existing.id ? note : item);
  } else {
    notes.push(note);
  }
  selectedNoteId = note.id;
  saveNotes();
  renderNotes();
  noteSaveStatus.textContent = "저장됨";
});

deleteNoteButton.addEventListener("click", () => {
  if (!requireSignIn("로그인하면 노트를 삭제할 수 있어요.")) return;
  const note = notes.find((item) => item.id === noteIdInput.value);
  if (!note || !window.confirm(`“${note.title || "제목 없는 노트"}” 노트를 삭제할까요?`)) return;
  notes = notes.filter((item) => item.id !== note.id);
  selectedNoteId = null;
  saveNotes();
  renderNotes();
});

taskForm.addEventListener("submit", (submitEvent) => {
  submitEvent.preventDefault();
  if (!requireSignIn("로그인하면 할 일을 저장할 수 있어요.")) return;
  const title = taskTitleInput.value.trim();
  if (!title) return taskTitleInput.focus();
  const dueTime = normalizeTime(taskDueTimeInput.value);
  if (dueTime === null) {
    window.alert("완료 시간은 24시간제로 입력해주세요. 예: 09:00, 16:30");
    return taskDueTimeInput.focus();
  }
  if (dueTime && !taskDueDateInput.value) {
    window.alert("완료 시간을 입력하려면 날짜도 선택해주세요.");
    return;
  }
  const now = new Date().toISOString();
  const existing = selectedTaskId ? tasks.find((task) => task.id === selectedTaskId) : null;
  const linkedValue = taskEventSelect.value;
  const eventId = linkedValue.startsWith("event:") ? linkedValue.slice(6) : "";
  const groupId = linkedValue.startsWith("group:") ? linkedValue.slice(6) : "";
  const linkedEvent = events.find((event) => event.id === eventId);
  const linkedGroup = groupForId(groupId);
  const classifications = linkedEvent
    ? eventClassificationLinks(linkedEvent)
    : linkedGroup
      ? [{ category: linkedGroup.category, groupId: linkedGroup.id }]
      : existing?.classifications || [{ category: "MISC", groupId: "" }];
  const repeatRule = taskRepeatInput.checked ? currentTaskRepeatRule() : null;
  if (repeatRule && (!taskDueDateInput.value || !repeatRule.endDate || repeatRule.endDate < taskDueDateInput.value)) {
    window.alert("반복 To Do에는 시작할 완료 기한과 그 이후의 반복 종료일이 필요해요.");
    return;
  }
  if (repeatRule?.frequency === "weekly" && !repeatRule.weekdays.length) {
    window.alert("매주 반복할 요일을 하나 이상 선택해주세요.");
    return;
  }
  const repeatSeriesId = repeatRule ? existing?.repeatSeriesId || crypto.randomUUID() : "";
  const task = normalizeTask({
    ...existing,
    id: existing?.id || crypto.randomUUID(),
    title,
    dueDate: taskDueDateInput.value,
    dueTime,
    eventId,
    groupId,
    classifications,
    parentTaskId: taskParentSelect.value,
    repeatSeriesId,
    repeatRule,
    submissionRequired: taskSubmissionInput.checked,
    memo: taskMemoInput.value.trim(),
    createdAt: existing?.createdAt || now,
    updatedAt: now
  });
  const shouldGenerateSeries = Boolean(repeatRule && !existing?.repeatSeriesId);
  const dates = shouldGenerateSeries
    ? [...new Set([task.dueDate, ...recurrenceDates(task.dueDate, repeatRule)])].sort()
    : [task.dueDate];
  const instances = dates.map((dueDate, index) => normalizeTask({
    ...task,
    id: index === 0 ? task.id : crypto.randomUUID(),
    dueDate,
    completed: index === 0 ? task.completed : false,
    completedAt: index === 0 ? task.completedAt : "",
    archivedAt: index === 0 ? task.archivedAt : "",
    createdAt: index === 0 ? task.createdAt : now,
    updatedAt: now
  }));
  tasks = existing ? tasks.map((item) => item.id === task.id ? instances[0] : item) : [...tasks, instances[0]];
  if (instances.length > 1) tasks.push(...instances.slice(1));
  saveTasks();
  renderAll();
  openTaskPanel(task.id);
});
taskRepeatInput.addEventListener("change", () => syncTaskRepeatFields({ initialize: true }));
taskRepeatFrequency.addEventListener("change", () => syncTaskRepeatFields({ initialize: true }));
taskDueDateInput.addEventListener("change", () => {
  if (taskRepeatInput.checked) syncTaskRepeatFields({ initialize: true });
});
taskDueTimeInput.addEventListener("blur", () => {
  const normalized = normalizeTime(taskDueTimeInput.value);
  if (normalized !== null) taskDueTimeInput.value = normalized;
});
taskChildButton.addEventListener("click", () => {
  const parentTaskId = selectedTaskId;
  if (!parentTaskId) return;
  openTaskPanel(null, { parentTaskId });
});
taskArchiveButton.addEventListener("click", () => {
  const task = tasks.find((item) => item.id === selectedTaskId);
  if (!task) return;
  const now = new Date().toISOString();
  const archived = isArchivedTask(task);
  tasks = tasks.map((item) => item.id === task.id ? {
    ...item,
    archivedAt: archived ? "" : now,
    completedAt: archived && item.completed ? now : item.completedAt,
    updatedAt: now
  } : item);
  saveTasks();
  showIdleForm();
  renderAll();
});
taskDeleteButton.addEventListener("click", () => {
  const task = tasks.find((item) => item.id === selectedTaskId);
  if (!task || !window.confirm(`“${task.title}” 할 일을 삭제할까요?`)) return;
  tasks = tasks.filter((item) => item.id !== task.id);
  saveTasks();
  showIdleForm();
  renderAll();
});

travelForm.addEventListener("submit", (submitEvent) => submitEvent.preventDefault());
travelCloseButton.addEventListener("click", () => travelDialog.close());
travelDialog.addEventListener("click", (clickEvent) => {
  if (clickEvent.target === travelDialog) travelDialog.close();
});
travelOriginSelect.addEventListener("change", updateTravelLinks);
travelForm.querySelectorAll('input[name="travelMode"]').forEach((input) => {
  input.addEventListener("change", updateTravelLinks);
});
travelDuration.addEventListener("input", updateTravelCalculations);
travelManualToggle.addEventListener("click", () => {
  const nextMode = !travelManualMode;
  const event = events.find((item) => item.id === travelEventId);
  if (nextMode && !event?.travelPlan?.manual) travelDuration.value = "";
  setTravelManualMode(nextMode);
});

travelSaveButton.addEventListener("click", () => {
  if (!requireSignIn("로그인하면 이동 계획을 저장할 수 있어요.")) return;
  const event = events.find((item) => item.id === travelEventId);
  const origin = selectedTravelOrigin();
  const targetArrival = normalizeTime(event?.startTime || "");
  if (!event || !origin) return;
  if (travelManualMode && targetArrival === null) {
    window.alert("일정에 시작 시각을 먼저 입력해주세요.");
    return;
  }

  const durationMinutes = travelDuration.value === "" ? null : Number(travelDuration.value);
  if (travelManualMode && (!Number.isFinite(durationMinutes) || durationMinutes < 0)) {
    window.alert("예상 소요 시간을 분 단위로 입력해주세요.");
    return;
  }
  if (!travelManualMode && !event.travelPlan?.naverDepartureTime) {
    window.alert("네이버지도에서 경로를 가져오거나 수동 입력을 선택해주세요.");
    return;
  }

  events = events.map((item) => item.id === event.id
    ? {
        ...item,
        travelPlan: travelManualMode
          ? {
              originKey: origin.key,
              originName: origin.name,
              mode: selectedTravelMode(),
              targetArrival,
              durationMinutes,
              manual: true,
              updatedAt: new Date().toISOString()
            }
          : {
              ...Object.fromEntries(Object.entries(item.travelPlan || {}).filter(([key]) => !["bufferMinutes", "summaryImage"].includes(key))),
              originKey: origin.key,
              originName: origin.name,
              mode: selectedTravelMode(),
              targetArrival: event.startTime || item.travelPlan?.targetArrival || "",
              manual: false,
              updatedAt: new Date().toISOString()
            }
      }
    : item);
  saveEvents();
  renderAll();
  travelDialog.close();
});

travelClearButton.addEventListener("click", () => {
  if (!requireSignIn("로그인하면 이동 계획을 지울 수 있어요.")) return;
  const event = events.find((item) => item.id === travelEventId);
  if (!event?.travelPlan || !window.confirm("이 일정에 저장된 이동 계획을 지울까요?")) return;
  events = events.map((item) => item.id === event.id ? { ...item, travelPlan: null } : item);
  saveEvents();
  renderAll();
  travelDialog.close();
});

window.addEventListener("message", (messageEvent) => {
  if (messageEvent.source !== window || messageEvent.data?.source !== "serin-route-extension") return;
  if (messageEvent.data.type !== "ROUTE_RESULT") return;
  if (!currentUser) {
    requireSignIn("로그인하면 네이버지도 이동 계획을 가져올 수 있어요.");
    return;
  }

  const payload = messageEvent.data.payload || {};
  const event = events.find((item) => item.id === payload.eventId);
  const durationMinutes = Number(payload.durationMinutes);
  if (!event || !Number.isFinite(durationMinutes) || durationMinutes < 0) return;

  const mode = ["traffic", "car", "walk", "bicycle"].includes(payload.mode) ? payload.mode : "traffic";
  const previousPlan = event.travelPlan || {};
  const normalizedTargetArrival = normalizeTime(payload.targetArrival || event.startTime || "");
  const targetArrival = normalizedTargetArrival === null ? event.startTime || "" : normalizedTargetArrival;
  events = events.map((item) => item.id === event.id
    ? {
        ...item,
        travelPlan: {
          ...Object.fromEntries(Object.entries(previousPlan).filter(([key]) => !["bufferMinutes", "summaryImage"].includes(key))),
          originKey: payload.originKey || previousPlan.originKey || "",
          originName: payload.originName || previousPlan.originName || "",
          mode,
          targetArrival,
          durationMinutes,
          naverDepartureTime: String(payload.departureTime || ""),
          naverArrivalTime: String(payload.arrivalTime || ""),
          routeSteps: normalizeTravelRouteSteps(payload.steps),
          manual: false,
          capturedAt: payload.capturedAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    : item);
  saveEvents();
  renderAll();

  if (travelEventId === event.id) {
    travelDuration.value = String(durationMinutes);
    const modeInput = travelForm.querySelector(`input[name="travelMode"][value="${mode}"]`);
    if (modeInput) modeInput.checked = true;
    setTravelManualMode(false);
    updateTravelLinks();
    renderTravelRouteSteps(travelStepsPreview, {
      ...previousPlan,
      naverDepartureTime: payload.departureTime || "",
      naverArrivalTime: payload.arrivalTime || "",
      routeSteps: payload.steps || []
    });
    const capturedTimes = [
      payload.departureTime ? `${payload.departureTime} 출발` : "",
      payload.arrivalTime ? `${payload.arrivalTime} 도착` : ""
    ].filter(Boolean).join(" · ");
    travelHelper.textContent = `네이버지도에서 ${durationMinutes}분 경로를 가져왔어요${capturedTimes ? ` · ${capturedTimes}` : ""}.`;
  }

  window.postMessage({
    source: "serin-schedule-page",
    type: "ROUTE_RESULT_ACCEPTED",
    eventId: event.id
  }, window.location.origin === "null" ? "*" : window.location.origin);
});

calendarFilterResetButton.addEventListener("click", resetCalendarDateFilter);

categoryManagerEditButton.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  if (!categoryManager.open) return;
  classificationManagerEditing = !classificationManagerEditing;
  renderCategoryControls();
});

categoryManager.addEventListener("toggle", () => {
  if (categoryManager.open || !classificationManagerEditing) return;
  classificationManagerEditing = false;
  renderCategoryControls();
});

clearButton.addEventListener("click", () => {
  if (!requireSignIn("로그인하면 내 데이터를 관리할 수 있어요.")) return;
  if ((!events.length && !notes.length && !tasks.length) || !window.confirm("저장된 일정, 할 일과 노트를 모두 삭제할까요? 이 작업은 되돌릴 수 없어요.")) return;
  events = [];
  tasks = [];
  notes = [];
  categoryOrder = [];
  eventGroups = [];
  selectedCategories.clear();
  selectedNoteId = null;
  saveEvents();
  saveTasks();
  saveNotes();
  saveCategoryOrder();
  saveEventGroups();
  showIdleForm();
  renderAll();
});

exportButton.addEventListener("click", () => {
  if (!requireSignIn("로그인하면 내 데이터를 백업할 수 있어요.")) return;
  const backup = { version: 11, events, tasks, taskSettings, categoryOrder, eventGroups, notes, homeLocation, homeVisible };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `serin-schedule-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
});

importInput.addEventListener("click", (clickEvent) => {
  if (currentUser) return;
  clickEvent.preventDefault();
  requireSignIn("로그인하면 백업 데이터를 불러올 수 있어요.");
});

importInput.addEventListener("change", async () => {
  if (!requireSignIn("로그인하면 백업 데이터를 불러올 수 있어요.")) {
    importInput.value = "";
    return;
  }
  const file = importInput.files?.[0];
  if (!file) return;

  try {
    const imported = JSON.parse(await file.text());
    const importedEvents = Array.isArray(imported) ? imported : imported.events;
    if (!Array.isArray(importedEvents)) throw new Error("일정 배열이 아닙니다.");
    events = importedEvents.map((event) => normalizeEventTodos({
      ...event,
      id: event.id || crypto.randomUUID(),
      category: normalizedCategory(event.category || "ETC")
    }));
    tasks = mergeTaskLists(tasksFromEventTodos(events), Array.isArray(imported.tasks) ? imported.tasks : []);
    events = events.map((event) => ({ ...event, todos: [] }));
    taskSettings = normalizeTaskSettings(imported.taskSettings);
    categoryOrder = Array.isArray(imported.categoryOrder) ? imported.categoryOrder : [];
    eventGroups = Array.isArray(imported.eventGroups) ? imported.eventGroups.map(normalizeEventGroup).filter((group) => group.name) : [];
    notes = Array.isArray(imported.notes) ? imported.notes.map(normalizeNote) : [];
    selectedCategories = new Set(events.map((event) => event.category));
    selectedNoteId = null;
    saveEvents();
    saveTasks();
    saveTaskSettings();
    saveNotes();
    saveCategoryOrder();
    saveEventGroups();
    showIdleForm();
    renderAll();
  } catch (error) {
    window.alert("일정 백업 파일을 읽지 못했어요.");
    console.error(error);
  } finally {
    importInput.value = "";
  }
});

syncLocationFields();
syncConditionalFields();
applyFormMode("idle");
initializePlannerMap();
renderAll();
initializeCloudSync();
window.setInterval(renderUpcomingTravel, 60 * 1000);
