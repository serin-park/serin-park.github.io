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

