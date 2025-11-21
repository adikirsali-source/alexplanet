// scripts.js - shared behaviours + page-specific modules

document.addEventListener('DOMContentLoaded', () => {
  highlightNav();
  initContactForm();
  initTodo();
  initProducts();
});

// small util
function qs(sel){ return document.querySelector(sel); }
function qsa(sel){ return Array.from(document.querySelectorAll(sel)); }

// highlight current nav link
function highlightNav(){
  const links = qsa('.nav-link');
  links.forEach(a => {
    if (a.getAttribute('href') === location.pathname.split('/').pop() || (location.pathname.endsWith('/') && a.getAttribute('href')==='index.html')) {
      a.classList.add('active');
    }
  });
}

/* ---------- CONTACT FORM (basic client validation) ---------- */
function initContactForm(){
  const form = qs('#contactForm');
  if (!form) return;
  const msg = qs('#contactMsg');
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const name = qs('#c-name').value.trim();
    const email = qs('#c-email').value.trim();
    const message = qs('#c-message').value.trim();
    if (!name || !email || !message) {
      msg.textContent = 'Please fill all fields.';
      msg.style.color = 'crimson';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      msg.textContent = 'Please enter a valid email.';
      msg.style.color = 'crimson';
      return;
    }
    msg.textContent = 'Thanks — message received (demo).';
    msg.style.color = 'green';
    form.reset();
  });
}

/* ---------- TODO app with localStorage ---------- */
function initTodo(){
  const form = qs('#todoForm');
  const input = qs('#taskInput');
  const list = qs('#taskList');
  const clearAll = qs('#clearAll');
  if (!form || !list) return;

  let tasks = loadTasks();
  renderTasks();

  form.addEventListener('submit', e=>{
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    const t = { id: Date.now(), text, done:false };
    tasks.push(t);
    saveTasks(tasks);
    renderTasks();
    input.value = '';
  });

  clearAll?.addEventListener('click', ()=>{
    if (!confirm('Clear all tasks?')) return;
    tasks = [];
    saveTasks(tasks);
    renderTasks();
  });

  function renderTasks(){
    list.innerHTML = '';
    if (tasks.length === 0) list.innerHTML = '<li style="color:#666;padding:8px;">No tasks yet</li>';
    tasks.slice().reverse().forEach(task => {
      const li = document.createElement('li');
      li.innerHTML = `<div style="display:flex;gap:10px;align-items:center">
        <input type="checkbox" ${task.done ? 'checked' : ''} data-id="${task.id}" class="task-toggle" />
        <span style="${task.done ? 'text-decoration:line-through;color:#999':''}">${escapeHtml(task.text)}</span>
      </div>
      <div>
        <button class="btn btn-outline btn-small" data-del="${task.id}">Delete</button>
      </div>`;
      list.appendChild(li);
    });
    // attach events
    qsa('.task-toggle').forEach(cb => cb.addEventListener('change', e=>{
      const id = Number(e.target.dataset.id);
      tasks = tasks.map(t => t.id===id ? {...t, done: e.target.checked} : t);
      saveTasks(tasks);
      renderTasks();
    }));
    qsa('[data-del]').forEach(b => b.addEventListener('click', e=>{
      const id = Number(e.target.dataset.del);
      tasks = tasks.filter(t => t.id !== id);
      saveTasks(tasks);
      renderTasks();
    }));
  }

  function saveTasks(t){ localStorage.setItem('apx_tasks_v1', JSON.stringify(t)); }
  function loadTasks(){ try { return JSON.parse(localStorage.getItem('apx_tasks_v1')) || []; } catch { return []; } }
}

/* ---------- PRODUCTS: filter & sort ---------- */
function initProducts(){
  const grid = qs('#productGrid');
  const cat = qs('#categoryFilter');
  const sort = qs('#sortSelect');
  if (!grid) return;

  // sample product data
  let products = [
    { id:1, title:'Wireless Mouse', category:'Accessories', price:599, rating:4.2 },
    { id:2, title:'Mechanical Keyboard', category:'Accessories', price:2499, rating:4.6 },
    { id:3, title:'USB-C Hub', category:'Accessories', price:1299, rating:4.0 },
    { id:4, title:'Laptop Stand', category:'Office', price:899, rating:4.1 },
    { id:5, title:'Noise-Cancelling Headphones', category:'Audio', price:4999, rating:4.7 },
    { id:6, title:'Webcam 1080p', category:'Video', price:1999, rating:4.3 }
  ];

  // populate category filter
  const categories = ['all', ...Array.from(new Set(products.map(p=>p.category)))];
  categories.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    cat.appendChild(opt);
  });

  // render
  function render(){
    const selectedCat = cat.value || 'all';
    const sortVal = sort.value || 'default';
    let list = products.slice();

    if (selectedCat !== 'all') list = list.filter(p => p.category === selectedCat);

    if (sortVal === 'price-asc') list.sort((a,b)=>a.price-b.price);
    else if (sortVal === 'price-desc') list.sort((a,b)=>b.price-a.price);
    else if (sortVal === 'rating-desc') list.sort((a,b)=>b.rating-b.rating ? b.rating - a.rating : b.price - a.price);

    grid.innerHTML = '';
    if (list.length === 0) grid.innerHTML = '<div>No products found</div>';
    list.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `<h3>${escapeHtml(p.title)}</h3>
        <p class="price">₹${p.price}</p>
        <p>Category: ${escapeHtml(p.category)} • Rating: ${p.rating}</p>
        <p><button class="btn" data-buy="${p.id}">Buy</button></p>`;
      grid.appendChild(card);
    });
    // optional: buy button handler
    qsa('[data-buy]').forEach(b => b.addEventListener('click', ()=> alert('Demo buy — product id '+b.dataset.buy)));
  }

  cat?.addEventListener('change', render);
  sort?.addEventListener('change', render);
  render();
}

// escape html util
function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, (m)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
