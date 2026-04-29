/**
 * RÁDIO CIDADE FM 87,9 — app.js
 * SPA leve: roteamento por hash, player persistente, render de páginas
 * ──────────────────────────────────────────────────────────────────
 * TODO (PHP): Substituir os dados mock por chamadas fetch() à sua API
 * ──────────────────────────────────────────────────────────────────
 */

/* ── Configurações ──────────────────────────────────────────────── */
const CONFIG = {
  // Stream principal da Rádio Cidade FM 87,9 - Ananás/TO
  // Tente múltiplas URLs de fallback para garantir reprodução
  streamUrl: 'https://stream.zeno.fm/cidade879',
  streamFallbacks: [
    'https://stream.zeno.fm/cidade879',
    'https://cast.radiosbrasil.com.br/8040/stream',
    'https://radios.com.br/aovivo/cidade-fm-879'
  ],
  whatsapp: '5563999999999',
  instagram: 'https://instagram.com/cidadefm879',
  facebook: 'https://facebook.com/cidadefm879',
  twitter: 'https://twitter.com/cidadefm879',
  radioNome: 'Cidade FM 87,9',
  radioFreq: '87,9 MHz',
  radioCidade: 'Ananás – TO'
};

/* ── Player Global ──────────────────────────────────────────────── */
const Player = (() => {
  let audio = null;
  let playing = false;

  function init() {
    audio = new Audio();
    audio.preload = 'none';
    // TODO: fetch('/api/now-playing.php') para atualizar a faixa atual
    renderPlayerUI();
    bindEvents();
  }

  function renderPlayerUI() {
    const el = document.getElementById('player');
    if (!el) return;
    el.innerHTML = `
      <div class="container">
        <div class="player-inner">
          <div class="player-info">
            <div class="player-logo">
              <svg width="26" height="26" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" fill="#FFD600"/>
                <path d="M8 16 Q16 4 24 16 Q16 28 8 16Z" fill="#CC0000" opacity="0.7"/>
                <circle cx="16" cy="16" r="5" fill="#CC0000"/>
                <circle cx="16" cy="16" r="2" fill="#FFD600"/>
              </svg>
            </div>
            <div class="player-meta">
              <div class="player-ao-vivo"><span class="dot"></span> Ao Vivo</div>
              <div class="player-radio-name">${CONFIG.radioNome}</div>
              <div class="player-track" id="player-track">Clique em play para ouvir</div>
            </div>
          </div>
          <div class="player-controls">
            <button class="btn-play" id="btn-play" aria-label="Play/Pause">
              <svg id="icon-play" width="22" height="22" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              <svg id="icon-pause" width="22" height="22" viewBox="0 0 24 24" style="display:none"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            </button>
          </div>
          <div class="player-volume">
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
            <input type="range" class="volume-slider" id="volume-slider" min="0" max="100" value="80" aria-label="Volume">
          </div>
        </div>
      </div>
    `;
  }

  function bindEvents() {
    document.addEventListener('click', e => {
      if (e.target.closest('#btn-play')) toggle();
    });
    document.addEventListener('input', e => {
      if (e.target.id === 'volume-slider' && audio) {
        audio.volume = e.target.value / 100;
      }
    });
  }

  let fallbackIdx = 0;

  function tryPlay(url) {
    if (!audio) return;
    audio.src = url;
    audio.volume = (document.getElementById('volume-slider')?.value || 80) / 100;
    audio.load();
    audio.play()
      .then(() => {
        setPlaying(true);
        fallbackIdx = 0;
      })
      .catch(err => {
        console.warn('Stream falhou:', url, err);
        fallbackIdx++;
        const fallbacks = CONFIG.streamFallbacks || [];
        if (fallbackIdx < fallbacks.length) {
          showToast('Tentando stream alternativo...');
          setTimeout(() => tryPlay(fallbacks[fallbackIdx]), 1500);
        } else {
          fallbackIdx = 0;
          setPlaying(false);
          showToast('⚠️ Não foi possível conectar. Verifique a URL do stream nas configurações.');
        }
      });
  }

  function toggle() {
    if (!audio) return;
    if (playing) {
      audio.pause();
      audio.src = '';
      setPlaying(false);
      fallbackIdx = 0;
    } else {
      const track = document.getElementById('player-track');
      if (track) track.textContent = 'Conectando...';
      tryPlay(CONFIG.streamUrl);
    }
  }

  function setPlaying(state) {
    playing = state;
    const iconPlay  = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');
    const btn       = document.getElementById('btn-play');
    if (!iconPlay || !iconPause) return;
    iconPlay.style.display  = state ? 'none'  : 'block';
    iconPause.style.display = state ? 'block' : 'none';
    if (btn) btn.style.boxShadow = state ? '0 0 30px rgba(255,214,0,0.5)' : '';
    // Atualiza track
    const track = document.getElementById('player-track');
    if (track) track.textContent = state ? 'Conectando ao stream...' : 'Clique em play para ouvir';
  }

  return { init, toggle };
})();

/* ── Router SPA ─────────────────────────────────────────────────── */
const Router = (() => {
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

  function getRoute() {
    const hash = location.hash.replace('#', '').split('/')[0];
    return hash || '';
  }

  function getParam() {
    const parts = location.hash.replace('#', '').split('/');
    return parts[1] || null;
  }

  function navigate(hash) {
    location.hash = hash;
  }

  function resolve() {
    const route = getRoute();
    const param  = getParam();
    const fn = routes[route] || renderHome;
    const content = document.getElementById('content');
    if (content) {
      content.innerHTML = '<div style="padding:120px 0;text-align:center;color:#555">Carregando...</div>';
    }
    // Pequeno delay para animação
    setTimeout(() => fn(param), 60);
    updateActiveNav(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateActiveNav(route) {
    document.querySelectorAll('[data-route]').forEach(el => {
      el.classList.toggle('active', el.dataset.route === route || (route === '' && el.dataset.route === 'home'));
    });
  }

  function init() {
    window.addEventListener('hashchange', resolve);
    resolve();
  }

  return { init, navigate };
})();

/* ── Utilitários ────────────────────────────────────────────────── */
function formatData(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  return `${d} ${meses[parseInt(m)-1]} ${y}`;
}

function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function getInitials(nome) {
  return nome.split(' ').slice(0,2).map(p => p[0]).join('');
}

/* ── SVG Placeholder para imagens ──────────────────────────────── */
function svgThumb(seed, w = 400, h = 200) {
  const cores = ['#CC0000','#990000','#FFD600','#B8860B','#333'];
  const cor = cores[seed % cores.length];
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="${cor}"/><text x="50%" y="50%" font-family="sans-serif" font-size="14" fill="rgba(255,255,255,0.3)" text-anchor="middle" dominant-baseline="middle">Cidade FM 87,9</text></svg>`)}`;
}

function svgAvatar(initials, seed = 0) {
  const cores = ['#CC0000','#990000','#FFD600','#B8860B'];
  const cor = cores[seed % cores.length];
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" viewBox="0 0 90 90"><rect width="90" height="90" rx="45" fill="${cor}"/><text x="50%" y="50%" font-family="sans-serif" font-size="28" font-weight="bold" fill="#fff" text-anchor="middle" dominant-baseline="central">${initials}</text></svg>`)}`;
}

/* ════════════════════════════════════════════════════════════════
   RENDERIZADORES DE PÁGINAS
   ════════════════════════════════════════════════════════════════ */

/* ── HOME ───────────────────────────────────────────────────────── */
function renderHome() {
  const programaAtual = getProgramaAtual();
  const noticasDestaque = NOTICIAS.slice(0, 3);
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
              Rádio<br>Cidade<br>
              <span class="freq">FM 87,9</span>
            </h1>
            <p class="hero-desc">
              A rádio que pulsa com a cidade. Música, informação e entretenimento 
              24 horas por dia para todo o Tocantins.
            </p>
            <div class="hero-actions">
              <button class="btn-primary" onclick="Player.toggle()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
                Ouvir Ao Vivo
              </button>
              <a href="#programacao" class="btn-ghost" data-route="programacao">
                Ver Programação
              </a>
            </div>
            <div class="quick-actions" style="margin-top:24px">
              <a href="https://wa.me/${CONFIG.whatsapp}" target="_blank" class="btn-action whatsapp">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
              <a href="${CONFIG.instagram}" target="_blank" class="btn-action instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                Instagram
              </a>
            </div>
          </div>
          <div class="hero-visual">
            <div class="hero-disc">
              <div class="hero-waves">
                <div class="wave"></div>
                <div class="wave"></div>
                <div class="wave"></div>
              </div>
              <div class="hero-disc-outer"></div>
              <div class="hero-disc-mid">
                <div class="hero-disc-center">
                  <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="22" fill="#CC0000" stroke="#FFD600" stroke-width="2"/>
                    <text x="24" y="18" font-family="sans-serif" font-weight="900" font-size="9" fill="#FFD600" text-anchor="middle" dominant-baseline="middle">CIDADE</text>
                    <text x="24" y="30" font-family="sans-serif" font-weight="900" font-size="13" fill="#FFD600" text-anchor="middle" dominant-baseline="middle">FM</text>
                    <text x="24" y="42" font-family="sans-serif" font-weight="700" font-size="7" fill="#FFD600" text-anchor="middle" dominant-baseline="middle">87,9</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="stats-row">
          <div class="stat-item"><div class="stat-num">20+</div><div class="stat-label">Anos no Ar</div></div>
          <div class="stat-item"><div class="stat-num">87,9</div><div class="stat-label">MHz Frequência</div></div>
          <div class="stat-item"><div class="stat-num">24h</div><div class="stat-label">Transmissão</div></div>
          <div class="stat-item"><div class="stat-num">5</div><div class="stat-label">Locutores</div></div>
        </div>
      </div>
    </section>

    <!-- PROGRAMA ATUAL -->
    ${programaAtual ? `
    <section class="section section-alt">
      <div class="container">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px">
          <div>
            <div class="label" style="margin-bottom:8px">Agora no Ar</div>
            <h2 style="font-size:clamp(1.8rem,4vw,3rem)">${programaAtual.nome}</h2>
            <p style="color:var(--cinza-claro);margin-top:6px">com <strong style="color:#fff">${programaAtual.locutor}</strong> · ${programaAtual.hora} – ${programaAtual.fim}</p>
          </div>
          <button class="btn-primary" onclick="Player.toggle()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
            Ouvir Agora
          </button>
        </div>
      </div>
    </section>
    ` : ''}

    <!-- NOTÍCIAS -->
    <section class="section section-dark">
      <div class="container">
        <div class="section-header">
          <h2>Últimas <span>Notícias</span></h2>
          <a href="#noticias" class="btn-ver-mais" data-route="noticias">Ver todas →</a>
        </div>
        <div class="noticias-grid" id="home-noticias"></div>
      </div>
    </section>

    <!-- PROGRAMAÇÃO RESUMIDA -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-header">
          <h2>Prog<span>ramação</span></h2>
          <a href="#programacao" class="btn-ver-mais" data-route="programacao">Grade completa →</a>
        </div>
        <div id="home-prog"></div>
      </div>
    </section>

    <!-- LOCUTORES -->
    <section class="section section-dark">
      <div class="container">
        <div class="section-header">
          <h2>Nos<span>sos</span> Locutores</h2>
          <a href="#locutores" class="btn-ver-mais" data-route="locutores">Ver todos →</a>
        </div>
        <div class="locutores-grid" id="home-locutores"></div>
      </div>
    </section>

    <!-- TOP 10 + TEMPO (grid lado a lado) -->
    <section class="section section-alt">
      <div class="container">
        <div class="home-widgets-grid">

          <!-- TOP 10 preview -->
          <div class="widget-box">
            <div class="widget-header">
              <span class="widget-icon">🎵</span>
              <div>
                <div class="label">Cidade FM 87,9</div>
                <h3>Top 10 Mais Tocadas</h3>
              </div>
              <a href="#top10" class="btn-ver-mais" data-route="top10" style="margin-left:auto">Ver ranking →</a>
            </div>
            <div class="top10-mini">
              ${TOP10.slice(0,5).map(t => `
                <div class="top10-mini-item">
                  <span class="top10-mini-pos ${t.pos === 1 ? 'gold' : t.pos === 2 ? 'silver' : t.pos === 3 ? 'bronze' : ''}">${t.pos}</span>
                  <div class="top10-mini-info">
                    <span class="top10-mini-musica">${t.musica}</span>
                    <span class="top10-mini-artista">${t.artista}</span>
                  </div>
                  <span class="top10-mini-sub ${t.subidas.startsWith('+') ? 'up' : t.subidas.startsWith('-') ? 'down' : t.subidas === 'NEW' ? 'new' : ''}">${t.subidas}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- TEMPO -->
          <div class="widget-box">
            <div class="widget-header">
              <span class="widget-icon">🌡️</span>
              <div>
                <div class="label">Agora em</div>
                <h3>${TEMPO_ANANAS.cidade}</h3>
              </div>
            </div>
            <div class="tempo-main">
              <div class="tempo-icon-big">${TEMPO_ANANAS.icon}</div>
              <div class="tempo-info-main">
                <div class="tempo-temp">${TEMPO_ANANAS.temp}°C</div>
                <div class="tempo-cond">${TEMPO_ANANAS.condicao}</div>
                <div class="tempo-detalhes">
                  <span>💧 ${TEMPO_ANANAS.umidade}%</span>
                  <span>💨 ${TEMPO_ANANAS.vento}</span>
                  <span>🌡️ Sensação ${TEMPO_ANANAS.sensacao}°C</span>
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
          </div>

        </div>
      </div>
    </section>

    <!-- MURAL DE RECADOS preview -->
    <section class="section section-dark">
      <div class="container">
        <div class="section-header">
          <h2>Mural de <span>Recados</span></h2>
          <a href="#mural" class="btn-ver-mais" data-route="mural">Ver mural completo →</a>
        </div>
        <div class="mural-preview" id="home-mural"></div>
        <div style="text-align:center;margin-top:24px">
          <a href="#mural" class="btn-primary" data-route="mural" onclick="location.hash='mural'">
            ✉️ Enviar Recado
          </a>
        </div>
      </div>
    </section>

    <!-- OUVINTE DO MÊS -->
    <section class="section section-alt">
      <div class="container">
        <div class="ouvinte-mes-home">
          <div class="ouvinte-mes-avatar">${OUVINTE_MES.foto_iniciais}</div>
          <div class="ouvinte-mes-body">
            <div class="label" style="margin-bottom:8px">⭐ ${OUVINTE_MES.mes}</div>
            <h3 class="ouvinte-mes-nome">${OUVINTE_MES.nome}</h3>
            <p class="ouvinte-mes-cidade">📍 ${OUVINTE_MES.cidade} · ${OUVINTE_MES.desde}</p>
            <p class="ouvinte-mes-msg">${OUVINTE_MES.mensagem}</p>
          </div>
          <div class="ouvinte-mes-cta">
            <p style="font-size:0.82rem;color:var(--cinza-claro);margin-bottom:12px">Quer ser o próximo ouvinte do mês?</p>
            <a href="#ouvinte-mes" class="btn-ghost" onclick="location.hash='ouvinte-mes'" style="font-size:0.78rem">Participar →</a>
          </div>
        </div>
      </div>
    </section>
  `;

  // Renderiza notícias na home
  const noticasEl = document.getElementById('home-noticias');
  if (noticasEl) noticasEl.innerHTML = noticasDestaque.map((n, i) => cardNoticia(n, i)).join('');

  // Renderiza programação resumida (dia atual, 4 itens)
  const progEl = document.getElementById('home-prog');
  if (progEl) {
    const diaIdx = new Date().getDay();
    const ordem = [6, 0, 1, 2, 3, 4, 5];
    const diaData = PROGRAMACAO[ordem[diaIdx]];
    const atual = getProgramaAtual();
    const progs = diaData ? diaData.programas.slice(0, 5) : [];
    progEl.innerHTML = `
      <div class="prog-lista">
        ${progs.map(p => `
          <div class="prog-item ${atual && p.id === atual.id ? 'agora' : ''}">
            <div class="prog-horario">${p.hora}</div>
            <div>
              <div class="prog-nome">${p.nome}</div>
              <div class="prog-locutor">${p.locutor}</div>
            </div>
            ${atual && p.id === atual.id
              ? '<span class="badge-agora">Agora</span>'
              : p.ao_vivo ? '<span class="badge-ao-vivo">Ao Vivo</span>' : '<span></span>'
            }
          </div>
        `).join('')}
      </div>
    `;
  }

  // Renderiza locutores destaque
  const locEl = document.getElementById('home-locutores');
  if (locEl) locEl.innerHTML = locutoresDestaque.map((l, i) => cardLocutor(l, i)).join('');

  // Mural preview (3 recados)
  const muralEl = document.getElementById('home-mural');
  if (muralEl) {
    const msgs = getMural().slice(0, 3);
    muralEl.innerHTML = msgs.map(m => `
      <div class="mural-card-mini">
        <div class="mural-card-mini-header">
          <strong>${m.nome}</strong>
          <span>📍 ${m.cidade}</span>
          <span class="mural-hora">${m.hora}</span>
        </div>
        <p>${m.msg}</p>
      </div>
    `).join('');
  }
}

/* ── PROGRAMAÇÃO ────────────────────────────────────────────────── */
function renderProgramacao() {
  const diaAtual = new Date().getDay();
  const ordemDias = [6, 0, 1, 2, 3, 4, 5];
  const diaAtualIdx = ordemDias[diaAtual];

  document.getElementById('content').innerHTML = `
    <div class="page-hero">
      <div class="container">
        <div class="page-hero-label label">Rádio Cidade FM 87,9</div>
        <h1>Prog<span>ramação</span></h1>
        <p style="color:var(--cinza-claro);margin-top:8px;font-size:1rem">Grade completa de programas da semana</p>
      </div>
    </div>
    <section class="section section-dark">
      <div class="container">
        <div class="prog-dias-tabs" id="prog-tabs"></div>
        <div id="prog-content"></div>
      </div>
    </section>
  `;

  const tabs = document.getElementById('prog-tabs');
  const content = document.getElementById('prog-content');
  if (!tabs || !content) return;

  tabs.innerHTML = PROGRAMACAO.map((d, i) => `
    <button class="tab-dia ${i === diaAtualIdx ? 'active' : ''}" data-idx="${i}">${d.dia}</button>
  `).join('');

  function renderDia(idx) {
    const diaData = PROGRAMACAO[idx];
    const atual = getProgramaAtual();
    content.innerHTML = `
      <div class="prog-lista">
        ${diaData.programas.map(p => `
          <div class="prog-item ${atual && p.id === atual.id && idx === diaAtualIdx ? 'agora' : ''}">
            <div class="prog-horario">${p.hora}<span style="color:var(--cinza-medio);font-size:0.7rem;display:block">até ${p.fim}</span></div>
            <div>
              <div class="prog-nome">${p.nome}</div>
              <div class="prog-locutor">com ${p.locutor}</div>
            </div>
            ${atual && p.id === atual.id && idx === diaAtualIdx
              ? '<span class="badge-agora">Agora</span>'
              : p.ao_vivo ? '<span class="badge-ao-vivo">Ao Vivo</span>' : '<span></span>'
            }
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

/* ── LOCUTORES ──────────────────────────────────────────────────── */
function renderLocutores(slug) {
  if (slug) {
    renderLocutorDetalhe(slug);
    return;
  }

  document.getElementById('content').innerHTML = `
    <div class="page-hero">
      <div class="container">
        <div class="page-hero-label label">Rádio Cidade FM 87,9</div>
        <h1>Nos<span>sos</span> Locutores</h1>
        <p style="color:var(--cinza-claro);margin-top:8px;font-size:1rem">As vozes que fazem a Cidade FM</p>
      </div>
    </div>
    <section class="section section-dark">
      <div class="container">
        <div class="locutores-grid" id="locutores-grid"></div>
      </div>
    </section>
  `;

  const el = document.getElementById('locutores-grid');
  if (el) el.innerHTML = LOCUTORES.map((l, i) => cardLocutor(l, i, true)).join('');
}

function renderLocutorDetalhe(slug) {
  const locutor = LOCUTORES.find(l => l.slug === slug);
  if (!locutor) { renderLocutores(); return; }

  document.getElementById('content').innerHTML = `
    <section class="section section-dark">
      <div class="container">
        <button class="btn-voltar" onclick="location.hash='locutores'">← Voltar</button>
        <div style="max-width:700px;margin:0 auto;text-align:center">
          <div class="locutor-foto" style="width:120px;height:120px;margin:0 auto 24px;border:3px solid var(--amarelo)">
            <img src="${svgAvatar(getInitials(locutor.nome), locutor.id)}" alt="${locutor.nome}">
          </div>
          <div class="label" style="margin-bottom:12px">${locutor.programa}</div>
          <h1 style="font-size:clamp(2rem,5vw,4rem);margin-bottom:8px">${locutor.nome}</h1>
          <p style="color:var(--cinza-claro);margin-bottom:8px">${locutor.horario}</p>
          <p style="color:var(--cinza-claro);line-height:1.8;margin-top:24px;font-size:1rem">${locutor.bio}</p>
          <div style="display:flex;gap:12px;justify-content:center;margin-top:32px">
            <a href="${locutor.instagram}" target="_blank" class="btn-ghost" style="padding:10px 20px;font-size:0.78rem">Instagram</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

/* ── NOTÍCIAS ───────────────────────────────────────────────────── */
function renderNoticias(slug) {
  if (slug) {
    renderNoticiaDetalhe(slug);
    return;
  }

  document.getElementById('content').innerHTML = `
    <div class="page-hero">
      <div class="container">
        <div class="page-hero-label label">Rádio Cidade FM 87,9</div>
        <h1>Últimas <span>Notícias</span></h1>
        <p style="color:var(--cinza-claro);margin-top:8px;font-size:1rem">Fique por dentro de tudo que acontece</p>
      </div>
    </div>
    <section class="section section-dark">
      <div class="container">
        <div class="noticias-grid" id="noticias-grid"></div>
      </div>
    </section>
  `;

  const el = document.getElementById('noticias-grid');
  if (el) el.innerHTML = NOTICIAS.map((n, i) => cardNoticia(n, i)).join('');
}

function renderNoticiaDetalhe(slug) {
  const noticia = getNoticiaPorSlug(slug);
  if (!noticia) { renderNoticias(); return; }

  document.getElementById('content').innerHTML = `
    <section class="section section-dark">
      <div class="container">
        <button class="btn-voltar" onclick="location.hash='noticias'">← Voltar para Notícias</button>
        <div class="noticia-full">
          <div class="noticia-full-header">
            <div class="noticia-full-cat">
              <span class="label" style="background:var(--vermelho);color:#fff;padding:4px 12px;border-radius:4px">${noticia.categoria}</span>
            </div>
            <h1 class="noticia-full-titulo">${noticia.titulo}</h1>
            <div class="noticia-full-meta">
              <span>📅 ${formatData(noticia.data)}</span>
              <span>✍️ ${noticia.autor}</span>
            </div>
          </div>
          <img class="noticia-full-img" src="${svgThumb(noticia.id, 760, 380)}" alt="${noticia.titulo}">
          <div class="noticia-full-content">${noticia.conteudo}</div>
        </div>
      </div>
    </section>
  `;
}

/* ── CONTATO ────────────────────────────────────────────────────── */
function renderContato() {
  document.getElementById('content').innerHTML = `
    <div class="page-hero">
      <div class="container">
        <div class="page-hero-label label">Fale Conosco</div>
        <h1>Entre em <span>Contato</span></h1>
        <p style="color:var(--cinza-claro);margin-top:8px;font-size:1rem">Sua mensagem é muito bem-vinda</p>
      </div>
    </div>
    <section class="section section-dark">
      <div class="container">
        <div class="contato-grid">
          <div>
            <h2 style="font-size:2rem;margin-bottom:8px">Envie uma <span style="color:var(--amarelo)">mensagem</span></h2>
            <p style="color:var(--cinza-claro);margin-bottom:32px;font-size:0.9rem">
              <!-- TODO (PHP): Este form deve fazer POST para /api/contato.php -->
              Preencha o formulário e entraremos em contato em breve.
            </p>
            <form class="contato-form" id="contato-form" onsubmit="handleContato(event)">
              <div class="form-group">
                <label for="nome">Nome</label>
                <input type="text" id="nome" name="nome" placeholder="Seu nome completo" required>
              </div>
              <div class="form-group">
                <label for="email">E-mail</label>
                <input type="email" id="email" name="email" placeholder="seu@email.com" required>
              </div>
              <div class="form-group">
                <label for="telefone">Telefone</label>
                <input type="tel" id="telefone" name="telefone" placeholder="(63) 9 9999-9999">
              </div>
              <div class="form-group">
                <label for="assunto">Assunto</label>
                <select id="assunto" name="assunto">
                  <option value="">Selecione...</option>
                  <option value="publicidade">Publicidade</option>
                  <option value="programa">Sugestão de Programa</option>
                  <option value="musica">Pedido de Música</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div class="form-group">
                <label for="mensagem">Mensagem</label>
                <textarea id="mensagem" name="mensagem" placeholder="Escreva sua mensagem..." required></textarea>
              </div>
              <button type="submit" class="btn-submit">Enviar Mensagem</button>
            </form>
          </div>
          <div class="contato-info">
            <h3 style="font-size:1.5rem;margin-bottom:24px">Informações de <span style="color:var(--amarelo)">Contato</span></h3>
            <div class="contato-info-item">
              <div class="contato-info-icon">📻</div>
              <div class="contato-info-text">
                <strong>Rádio Cidade FM 87,9</strong>
                <span>Ananás – Tocantins</span>
              </div>
            </div>
            <div class="contato-info-item">
              <div class="contato-info-icon">📱</div>
              <div class="contato-info-text">
                <strong>WhatsApp</strong>
                <span>(63) 9 9999-9999</span>
              </div>
            </div>
            <div class="contato-info-item">
              <div class="contato-info-icon">📧</div>
              <div class="contato-info-text">
                <strong>E-mail</strong>
                <span>contato@cidadefm879.com.br</span>
              </div>
            </div>
            <div class="contato-info-item">
              <div class="contato-info-icon">🕐</div>
              <div class="contato-info-text">
                <strong>Horário de Atendimento</strong>
                <span>Segunda a Sexta, 08h às 18h</span>
              </div>
            </div>
            <div style="margin-top:8px">
              <a href="https://wa.me/${CONFIG.whatsapp}?text=Olá, vim pelo site da Cidade FM!" 
                 target="_blank" class="btn-primary" style="display:inline-flex;width:100%;justify-content:center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Chamar no WhatsApp
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
  // TODO (PHP): fetch('/api/contato.php', { method:'POST', body: new FormData(e.target) })
  showToast('✅ Mensagem enviada com sucesso!');
  e.target.reset();
}

/* ── SOBRE ──────────────────────────────────────────────────────── */
/* ── TOP 10 ─────────────────────────────────────────────────────── */
function renderTop10() {
  document.getElementById('content').innerHTML = `
    <div class="page-hero">
      <div class="container">
        <div class="page-hero-label label">Cidade FM 87,9</div>
        <h1>Top <span>10</span> Mais Tocadas</h1>
        <p style="color:var(--cinza-claro);margin-top:8px;font-size:1rem">As músicas que mais tocam na sua rádio esta semana</p>
      </div>
    </div>
    <section class="section section-dark">
      <div class="container">
        <div class="top10-full">
          ${TOP10.map(t => `
            <div class="top10-item">
              <div class="top10-pos ${t.pos === 1 ? 'gold' : t.pos === 2 ? 'silver' : t.pos === 3 ? 'bronze' : ''}">${t.pos}</div>
              <div class="top10-disco">🎵</div>
              <div class="top10-dados">
                <div class="top10-musica">${t.musica}</div>
                <div class="top10-artista">${t.artista}</div>
              </div>
              <span class="top10-variacao ${t.subidas.startsWith('+') ? 'up' : t.subidas.startsWith('-') ? 'down' : t.subidas === 'NEW' ? 'new' : 'igual'}">
                ${t.subidas.startsWith('+') ? '▲' : t.subidas.startsWith('-') ? '▼' : t.subidas === 'NEW' ? '★' : '='} ${t.subidas}
              </span>
            </div>
          `).join('')}
        </div>
        <p style="text-align:center;color:var(--cinza-claro);font-size:0.78rem;margin-top:32px">
          ⚠️ Ranking atualizado semanalmente pela equipe da Cidade FM 87,9
        </p>
      </div>
    </section>
  `;
}

/* ── MURAL DE RECADOS ────────────────────────────────────────────── */
function renderMural() {
  document.getElementById('content').innerHTML = `
    <div class="page-hero">
      <div class="container">
        <div class="page-hero-label label">Fale com a Cidade FM</div>
        <h1>Mural de <span>Recados</span></h1>
        <p style="color:var(--cinza-claro);margin-top:8px;font-size:1rem">Deixe seu recado, pedido de música ou mensagem!</p>
      </div>
    </div>
    <section class="section section-dark">
      <div class="container">
        <div class="mural-grid">

          <!-- Formulário -->
          <div class="mural-form-box">
            <h3 style="margin-bottom:20px">✉️ Enviar <span style="color:var(--amarelo)">Recado</span></h3>
            <div class="form-group">
              <label for="mural-nome">Seu nome</label>
              <input type="text" id="mural-nome" placeholder="Como você se chama?">
            </div>
            <div class="form-group">
              <label for="mural-cidade">Cidade</label>
              <input type="text" id="mural-cidade" placeholder="Ananás, Xambioá...">
            </div>
            <div class="form-group">
              <label for="mural-msg">Recado</label>
              <textarea id="mural-msg" placeholder="Escreva seu recado, pedido de música ou mensagem para a rádio..." rows="4"></textarea>
            </div>
            <button class="btn-submit" onclick="enviarRecado()">Enviar Recado 📨</button>
          </div>

          <!-- Lista de recados -->
          <div>
            <h3 style="margin-bottom:20px">📋 Recados dos <span style="color:var(--amarelo)">Ouvintes</span></h3>
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
  const msgs = getMural();
  el.innerHTML = msgs.map(m => `
    <div class="mural-card">
      <div class="mural-card-header">
        <div class="mural-avatar">${m.nome.charAt(0)}</div>
        <div>
          <strong class="mural-nome">${m.nome}</strong>
          <span class="mural-cidade">📍 ${m.cidade}</span>
        </div>
        <span class="mural-hora">${m.hora}</span>
      </div>
      <p class="mural-msg">${m.msg}</p>
    </div>
  `).join('');
}

function enviarRecado() {
  const nome  = document.getElementById('mural-nome')?.value.trim();
  const cidade = document.getElementById('mural-cidade')?.value.trim() || 'Ananás';
  const msg   = document.getElementById('mural-msg')?.value.trim();
  if (!nome || !msg) { showToast('⚠️ Preencha o nome e o recado!'); return; }
  if (msg.length < 5) { showToast('⚠️ Recado muito curto!'); return; }
  adicionarRecado(nome, cidade, msg);
  document.getElementById('mural-nome').value = '';
  document.getElementById('mural-cidade').value = '';
  document.getElementById('mural-msg').value = '';
  renderizarMural();
  showToast('✅ Recado enviado! Apareceu no mural!');
}

/* ── OUVINTE DO MÊS ─────────────────────────────────────────────── */
function renderOuvinteMes() {
  document.getElementById('content').innerHTML = `
    <div class="page-hero">
      <div class="container">
        <div class="page-hero-label label">Cidade FM 87,9</div>
        <h1>Ouvinte do <span>Mês</span></h1>
        <p style="color:var(--cinza-claro);margin-top:8px;font-size:1rem">Cada mês um ouvinte especial é homenageado!</p>
      </div>
    </div>
    <section class="section section-dark">
      <div class="container">

        <!-- Ouvinte em destaque -->
        <div class="ouvinte-destaque">
          <div class="ouvinte-destaque-avatar">${OUVINTE_MES.foto_iniciais}</div>
          <div class="ouvinte-destaque-info">
            <div class="label" style="margin-bottom:12px">⭐ ${OUVINTE_MES.mes}</div>
            <h2>${OUVINTE_MES.nome}</h2>
            <p style="color:var(--cinza-claro);margin:8px 0">📍 ${OUVINTE_MES.cidade} · ${OUVINTE_MES.desde}</p>
            <blockquote class="ouvinte-fala">${OUVINTE_MES.mensagem}</blockquote>
          </div>
        </div>

        <!-- Formulário de Cadastro -->
        <div class="cadastro-ouvinte-box">
          <h3 style="margin-bottom:8px">📝 Quero ser o Ouvinte do <span style="color:var(--amarelo)">Mês!</span></h3>
          <p style="color:var(--cinza-claro);margin-bottom:24px;font-size:0.88rem">Preencha o formulário abaixo e concorra a ser homenageado na Cidade FM 87,9!</p>
          <div class="cadastro-grid">
            <div class="form-group">
              <label>Nome completo</label>
              <input type="text" id="cad-nome" placeholder="Seu nome">
            </div>
            <div class="form-group">
              <label>Cidade</label>
              <input type="text" id="cad-cidade" placeholder="Sua cidade">
            </div>
            <div class="form-group">
              <label>WhatsApp</label>
              <input type="tel" id="cad-fone" placeholder="(63) 9 9999-9999">
            </div>
            <div class="form-group">
              <label>Há quanto tempo ouve a Cidade FM?</label>
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
              <label>Por que você merece ser o Ouvinte do Mês?</label>
              <textarea id="cad-motivo" rows="3" placeholder="Conte sua história com a Cidade FM..."></textarea>
            </div>
          </div>
          <button class="btn-submit" onclick="submeterCadastro()">📨 Enviar Cadastro</button>
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
  if (!nome || !cidade || !fone || !tempo || !motivo) {
    showToast('⚠️ Preencha todos os campos!'); return;
  }
  cadastrarOuvinte({ nome, cidade, fone, tempo, motivo });
  showToast('✅ Cadastro enviado! Boa sorte! 🌟');
  ['cad-nome','cad-cidade','cad-fone','cad-motivo'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  document.getElementById('cad-tempo').value = '';
}

/* ── TEMPO ───────────────────────────────────────────────────────── */
function renderTempo() {
  document.getElementById('content').innerHTML = `
    <div class="page-hero">
      <div class="container">
        <div class="page-hero-label label">Cidade FM 87,9</div>
        <h1>Tempo em <span>Ananás</span></h1>
        <p style="color:var(--cinza-claro);margin-top:8px;font-size:1rem">Previsão do tempo para Ananás e região</p>
      </div>
    </div>
    <section class="section section-dark">
      <div class="container">
        <div class="tempo-page-grid">

          <!-- Card principal -->
          <div class="tempo-card-main">
            <div class="tempo-card-city">📍 ${TEMPO_ANANAS.cidade}</div>
            <div class="tempo-card-icon-big">${TEMPO_ANANAS.icon}</div>
            <div class="tempo-card-temp">${TEMPO_ANANAS.temp}<span>°C</span></div>
            <div class="tempo-card-cond">${TEMPO_ANANAS.condicao}</div>
            <div class="tempo-card-extras">
              <div class="tempo-extra-item">
                <span class="tempo-extra-label">Sensação Térmica</span>
                <span class="tempo-extra-val">🌡️ ${TEMPO_ANANAS.sensacao}°C</span>
              </div>
              <div class="tempo-extra-item">
                <span class="tempo-extra-label">Umidade</span>
                <span class="tempo-extra-val">💧 ${TEMPO_ANANAS.umidade}%</span>
              </div>
              <div class="tempo-extra-item">
                <span class="tempo-extra-label">Vento</span>
                <span class="tempo-extra-val">💨 ${TEMPO_ANANAS.vento}</span>
              </div>
            </div>
          </div>

          <!-- Previsão 5 dias -->
          <div class="tempo-previsao-full">
            <h3 style="margin-bottom:20px">Próximos <span style="color:var(--amarelo)">5 Dias</span></h3>
            ${TEMPO_ANANAS.previsao.map(p => `
              <div class="tempo-prev-row">
                <span class="tempo-prev-dia-full">${p.dia}</span>
                <span class="tempo-prev-icon-lg">${p.icon}</span>
                <div class="tempo-prev-bar-wrap">
                  <span class="tempo-prev-min-full">${p.min}°</span>
                  <div class="tempo-prev-bar">
                    <div class="tempo-prev-bar-fill" style="width:${Math.round((p.max - p.min) / 20 * 100)}%"></div>
                  </div>
                  <span class="tempo-prev-max-full">${p.max}°</span>
                </div>
              </div>
            `).join('')}
          </div>

        </div>
        <p style="text-align:center;color:var(--cinza-claro);font-size:0.75rem;margin-top:32px">
          ⚠️ Previsão estática — em breve integração com API meteorológica em tempo real.
        </p>
      </div>
    </section>
  `;
}

/* ── HORÓSCOPO ───────────────────────────────────────────────────── */
function renderHoroscopo() {
  const hoje = new Date();
  const semana = `Semana de ${hoje.toLocaleDateString('pt-BR', {day:'2-digit',month:'long'})}`;
  document.getElementById('content').innerHTML = `
    <div class="page-hero">
      <div class="container">
        <div class="page-hero-label label">${semana}</div>
        <h1>Horós<span>copo</span></h1>
        <p style="color:var(--cinza-claro);margin-top:8px;font-size:1rem">A previsão dos astros para todos os signos desta semana</p>
      </div>
    </div>
    <section class="section section-dark">
      <div class="container">
        <div class="horo-grid">
          ${HOROSCOPO.map(h => `
            <div class="horo-card">
              <div class="horo-emoji">${h.emoji}</div>
              <div class="horo-signo">${h.signo}</div>
              <div class="horo-datas">${h.datas}</div>
              <div class="horo-nota">
                ${'⭐'.repeat(Math.round(h.nota/2))}
                <span style="color:var(--cinza-claro);font-size:0.7rem">${h.nota}/10</span>
              </div>
              <p class="horo-previsao">${h.previsao}</p>
            </div>
          `).join('')}
        </div>
        <p style="text-align:center;color:var(--cinza-claro);font-size:0.75rem;margin-top:32px">
          ✨ Previsões para entretenimento. Atualizado semanalmente pela equipe Cidade FM.
        </p>
      </div>
    </section>
  `;
}

function renderSobre() {
  document.getElementById('content').innerHTML = `
    <div class="page-hero">
      <div class="container">
        <div class="page-hero-label label">Nossa História</div>
        <h1>Sobre a <span>Cidade FM</span></h1>
        <p style="color:var(--cinza-claro);margin-top:8px;font-size:1rem">20 anos de voz, música e informação em Ananás</p>
      </div>
    </div>
    <section class="section section-dark">
      <div class="container">
        <div class="sobre-grid">
          <div class="sobre-text">
            <div class="label" style="margin-bottom:16px">Nossa Missão</div>
            <h2 style="font-size:clamp(1.8rem,4vw,3rem);margin-bottom:24px">A rádio que <span style="color:var(--amarelo)">pulsa</span> com a cidade</h2>
            <p>A Rádio Cidade FM 87,9 faz parte da ACA – Associação Comunitária de Ananás – e nasceu para servir a comunidade de Ananás e região norte do Tocantins. Desde 2005, somos a voz do povo, levando informação, cultura e entretenimento para toda a região.</p>
            <p>Nossa missão é simples: levar entretenimento, informação e cultura de qualidade para cada ouvinte. Seja no carro, no trabalho ou em casa, a Cidade FM está presente nos momentos mais importantes do seu dia.</p>
            <p>Com uma equipe apaixonada e comprometida, produzimos conteúdo exclusivo para o norte do Tocantins, respeitando nossa cultura, valorizando nossos artistas e mantendo nossos ouvintes sempre bem informados.</p>
            <div style="margin-top:24px;display:inline-block;padding:16px 24px;background:var(--amarelo);border-radius:var(--radius)">
              <img src="assets/img/logo-aca.svg" alt="ACA – Associação Comunitária de Ananás" style="height:50px;display:block"/>
            </div>
            <div class="stats-row" style="margin-top:40px;border-radius:var(--radius)">
              <div class="stat-item"><div class="stat-num">20+</div><div class="stat-label">Anos no Ar</div></div>
              <div class="stat-item"><div class="stat-num">5</div><div class="stat-label">Locutores</div></div>
              <div class="stat-item"><div class="stat-num">24h</div><div class="stat-label">No Ar</div></div>
            </div>
          </div>
          <div class="sobre-highlights">
            <div class="sobre-highlight-item">
              <div class="sobre-highlight-icon">🎙️</div>
              <div class="sobre-highlight-text">
                <strong>Transmissão 24 Horas</strong>
                <p>Programação ininterrupta com locutores ao vivo nos principais horários</p>
              </div>
            </div>
            <div class="sobre-highlight-item">
              <div class="sobre-highlight-icon">📡</div>
              <div class="sobre-highlight-text">
                <strong>Sinal Online e FM</strong>
                <p>Ouça pelo rádio tradicional em 87,9 MHz ou pelo nosso player online de qualquer lugar do mundo</p>
              </div>
            </div>
            <div class="sobre-highlight-item">
              <div class="sobre-highlight-icon">🎵</div>
              <div class="sobre-highlight-text">
                <strong>Música Para Todos</strong>
                <p>Sertanejo, pop, flashback, eletrônico e muito mais na grade que representa o gosto do tocantinense</p>
              </div>
            </div>
            <div class="sobre-highlight-item">
              <div class="sobre-highlight-icon">📰</div>
              <div class="sobre-highlight-text">
                <strong>Informação Local</strong>
                <p>Cobertura jornalística dos principais acontecimentos de Ananás e do norte do Tocantins</p>
              </div>
            </div>
            <div class="sobre-highlight-item">
              <div class="sobre-highlight-icon">🤝</div>
              <div class="sobre-highlight-text">
                <strong>Publicidade Eficiente</strong>
                <p>Alcance os consumidores tocantinenses com anúncios na Cidade FM. Fale com nossa equipe comercial</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

/* ── Cards (componentes reutilizáveis) ──────────────────────────── */
function cardNoticia(n, i) {
  return `
    <article class="noticia-card" onclick="location.hash='noticias/${n.slug}'">
      <div class="noticia-thumb">
        <img src="${svgThumb(n.id)}" alt="${n.titulo}" loading="lazy">
        <span class="noticia-categoria">${n.categoria}</span>
      </div>
      <div class="noticia-body">
        <div class="noticia-data">📅 ${formatData(n.data)}</div>
        <h3 class="noticia-titulo">${n.titulo}</h3>
        <p class="noticia-resumo">${n.resumo}</p>
      </div>
      <div class="noticia-footer">
        <span class="noticia-autor">${n.autor}</span>
        <span class="noticia-link">Leia mais →</span>
      </div>
    </article>
  `;
}

function cardLocutor(l, i, clickable = false) {
  return `
    <div class="locutor-card" ${clickable ? `onclick="location.hash='locutores/${l.slug}'"` : ''}>
      <div class="locutor-foto">
        <img src="${svgAvatar(getInitials(l.nome), l.id)}" alt="${l.nome}">
      </div>
      <div class="locutor-nome">${l.nome}</div>
      <div class="locutor-programa">${l.programa}</div>
      <div class="locutor-horario">${l.horario}</div>
    </div>
  `;
}

/* ── Inicialização ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  Player.init();
  Router.init();

  // Hamburger menu
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }
});
