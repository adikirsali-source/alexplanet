// scripts.js - handles forms, modal, and To-Do app

document.addEventListener("DOMContentLoaded", () => {
  // ---------- ADVANCED FORM ----------
  const advForm = document.getElementById("advancedForm");
  if (advForm) {
    advForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("a-name").value.trim();
      const email = document.getElementById("a-email").value.trim();
      const subject = document.getElementById("a-subject").value.trim();
      const consent = document.getElementById("consent").checked;
      const msgEl = document.getElementById("advancedFormMsg");

      if (!name || !email || !subject || !consent) {
        msgEl.textContent = "Please fill required fields and accept consent.";
        msgEl.style.color = "crimson";
        return;
      }
      if (!validateEmail(email)) {
        msgEl.textContent = "Enter a valid email address.";
        msgEl.style.color = "crimson";
        return;
      }

      msgEl.textContent = "Form submitted successfully. Thank you!";
      msgEl.style.color = "green";
      advForm.reset();
    });
  }

  // ---------- TODO APP ----------
  const todoForm = document.getElementById("todoForm");
  const todoInput = document.getElementById("todoInput");
  const todoList = document.getElementById("todoList");
  const clearCompleted = document.getElementById("clearCompleted");
  const clearAll = document.getElementById("clearAll");

  if (todoForm && todoList) {
    let todos = loadTodos();
    renderTodos();

    todoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = todoInput.value.trim();
      if (!text) return;
      const task = { id: Date.now(), text, done: false };
      todos.push(task);
      saveTodos(todos);
      renderTodos();
      todoInput.value = "";
    });

    clearCompleted?.addEventListener("click", () => {
      todos = todos.filter(t => !t.done);
      saveTodos(todos);
      renderTodos();
    });

    clearAll?.addEventListener("click", () => {
      if (!confirm("Clear all tasks?")) return;
      todos = [];
      saveTodos(todos);
      renderTodos();
    });

    // helper functions
    function renderTodos(){
      todoList.innerHTML = "";
      if (todos.length === 0) {
        todoList.innerHTML = "<li style='color:#666;padding:8px;'>No tasks yet</li>";
        return;
      }
      todos.slice().reverse().forEach(task => {
        const li = document.createElement("li");
        const left = document.createElement("div");
        left.className = "todo-left";

        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = task.done;
        cb.addEventListener("change", () => {
          task.done = cb.checked;
          saveTodos(todos);
          renderTodos();
        });

        const span = document.createElement("span");
        span.className = "todo-text" + (task.done ? " completed" : "");
        span.textContent = task.text;

        left.appendChild(cb);
        left.appendChild(span);

        const actions = document.createElement("div");
        const del = document.createElement("button");
        del.textContent = "Delete";
        del.className = "btn btn-secondary";
        del.addEventListener("click", () => {
          todos = todos.filter(t => t.id !== task.id);
          saveTodos(todos);
          renderTodos();
        });
        actions.appendChild(del);

        li.appendChild(left);
        li.appendChild(actions);
        todoList.appendChild(li);
      });
    }

    function saveTodos(todos) {
      localStorage.setItem("apx_todos_v1", JSON.stringify(todos));
    }
    function loadTodos() {
      try {
        return JSON.parse(localStorage.getItem("apx_todos_v1")) || [];
      } catch {
        return [];
      }
    }
  }

}); // DOMContentLoaded end

// ---------- UTIL ----------
function validateEmail(email) {
  // simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
