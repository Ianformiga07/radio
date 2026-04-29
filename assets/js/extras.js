/**
 * EXTRAS — Cidade FM 87,9
 * Top 10 mais tocadas | Mural de Recados | Ouvinte do Mês | Tempo | Horóscopo
 * TODO (Admin): Substituir dados estáticos por chamadas à API do painel admin
 */

/* ══════════════════════════════════════════════════════════
   TOP 10 MAIS TOCADAS
   TODO (Admin): Alimentar via painel admin
   ══════════════════════════════════════════════════════════ */
const TOP10 = [
  { pos: 1,  artista: 'Jorge & Mateus',     musica: 'Mil Vezes',                 subidas: '+3' },
  { pos: 2,  artista: 'Gusttavo Lima',      musica: 'Bloqueado e Deletado',      subidas: '★'  },
  { pos: 3,  artista: 'Marília Mendonça',   musica: 'Supera',                    subidas: '-1' },
  { pos: 4,  artista: 'Wesley Safadão',     musica: 'Camarote',                  subidas: '+1' },
  { pos: 5,  artista: 'Zé Neto & Cristiano',musica: 'Largado às Traças',         subidas: '-2' },
  { pos: 6,  artista: 'Luan Santana',       musica: 'Acordando o Prédio',        subidas: '+2' },
  { pos: 7,  artista: 'Henrique & Juliano', musica: 'Cuida Bem Dela',            subidas: '='  },
  { pos: 8,  artista: 'Simone & Simaria',   musica: 'Regime Fechado',            subidas: '+1' },
  { pos: 9,  artista: 'Fernando & Sorocaba',musica: 'Saudade Que Mata',          subidas: '-1' },
  { pos: 10, artista: 'Xand Avião',         musica: 'Traiçoeiro',                subidas: 'NEW'}
];

/* ══════════════════════════════════════════════════════════
   MURAL DE RECADOS
   Mensagens ficam em localStorage (cliente) até admin limpar
   ══════════════════════════════════════════════════════════ */
const MURAL_INICIAIS = [
  { nome: 'Maria das Graças', cidade: 'Ananás', msg: 'Adoro a programação da Cidade FM! Parabéns a toda a equipe da ACA!', hora: '08:32' },
  { nome: 'João Paulo',       cidade: 'Ananás', msg: 'Pode tocar uma do Gusttavo Lima pro pessoal do Barreiro? Abraços!', hora: '09:15' },
  { nome: 'Ana Lucia',        cidade: 'Xambioá', msg: 'Ouvindo aqui de Xambioá, sinal perfeito! Continuem assim!', hora: '10:47' },
  { nome: 'Raimundo Farias',  cidade: 'Ananás', msg: 'Bom dia a toda a equipe! A rádio é demais!', hora: '11:20' },
];

function getMural() {
  try {
    const stored = localStorage.getItem('mural_recados');
    if (stored) return JSON.parse(stored);
  } catch(e) {}
  return [...MURAL_INICIAIS];
}

function saveMural(msgs) {
  try { localStorage.setItem('mural_recados', JSON.stringify(msgs)); } catch(e) {}
}

function adicionarRecado(nome, cidade, msg) {
  const msgs = getMural();
  const agora = new Date();
  const hora = agora.getHours().toString().padStart(2,'0') + ':' + agora.getMinutes().toString().padStart(2,'0');
  msgs.unshift({ nome, cidade, msg, hora });
  if (msgs.length > 20) msgs.pop();
  saveMural(msgs);
  return msgs;
}

/* ══════════════════════════════════════════════════════════
   OUVINTE DO MÊS
   TODO (Admin): Alimentar via painel admin
   ══════════════════════════════════════════════════════════ */
const OUVINTE_MES = {
  nome: 'Maria Aparecida Silva',
  cidade: 'Ananás – TO',
  foto_iniciais: 'MA',
  mensagem: '"Ouvir a Cidade FM faz parte do meu dia a dia! É a minha companhia no trabalho, no almoço e em casa. Parabéns à toda equipe da ACA!"',
  desde: 'Ouvinte desde 2010',
  mes: 'Ouvinte de Abril 2025'
};

/* ══════════════════════════════════════════════════════════
   TEMPO – ANANÁS/TO
   TODO (Dinâmico): Usar API OpenWeatherMap ou similar
   Coordenadas Ananás: -6.365, -48.072
   ══════════════════════════════════════════════════════════ */
const TEMPO_ANANAS = {
  cidade: 'Ananás – TO',
  temp: 34,
  sensacao: 38,
  condicao: 'Ensolarado',
  icon: '☀️',
  umidade: 62,
  vento: '14 km/h',
  previsao: [
    { dia: 'Seg', icon: '☀️', max: 35, min: 24 },
    { dia: 'Ter', icon: '🌤️', max: 33, min: 23 },
    { dia: 'Qua', icon: '⛅', max: 31, min: 22 },
    { dia: 'Qui', icon: '🌦️', max: 29, min: 22 },
    { dia: 'Sex', icon: '🌧️', max: 28, min: 21 },
  ]
};

/* ══════════════════════════════════════════════════════════
   HORÓSCOPO
   TODO (Admin): Alimentar via painel admin semanalmente
   ══════════════════════════════════════════════════════════ */
const HOROSCOPO = [
  { signo: 'Áries',       datas: '21/03 – 19/04', icon: '♈', emoji: '🐏', previsao: 'Semana de grandes oportunidades no trabalho. Confie na sua intuição e não deixe o medo te paralisar. No amor, surpresas positivas chegam!', nota: 8 },
  { signo: 'Touro',       datas: '20/04 – 20/05', icon: '♉', emoji: '🐂', previsao: 'Momento de cautela financeira. Evite gastos desnecessários. Relacionamentos pedem atenção e diálogo. Saúde em dia — mantenha a rotina!', nota: 7 },
  { signo: 'Gêmeos',      datas: '21/05 – 20/06', icon: '♊', emoji: '👯', previsao: 'Sua comunicação está afiada! Ótimo para negociações, reuniões e novos contatos. Amor pede sinceridade. Cuide do sono.', nota: 9 },
  { signo: 'Câncer',      datas: '21/06 – 22/07', icon: '♋', emoji: '🦀', previsao: 'Semana introspectiva. Aproveite para reorganizar as prioridades. A família merece atenção especial. Evite conflitos desnecessários.', nota: 7 },
  { signo: 'Leão',        datas: '23/07 – 22/08', icon: '♌', emoji: '🦁', previsao: 'Você brilha! Autoconfiança em alta para conquistar o que deseja. Projetos criativos decolam. No amor, romantismo em evidência.', nota: 9 },
  { signo: 'Virgem',      datas: '23/08 – 22/09', icon: '♍', emoji: '🌾', previsao: 'Atenção redobrada nos detalhes do trabalho. Reconhecimento chega para quem se dedicou. Saúde pede descanso e hidratação.', nota: 8 },
  { signo: 'Libra',       datas: '23/09 – 22/10', icon: '♎', emoji: '⚖️', previsao: 'Equilíbrio é a chave desta semana. Parcerias profissionais ganham força. No amor, momentos especiais com a pessoa amada.', nota: 8 },
  { signo: 'Escorpião',   datas: '23/10 – 21/11', icon: '♏', emoji: '🦂', previsao: 'Intuição poderosa! Confie no seu instinto nas decisões importantes. Transformações positivas se aproximam. Finança estável.', nota: 8 },
  { signo: 'Sagitário',   datas: '22/11 – 21/12', icon: '♐', emoji: '🏹', previsao: 'Aventura e otimismo marcam a semana! Viagens ou projetos novos ganham impulso. Amor despreocupado e alegre. Aproveite!', nota: 9 },
  { signo: 'Capricórnio', datas: '22/12 – 19/01', icon: '♑', emoji: '🐐', previsao: 'Semana produtiva e focada. Resultados do seu esforço aparecem. Cuidado com o excesso de seriedade — relaxe um pouco!', nota: 8 },
  { signo: 'Aquário',     datas: '20/01 – 18/02', icon: '♒', emoji: '🏺', previsao: 'Ideias inovadoras surgem! Networking em alta. Amizades trazem alegria e novidades. No amor, abertura para o novo.', nota: 9 },
  { signo: 'Peixes',      datas: '19/02 – 20/03', icon: '♓', emoji: '🐟', previsao: 'Semana de sensibilidade e criatividade elevadas. Arte, música e intuição guiam seu caminho. Cuide da saúde emocional.', nota: 7 },
];

/* ══════════════════════════════════════════════════════════
   CADASTRO OUVINTE DO MÊS
   Salvo em localStorage — TODO (Admin): Enviar para servidor
   ══════════════════════════════════════════════════════════ */
function cadastrarOuvinte(dados) {
  try {
    const lista = JSON.parse(localStorage.getItem('candidatos_ouvinte') || '[]');
    lista.push({ ...dados, data: new Date().toLocaleDateString('pt-BR') });
    localStorage.setItem('candidatos_ouvinte', JSON.stringify(lista));
    return true;
  } catch(e) { return false; }
}
