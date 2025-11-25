import './style.css';

const app = document.getElementById('app');
app.innerHTML = `
  <header class="header">
    <div class="brand">Short<span>flix</span></div>
    <input id="search" class="search" placeholder="Search titles or tags..." />
  </header>
  <main class="container">
    <div id="tags" class="tags"></div>
    <section id="grid" class="grid"></section>

    <dialog id="player" class="dialog">
      <div class="dialog-content">
        <button id="close" class="close" aria-label="Close">×</button>
        <video id="playerVideo" controls playsinline preload="metadata"></video>
        <div class="meta">
          <h2 id="playerTitle"></h2>
          <div id="playerTags" class="taglist"></div>
        </div>
      </div>
    </dialog>
  </main>
`;

const API_BASE = import.meta.env.VITE_API_BASE || '';
const grid = document.getElementById('grid');
const search = document.getElementById('search');
const tags = document.getElementById('tags');
const dialog = document.getElementById('player');
const closeBtn = document.getElementById('close');
const playerVideo = document.getElementById('playerVideo');
const playerTitle = document.getElementById('playerTitle');
const playerTags = document.getElementById('playerTags');
let activeTag = '';

async function fetchShorts(q = '') {
  const url = new URL(API_BASE + '/api/shorts', window.location.origin);
  if (q) url.searchParams.set('q', q);
  if (activeTag) url.searchParams.set('tag', activeTag);
  const res = await fetch(url, { credentials: 'omit' });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

function pill(text, cls = 'tagpill') { const s = document.createElement('span'); s.className = cls; s.textContent = text; return s; }

function renderTags(list) {
  const counts = new Map();
  list.forEach(s => (s.tags || []).forEach(t => counts.set(t, (counts.get(t) || 0) + 1)));
  const unique = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([t]) => t);
  tags.innerHTML = '';
  const all = document.createElement('button'); all.textContent = 'All'; all.className = 'tag' + (!activeTag ? ' active' : ''); all.onclick = () => { activeTag = ''; refresh() }; tags.appendChild(all);
  unique.forEach(t => { const b = document.createElement('button'); b.textContent = t; b.className = 'tag' + (activeTag === t ? ' active' : ''); b.onclick = () => { activeTag = activeTag === t ? '' : t; refresh() }; tags.appendChild(b); });
}

function openPlayer(item) { playerVideo.src = item.videoUrl + '#t=0.001'; playerTitle.textContent = item.title || 'Untitled'; playerTags.innerHTML = ''; (item.tags || []).forEach(t => playerTags.appendChild(pill(t))); dialog.showModal?.(); }
function closePlayer() { playerVideo.pause(); playerVideo.removeAttribute('src'); playerVideo.load(); dialog.close(); }
closeBtn.addEventListener('click', closePlayer);

dialog.addEventListener('click', e => { const rect = dialog.querySelector('.dialog-content').getBoundingClientRect(); if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) closePlayer(); });

function renderGrid(list) { grid.innerHTML = ''; const frag = document.createDocumentFragment(); list.forEach(item => { const card = document.createElement('article'); card.className = 'card'; card.innerHTML = `<div class="thumb"><video muted preload="metadata" src="${item.videoUrl}#t=0.1"></video></div><div class="info"><h3 class="title"></h3><div class="taglist"></div></div>`; card.querySelector('.title').textContent = item.title || 'Untitled'; const tl = card.querySelector('.taglist'); (item.tags || []).forEach(t => tl.appendChild(pill(t))); card.addEventListener('click', () => openPlayer(item)); frag.appendChild(card); }); grid.appendChild(frag); }

async function refresh() { try { const q = search.value.trim(); const data = await fetchShorts(q); renderTags(data); renderGrid(data); } catch (e) { grid.innerHTML = `<div class="error">${e.message}</div>`; } }

search.addEventListener('input', debounce(() => refresh(), 250));
function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); } }

refresh();
