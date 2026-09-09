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

