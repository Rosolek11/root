class Todo {
  constructor() {
    this.storageKey = "ptw-lab-b-tasks";
    this.tasks = [];
    this.term = "";
    this.editingId = null;

    this.listEl = document.querySelector("#tasks");
    this.searchEl = document.querySelector("#search");
    this.formEl = document.querySelector("#add-task-form");
    this.textEl = document.querySelector("#task-text");
    this.dueEl = document.querySelector("#task-due");
    this.errorEl = document.querySelector("#form-error");

    this.load();
    this.bindEvents();
    this.draw();
  }

  bindEvents() {
    this.formEl.addEventListener("submit", (event) => {
      event.preventDefault();
      this.add(this.textEl.value, this.dueEl.value);
    });

    this.searchEl.addEventListener("input", () => {
      this.term = this.searchEl.value.trim().toLowerCase();
      this.draw();
    });

    document.addEventListener("click", (event) => {
      if (this.editingId === null) {
        return;
      }

      const editingItem = this.listEl.querySelector(`.task-item[data-id="${this.editingId}"]`);
      if (!editingItem) {
        return;
      }

      if (!editingItem.contains(event.target)) {
        this.saveEditFromDom();
      }
    });
  }

  validateTask(text, dueIso, currentId = null) {
    const trimmed = text.trim();
    if (trimmed.length < 3 || trimmed.length > 255) {
      return "Treść zadania musi mieć od 3 do 255 znaków.";
    }

    if (!dueIso) {
      return "";
    }

    const parsed = new Date(dueIso);
    if (Number.isNaN(parsed.getTime())) {
      return "Podaj poprawną datę.";
    }

    const now = new Date();
    const currentTask = this.tasks.find((task) => task.id === currentId);
    const sameDue = currentTask && currentTask.due === dueIso;

    if (parsed <= now && !sameDue) {
      return "Data musi być pusta albo w przyszłości.";
    }

    return "";
  }

  add(text, dueIso) {
    const error = this.validateTask(text, dueIso);
    if (error) {
      this.showError(error);
      return;
    }

    this.tasks.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      text: text.trim(),
      due: dueIso || ""
    });

    this.textEl.value = "";
    this.dueEl.value = "";
    this.showError("");
    this.save();
    this.draw();
  }

  remove(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.save();
    this.draw();
  }

  startEdit(id) {
    this.editingId = id;
    this.draw();

    const row = this.listEl.querySelector(`.task-item[data-id="${id}"]`);
    if (!row) {
      return;
    }

    const textInput = row.querySelector(".task-edit-text");
    const dateInput = row.querySelector(".task-edit-date");

    if (!textInput || !dateInput) {
      return;
    }

    textInput.focus();

    textInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.saveEditFromDom();
      }
      if (event.key === "Escape") {
        this.cancelEdit();
      }
    });

    dateInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.saveEditFromDom();
      }
      if (event.key === "Escape") {
        this.cancelEdit();
      }
    });
  }

  cancelEdit() {
    this.editingId = null;
    this.showError("");
    this.draw();
  }

  saveEditFromDom() {
    if (this.editingId === null) {
      return;
    }

    const row = this.listEl.querySelector(`.task-item[data-id="${this.editingId}"]`);
    if (!row) {
      return;
    }

    const textInput = row.querySelector(".task-edit-text");
    const dateInput = row.querySelector(".task-edit-date");
    if (!textInput || !dateInput) {
      return;
    }

    const error = this.validateTask(textInput.value, dateInput.value, this.editingId);
    if (error) {
      this.showError(error);
      textInput.focus();
      return;
    }

    const task = this.tasks.find((item) => item.id === this.editingId);
    if (task) {
      task.text = textInput.value.trim();
      task.due = dateInput.value || "";
    }

    this.editingId = null;
    this.showError("");
    this.save();
    this.draw();
  }

  get filteredTasks() {
    if (this.term.length < 2) {
      return this.tasks;
    }

    return this.tasks.filter((task) => task.text.toLowerCase().includes(this.term));
  }

  highlight(text) {
    const safe = this.escapeHtml(text);

    if (this.term.length < 2) {
      return safe;
    }

    const escapedTerm = this.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedTerm})`, "ig");
    return safe.replace(regex, "<mark>$1</mark>");
  }

  formatDue(isoValue) {
    if (!isoValue) {
      return "Brak terminu";
    }

    const date = new Date(isoValue);
    if (Number.isNaN(date.getTime())) {
      return "Brak terminu";
    }

    return date.toLocaleString("pl-PL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  draw() {
    this.listEl.innerHTML = "";

    const tasks = this.filteredTasks;

    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = "task-item";
      li.dataset.id = String(task.id);

      if (this.editingId === task.id) {
        li.classList.add("editing");
        li.innerHTML = `
          <div class="task-edit-wrap">
            <input class="task-edit-text" type="text" maxlength="255" value="${this.escapeHtml(task.text)}">
            <input class="task-edit-date" type="datetime-local" value="${task.due}">
          </div>
          <button class="delete-btn" type="button" data-action="delete">Usuń</button>
        `;
      } else {
        li.innerHTML = `
          <div class="task-content" data-action="edit">
            <span class="task-text">${this.highlight(task.text)}</span>
            <span class="task-due">Termin: ${this.formatDue(task.due)}</span>
          </div>
          <button class="delete-btn" type="button" data-action="delete">Usuń</button>
        `;
      }

      const deleteBtn = li.querySelector('[data-action="delete"]');
      deleteBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        this.remove(task.id);
      });

      const editArea = li.querySelector('[data-action="edit"]');
      if (editArea) {
        editArea.addEventListener("click", (event) => {
          event.stopPropagation();
          this.startEdit(task.id);
        });
      }

      this.listEl.appendChild(li);
    });
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
  }

  load() {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        this.tasks = parsed.filter((item) => item && typeof item.text === "string").map((item) => ({
          id: Number(item.id) || Date.now() + Math.floor(Math.random() * 1000),
          text: item.text,
          due: typeof item.due === "string" ? item.due : ""
        }));
      }
    } catch (error) {
      this.tasks = [];
    }
  }

  showError(message) {
    this.errorEl.textContent = message;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.todo = new Todo();
});
