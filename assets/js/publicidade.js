/**
 * PUBLICIDADE — Cidade FM 87,9
 * ─────────────────────────────────────────────────────────────
 * 3 formatos:
 *   1. SPOT DE SEÇÃO  — faixa horizontal entre seções da Home
 *   2. PATROCINADOR   — card de patrocinador na grade de programação
 *   3. BANNER CLIMA   — banner contextual no widget de tempo
 *
 * Para cadastrar um novo anunciante: edite os arrays abaixo.
 * Rotação automática a cada página carregada.
 * ─────────────────────────────────────────────────────────────
 */

/* ══════════════════════════════════════════════════════════
   DADOS DOS ANUNCIANTES
   ══════════════════════════════════════════════════════════ */

/**
 * SPOTS DE SEÇÃO
 * Aparecem entre seções da Home. Formato horizontal discreto.
 * Campos: empresa, slogan, cor (hex), link, telefone (opcional), icone (FA class)
 */
const SPOTS_SECAO = [
  {
    id: 1,
    empresa:  'Farmácia Popular Ananás',
    slogan:   'Medicamentos, perfumaria e conveniência. A mais completa de Ananás!',
    cor:      '#16A34A',
    link:     'https://wa.me/556300000001',
    telefone: '(63) 9 9000-0001',
    icone:    'fa-solid fa-kit-medical',
    ativo:    true,
  },
  {
    id: 2,
    empresa:  'Supermercado Bom Preço',
    slogan:   'As melhores ofertas da semana estão esperando por você!',
    cor:      '#D97706',
    link:     'https://wa.me/556300000002',
    telefone: '(63) 9 9000-0002',
    icone:    'fa-solid fa-cart-shopping',
    ativo:    true,
  },
  {
    id: 3,
    empresa:  'Clínica Saúde & Vida',
    slogan:   'Consultas médicas e exames. Agende agora pelo WhatsApp.',
    cor:      '#2563EB',
    link:     'https://wa.me/556300000003',
    telefone: '(63) 9 9000-0003',
    icone:    'fa-solid fa-stethoscope',
    ativo:    true,
  },
  {
    id: 4,
    empresa:  'Materiais de Construção Tocantins',
    slogan:   'Tudo para sua obra com os melhores preços da região!',
    cor:      '#B45309',
    link:     'https://wa.me/556300000004',
    telefone: '(63) 9 9000-0004',
    icone:    'fa-solid fa-hard-hat',
    ativo:    true,
  },
];

/**
 * PATROCINADORES DE PROGRAMA
 * Aparecem na grade de programação. Um por programa, rotacionado.
 * Campos: empresa, chamada curta, cor, link
 */
const PATROCINADORES_PROGRAMA = [
  {
    id: 1,
    empresa:  'Farmácia Popular',
    chamada:  'Apresentado por',
    cor:      '#16A34A',
    link:     'https://wa.me/556300000001',
    ativo:    true,
  },
  {
    id: 2,
    empresa:  'Bom Preço Supermercado',
    chamada:  'Com apoio de',
    cor:      '#D97706',
    link:     'https://wa.me/556300000002',
    ativo:    true,
  },
  {
    id: 3,
    empresa:  'Clínica Saúde & Vida',
    chamada:  'Apoiado por',
    cor:      '#2563EB',
    link:     'https://wa.me/556300000003',
    ativo:    true,
  },
  {
    id: 4,
    empresa:  'Materiais Tocantins',
    chamada:  'Patrocinado por',
    cor:      '#B45309',
    link:     'https://wa.me/556300000004',
    ativo:    true,
  },
];

/**
 * BANNERS DO WIDGET DE CLIMA
 * Aparecem dentro do card de temperatura — contexto perfeito.
 * Podem ter regras de temperatura para aparecer só quando relevante.
 * Campos: empresa, slogan, cor, link, tempMin, tempMax (null = sempre)
 */
const BANNERS_CLIMA = [
  {
    id: 1,
    empresa:  'Sorveteria Gelado Bom',
    slogan:   'Com esse calor, um sorvete cai muito bem! Venha nos visitar.',
    cor:      '#DB2777',
    link:     'https://wa.me/556300000005',
    icone:    'fa-solid fa-ice-cream',
    tempMin:  28,  // aparece só quando >= 28°C
    tempMax:  null,
    ativo:    true,
  },
  {
    id: 2,
    empresa:  'Ar Condicionado Frio Total',
    slogan:   'Instalação e manutenção de ar condicionado. Ligue agora!',
    cor:      '#0284C7',
    link:     'https://wa.me/556300000006',
    icone:    'fa-solid fa-snowflake',
    tempMin:  30,
    tempMax:  null,
    ativo:    true,
  },
  {
    id: 3,
    empresa:  'Guarda-Chuvas & Capas',
    slogan:   'Chuva chegando! Confira nossa linha de proteção.',
    cor:      '#4338CA',
    link:     'https://wa.me/556300000007',
    icone:    'fa-solid fa-umbrella',
    tempMin:  null,
    tempMax:  26,  // aparece só quando <= 26°C (dias mais frios/chuvosos)
    ativo:    true,
  },
  {
    id: 4,
    empresa:  'Farmácia Popular Ananás',
    slogan:   'Protetor solar, vitaminas e muito mais. Cuide-se!',
    cor:      '#16A34A',
    link:     'https://wa.me/556300000001',
    icone:    'fa-solid fa-sun',
    tempMin:  null,
    tempMax:  null,
    ativo:    true,
  },
];

/* ══════════════════════════════════════════════════════════
   ENGINE DE ROTAÇÃO
   ══════════════════════════════════════════════════════════ */

/** Retorna um item rotacionado com base em um índice de sessão */
function getAnuncio(lista, offsetExtra = 0) {
  const ativos = lista.filter(a => a.ativo);
  if (!ativos.length) return null;
  // Usa hora atual (minutos) + offset para variar entre chamadas na mesma página
  const idx = (Math.floor(Date.now() / 60000) + offsetExtra) % ativos.length;
  return ativos[idx];
}

/** Retorna banner de clima filtrado pela temperatura atual */
function getBannerClima(tempAtual) {
  const ativos = BANNERS_CLIMA.filter(b => {
    if (!b.ativo) return false;
    if (b.tempMin !== null && tempAtual < b.tempMin) return false;
    if (b.tempMax !== null && tempAtual > b.tempMax) return false;
    return true;
  });
  if (!ativos.length) return null;
  const idx = Math.floor(Date.now() / 60000) % ativos.length;
  return ativos[idx];
}

/* ══════════════════════════════════════════════════════════
   RENDERIZADORES
   ══════════════════════════════════════════════════════════ */

/**
 * FORMATO 1 — SPOT DE SEÇÃO
 * Faixa horizontal discreta entre seções.
 * Uso: inserir no HTML da renderHome() entre <section>s
 */
function renderSpotSecao(offsetExtra = 0) {
  const a = getAnuncio(SPOTS_SECAO, offsetExtra);
  if (!a) return '';
  return `
    <div class="pub-spot" style="--pub-cor:${a.cor}">
      <div class="container">
        <div class="pub-spot-inner">
          <div class="pub-spot-badge">
            <i class="${a.icone}"></i>
          </div>
          <div class="pub-spot-body">
            <strong class="pub-spot-empresa">${a.empresa}</strong>
            <span class="pub-spot-slogan">${a.slogan}</span>
          </div>
          <div class="pub-spot-actions">
            ${a.telefone ? `<span class="pub-spot-tel"><i class="fa-solid fa-phone"></i> ${a.telefone}</span>` : ''}
            <a href="${a.link}" target="_blank" rel="noopener" class="pub-spot-cta">
              Saiba mais <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
          <span class="pub-label-ad">Publi</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * FORMATO 2 — PATROCINADOR DE PROGRAMA
 * Card discreto abaixo de um item da grade de programação.
 * Uso: inserir dentro de um .prog-item ao renderizar a grade
 */
function renderPatrocinadorPrograma(progIdx = 0) {
  // Aparece apenas no 1º e 3º programa (índices 0 e 2) para não poluir
  if (progIdx !== 0 && progIdx !== 2) return '';
  const a = getAnuncio(PATROCINADORES_PROGRAMA, progIdx);
  if (!a) return '';
  return `
    <a href="${a.link}" target="_blank" rel="noopener" class="pub-patrocinador" style="--pub-cor:${a.cor}">
      <span class="pub-patrocinador-chamada">${a.chamada}</span>
      <span class="pub-patrocinador-empresa">${a.empresa}</span>
      <i class="fa-solid fa-arrow-up-right-from-square pub-patrocinador-icon"></i>
    </a>
  `;
}

/**
 * FORMATO 3 — BANNER CONTEXTUAL NO WIDGET DE CLIMA
 * Aparece dentro do widget de temperatura na Home.
 * Filtrado pela temperatura atual.
 */
function renderBannerClima(tempAtual) {
  const a = getBannerClima(tempAtual);
  if (!a) return '';
  return `
    <a href="${a.link}" target="_blank" rel="noopener" class="pub-banner-clima" style="--pub-cor:${a.cor}">
      <i class="${a.icone} pub-banner-clima-icon"></i>
      <div class="pub-banner-clima-body">
        <strong>${a.empresa}</strong>
        <span>${a.slogan}</span>
      </div>
      <span class="pub-label-ad">Publi</span>
    </a>
  `;
}
