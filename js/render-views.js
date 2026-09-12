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

  const today = dateInputValue(new Date());
  const pastDates = Object.keys(byDate).filter((date) => date < today);
  if (pastDates.length) {
    const pastEntryCount = pastDates.reduce((count, date) => count + byDate[date].length, 0);
    const pastToggle = element("button", "past-timeline-toggle");
    pastToggle.type = "button";
    pastToggle.setAttribute("aria-expanded", String(!pastTimelineDatesCollapsed));
    pastToggle.append(
      element("span", "", pastTimelineDatesCollapsed
        ? `오늘 이전 일정 ${pastEntryCount}개 펼치기`
        : "오늘 이전 일정 모두 접기"),
      element("span", "past-timeline-toggle-icon")
    );
    pastToggle.addEventListener("click", () => {
      pastTimelineDatesCollapsed = !pastTimelineDatesCollapsed;
      renderTimeline();
    });
    timelineView.append(pastToggle);
  }

  Object.entries(byDate).forEach(([date, dateEntries]) => {
    if (pastTimelineDatesCollapsed && date < today) return;
    const collapsed = collapsedTimelineDates.has(date);
    const group = element("section", `date-group${collapsed ? " is-collapsed" : ""}`);
    const label = element("button", `date-label${date === today ? " is-today" : ""}`);
    label.type = "button";
    label.setAttribute("aria-expanded", String(!collapsed));
    const dateObject = new Date(`${date}T00:00:00`);
    label.append(
      element("strong", "", compactDate(date, { includeWeekday: false })),
      element("span", "date-weekday", `(${["일", "월", "화", "수", "목", "금", "토"][dateObject.getDay()]})`),
      element("span", "date-event-count", `${dateEntries.length}개`),
      element("span", "date-group-toggle", collapsed ? "일정 펼치기" : "일정 접기")
    );
    label.addEventListener("click", () => {
      if (collapsedTimelineDates.has(date)) collapsedTimelineDates.delete(date);
      else collapsedTimelineDates.add(date);
      renderTimeline();
    });

    const list = element("div", "date-events");
    list.hidden = collapsed;
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
      const collapsed = collapsedCategoryCards.has(category);
      const card = element("article", `category-card${collapsed ? " is-collapsed" : ""}`);
      const heading = element("button", "category-heading");
      heading.type = "button";
      heading.setAttribute("aria-expanded", String(!collapsed));
      const headingMeta = element("span", "category-heading-meta");
      headingMeta.append(
        element("span", "category-heading-count", `${categoryEvents.length}개`),
        element("span", "category-card-toggle", collapsed ? "일정 펼치기" : "일정 접기")
      );
      heading.append(
        element("strong", "category-heading-title", category),
        headingMeta
      );
      heading.addEventListener("click", () => {
        if (collapsedCategoryCards.has(category)) collapsedCategoryCards.delete(category);
        else collapsedCategoryCards.add(category);
        renderCategories();
      });

      const list = element("div", "category-events");
      list.hidden = collapsed;
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
        groupInput.size = Math.max(2, group.name.length);
        groupInput.setAttribute("aria-label", `${group.name} 그룹 이름`);
        const groupSave = element("button", "", "변경");
        groupSave.type = "button";
        groupSave.hidden = true;
        const syncGroupDirty = () => {
          groupInput.size = Math.max(2, groupInput.value.length);
          groupSave.hidden = groupInput.value.trim() === group.name || !groupInput.value.trim();
        };
        groupInput.addEventListener("input", syncGroupDirty);
        groupInput.addEventListener("keydown", (keyEvent) => {
          if (keyEvent.key === "Enter") {
            keyEvent.preventDefault();
            renameEventGroup(group.id, groupInput.value);
          }
        });
        groupSave.addEventListener("click", () => renameEventGroup(group.id, groupInput.value));
        const groupRemove = element("button", "group-manager-delete", "삭제");
        groupRemove.type = "button";
        groupRemove.setAttribute("aria-label", `${group.name} 그룹 삭제`);
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

function latestEventWithTitlePrefix(prefix) {
  const typed = String(prefix || "").trim();
  if (typed.length < 2) return null;
  const target = typed.toLocaleLowerCase("ko-KR");
  const matches = events.filter((event) => (
    !isTravelEvent(event) && String(event.title || "").trim().toLocaleLowerCase("ko-KR").startsWith(target)
  ));
  if (!matches.length) return null;
  return matches.sort((a, b) => (b.date || "").localeCompare(a.date || ""))[0];
}

function updateTitleAutocomplete() {
  const typed = titleInput.value;
  const match = formMode === "create" ? latestEventWithTitlePrefix(typed) : null;
  titleSuggestionMatch = match;
  if (!match) {
    titleGhostInput.value = "";
    titleField.classList.remove("has-suggestion");
    titleAutofillHint.hidden = true;
    return;
  }
  titleGhostInput.value = typed + match.title.slice(typed.length);
  titleField.classList.add("has-suggestion");
  titleAutofillHint.hidden = false;
}

function acceptTitleSuggestion() {
  if (!titleSuggestionMatch) return;
  const match = titleSuggestionMatch;
  titleInput.value = match.title;
  const caret = titleInput.value.length;
  titleInput.setSelectionRange(caret, caret);
  applyEventTitleAutofill(match);
  titleGhostInput.value = "";
  titleField.classList.remove("has-suggestion");
  titleAutofillHint.hidden = true;
  titleSuggestionMatch = null;
}

function clearTitleAutocomplete() {
  titleSuggestionMatch = null;
  titleGhostInput.value = "";
  titleField.classList.remove("has-suggestion");
  titleAutofillHint.hidden = true;
}

function applyEventTitleAutofill(sourceEvent) {
  if (!sourceEvent) return;
  document.querySelector('input[name="eventKind"][value="regular"]').checked = true;
  renderClassificationInputs(sourceEvent.classifications);
  document.querySelector("#category").value = sourceEvent.category || "ETC";
  eventGroupInput.value = groupForId(sourceEvent.groupId)?.name || "";
  document.querySelector("#startTime").value = sourceEvent.startTime || "";
  document.querySelector("#endTime").value = sourceEvent.endTime || "";
  const locationType = inferredLocationType(sourceEvent);
  document.querySelector(`input[name="locationType"][value="${locationType}"]`).checked = true;
  document.querySelector("#location").value = sourceEvent.location || "";
  locationDetailInput.value = sourceEvent.locationDetail || "";
  selectedLocation = hasMapCoordinates(sourceEvent)
    ? {
        latitude: Number(sourceEvent.latitude),
        longitude: Number(sourceEvent.longitude),
        name: sourceEvent.location || "장소",
        address: sourceEvent.locationAddress || sourceEvent.location || ""
      }
    : null;
  locationSearchStatus.textContent = selectedLocation ? "이전 일정의 장소를 불러왔어요." : "";
  document.querySelector("#url").value = sourceEvent.url || "";
  const reservationStatus = inferredReservationStatus(sourceEvent);
  document.querySelector(`input[name="reservationStatus"][value="${reservationStatus}"]`).checked = true;
  syncLocationFields();
  syncConditionalFields();
  renderEventGroupOptions();
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
