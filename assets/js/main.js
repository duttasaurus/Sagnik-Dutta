// main.js — handles blog loading, search, calendar interactions

async function loadPosts(){
  const res = await fetch('assets/posts/posts.json');
  const data = await res.json();
  return data.posts;
}

function formatDate(iso){
  const d = new Date(iso);
  return d.toLocaleString();
}

// --- Read page logic ---
async function initReadPage(){
  if(!document.querySelector('#read-root')) return;
  const posts = await loadPosts();
  // default to current month
  const now = new Date();
  renderCalendar(now.getFullYear(), now.getMonth(), posts);
  renderPostsForMonth(now.getFullYear(), now.getMonth(), posts);
  renderRecent(posts);

  document.querySelector('#search-input').addEventListener('input', e=>{
    const q = e.target.value.trim().toLowerCase();
    const filtered = posts.filter(p=> p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q) || (p.tags||[]).join(' ').toLowerCase().includes(q));
    renderPostList(filtered);
  })
}

function renderPostList(list){
  const container = document.querySelector('#posts-list');
  container.innerHTML='';
  if(!list.length) { container.innerHTML='<p>No posts found.</p>'; return }
  list.forEach(p=>{
    const div = document.createElement('div'); div.className='post';
    div.innerHTML = `<h3>${p.title}</h3><small>${new Date(p.date).toDateString()}</small><p>${p.excerpt||p.content.slice(0,220)}</p><div>${(p.tags||[]).map(t=>`<span class=\"tag\">${t}</span>`).join('')}</div>`;
    container.appendChild(div);
  })
}

function renderPostsForMonth(year,month,posts){
  const filtered = posts.filter(p=>{ const d=new Date(p.date); return d.getFullYear()===year && d.getMonth()===month});
  renderPostList(filtered);
}

function renderRecent(posts){
  const recent = posts.slice().sort((a,b)=> new Date(b.date)-new Date(a.date)).slice(0,3);
  const c = document.querySelector('#recent-list'); c.innerHTML = recent.map(r=>`<div><a href=\"#\">${r.title}</a><div style=\"font-size:12px;color:#666\">${new Date(r.date).toDateString()}</div></div>`).join('');
}

function renderCalendar(year,month,posts){
  const cal = document.querySelector('#calendar');
  cal.innerHTML='';
  const first = new Date(year,month,1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year,month+1,0).getDate();

  const monthTitle = document.createElement('div');
  monthTitle.className='row';
  monthTitle.innerHTML = `<button id=\"prev-month\">&lt;&lt; Prev</button><strong style=\"margin-left:12px\">${first.toLocaleString(undefined,{month:'long',year:'numeric'})}</strong><button id=\"next-month\" style=\"margin-left:auto\">Next &gt;&gt;</button>`;
  cal.appendChild(monthTitle);

  const grid = document.createElement('div'); grid.style.marginTop='12px';
  const names = ['S','M','T','W','T','F','S'];
  grid.innerHTML = names.map(n=>`<span style=\"display:inline-block;width:32px;text-align:center;font-weight:600\">${n}</span>`).join('');

  // pad start
  for(let i=0;i<startDay;i++) grid.innerHTML += '<span style="display:inline-block;width:32px;height:28px"></span>';
  for(let d=1;d<=daysInMonth;d++){
    const fullDate = new Date(year,month,d);
    const iso = fullDate.toISOString();
    const isToday = (new Date()).toDateString() === fullDate.toDateString();
    grid.innerHTML += `<button class=\"cal-day\" data-date=\"${iso}\" style=\"display:inline-block;width:32px;height:28px;margin:2px;border:none;background:transparent;\">${isToday?'<span class="today">'+d+'</span>':d}</button>`;
  }
  cal.appendChild(grid);

  cal.querySelector('#prev-month').addEventListener('click',()=>{ const dt=new Date(year,month-1,1); renderCalendar(dt.getFullYear(),dt.getMonth(),posts); renderPostsForMonth(dt.getFullYear(),dt.getMonth(),posts); });
  cal.querySelector('#next-month').addEventListener('click',()=>{ const dt=new Date(year,month+1,1); renderCalendar(dt.getFullYear(),dt.getMonth(),posts); renderPostsForMonth(dt.getFullYear(),dt.getMonth(),posts); });

  cal.querySelectorAll('.cal-day').forEach(b=> b.addEventListener('click',e=>{
    const d = new Date(e.currentTarget.dataset.date);
    renderPostsForMonth(d.getFullYear(), d.getMonth(), posts);
  }))
}

// init on DOM ready
window.addEventListener('DOMContentLoaded',()=>{
  initReadPage();
});
