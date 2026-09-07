const STORAGE_KEY = "serin-schedule-events-v1";
const CATEGORY_ORDER_KEY = "serin-schedule-category-order-v1";
const HOME_LOCATION_KEY = "serin-schedule-home-location-v1";
const HOME_VISIBLE_KEY = "serin-schedule-home-visible-v1";
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
const categoryInput = document.querySelector("#category");
const categoryMenuButton = document.querySelector("#categoryMenuButton");
const categoryMenu = document.querySelector("#categoryMenu");
const categoryManagerList = document.querySelector("#categoryManagerList");
const timelineView = document.querySelector("#timelineView");
const categoriesView = document.querySelector("#categoriesView");
const tasksView = document.querySelector("#tasksView");
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
const plannerMapEmpty = document.querySelector("#plannerMapEmpty");
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
const authSignedOut = document.querySelector("#authSignedOut");
const authSignedIn = document.querySelector("#authSignedIn");
const authEmailInput = document.querySelector("#authEmailInput");
const authLoginButton = document.querySelector("#authLoginButton");
const authUserEmail = document.querySelector("#authUserEmail");
const authLogoutButton = document.querySelector("#authLogoutButton");
const authMessage = document.querySelector("#authMessage");
const syncStatus = document.querySelector("#syncStatus");
const syncNowButton = document.querySelector("#syncNowButton");

let events = loadEvents();
let categoryOrder = loadCategoryOrder();
let selectedCategories = new Set(events.map((event) => normalizedCategory(event.category || "ETC")));
let draggedCategoryItem = null;
let draggedCategoryContainer = null;
let selectedEventId = null;
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
let plannerMap = null;
let plannerMapMarkers = null;
let locationSearchController = null;
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
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
    version: 6,
    events,
    categoryOrder,
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

function updateAuthView() {
  const signedIn = Boolean(currentUser);
  authSignedOut.hidden = signedIn;
  authSignedIn.hidden = !signedIn;
  authUserEmail.textContent = currentUser?.email || "로그인됨";
  document.querySelectorAll("[data-auth-required]").forEach((section) => {
    section.hidden = !signedIn;
  });
  if (!signedIn) setSyncStatus("");
  if (signedIn && plannerMap) {
    window.setTimeout(() => plannerMap.invalidateSize(), 0);
  }
}

function storePlannerState(state) {
  const incomingEvents = Array.isArray(state?.events) ? state.events : [];
  const incomingCategoryOrder = Array.isArray(state?.categoryOrder) ? state.categoryOrder : [];
  const incomingHome = state?.homeLocation;

  applyingCloudState = true;
  events = incomingEvents.map((event) => normalizeEventTodos({
    ...event,
    id: event.id || crypto.randomUUID(),
    category: normalizedCategory(event.category || "ETC")
  }));
  categoryOrder = incomingCategoryOrder.map(normalizedCategory);
  homeLocation = incomingHome && Number.isFinite(Number(incomingHome.latitude)) && Number.isFinite(Number(incomingHome.longitude))
    ? {
        latitude: Number(incomingHome.latitude),
        longitude: Number(incomingHome.longitude),
        name: String(incomingHome.name || "집"),
        address: String(incomingHome.address || "")
      }
    : null;
  homeVisible = Boolean(state?.homeVisible && homeLocation);
  selectedCategories = new Set(events.map((event) => event.category));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  localStorage.setItem(CATEGORY_ORDER_KEY, JSON.stringify(categoryOrder));
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
  return {
    version: 6,
    events: [...mergedEvents.values()],
    categoryOrder: [...new Set([...cloudCategories, ...localCategories])],
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
    authMessage.textContent = "동기화 서비스를 불러오지 못했어요. 이 기기에는 계속 저장됩니다.";
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
        authMessage.textContent = "로그아웃됐어요. 일정은 이 기기에도 남아 있습니다.";
        updateAuthView();
      }
    }, 0);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && currentUser && ["idle", "view"].includes(formMode)) {
      syncFromCloud().catch((syncError) => {
        console.error(syncError);
        setSyncStatus("자동 동기화 실패 · 다시 시도해주세요", "error");
      });
    }
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
    updateAuthView();
  }
}

function normalizedCategory(value) {
  return value.trim().toUpperCase() || "ETC";
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

function inferredLocationType(event) {
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
    location: compactLocation,
    locationDetail: String(event.locationDetail || ""),
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
  return [...new Set(events.map((event) => normalizedCategory(event.category || "ETC")))];
}

function eventLocationLabel(event) {
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

function compactDate(dateString) {
  return formatDate(dateString, { month: "numeric", day: "numeric", weekday: "short" });
}

function dateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateMatchesActiveFilter(date) {
  if (timelineStartDate && date < timelineStartDate) return false;
  if (timelineEndDate && date > timelineEndDate) return false;
  return true;
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

function hasMapCoordinates(event) {
  if (event.latitude === null || event.latitude === undefined || event.latitude === "") return false;
  if (event.longitude === null || event.longitude === undefined || event.longitude === "") return false;
  return Number.isFinite(Number(event.latitude)) && Number.isFinite(Number(event.longitude));
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

function mapPopupForEvent(event, { showDate = false } = {}) {
  const popup = element("div", "map-popup-content");
  const time = event.startTime || "All day";
  const popupHeading = [
    showDate ? compactDate(event.date) : "",
    time,
    event.title
  ].filter(Boolean).join(" · ");
  popup.append(
    element("strong", "", popupHeading),
    element("span", "", eventLocationLabel(event) || "장소 정보 없음")
  );

  const links = element("div", "map-popup-links");
  const coordinates = `${Number(event.latitude)},${Number(event.longitude)}`;
  const googleLink = element("a", "", "Google 지도");
  googleLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coordinates)}`;
  googleLink.target = "_blank";
  googleLink.rel = "noreferrer";
  const appleLink = element("a", "", "Apple 지도");
  appleLink.href = `https://maps.apple.com/?ll=${encodeURIComponent(coordinates)}&q=${encodeURIComponent(event.location || event.title)}`;
  appleLink.target = "_blank";
  appleLink.rel = "noreferrer";
  links.append(googleLink, appleLink);
  popup.append(links);
  return popup;
}

function renderPlannerMap() {
  const mapStartDate = hasExplicitDateFilter ? timelineStartDate : selectedMapDate;
  const mapEndDate = hasExplicitDateFilter ? timelineEndDate : selectedMapDate;
  const isMapRange = mapStartDate !== mapEndDate;
  mapDateKicker.textContent = isMapRange ? "SELECTED RANGE" : "SELECTED DATE";
  mapDateLabel.textContent = isMapRange
    ? `${formatDate(mapStartDate, { year: "numeric", month: "numeric", day: "numeric" })} – ${formatDate(mapEndDate, { year: "numeric", month: "numeric", day: "numeric" })}`
    : formatDate(mapStartDate, { month: "long", day: "numeric", weekday: "long" });
  const offlineEvents = sortEvents(events.filter((event) => (
    event.date >= mapStartDate &&
    event.date <= mapEndDate &&
    inferredLocationType(event) === "offline"
  )));
  const mappedEvents = offlineEvents.filter(hasMapCoordinates);
  const unmappedCount = offlineEvents.length - mappedEvents.length;
  const showHome = homeVisible && Boolean(homeLocation);
  mapEventCount.textContent = offlineEvents.length
    ? `${mappedEvents.length}곳${unmappedCount ? ` · 위치 미설정 ${unmappedCount}` : ""}${showHome ? " · 집" : ""}`
    : `일정 없음${showHome ? " · 집" : ""}`;
  homeMapToggle.checked = showHome;
  homeLocationRemoveButton.hidden = !homeLocation;

  if (!plannerMap || !plannerMapMarkers) return;
  plannerMapMarkers.clearLayers();

  const coordinates = [];
  mappedEvents.forEach((event) => {
    const point = [Number(event.latitude), Number(event.longitude)];
    coordinates.push(point);
    window.L.circleMarker(point, {
      radius: 7,
      color: "#ffffff",
      weight: 2,
      fillColor: "#0071e3",
      fillOpacity: 0.95
    }).bindPopup(mapPopupForEvent(event, { showDate: isMapRange })).addTo(plannerMapMarkers);
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
  renderPlannerMap();
}

function isEventElapsed(event) {
  const today = dateInputValue(new Date());
  if (event.date < today) return true;
  if (event.date > today) return false;

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
  const date = new Date(`${datePart}T${timePart}`);
  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date);
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
      completed: item.dataset.completed === "true"
    });
  }
  return { todos };
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
  card.open = selectedEventId === event.id;
  const summary = element("summary", "compact-event-summary");
  const primary = element("span", "compact-event-primary");
  if (stackDateTime) {
    primary.append(
      element("span", "compact-event-title", event.title),
      element("span", "compact-event-subline", `${compactDate(event.date)} · ${event.startTime || "All day"}`)
    );
  } else {
    if (showDate) primary.append(element("span", "compact-event-date", compactDate(event.date)));
    primary.append(
      element("span", `compact-event-time${event.startTime ? "" : " is-all-day"}`, event.startTime || "All day"),
      element("span", "compact-event-divider", "—"),
      element("span", "compact-event-title", event.title)
    );
  }

  const meta = element("span", "compact-event-meta");
  const reservationPill = reservationStatusPill(event);
  if (reservationPill) meta.append(reservationPill);
  if (showCategory) meta.append(element("span", "category-pill", event.category));
  summary.append(primary, meta);
  card.append(summary);

  const expanded = element("div", "event-expanded");
  const info = element("div", "event-expanded-info");
  const dateInfo = element("div", "event-info-item");
  dateInfo.append(element("span", "", "일시"), element("strong", "", `${compactDate(event.date)} · ${formatTime(event)}`));
  info.append(dateInfo);

  const locationType = inferredLocationType(event);
  const locationText = locationType === "online" ? "온라인" : eventLocationLabel(event);
  if (locationText) {
    const locationInfo = element("div", "event-info-item");
    locationInfo.append(element("span", "", "위치"), element("strong", "", locationText));
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

  const actions = element("div", "event-actions");
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

function submissionTimelineCard(event, todo, { dimmed = false } = {}) {
  const elapsed = isTodoDeadlineElapsed(todo);
  const card = element(
    "details",
    `compact-event submission-deadline-event${dimmed ? " is-dimmed" : ""}${elapsed ? " is-elapsed" : ""}`
  );
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
    element("span", "compact-event-subline", `${todo.title} · ${event.title}`)
  );
  primary.append(time, element("span", "compact-event-divider", "—"), copy);
  const meta = element("span", "compact-event-meta");
  meta.append(element("span", "category-pill", event.category));
  summary.append(primary, meta);
  card.append(summary);

  const expanded = element("div", "event-expanded");
  const info = element("div", "event-expanded-info");
  const deadlineInfo = element("div", "event-info-item");
  deadlineInfo.append(
    element("span", "", "제출 기한"),
    element("strong", "", `${compactDate(todo.dueDate)} · ${todo.dueTime || "시간 미정"}`)
  );
  const linkedEventInfo = element("div", "event-info-item");
  linkedEventInfo.append(element("span", "", "연결 일정"), element("strong", "", event.title));
  info.append(deadlineInfo, linkedEventInfo);
  expanded.append(info);

  const actions = element("div", "event-actions");
  const detailButton = element("button", "detail-button", "연결 일정 보기");
  detailButton.type = "button";
  detailButton.addEventListener("click", () => {
    showEventInForm(event.id, "view");
    formCard.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  actions.append(detailButton);
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

function renderTimeline() {
  timelineView.replaceChildren();

  const timelineEntries = [];
  events.forEach((event) => {
    timelineEntries.push({ kind: "event", date: event.date, time: event.startTime || "", event });
    event.todos
      .filter((todo) => todo.submissionRequired && todo.dueDate)
      .forEach((todo) => {
        timelineEntries.push({ kind: "submission", date: todo.dueDate, time: todo.dueTime || "", event, todo });
      });
  });

  const sorted = timelineEntries.filter((entry) => dateMatchesActiveFilter(entry.date)).sort((a, b) => {
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
    const label = element("div", "date-label");
    const dateObject = new Date(`${date}T00:00:00`);
    label.append(
      element("strong", "", `${dateObject.getMonth() + 1}/${dateObject.getDate()}`),
      element("span", "", formatDate(date, { weekday: "long" }))
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
  const categories = orderedCategories();
  const visibleEvents = events.filter((event) => dateMatchesActiveFilter(event.date));

  if (!categories.length) {
    categoriesView.append(emptyState("표시할 카테고리가 없어요", "일정을 추가하면 카테고리 카드가 자동으로 생깁니다."));
    return;
  }

  const filterToolbar = element("div", "category-filter-toolbar");
  const filterHeader = element("div", "category-filter-header");
  filterHeader.append(element("strong", "", "카테고리 필터"), element("span", "", "드래그해서 순서 변경"));

  const filterActions = element("div", "category-filter-actions");
  const selectAllButton = element("button", "text-button", "모두 선택");
  selectAllButton.type = "button";
  selectAllButton.addEventListener("click", () => {
    selectedCategories = new Set(categories);
    renderCategories();
  });

  const clearAllButton = element("button", "text-button", "모두 해제");
  clearAllButton.type = "button";
  clearAllButton.addEventListener("click", () => {
    selectedCategories.clear();
    renderCategories();
  });
  filterActions.append(selectAllButton, clearAllButton);
  filterHeader.append(filterActions);

  const filterList = element("div", "category-filter-list");
  categories.forEach((category) => {
    const chip = element("div", "category-filter-chip");
    chip.dataset.category = category;
    chip.draggable = true;
    const button = element("button", `category-filter-button${selectedCategories.has(category) ? " is-active" : ""}`, `#${category}`);
    button.type = "button";
    button.setAttribute("aria-pressed", String(selectedCategories.has(category)));
    button.addEventListener("click", () => {
      if (selectedCategories.has(category)) {
        selectedCategories.delete(category);
      } else {
        selectedCategories.add(category);
      }
      renderCategories();
    });
    chip.append(button);
    filterList.append(chip);
  });

  filterToolbar.append(filterHeader, filterList);
  categoriesView.append(filterToolbar);
  setupCategoryDragSorting(filterList);

  const grouped = sortEvents(visibleEvents).reduce((groups, event) => {
    if (!groups[event.category]) groups[event.category] = [];
    groups[event.category].push(event);
    return groups;
  }, {});

  const grid = element("div", "category-grid");
  categories
    .filter((category) => selectedCategories.has(category) && grouped[category]?.length)
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
    const hasSelectedCategory = categories.some((category) => selectedCategories.has(category));
    categoriesView.append(emptyState(
      hasSelectedCategory ? "선택한 기간에 일정이 없어요" : "선택된 카테고리가 없어요",
      hasSelectedCategory
        ? "위 달력에서 다른 날짜나 범위를 선택해보세요."
        : "위에서 카테고리를 선택하거나 모두 선택을 눌러주세요."
    ));
  }
}

function renderCategoryControls() {
  categoryManagerList.replaceChildren();
  const categories = orderedCategories();

  renderCategoryMenu(categories);

  categories.forEach((category) => {
    const row = element("div", "category-manager-row");
    row.dataset.category = category;
    const dragHandle = element("button", "category-drag-handle", "⠿");
    dragHandle.type = "button";
    dragHandle.draggable = true;
    dragHandle.title = `${category} 순서 변경`;
    dragHandle.setAttribute("aria-label", `${category} 카테고리 순서 변경`);
    const input = document.createElement("input");
    input.type = "text";
    input.value = category;
    input.setAttribute("aria-label", `${category} 카테고리 새 이름`);
    const button = element("button", "", "변경");
    button.type = "button";
    button.addEventListener("click", () => renameCategory(category, input.value));
    input.addEventListener("keydown", (keyEvent) => {
      if (keyEvent.key === "Enter") {
        keyEvent.preventDefault();
        renameCategory(category, input.value);
      }
    });
    row.append(dragHandle, input, button);
    categoryManagerList.append(row);
  });

  if (!categories.length) {
    categoryManagerList.append(element("span", "category-manager-empty", "일정을 추가하면 카테고리가 생겨요."));
  }

  setupCategoryDragSorting(categoryManagerList);
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
    const item = dragEvent.target.closest("[data-category]");
    if (!item || !container.contains(item)) return;
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
  const label = element("label", "task-check");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = false;
  checkbox.setAttribute("aria-label", `${event.title} 예약 완료`);
  checkbox.addEventListener("change", () => updateReservationTask(event.id, checkbox.checked));

  const copy = element("span", "task-copy");
  copy.append(
    element("strong", "", event.title),
    element("span", "", `${compactDate(event.date)} · 예약`)
  );
  label.append(checkbox, copy);
  item.append(label, element("span", "category-pill", event.category));
  return item;
}

function todoTaskItem(event, todo) {
  const item = element("div", `task-item${todo.completed ? " is-done" : ""}`);
  const label = element("label", "task-check");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;
  checkbox.setAttribute("aria-label", `${todo.title} 완료`);
  checkbox.addEventListener("change", () => updateTodoTask(event.id, todo.id, checkbox.checked));

  const copy = element("span", "task-copy");
  const deadline = todo.dueDate
    ? formatDeadline(`${todo.dueDate}${todo.dueTime ? `T${todo.dueTime}` : ""}`)
    : "기한 없음";
  copy.append(
    element("strong", "", todo.title),
    element("span", "", `${event.title} · ${deadline}`)
  );
  label.append(checkbox, copy);

  const pills = element("span", "task-pills");
  if (todo.submissionRequired) pills.append(element("span", "submission-pill", "제출"));
  pills.append(element("span", "category-pill", event.category));
  item.append(label, pills);
  return item;
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
  const visibleEvents = events.filter((event) => dateMatchesActiveFilter(event.date));
  const reservationTasks = sortEvents(visibleEvents.filter((event) => inferredReservationStatus(event) === "needed"));
  const cancellationTasks = [...visibleEvents]
    .filter((event) => inferredReservationStatus(event) === "considering")
    .sort((a, b) => cancellationDeadlineSortValue(a).localeCompare(cancellationDeadlineSortValue(b)));
  const todoTasks = visibleEvents.flatMap((event) => event.todos.map((todo) => ({ event, todo })))
    .sort((a, b) => {
      const aValue = `${a.todo.dueDate || "9999-12-31"}T${a.todo.dueTime || "23:59"}`;
      const bValue = `${b.todo.dueDate || "9999-12-31"}T${b.todo.dueTime || "23:59"}`;
      return aValue.localeCompare(bValue);
    });

  if (!reservationTasks.length && !cancellationTasks.length && !todoTasks.length) {
    tasksView.append(emptyState("아직 할 일이 없어요", "일정에 To Do를 추가하면 여기에 모두 모아 보여줍니다."));
    return;
  }

  if (cancellationTasks.length) {
    const section = element("section", "task-section cancellation-task-section");
    section.append(element("h2", "", "취소 결정"));
    const list = element("div", "task-list");
    cancellationTasks.forEach((event) => list.append(cancellationTaskItem(event)));
    section.append(list);
    tasksView.append(section);
  }

  if (reservationTasks.length) {
    const section = element("section", "task-section");
    section.append(element("h2", "", "예약"));
    const list = element("div", "task-list");
    reservationTasks.forEach((event) => list.append(reservationTaskItem(event)));
    section.append(list);
    tasksView.append(section);
  }

  if (todoTasks.length) {
    const section = element("section", "task-section");
    section.append(element("h2", "", "To Do"));
    const list = element("div", "task-list");
    todoTasks.forEach(({ event, todo }) => list.append(todoTaskItem(event, todo)));
    section.append(list);
    tasksView.append(section);
  }
}

function renderAll() {
  renderTimeline();
  renderCategories();
  renderTasks();
  renderCategoryControls();
  renderPlannerOverview();
}

function clearLocationSearchResults() {
  locationSearchResults.hidden = true;
  locationSearchResults.replaceChildren();
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

function selectLocationResult(result) {
  const latitude = Number(result.lat);
  const longitude = Number(result.lon);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;

  selectedLocation = {
    latitude,
    longitude,
    name: locationResultName(result),
    address: result.display_name || locationResultName(result)
  };
  locationSearchController?.abort();
  locationSearchController = null;
  locationSearchButton.disabled = false;
  locationInput.value = selectedLocation.name;
  locationSearchStatus.textContent = "지도 위치가 선택됐어요.";
  clearLocationSearchResults();
  locationInput.focus({ preventScroll: true });
}

function renderLocationSearchResults(results) {
  locationSearchResults.replaceChildren();
  if (!results.length) {
    locationSearchResults.append(element("p", "category-menu-hint", "검색 결과가 없어요. 장소명을 더 구체적으로 입력해보세요."));
  } else {
    results.forEach((result) => {
      const button = element("button", "location-result-button");
      button.type = "button";
      button.append(
        element("strong", "", locationResultName(result)),
        element("span", "", result.display_name || "")
      );
      button.addEventListener("click", () => selectLocationResult(result));
      locationSearchResults.append(button);
    });
  }
  locationSearchResults.hidden = false;
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

async function searchLocation() {
  const query = locationInput.value.trim();
  if (query.length < 2) {
    locationSearchStatus.textContent = query ? "두 글자 이상 입력하면 장소를 찾아드려요." : "";
    clearLocationSearchResults();
    return;
  }

  locationSearchController?.abort();
  const controller = new AbortController();
  locationSearchController = controller;
  locationSearchButton.disabled = true;
  locationSearchStatus.textContent = "장소를 검색하고 있어요…";
  clearLocationSearchResults();

  try {
    const results = await requestNominatim(query, controller);
    if (controller.signal.aborted) return;
    renderLocationSearchResults(results);
    locationSearchStatus.textContent = results.length
      ? "검색 결과에서 정확한 장소를 선택해주세요."
      : "검색 결과가 없어요. 장소명이나 주소를 바꿔보세요.";
  } catch (error) {
    if (error.name === "AbortError") return;
    console.error(error);
    locationSearchStatus.textContent = "장소를 검색하지 못했어요. 잠시 후 다시 시도해주세요.";
  } finally {
    if (locationSearchController === controller) {
      locationSearchController = null;
      locationSearchButton.disabled = false;
    }
  }
}

function resetLocationSearch() {
  locationSearchController?.abort();
  locationSearchController = null;
  locationSearchButton.disabled = false;
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
  const locationType = document.querySelector('input[name="locationType"]:checked')?.value || "offline";
  offlineLocationField.hidden = locationType !== "offline";
  onlineLinkField.hidden = locationType !== "online";
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
  locationSearchStatus.textContent = "";
  clearLocationSearchResults();
  form.reset();
  document.querySelector("#eventId").value = "";
  renderTodoInputs();
  syncLocationFields();
  syncConditionalFields();
}

function applyFormMode(mode) {
  formMode = mode;
  const isIdle = mode === "idle";
  const isViewing = mode === "view";
  const isCreating = mode === "create";

  form.hidden = isIdle;
  formPlaceholder.hidden = !isIdle;
  form.classList.toggle("is-viewing", isViewing);
  saveButton.hidden = isIdle || isViewing;
  newEventButton.hidden = isCreating || mode === "edit";
  cancelEditButton.hidden = isIdle || isViewing;

  formKicker.textContent = isCreating ? "NEW EVENT" : isViewing ? "SELECTED EVENT" : mode === "edit" ? "EDIT EVENT" : "EVENT";
  formTitle.textContent = isCreating ? "일정 추가" : isViewing ? "일정 보기" : mode === "edit" ? "일정 수정" : "일정 보기";
  saveButton.textContent = isCreating ? "일정 저장" : "변경 저장";
}

function showIdleForm() {
  selectedEventId = null;
  clearFormValues();
  applyFormMode("idle");
}

function startNewEvent() {
  selectedEventId = null;
  clearFormValues();
  applyFormMode("create");
  renderAll();
  document.querySelector("#title").focus();
}

function showEventInForm(id, mode = "view") {
  const event = events.find((item) => item.id === id);
  if (!event) return;

  selectedEventId = event.id;
  document.querySelector("#eventId").value = event.id;
  document.querySelector("#title").value = event.title;
  document.querySelector("#date").value = event.date;
  document.querySelector("#startTime").value = event.startTime || "";
  document.querySelector("#endTime").value = event.endTime || "";
  const locationType = inferredLocationType(event);
  document.querySelector(`input[name="locationType"][value="${locationType}"]`).checked = true;
  document.querySelector("#location").value = event.location || "";
  locationDetailInput.value = event.locationDetail || "";
  selectedLocation = hasMapCoordinates(event)
    ? {
        latitude: Number(event.latitude),
        longitude: Number(event.longitude),
        name: event.location || "장소",
        address: event.locationAddress || event.location || ""
      }
    : null;
  locationSearchStatus.textContent = selectedLocation ? "지도 위치가 저장된 일정이에요." : "";
  clearLocationSearchResults();
  document.querySelector("#url").value = event.url || "";
  document.querySelector("#category").value = event.category || "ETC";
  document.querySelector("#notes").value = event.notes || "";
  const reservationStatus = inferredReservationStatus(event);
  document.querySelector(`input[name="reservationStatus"][value="${reservationStatus}"]`).checked = true;
  const cancellationDeadline = splitSubmissionDeadline(event.cancellationDeadline || "");
  document.querySelector("#cancellationDeadlineDate").value = cancellationDeadline.date;
  document.querySelector("#cancellationDeadlineTime").value = cancellationDeadline.time;
  document.querySelector("#cancellationNotes").value = event.cancellationNotes || "";
  renderTodoInputs(event.todos);

  syncLocationFields();
  syncConditionalFields();
  applyFormMode(mode);
}

function activateEventEditing(target) {
  if (formMode !== "view") return;
  applyFormMode("edit");

  const control = target.matches?.("input, textarea")
    ? target
    : target.closest?.("label")?.querySelector("input, textarea");
  (control || document.querySelector("#title")).focus({ preventScroll: true });
}

function cancelFormEditing() {
  if (selectedEventId && events.some((event) => event.id === selectedEventId)) {
    showEventInForm(selectedEventId, "view");
  } else {
    showIdleForm();
  }
}

function deleteEvent(id) {
  const event = events.find((item) => item.id === id);
  if (!event || !window.confirm(`“${event.title}” 일정을 삭제할까요?`)) return;
  events = events.filter((item) => item.id !== id);
  if (selectedEventId === id) showIdleForm();
  saveEvents();
  renderAll();
}

function updateTodoTask(eventId, todoId, completed) {
  events = events.map((event) => event.id === eventId
    ? {
        ...event,
        todos: event.todos.map((todo) => todo.id === todoId ? { ...todo, completed } : todo)
      }
    : event);
  saveEvents();
  renderAll();
  if (selectedEventId === eventId && formMode === "view") showEventInForm(eventId, "view");
}

function updateReservationTask(id, completed) {
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
  const newName = normalizedCategory(requestedName);
  if (!requestedName.trim()) {
    window.alert("새 카테고리 이름을 입력해주세요.");
    return;
  }
  if (newName === oldName) return;

  const willMerge = events.some((event) => event.category === newName);
  if (willMerge && !window.confirm(`이미 “${newName}” 카테고리가 있어요. 두 카테고리를 합칠까요?`)) return;

  const wasSelected = selectedCategories.has(oldName) || selectedCategories.has(newName);
  events = events.map((event) => event.category === oldName ? { ...event, category: newName } : event);
  categoryOrder = categoryOrder
    .map((category) => category === oldName ? newName : category)
    .filter((category, index, list) => list.indexOf(category) === index);
  selectedCategories.delete(oldName);
  if (wasSelected) selectedCategories.add(newName);
  if (normalizedCategory(document.querySelector("#category").value) === oldName) {
    document.querySelector("#category").value = newName;
  }
  saveEvents();
  saveCategoryOrder();
  renderAll();
}

form.addEventListener("submit", (submitEvent) => {
  submitEvent.preventDefault();
  const id = document.querySelector("#eventId").value;
  const startTime = normalizeTime(document.querySelector("#startTime").value);
  const endTime = normalizeTime(document.querySelector("#endTime").value);
  const reservationStatus = currentReservationStatus();
  const cancellationDeadlineDate = document.querySelector("#cancellationDeadlineDate").value;
  const cancellationDeadlineTime = normalizeTime(document.querySelector("#cancellationDeadlineTime").value);
  const todoResult = collectTodoInputs();
  const locationType = document.querySelector('input[name="locationType"]:checked').value;
  const typedLocation = locationType === "offline" ? locationInput.value.trim() : "";
  const location = locationType === "offline" ? selectedLocation?.name || typedLocation : "";
  const url = locationType === "online" ? normalizeUrl(document.querySelector("#url").value) : "";

  if (startTime === null || endTime === null || cancellationDeadlineTime === null) {
    window.alert("시간은 24시간제로 입력해주세요. 예: 09:00, 16:30");
    return;
  }

  if (todoResult.error) {
    window.alert(todoResult.error);
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

  const event = {
    id: id || crypto.randomUUID(),
    title: document.querySelector("#title").value.trim(),
    date: document.querySelector("#date").value,
    startTime,
    endTime,
    locationType,
    location,
    locationDetail: locationType === "offline" ? locationDetailInput.value.trim() : "",
    locationAddress: locationType === "offline" ? selectedLocation?.address || "" : "",
    latitude: locationType === "offline" ? selectedLocation?.latitude ?? null : null,
    longitude: locationType === "offline" ? selectedLocation?.longitude ?? null : null,
    url,
    category: normalizedCategory(document.querySelector("#category").value),
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
    todos: todoResult.todos,
    createdAt: id
      ? events.find((item) => item.id === id)?.createdAt || new Date().toISOString()
      : new Date().toISOString()
  };

  if (event.startTime && event.endTime && event.endTime < event.startTime) {
    window.alert("종료 시간은 시작 시간보다 늦게 설정해주세요.");
    return;
  }

  if (id) {
    events = events.map((item) => item.id === id ? event : item);
  } else {
    events.push(event);
  }

  saveEvents();
  selectedEventId = event.id;
  selectedMapDate = event.date;
  calendarCursor = new Date(`${event.date}T00:00:00`);
  calendarCursor.setDate(1);
  renderAll();
  showEventInForm(event.id, "view");
});

reservationStatusInputs.forEach((input) => input.addEventListener("change", syncConditionalFields));
addTodoButton.addEventListener("click", () => addTodoInput({}, true));
newEventButton.addEventListener("click", startNewEvent);
cancelEditButton.addEventListener("click", cancelFormEditing);
calendarPrevButton.addEventListener("click", () => shiftCalendarMonth(-1));
calendarNextButton.addEventListener("click", () => shiftCalendarMonth(1));
calendarTodayButton.addEventListener("click", selectTodayInCalendar);
calendarThisWeekButton.addEventListener("click", () => selectWeekInCalendar(0));
calendarNextWeekButton.addEventListener("click", () => selectWeekInCalendar(1));
locationSearchButton.addEventListener("click", searchLocation);
locationInput.addEventListener("input", () => {
  if (selectedLocation && locationInput.value.trim() !== selectedLocation.name) {
    selectedLocation = null;
    locationSearchStatus.textContent = "주소가 바뀌었어요. 다시 검색해 위치를 선택해주세요.";
  } else {
    locationSearchStatus.textContent = locationInput.value.trim().length >= 2
      ? "지도에 표시하려면 검색해주세요. 검색하지 않아도 저장할 수 있어요."
      : "";
  }
  clearLocationSearchResults();
  resetLocationSearch();
});
locationInput.addEventListener("keydown", (keyEvent) => {
  if (keyEvent.key === "Enter") {
    keyEvent.preventDefault();
    searchLocation();
  }
  if (keyEvent.key === "Escape") {
    resetLocationSearch();
    clearLocationSearchResults();
  }
});
homeMapToggle.addEventListener("change", () => {
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
categoryInput.addEventListener("input", () => renderCategoryMenu());
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
  if (!pointerEvent.target.closest(".location-search-field")) clearLocationSearchResults();
  if (!pointerEvent.target.closest(".home-location-editor") && !pointerEvent.target.closest("#homeLocationButton")) {
    closeHomeLocationEditor();
  }
});
document.querySelectorAll('input[name="locationType"]').forEach((input) => {
  input.addEventListener("change", syncLocationFields);
});

form.addEventListener("click", (clickEvent) => {
  if (formMode !== "view") return;
  activateEventEditing(clickEvent.target);
}, true);

form.addEventListener("keydown", (keyEvent) => {
  if (formMode !== "view" || keyEvent.key === "Tab") return;
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

calendarFilterResetButton.addEventListener("click", resetCalendarDateFilter);

clearButton.addEventListener("click", () => {
  if (!events.length || !window.confirm("저장된 일정을 모두 삭제할까요? 이 작업은 되돌릴 수 없어요.")) return;
  events = [];
  categoryOrder = [];
  selectedCategories.clear();
  saveEvents();
  saveCategoryOrder();
  showIdleForm();
  renderAll();
});

exportButton.addEventListener("click", () => {
  const backup = { version: 5, events, categoryOrder };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `serin-schedule-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
});

importInput.addEventListener("change", async () => {
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
    categoryOrder = Array.isArray(imported.categoryOrder) ? imported.categoryOrder : [];
    selectedCategories = new Set(events.map((event) => event.category));
    saveEvents();
    saveCategoryOrder();
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
