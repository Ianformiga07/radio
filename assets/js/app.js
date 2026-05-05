/**
 * RÁDIO CIDADE FM 87,9 — app.js (v5)
 * Rotas limpas na nav | Font Awesome icons | Layout claro
 * Top10, Mural, Tempo, Horóscopo aparecem APENAS na Home (widgets)
 * e em páginas acessíveis via link, mas NÃO listadas na navbar
 */

/* ── Config ─────────────────────────────────────────────── */
const CONFIG = {
  streamUrl: 'https://stream.zeno.fm/cidade879',
  streamFallbacks: [
    'https://stream.zeno.fm/cidade879',
    'https://cast.radiosbrasil.com.br/8040/stream',
  ],
  whatsapp: '5563999999999',
  instagram: 'https://instagram.com/cidadefm879',
  facebook:  'https://facebook.com/cidadefm879',
  youtube:   'https://youtube.com/@cidadefm879',
  radioNome: 'Cidade FM 87,9',
  radioFreq: '87,9 MHz',
  radioCidade: 'Ananás – TO'
};

/* ── Player ──────────────────────────────────────────────── */
const Player = (() => {
  let audio = null, playing = false, fallbackIdx = 0;

  function init() {
    audio = new Audio();
    audio.preload = 'none';
    renderPlayerUI();
    bindEvents();
  }

  function renderPlayerUI() {
    const el = document.getElementById('player');
    if (!el) return;
    el.innerHTML = `
      <div class="container">
        <div class="player-inner">
          <div class="player-logo">
            <i class="fa-solid fa-radio fa-lg" style="color:var(--amarelo)"></i>
          </div>
          <div class="player-meta">
            <div class="player-ao-vivo"><span class="dot"></span> Ao Vivo</div>
            <div class="player-radio-name">${CONFIG.radioNome} · ${CONFIG.radioCidade}</div>
            <div class="player-track" id="player-track">Clique em play para ouvir</div>
          </div>
          <div class="player-controls">
            <button class="btn-play" id="btn-play" aria-label="Play/Pause">
              <i class="fa-solid fa-play" id="icon-play"></i>
              <i class="fa-solid fa-pause" id="icon-pause" style="display:none"></i>
            </button>
          </div>
          <div class="player-volume">
            <i class="fa-solid fa-volume-high"></i>
            <input type="range" class="volume-slider" id="volume-slider" min="0" max="100" value="80" aria-label="Volume">
          </div>
        </div>
      </div>
    `;
  }

  function bindEvents() {
    document.addEventListener('click', e => { if (e.target.closest('#btn-play')) toggle(); });
    document.addEventListener('input', e => {
      if (e.target.id === 'volume-slider' && audio) audio.volume = e.target.value / 100;
    });
  }

  function tryPlay(url) {
    if (!audio) return;
    audio.src = url; audio.volume = (document.getElementById('volume-slider')?.value || 80) / 100;
    audio.load();
    audio.play()
      .then(() => { setPlaying(true); fallbackIdx = 0; })
      .catch(err => {
        console.warn('Stream falhou:', url, err);
        fallbackIdx++;
        if (fallbackIdx < CONFIG.streamFallbacks.length) {
          showToast('Tentando stream alternativo...');
          setTimeout(() => tryPlay(CONFIG.streamFallbacks[fallbackIdx]), 1500);
        } else {
          fallbackIdx = 0; setPlaying(false);
          showToast('⚠️ Não foi possível conectar ao stream.');
        }
      });
  }

  function toggle() {
    if (!audio) return;
    if (playing) { audio.pause(); audio.src = ''; setPlaying(false); fallbackIdx = 0; }
    else { const t = document.getElementById('player-track'); if (t) t.textContent = 'Conectando...'; tryPlay(CONFIG.streamUrl); }
  }

  function setPlaying(state) {
    playing = state;
    const iPlay = document.getElementById('icon-play');
    const iPause = document.getElementById('icon-pause');
    const btn = document.getElementById('btn-play');
    if (iPlay)  iPlay.style.display  = state ? 'none'  : '';
    if (iPause) iPause.style.display = state ? ''      : 'none';
    if (btn) btn.style.boxShadow = state ? '0 0 24px rgba(255,214,0,0.6)' : '';
    const t = document.getElementById('player-track');
    if (t) t.textContent = state ? 'Transmissão ao vivo — Cidade FM 87,9' : 'Clique em play para ouvir';
    // Atualiza ícone na nav
    const navIcon = document.getElementById('nav-play-icon');
    if (navIcon) { navIcon.className = state ? 'fa-solid fa-pause' : 'fa-solid fa-play'; }
  }

  return { init, toggle };
})();

/* ── Router SPA ─────────────────────────────────────────── */
const Router = (() => {
  // Todas as rotas funcionam — mas top10/mural/tempo/horoscopo/ouvinte-mes
  // não aparecem na navbar. São acessíveis pelos widgets da Home.
  const routes = {
    '':           renderHome,
    'home':       renderHome,
    'programacao':renderProgramacao,
    'locutores':  renderLocutores,
    'noticias':   renderNoticias,
    'contato':    renderContato,
    'sobre':      renderSobre,
    'top10':      renderTop10,
    'mural':      renderMural,
    'tempo':      renderTempo,
    'horoscopo':  renderHoroscopo,
    'ouvinte-mes':renderOuvinteMes,
  };

  function getRoute() { return location.hash.replace('#','').split('/')[0] || ''; }
  function getParam()  { return location.hash.replace('#','').split('/')[1] || null; }
  function navigate(h) { location.hash = h; }

  function resolve() {
    const route = getRoute(), param = getParam();
    const fn = routes[route] || renderHome;
    const content = document.getElementById('content');
    if (content) content.innerHTML = '<div style="padding:100px 0;text-align:center;color:#aaa"><i class="fa-solid fa-spinner fa-spin"></i> Carregando...</div>';
    setTimeout(() => fn(param), 55);
    updateActiveNav(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateActiveNav(route) {
    document.querySelectorAll('[data-route]').forEach(el => {
      el.classList.toggle('active', el.dataset.route === route || (route === '' && el.dataset.route === 'home'));
    });
  }

  function init() { window.addEventListener('hashchange', resolve); resolve(); }
  return { init, navigate };
})();

/* ── Utilitários ─────────────────────────────────────────── */
function formatData(dateStr) {
  if (!dateStr) return '';
  const [y,m,d] = dateStr.split('-');
  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  return `${d} ${meses[parseInt(m)-1]} ${y}`;
}

function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function getInitials(nome) { return nome.split(' ').slice(0,2).map(p => p[0]).join(''); }

function svgThumb(seed, w=400, h=200) {
  const cores = ['#CC0000','#990000','#1E2340','#252B50'];
  const cor = cores[seed % cores.length];
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${cor}"/><text x="50%" y="50%" font-family="sans-serif" font-size="14" fill="rgba(255,255,255,0.25)" text-anchor="middle" dominant-baseline="middle">Cidade FM 87,9</text></svg>`)}`;
}

function svgAvatar(initials, seed=0) {
  const cores = ['#CC0000','#1E2340','#252B50','#A00000'];
  const cor = cores[seed % cores.length];
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="90" height="90"><rect width="90" height="90" rx="45" fill="${cor}"/><text x="50%" y="50%" font-family="sans-serif" font-size="28" font-weight="bold" fill="#FFD600" text-anchor="middle" dominant-baseline="central">${initials}</text></svg>`)}`;
}

/* ════════════════════════════════════════════════════════
   HOME
   ════════════════════════════════════════════════════════ */
function renderHome() {
  const programaAtual = getProgramaAtual();
  const noticasDestaque = NOTICIAS.slice(0,3);
  const locutoresDestaque = LOCUTORES.filter(l => l.destaque);

  document.getElementById('content').innerHTML = `

    <!-- HERO -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-grid-lines"></div>
      <div class="container">
        <div class="hero-inner">
          <div class="hero-text fade-in">
            <div class="hero-tag">No ar desde 2005 · Ananás – TO · ACA</div>
            <h1 class="hero-title">
              Rádio<br>Cidade<br><span class="freq">FM 87,9</span>
            </h1>
            <p class="hero-desc">A rádio que pulsa com a cidade. Música, informação e entretenimento 24 horas para todo o Tocantins.</p>
            <div class="hero-actions">
              <button class="btn-primary" onclick="Player.toggle()">
                <i class="fa-solid fa-play"></i> Ouvir Ao Vivo
              </button>
              <a href="#programacao" class="btn-ghost" data-route="programacao">
                <i class="fa-solid fa-calendar-days"></i> Ver Programação
              </a>
            </div>
            <div class="hero-social">
              <span class="hero-social-label">Siga-nos</span>
              <a href="https://wa.me/${CONFIG.whatsapp}" target="_blank" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
              <a href="${CONFIG.instagram}" target="_blank" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
              <a href="${CONFIG.facebook}" target="_blank" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
              <a href="${CONFIG.youtube}" target="_blank" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
            </div>
          </div>
          <div class="hero-visual">
            <div class="hero-disc">
              <div class="hero-waves"><div class="wave"></div><div class="wave"></div><div class="wave"></div></div>
              <div class="hero-disc-outer"></div>
              <div class="hero-disc-mid">
                <div class="hero-disc-center">
                  <svg width="52" height="52" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="22" fill="#8B1A2B" stroke="#FFD600" stroke-width="2"/>
                    <text x="24" y="17" font-family="sans-serif" font-weight="900" font-size="8" fill="#FFD600" text-anchor="middle" dominant-baseline="middle">CIDADE</text>
                    <text x="24" y="29" font-family="sans-serif" font-weight="900" font-size="13" fill="#FFD600" text-anchor="middle" dominant-baseline="middle">FM</text>
                    <text x="24" y="41" font-family="sans-serif" font-weight="700" font-size="7" fill="#FFD600" text-anchor="middle" dominant-baseline="middle">87,9</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS STRIP -->
    <div class="stats-strip">
      <div class="container">
        <div class="stats-row">
          <div class="stat-item"><div class="stat-num">20+</div><div class="stat-label">Anos no Ar</div></div>
          <div class="stat-item"><div class="stat-num">87,9</div><div class="stat-label">MHz Frequência</div></div>
          <div class="stat-item"><div class="stat-num">24h</div><div class="stat-label">Transmissão</div></div>
          <div class="stat-item"><div class="stat-num">5</div><div class="stat-label">Locutores</div></div>
        </div>
      </div>
    </div>

    <!-- PROGRAMA ATUAL -->
    ${programaAtual ? `
    <div class="agora-strip">
      <div class="container">
        <div class="agora-strip-inner">
          <div class="agora-strip-info">
            <div class="agora-strip-badge"><i class="fa-solid fa-circle fa-beat" style="font-size:0.5rem"></i> No Ar Agora</div>
            <div class="agora-strip-nome">${programaAtual.nome}</div>
            <div class="agora-strip-loc"><i class="fa-solid fa-microphone" style="margin-right:5px"></i>com ${programaAtual.locutor} · ${programaAtual.hora} – ${programaAtual.fim}</div>
          </div>
          <button class="btn-primary" onclick="Player.toggle()"><i class="fa-solid fa-headphones"></i> Ouvir Agora</button>
        </div>
      </div>
    </div>` : ''}

    <!-- NOTÍCIAS -->
    <section class="section section-white">
      <div class="container">
        <div class="section-header">
          <h2><i class="fa-solid fa-newspaper" style="font-size:0.85em;color:var(--vermelho);margin-right:8px"></i>Últimas <span>Notícias</span></h2>
          <a href="#noticias" class="btn-ver-mais" data-route="noticias"><i class="fa-solid fa-arrow-right"></i> Ver todas</a>
        </div>
        <div class="noticias-grid" id="home-noticias"></div>
      </div>
    </section>

    <!-- PUBLICIDADE: SPOT 1 (entre Notícias e Programação) -->
    ${renderSpotSecao(0)}

    <!-- PROGRAMAÇÃO RESUMIDA -->
    <section class="section section-light">
      <div class="container">
        <div class="section-header">
          <h2><i class="fa-solid fa-calendar-days" style="font-size:0.85em;color:var(--vermelho);margin-right:8px"></i>Prog<span>ramação</span></h2>
          <a href="#programacao" class="btn-ver-mais" data-route="programacao"><i class="fa-solid fa-arrow-right"></i> Grade completa</a>
        </div>
        <div id="home-prog"></div>
      </div>
    </section>

    <!-- LOCUTORES -->
    <section class="section section-white">
      <div class="container">
        <div class="section-header">
          <h2><i class="fa-solid fa-microphone" style="font-size:0.85em;color:var(--vermelho);margin-right:8px"></i>Nos<span>sos</span> Locutores</h2>
          <a href="#locutores" class="btn-ver-mais" data-route="locutores"><i class="fa-solid fa-arrow-right"></i> Ver todos</a>
        </div>
        <div class="locutores-grid" id="home-locutores"></div>
      </div>
    </section>

    <!-- TOP 10 + TEMPO -->
    <section class="section section-light">
      <div class="container">
        <div class="home-widgets-grid">

          <!-- TOP 10 preview -->
          <div class="widget-box">
            <div class="widget-header">
              <div class="widget-icon"><i class="fa-solid fa-music" style="color:var(--vermelho)"></i></div>
              <div>
                <div class="label">Cidade FM 87,9</div>
                <h3>Top 10 Mais Tocadas</h3>
              </div>
              <a href="#top10" class="btn-ver-mais" data-route="top10" style="margin-left:auto;font-size:0.72rem">Ver ranking</a>
            </div>
            <div class="top10-mini">
              ${TOP10.slice(0,5).map(t => `
                <div class="top10-mini-item">
                  <span class="top10-mini-pos ${t.pos===1?'gold':t.pos===2?'silver':t.pos===3?'bronze':''}">${t.pos}</span>
                  <div class="top10-mini-info">
                    <span class="top10-mini-musica">${t.musica}</span>
                    <span class="top10-mini-artista">${t.artista}</span>
                  </div>
                  <span class="top10-mini-sub ${t.subidas.startsWith('+')?'up':t.subidas.startsWith('-')?'down':t.subidas==='NEW'?'new':''}">${t.subidas}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- TEMPO -->
          <div class="widget-box">
            <div class="widget-header">
              <div class="widget-icon"><i class="fa-solid fa-cloud-sun" style="color:var(--vermelho)"></i></div>
              <div>
                <div class="label">Agora em</div>
                <h3>${TEMPO_ANANAS.cidade}</h3>
              </div>
              <a href="#tempo" class="btn-ver-mais" data-route="tempo" style="margin-left:auto;font-size:0.72rem">Detalhar</a>
            </div>
            <div class="tempo-main">
              <div class="tempo-icon-big">${TEMPO_ANANAS.icon}</div>
              <div class="tempo-info-main">
                <div class="tempo-temp">${TEMPO_ANANAS.temp}°C</div>
                <div class="tempo-cond">${TEMPO_ANANAS.condicao}</div>
                <div class="tempo-detalhes">
                  <span><i class="fa-solid fa-droplet"></i> ${TEMPO_ANANAS.umidade}%</span>
                  <span><i class="fa-solid fa-wind"></i> ${TEMPO_ANANAS.vento}</span>
                  <span><i class="fa-solid fa-temperature-half"></i> ${TEMPO_ANANAS.sensacao}°C</span>
                </div>
              </div>
            </div>
            <div class="tempo-previsao">
              ${TEMPO_ANANAS.previsao.map(p => `
                <div class="tempo-prev-item">
                  <span class="tempo-prev-dia">${p.dia}</span>
                  <span class="tempo-prev-icon">${p.icon}</span>
                  <span class="tempo-prev-max">${p.max}°</span>
                  <span class="tempo-prev-min">${p.min}°</span>
                </div>
              `).join('')}
            </div>
            <!-- PUBLICIDADE: Banner Contextual de Clima -->
            ${renderBannerClima(TEMPO_ANANAS.temp)}
          </div>

        </div>
      </div>
    </section>

    <!-- MURAL DE RECADOS -->
    <section class="section section-white">
      <div class="container">
        <div class="section-header">
          <h2><i class="fa-solid fa-comments" style="font-size:0.85em;color:var(--vermelho);margin-right:8px"></i>Mural de <span>Recados</span></h2>
          <a href="#mural" class="btn-ver-mais" data-route="mural"><i class="fa-solid fa-arrow-right"></i> Ver mural completo</a>
        </div>
        <div class="mural-preview" id="home-mural"></div>
        <div style="text-align:center;margin-top:28px">
          <a href="#mural" class="btn-primary" onclick="location.hash='mural'">
            <i class="fa-solid fa-paper-plane"></i> Enviar Recado
          </a>
        </div>
      </div>
    </section>

    <!-- PUBLICIDADE: SPOT 2 (entre Mural e Ouvinte do Mês) -->
    ${renderSpotSecao(2)}

    <!-- OUVINTE DO MÊS -->
    <section class="section section-light">
      <div class="container">
        <div class="ouvinte-mes-home">
          <div class="ouvinte-mes-avatar">${OUVINTE_MES.foto_iniciais}</div>
          <div class="ouvinte-mes-body">
            <div class="label"><i class="fa-solid fa-star"></i> ${OUVINTE_MES.mes}</div>
            <h3 class="ouvinte-mes-nome">${OUVINTE_MES.nome}</h3>
            <p class="ouvinte-mes-cidade"><i class="fa-solid fa-location-dot"></i> ${OUVINTE_MES.cidade} · ${OUVINTE_MES.desde}</p>
            <p class="ouvinte-mes-msg">${OUVINTE_MES.mensagem}</p>
          </div>
          <div class="ouvinte-mes-cta">
            <p style="font-size:0.8rem;color:rgba(255,255,255,0.7);margin-bottom:12px">Quer ser o próximo?</p>
            <a href="#ouvinte-mes" class="btn-ghost" onclick="location.hash='ouvinte-mes'">
              <i class="fa-solid fa-trophy"></i> Participar
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- HORÓSCOPO TEASER -->
    <section class="section section-white">
      <div class="container">
        <div class="section-header">
          <h2><i class="fa-solid fa-star-half-stroke" style="font-size:0.85em;color:var(--vermelho);margin-right:8px"></i>Horós<span>copo</span></h2>
          <a href="#horoscopo" class="btn-ver-mais" data-route="horoscopo"><i class="fa-solid fa-arrow-right"></i> Ver todos os signos</a>
        </div>
        <div class="horo-grid">
          ${HOROSCOPO.slice(0,4).map(h => `
            <div class="horo-card" onclick="location.hash='horoscopo'" style="cursor:pointer">
              <div class="horo-emoji">${h.emoji}</div>
              <div class="horo-signo">${h.signo}</div>
              <div class="horo-datas">${h.datas}</div>
              <div class="horo-nota">${'⭐'.repeat(Math.round(h.nota/2))}</div>
              <p class="horo-previsao">${h.previsao.substring(0,90)}...</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  // Preenche dinâmicos
  const noticasEl = document.getElementById('home-noticias');
  if (noticasEl) noticasEl.innerHTML = noticasDestaque.map((n,i) => cardNoticia(n,i)).join('');

  const progEl = document.getElementById('home-prog');
  if (progEl) {
    const diaIdx = new Date().getDay();
    const ordem = [6,0,1,2,3,4,5];
    const diaData = PROGRAMACAO[ordem[diaIdx]];
    const atual = getProgramaAtual();
    const progs = diaData ? diaData.programas.slice(0,5) : [];
    progEl.innerHTML = `
      <div class="prog-lista">
        ${progs.map((p, idx) => `
          <div class="prog-item ${atual && p.id===atual.id?'agora':''}">
            <div class="prog-horario">${p.hora}<span style="font-size:0.7rem;color:var(--txt-muted);display:block;font-weight:400">até ${p.fim}</span></div>
            <div>
              <div class="prog-nome">${p.nome}</div>
              <div class="prog-locutor"><i class="fa-solid fa-microphone" style="margin-right:4px;color:var(--vermelho)"></i>${p.locutor}</div>
            </div>
            ${atual && p.id===atual.id ? '<span class="badge-agora">Agora</span>' : p.ao_vivo ? '<span class="badge-ao-vivo">Ao Vivo</span>' : '<span></span>'}
            ${renderPatrocinadorPrograma(idx)}
          </div>
        `).join('')}
      </div>
    `;
  }

  const locEl = document.getElementById('home-locutores');
  if (locEl) locEl.innerHTML = locutoresDestaque.map((l,i) => cardLocutor(l,i)).join('');

  const muralEl = document.getElementById('home-mural');
  if (muralEl) {
    muralEl.innerHTML = getMural().slice(0,3).map(m => `
      <div class="mural-card-mini">
        <div class="mural-card-mini-header">
          <strong>${m.nome}</strong>
          <span><i class="fa-solid fa-location-dot"></i> ${m.cidade}</span>
          <span class="mural-hora"><i class="fa-regular fa-clock"></i> ${m.hora}</span>
        </div>
        <p>${m.msg}</p>
      </div>
    `).join('');
  }
}

/* ── PROGRAMAÇÃO ─────────────────────────────────────────── */
function renderProgramacao() {
  const diaAtual = new Date().getDay();
  const ordemDias = [6,0,1,2,3,4,5];
  const diaAtualIdx = ordemDias[diaAtual];

  document.getElementById('content').innerHTML = `
    <div class="page-hero">
      <div class="container">
        <div class="page-hero-label label"><i class="fa-solid fa-calendar-days"></i> Rádio Cidade FM 87,9</div>
        <h1>Prog<span>ramação</span></h1>
        <p>Grade completa de programas da semana</p>
      </div>
    </div>
    <section class="section section-light">
      <div class="container">
        <div class="prog-dias-tabs" id="prog-tabs"></div>
        <div id="prog-content"></div>
      </div>
    </section>
  `;

  const tabs = document.getElementById('prog-tabs');
  const content = document.getElementById('prog-content');
  if (!tabs || !content) return;

  tabs.innerHTML = PROGRAMACAO.map((d,i) => `
    <button class="tab-dia ${i===diaAtualIdx?'active':''}" data-idx="${i}">${d.dia}</button>
  `).join('');

  function renderDia(idx) {
    const diaData = PROGRAMACAO[idx];
    const atual = getProgramaAtual();
    content.innerHTML = `
      <div class="prog-lista">
        ${diaData.programas.map((p, pIdx) => `
          <div class="prog-item ${atual && p.id===atual.id && idx===diaAtualIdx?'agora':''}">
            <div class="prog-horario">${p.hora}<span style="color:var(--txt-muted);font-size:0.7rem;display:block;font-weight:400">até ${p.fim}</span></div>
            <div>
              <div class="prog-nome">${p.nome}</div>
              <div class="prog-locutor"><i class="fa-solid fa-microphone" style="margin-right:4px;color:var(--vermelho)"></i>com ${p.locutor}</div>
            </div>
            ${atual && p.id===atual.id && idx===diaAtualIdx ? '<span class="badge-agora">Agora</span>' : p.ao_vivo ? '<span class="badge-ao-vivo">Ao Vivo</span>' : '<span></span>'}
            ${renderPatrocinadorPrograma(pIdx)}
          </div>
        `).join('')}
      </div>
    `;
  }
  renderDia(diaAtualIdx);
  tabs.addEventListener('click', e => {
    const btn = e.target.closest('.tab-dia');
    if (!btn) return;
    tabs.querySelectorAll('.tab-dia').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderDia(parseInt(btn.dataset.idx));
  });
}

/* ── LOCUTORES ───────────────────────────────────────────── */
function renderLocutores(slug) {
  if (slug) { renderLocutorDetalhe(slug); return; }
  document.getElementById('content').innerHTML = `
    <div class="page-hero">
      <div class="container">
        <div class="page-hero-label label"><i class="fa-solid fa-microphone"></i> Rádio Cidade FM 87,9</div>
        <h1>Nos<span>sos</span> Locutores</h1>
        <p>As vozes que fazem a Cidade FM</p>
      </div>
    </div>
    <section class="section section-light">
      <div class="container">
        <div class="locutores-grid" id="locutores-grid"></div>
      </div>
    </section>
  `;
  const el = document.getElementById('locutores-grid');
  if (el) el.innerHTML = LOCUTORES.map((l,i) => cardLocutor(l,i,true)).join('');
}

function renderLocutorDetalhe(slug) {
  const locutor = LOCUTORES.find(l => l.slug === slug);
  if (!locutor) { renderLocutores(); return; }
  document.getElementById('content').innerHTML = `
    <section class="section section-dark">
      <div class="container">
        <button class="btn-voltar" onclick="location.hash='locutores'"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
        <div style="max-width:700px;margin:0 auto;text-align:center">
          <div class="locutor-foto" style="width:120px;height:120px;margin:0 auto 24px;border:3px solid var(--amarelo)">
            <img src="${svgAvatar(getInitials(locutor.nome), locutor.id)}" alt="${locutor.nome}">
          </div>
          <div class="label" style="margin-bottom:12px"><i class="fa-solid fa-microphone"></i> ${locutor.programa}</div>
          <h1 style="font-size:clamp(2rem,5vw,4rem);color:#fff;margin-bottom:8px">${locutor.nome}</h1>
          <p style="color:rgba(255,255,255,0.5);margin-bottom:8px"><i class="fa-regular fa-clock" style="margin-right:5px"></i>${locutor.horario}</p>
          <p style="color:rgba(255,255,255,0.7);line-height:1.8;margin-top:24px">${locutor.bio}</p>
          <div style="display:flex;gap:12px;justify-content:center;margin-top:32px">
            <a href="${locutor.instagram}" target="_blank" class="btn-ghost"><i class="fa-brands fa-instagram"></i> Instagram</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

/* ── NOTÍCIAS ────────────────────────────────────────────── */
function renderNoticias(slug) {
  if (slug) { renderNoticiaDetalhe(slug); return; }
  document.getElementById('content').innerHTML = `
    <div class="page-hero">
      <div class="container">
        <div class="page-hero-label label"><i class="fa-solid fa-newspaper"></i> Rádio Cidade FM 87,9</div>
        <h1>Últimas <span>Notícias</span></h1>
        <p>Fique por dentro de tudo que acontece</p>
      </div>
    </div>
    <section class="section section-light">
      <div class="container">
        <div class="noticias-grid" id="noticias-grid"></div>
      </div>
    </section>
  `;
  const el = document.getElementById('noticias-grid');
  if (el) el.innerHTML = NOTICIAS.map((n,i) => cardNoticia(n,i)).join('');
}

function renderNoticiaDetalhe(slug) {
  const noticia = getNoticiaPorSlug(slug);
  if (!noticia) { renderNoticias(); return; }
  document.getElementById('content').innerHTML = `
    <section class="section section-dark">
      <div class="container">
        <button class="btn-voltar" onclick="location.hash='noticias'"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
        <div class="noticia-full">
          <div class="noticia-full-header">
            <div class="noticia-full-cat">
              <span style="background:var(--vermelho);color:#fff;padding:4px 12px;border-radius:4px;font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase">${noticia.categoria}</span>
            </div>
            <h1 class="noticia-full-titulo">${noticia.titulo}</h1>
            <div class="noticia-full-meta">
              <span><i class="fa-regular fa-calendar"></i> ${formatData(noticia.data)}</span>
              <span><i class="fa-solid fa-pen-nib"></i> ${noticia.autor}</span>
            </div>
          </div>
          <img class="noticia-full-img" src="${svgThumb(noticia.id, 760, 380)}" alt="${noticia.titulo}">
          <div class="noticia-full-content">${noticia.conteudo}</div>
        </div>
      </div>
    </section>
  `;
}

/* ── CONTATO ─────────────────────────────────────────────── */
function renderContato() {
  document.getElementById('content').innerHTML = `
    <div class="page-hero">
      <div class="container">
        <div class="page-hero-label label"><i class="fa-solid fa-envelope"></i> Fale Conosco</div>
        <h1>Entre em <span>Contato</span></h1>
        <p>Sua mensagem é muito bem-vinda!</p>
      </div>
    </div>
    <section class="section section-light">
      <div class="container">
        <div class="contato-grid">
          <div>
            <h2 style="font-size:1.8rem;margin-bottom:8px;color:var(--txt-primary)">Envie uma <span style="color:var(--vermelho)">mensagem</span></h2>
            <p style="color:var(--txt-muted);margin-bottom:28px;font-size:0.9rem">Preencha o formulário e entraremos em contato em breve.</p>
            <form class="contato-form" id="contato-form" onsubmit="handleContato(event)">
              <div class="form-group">
                <label><i class="fa-solid fa-user"></i> Nome</label>
                <input type="text" id="nome" name="nome" placeholder="Seu nome completo" required>
              </div>
              <div class="form-group">
                <label><i class="fa-solid fa-envelope"></i> E-mail</label>
                <input type="email" id="email" name="email" placeholder="seu@email.com" required>
              </div>
              <div class="form-group">
                <label><i class="fa-brands fa-whatsapp"></i> Telefone</label>
                <input type="tel" id="telefone" name="telefone" placeholder="(63) 9 9999-9999">
              </div>
              <div class="form-group">
                <label><i class="fa-solid fa-tag"></i> Assunto</label>
                <select id="assunto" name="assunto">
                  <option value="">Selecione...</option>
                  <option>Publicidade</option>
                  <option>Sugestão de Programa</option>
                  <option>Pedido de Música</option>
                  <option>Outro</option>
                </select>
              </div>
              <div class="form-group">
                <label><i class="fa-solid fa-message"></i> Mensagem</label>
                <textarea id="mensagem" name="mensagem" placeholder="Escreva sua mensagem..." required></textarea>
              </div>
              <button type="submit" class="btn-submit"><i class="fa-solid fa-paper-plane"></i> Enviar Mensagem</button>
            </form>
          </div>
          <div class="contato-info">
            <h3 style="font-size:1.3rem;margin-bottom:22px;color:var(--txt-primary)">Informações de <span style="color:var(--vermelho)">Contato</span></h3>
            <div class="contato-info-item">
              <div class="contato-info-icon"><i class="fa-solid fa-radio"></i></div>
              <div class="contato-info-text"><strong>Rádio Cidade FM 87,9</strong><span>Ananás – Tocantins · ACA</span></div>
            </div>
            <div class="contato-info-item">
              <div class="contato-info-icon"><i class="fa-brands fa-whatsapp"></i></div>
              <div class="contato-info-text"><strong>WhatsApp</strong><a href="https://wa.me/${CONFIG.whatsapp}">(63) 9 9999-9999</a></div>
            </div>
            <div class="contato-info-item">
              <div class="contato-info-icon"><i class="fa-solid fa-envelope"></i></div>
              <div class="contato-info-text"><strong>E-mail</strong><a href="mailto:contato@cidadefm879.com.br">contato@cidadefm879.com.br</a></div>
            </div>
            <div class="contato-info-item">
              <div class="contato-info-icon"><i class="fa-solid fa-clock"></i></div>
              <div class="contato-info-text"><strong>Atendimento</strong><span>Segunda a Sexta, 08h às 18h</span></div>
            </div>
            <div style="margin-top:20px">
              <a href="https://wa.me/${CONFIG.whatsapp}?text=Olá, vim pelo site da Cidade FM!" target="_blank" class="btn-submit" style="background:var(--vermelho)">
                <i class="fa-brands fa-whatsapp"></i> Chamar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
function handleContato(e) {
  e.preventDefault();
  showToast('✅ Mensagem enviada com sucesso!');
  e.target.reset();
}

/* ── SOBRE ───────────────────────────────────────────────── */
function renderSobre() {
  document.getElementById('content').innerHTML = `
    <div class="page-hero">
      <div class="container">
        <div class="page-hero-label label"><i class="fa-solid fa-circle-info"></i> Nossa História</div>
        <h1>Sobre a <span>Cidade FM</span></h1>
        <p>20 anos de voz, música e informação em Ananás</p>
      </div>
    </div>
    <section class="section section-light">
      <div class="container">
        <div class="sobre-grid">
          <div class="sobre-text">
            <div class="label" style="margin-bottom:12px"><i class="fa-solid fa-bullhorn"></i> Nossa Missão</div>
            <h2 style="font-size:clamp(1.8rem,4vw,3rem);color:var(--txt-primary);margin-bottom:20px">A rádio que <span style="color:var(--vermelho)">pulsa</span> com a cidade</h2>
            <p>A Rádio Cidade FM 87,9 faz parte da ACA – Associação Comunitária de Ananás – e nasceu para servir a comunidade de Ananás e região norte do Tocantins. Desde 2005, somos a voz do povo, levando informação, cultura e entretenimento para toda a região.</p>
            <p>Nossa missão é levar entretenimento, informação e cultura de qualidade para cada ouvinte. Seja no carro, no trabalho ou em casa, a Cidade FM está presente nos momentos mais importantes do seu dia.</p>
            <p>Com uma equipe apaixonada e comprometida, produzimos conteúdo exclusivo para o norte do Tocantins, respeitando nossa cultura e valorizando nossos artistas.</p>
            <div style="margin-top:24px;display:inline-block;padding:14px 20px;background:var(--amarelo);border-radius:var(--radius)">
              <img src="assets/img/logo-aca.svg" alt="ACA – Associação Comunitária de Ananás" style="height:46px;display:block"/>
            </div>
            <div class="sobre-stats">
              <div class="stats-row">
                <div class="stat-item"><div class="stat-num">20+</div><div class="stat-label">Anos no Ar</div></div>
                <div class="stat-item"><div class="stat-num">5</div><div class="stat-label">Locutores</div></div>
                <div class="stat-item"><div class="stat-num">24h</div><div class="stat-label">No Ar</div></div>
              </div>
            </div>
          </div>
          <div class="sobre-highlights">
            <div class="sobre-highlight-item">
              <div class="sobre-highlight-icon"><i class="fa-solid fa-microphone-lines"></i></div>
              <div class="sobre-highlight-text"><strong>Transmissão 24 Horas</strong><p>Programação ininterrupta com locutores ao vivo nos principais horários</p></div>
            </div>
            <div class="sobre-highlight-item">
              <div class="sobre-highlight-icon"><i class="fa-solid fa-satellite-dish"></i></div>
              <div class="sobre-highlight-text"><strong>Sinal Online e FM</strong><p>Ouça pelo rádio em 87,9 MHz ou pelo nosso player online de qualquer lugar do mundo</p></div>
            </div>
            <div class="sobre-highlight-item">
              <div class="sobre-highlight-icon"><i class="fa-solid fa-music"></i></div>
              <div class="sobre-highlight-text"><strong>Música Para Todos</strong><p>Sertanejo, pop, flashback, eletrônico e muito mais na grade do tocantinense</p></div>
            </div>
            <div class="sobre-highlight-item">
              <div class="sobre-highlight-icon"><i class="fa-solid fa-newspaper"></i></div>
              <div class="sobre-highlight-text"><strong>Informação Local</strong><p>Cobertura jornalística de Ananás e do norte do Tocantins</p></div>
            </div>
            <div class="sobre-highlight-item">
              <div class="sobre-highlight-icon"><i class="fa-solid fa-handshake"></i></div>
              <div class="sobre-highlight-text"><strong>Publicidade Eficiente</strong><p>Alcance os consumidores tocantinenses. Fale com nossa equipe comercial</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

/* ── TOP 10 ──────────────────────────────────────────────── */
function renderTop10() {
  document.getElementById('content').innerHTML = `
    <div class="page-hero">
      <div class="container">
        <div class="page-hero-label label"><i class="fa-solid fa-music"></i> Cidade FM 87,9</div>
        <h1>Top <span>10</span> Mais Tocadas</h1>
        <p>As músicas que mais tocam na sua rádio esta semana</p>
      </div>
    </div>
    <section class="section section-light">
      <div class="container">
        <div class="top10-full">
          ${TOP10.map(t => `
            <div class="top10-item">
              <div class="top10-pos ${t.pos===1?'gold':t.pos===2?'silver':t.pos===3?'bronze':''}">${t.pos}</div>
              <div class="top10-disco"><i class="fa-solid fa-compact-disc fa-spin" style="color:var(--txt-muted)"></i></div>
              <div class="top10-dados">
                <div class="top10-musica">${t.musica}</div>
                <div class="top10-artista">${t.artista}</div>
              </div>
              <span class="top10-variacao ${t.subidas.startsWith('+')?'up':t.subidas.startsWith('-')?'down':t.subidas==='NEW'?'new':'igual'}">
                <i class="fa-solid ${t.subidas.startsWith('+')?'fa-arrow-up':t.subidas.startsWith('-')?'fa-arrow-down':t.subidas==='NEW'?'fa-star':'fa-minus'}"></i> ${t.subidas}
              </span>
            </div>
          `).join('')}
        </div>
        <p style="text-align:center;color:var(--txt-muted);font-size:0.78rem;margin-top:28px">
          <i class="fa-solid fa-circle-info"></i> Ranking atualizado semanalmente pela equipe da Cidade FM 87,9
        </p>
      </div>
    </section>
  `;
}

/* ── MURAL ───────────────────────────────────────────────── */
function renderMural() {
  document.getElementById('content').innerHTML = `
    <div class="page-hero">
      <div class="container">
        <div class="page-hero-label label"><i class="fa-solid fa-comments"></i> Fale com a Cidade FM</div>
        <h1>Mural de <span>Recados</span></h1>
        <p>Deixe seu recado, pedido de música ou mensagem!</p>
      </div>
    </div>
    <section class="section section-light">
      <div class="container">
        <div class="mural-grid">
          <div class="mural-form-box">
            <h3><i class="fa-solid fa-paper-plane"></i> Enviar <span>Recado</span></h3>
            <div class="form-group">
              <label><i class="fa-solid fa-user"></i> Seu nome</label>
              <input type="text" id="mural-nome" placeholder="Como você se chama?">
            </div>
            <div class="form-group">
              <label><i class="fa-solid fa-location-dot"></i> Cidade</label>
              <input type="text" id="mural-cidade" placeholder="Ananás, Xambioá...">
            </div>
            <div class="form-group">
              <label><i class="fa-solid fa-comment"></i> Recado</label>
              <textarea id="mural-msg" placeholder="Escreva seu recado, pedido de música ou mensagem para a rádio..." rows="4"></textarea>
            </div>
            <button class="btn-submit" onclick="enviarRecado()"><i class="fa-solid fa-paper-plane"></i> Enviar Recado</button>
          </div>
          <div>
            <h3 style="font-family:var(--font-display);font-size:1.4rem;font-weight:800;color:var(--txt-primary);margin-bottom:20px">
              <i class="fa-solid fa-list" style="color:var(--vermelho);margin-right:8px"></i>Recados dos <span style="color:var(--vermelho)">Ouvintes</span>
            </h3>
            <div id="mural-lista"></div>
          </div>
        </div>
      </div>
    </section>
  `;
  renderizarMural();
}

function renderizarMural() {
  const el = document.getElementById('mural-lista');
  if (!el) return;
  el.innerHTML = getMural().map(m => `
    <div class="mural-card">
      <div class="mural-card-header">
        <div class="mural-avatar">${m.nome.charAt(0)}</div>
        <div>
          <strong class="mural-nome">${m.nome}</strong>
          <span class="mural-cidade"><i class="fa-solid fa-location-dot"></i> ${m.cidade}</span>
        </div>
        <span class="mural-hora"><i class="fa-regular fa-clock"></i> ${m.hora}</span>
      </div>
      <p class="mural-msg">${m.msg}</p>
    </div>
  `).join('');
}

function enviarRecado() {
  const nome   = document.getElementById('mural-nome')?.value.trim();
  const cidade = document.getElementById('mural-cidade')?.value.trim() || 'Ananás';
  const msg    = document.getElementById('mural-msg')?.value.trim();
  if (!nome || !msg) { showToast('⚠️ Preencha o nome e o recado!'); return; }
  if (msg.length < 5) { showToast('⚠️ Recado muito curto!'); return; }
  adicionarRecado(nome, cidade, msg);
  document.getElementById('mural-nome').value = '';
  document.getElementById('mural-cidade').value = '';
  document.getElementById('mural-msg').value = '';
  renderizarMural();
  showToast('✅ Recado enviado!');
}

/* ── OUVINTE DO MÊS ──────────────────────────────────────── */
function renderOuvinteMes() {
  document.getElementById('content').innerHTML = `
    <div class="page-hero">
      <div class="container">
        <div class="page-hero-label label"><i class="fa-solid fa-trophy"></i> Cidade FM 87,9</div>
        <h1>Ouvinte do <span>Mês</span></h1>
        <p>Cada mês um ouvinte especial é homenageado!</p>
      </div>
    </div>
    <section class="section section-light">
      <div class="container">
        <div class="ouvinte-destaque">
          <div class="ouvinte-destaque-avatar">${OUVINTE_MES.foto_iniciais}</div>
          <div class="ouvinte-destaque-info">
            <div class="label" style="margin-bottom:10px"><i class="fa-solid fa-star"></i> ${OUVINTE_MES.mes}</div>
            <h2>${OUVINTE_MES.nome}</h2>
            <p style="color:rgba(255,255,255,0.65);margin:6px 0"><i class="fa-solid fa-location-dot"></i> ${OUVINTE_MES.cidade} · ${OUVINTE_MES.desde}</p>
            <blockquote class="ouvinte-fala">${OUVINTE_MES.mensagem}</blockquote>
          </div>
        </div>
        <div class="cadastro-ouvinte-box">
          <h3 style="font-family:var(--font-display);font-size:1.5rem;font-weight:800;color:var(--txt-primary);margin-bottom:8px">
            <i class="fa-solid fa-pen-to-square" style="color:var(--vermelho)"></i> Quero ser o Ouvinte do <span style="color:var(--vermelho)">Mês!</span>
          </h3>
          <p style="color:var(--txt-muted);margin-bottom:24px;font-size:0.88rem">Preencha e concorra a ser homenageado na Cidade FM 87,9!</p>
          <div class="cadastro-grid">
            <div class="form-group">
              <label><i class="fa-solid fa-user"></i> Nome completo</label>
              <input type="text" id="cad-nome" placeholder="Seu nome">
            </div>
            <div class="form-group">
              <label><i class="fa-solid fa-location-dot"></i> Cidade</label>
              <input type="text" id="cad-cidade" placeholder="Sua cidade">
            </div>
            <div class="form-group">
              <label><i class="fa-brands fa-whatsapp"></i> WhatsApp</label>
              <input type="tel" id="cad-fone" placeholder="(63) 9 9999-9999">
            </div>
            <div class="form-group">
              <label><i class="fa-regular fa-clock"></i> Há quanto tempo ouve?</label>
              <select id="cad-tempo">
                <option value="">Selecione...</option>
                <option>Menos de 1 ano</option>
                <option>1 a 3 anos</option>
                <option>3 a 5 anos</option>
                <option>Mais de 5 anos</option>
                <option>Mais de 10 anos</option>
              </select>
            </div>
            <div class="form-group" style="grid-column:1/-1">
              <label><i class="fa-solid fa-comment"></i> Por que você merece ser o Ouvinte do Mês?</label>
              <textarea id="cad-motivo" rows="3" placeholder="Conte sua história com a Cidade FM..."></textarea>
            </div>
          </div>
          <button class="btn-submit" onclick="submeterCadastro()"><i class="fa-solid fa-paper-plane"></i> Enviar Cadastro</button>
        </div>
      </div>
    </section>
  `;
}

function submeterCadastro() {
  const nome   = document.getElementById('cad-nome')?.value.trim();
  const cidade = document.getElementById('cad-cidade')?.value.trim();
  const fone   = document.getElementById('cad-fone')?.value.trim();
  const tempo  = document.getElementById('cad-tempo')?.value;
  const motivo = document.getElementById('cad-motivo')?.value.trim();
  if (!nome||!cidade||!fone||!tempo||!motivo) { showToast('⚠️ Preencha todos os campos!'); return; }
  cadastrarOuvinte({ nome,cidade,fone,tempo,motivo });
  showToast('✅ Cadastro enviado! Boa sorte! 🌟');
  ['cad-nome','cad-cidade','cad-fone','cad-motivo'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  document.getElementById('cad-tempo').value='';
}

/* ── TEMPO ───────────────────────────────────────────────── */
function renderTempo() {
  document.getElementById('content').innerHTML = `
    <div class="page-hero">
      <div class="container">
        <div class="page-hero-label label"><i class="fa-solid fa-cloud-sun"></i> Cidade FM 87,9</div>
        <h1>Tempo em <span>Ananás</span></h1>
        <p>Previsão do tempo para Ananás e região</p>
      </div>
    </div>
    <section class="section section-light">
      <div class="container">
        <div class="tempo-page-grid">
          <div class="tempo-card-main">
            <div class="tempo-card-city"><i class="fa-solid fa-location-dot"></i> ${TEMPO_ANANAS.cidade}</div>
            <div class="tempo-card-icon-big">${TEMPO_ANANAS.icon}</div>
            <div class="tempo-card-temp">${TEMPO_ANANAS.temp}<span>°C</span></div>
            <div class="tempo-card-cond">${TEMPO_ANANAS.condicao}</div>
            <div class="tempo-card-extras">
              <div class="tempo-extra-item">
                <span class="tempo-extra-label"><i class="fa-solid fa-temperature-half"></i> Sensação</span>
                <span class="tempo-extra-val">${TEMPO_ANANAS.sensacao}°C</span>
              </div>
              <div class="tempo-extra-item">
                <span class="tempo-extra-label"><i class="fa-solid fa-droplet"></i> Umidade</span>
                <span class="tempo-extra-val">${TEMPO_ANANAS.umidade}%</span>
              </div>
              <div class="tempo-extra-item">
                <span class="tempo-extra-label"><i class="fa-solid fa-wind"></i> Vento</span>
                <span class="tempo-extra-val">${TEMPO_ANANAS.vento}</span>
              </div>
            </div>
          </div>
          <div class="tempo-previsao-full">
            <h3 style="font-family:var(--font-display);font-size:1.4rem;font-weight:800;color:var(--txt-primary);margin-bottom:20px">
              <i class="fa-solid fa-calendar-week" style="color:var(--vermelho);margin-right:8px"></i>Próximos <span style="color:var(--vermelho)">5 Dias</span>
            </h3>
            ${TEMPO_ANANAS.previsao.map(p => `
              <div class="tempo-prev-row">
                <span class="tempo-prev-dia-full">${p.dia}</span>
                <span class="tempo-prev-icon-lg">${p.icon}</span>
                <div class="tempo-prev-bar-wrap">
                  <span class="tempo-prev-min-full">${p.min}°</span>
                  <div class="tempo-prev-bar"><div class="tempo-prev-bar-fill" style="width:${Math.round((p.max-p.min)/20*100)}%"></div></div>
                  <span class="tempo-prev-max-full">${p.max}°</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <p style="text-align:center;color:var(--txt-muted);font-size:0.75rem;margin-top:28px">
          <i class="fa-solid fa-circle-info"></i> Previsão estática — em breve integração com API meteorológica em tempo real.
        </p>
      </div>
    </section>
  `;
}

/* ── HORÓSCOPO ───────────────────────────────────────────── */
function renderHoroscopo() {
  const hoje = new Date();
  const semana = `Semana de ${hoje.toLocaleDateString('pt-BR',{day:'2-digit',month:'long'})}`;
  // Nota como barras FA — sem emojis, visual limpo
  function notaBarras(nota) {
    const total = 5;
    const cheias = Math.round(nota / 2);
    let bars = '';
    for (let i = 0; i < total; i++) {
      bars += `<i class="fa-solid fa-star" style="font-size:0.6rem;color:${i < cheias ? 'var(--amarelo)' : 'var(--border-strong)'}"></i>`;
    }
    return `<div style="display:flex;gap:2px;justify-content:center;align-items:center">${bars}<span style="color:var(--txt-muted);font-size:0.68rem;margin-left:5px">${nota}/10</span></div>`;
  }
  document.getElementById('content').innerHTML = `
    <div class="page-hero">
      <div class="container">
        <div class="page-hero-label label"><i class="fa-solid fa-star"></i> ${semana}</div>
        <h1>Horós<span>copo</span></h1>
        <p>A previsão dos astros para todos os signos desta semana</p>
      </div>
    </div>
    <section class="section section-light">
      <div class="container">
        <div class="horo-grid">
          ${HOROSCOPO.map(h => `
            <div class="horo-card">
              <div class="horo-emoji" style="font-size:2rem;color:var(--vermelho);margin-bottom:8px">${h.icon}</div>
              <div class="horo-signo">${h.signo}</div>
              <div class="horo-datas">${h.datas}</div>
              <div class="horo-nota" style="margin-bottom:10px">${notaBarras(h.nota)}</div>
              <p class="horo-previsao">${h.previsao}</p>
            </div>
          `).join('')}
        </div>
        <p style="text-align:center;color:var(--txt-muted);font-size:0.75rem;margin-top:28px">
          <i class="fa-solid fa-star-half-stroke"></i> Previsões para entretenimento. Atualizado semanalmente pela equipe Cidade FM.
        </p>
      </div>
    </section>
  `;
}

/* ── Cards reutilizáveis ──────────────────────────────────── */
function cardNoticia(n,i) {
  return `
    <article class="noticia-card" onclick="location.hash='noticias/${n.slug}'" tabindex="0">
      <div class="noticia-thumb">
        <img src="${svgThumb(n.id)}" alt="${n.titulo}" loading="lazy">
        <span class="noticia-categoria">${n.categoria}</span>
      </div>
      <div class="noticia-body">
        <div class="noticia-data"><i class="fa-regular fa-calendar"></i> ${formatData(n.data)}</div>
        <h3 class="noticia-titulo">${n.titulo}</h3>
        <p class="noticia-resumo">${n.resumo}</p>
      </div>
      <div class="noticia-footer">
        <span class="noticia-autor"><i class="fa-solid fa-pen-nib"></i> ${n.autor}</span>
        <span class="noticia-link">Leia mais <i class="fa-solid fa-arrow-right"></i></span>
      </div>
    </article>
  `;
}

function cardLocutor(l,i,clickable=false) {
  return `
    <div class="locutor-card" ${clickable?`onclick="location.hash='locutores/${l.slug}'" tabindex="0"`:''}>
      <div class="locutor-foto">
        <img src="${svgAvatar(getInitials(l.nome),l.id)}" alt="${l.nome}">
      </div>
      <div class="locutor-nome">${l.nome}</div>
      <div class="locutor-programa">${l.programa}</div>
      <div class="locutor-horario"><i class="fa-regular fa-clock"></i> ${l.horario}</div>
    </div>
  `;
}

/* ── Init ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  Player.init();
  Router.init();

  // ── Hamburger menu ──────────────────────────────────────────
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      hamburger.querySelector('i').className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });
    mobileMenu.querySelectorAll('a, button').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.querySelector('i').className = 'fa-solid fa-bars';
      });
    });
    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        if (hamburger.querySelector('i')) hamburger.querySelector('i').className = 'fa-solid fa-bars';
      }
    });
  }

  // ── Nav: scroll shadow ──────────────────────────────────────
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (nav) nav.style.boxShadow = window.scrollY > 4 ? 'var(--shadow-lg)' : 'var(--shadow-md)';
  }, { passive: true });

  // ── WhatsApp float: atualiza href dinamicamente ─────────────
  const waBtn = document.querySelector('.whatsapp-float-btn');
  if (waBtn && typeof CONFIG !== 'undefined') {
    waBtn.href = `https://wa.me/${CONFIG.whatsapp}?text=Olá%2C%20vim%20pelo%20site%20da%20Cidade%20FM%2087%2C9!`;
  }

  // ── Scroll to top ao trocar de rota (mobile fix) ────────────
  window.addEventListener('hashchange', () => {
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 60);
  });

  // ── iOS: impede zoom ao focar em inputs ─────────────────────
  // Define font-size mínimo de 16px via meta se não existir
  if (!document.querySelector('meta[name="viewport"][content*="maximum-scale"]')) {
    const vp = document.querySelector('meta[name="viewport"]');
    if (vp) vp.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0';
  }
});
