initializeScheduleState();
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
