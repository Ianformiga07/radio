/**
 * PROGRAMAÇÃO - Dados Mock
 * ──────────────────────────────────────────────────────────────────
 * TODO (PHP): Substituir este array por uma chamada fetch() à API:
 *   fetch('/api/programacao.php')
 *     .then(r => r.json())
 *     .then(data => renderProgramacao(data))
 * ──────────────────────────────────────────────────────────────────
 */
const PROGRAMACAO = [
  {
    dia: "Segunda",
    slug: "segunda",
    programas: [
      { id: 1, hora: "06:00", fim: "09:00", nome: "Cidade Manhã",      locutor: "Carlos Henrique", ao_vivo: true  },
      { id: 2, hora: "09:00", fim: "12:00", nome: "Hit's do Dia",       locutor: "Fernanda Lima",   ao_vivo: false },
      { id: 3, hora: "12:00", fim: "14:00", nome: "Almoço Total",       locutor: "Rafael Torres",   ao_vivo: true  },
      { id: 4, hora: "14:00", fim: "18:00", nome: "Tarde Animada",      locutor: "Ana Paula",       ao_vivo: false },
      { id: 5, hora: "18:00", fim: "21:00", nome: "Cidade Prime",       locutor: "Carlos Henrique", ao_vivo: true  },
      { id: 6, hora: "21:00", fim: "00:00", nome: "Noite na Cidade",    locutor: "DJ Marcos",       ao_vivo: false }
    ]
  },
  {
    dia: "Terça",
    slug: "terca",
    programas: [
      { id: 7,  hora: "06:00", fim: "09:00", nome: "Cidade Manhã",      locutor: "Carlos Henrique", ao_vivo: true  },
      { id: 8,  hora: "09:00", fim: "12:00", nome: "Hit's do Dia",       locutor: "Fernanda Lima",   ao_vivo: false },
      { id: 9,  hora: "12:00", fim: "14:00", nome: "Almoço Total",       locutor: "Rafael Torres",   ao_vivo: true  },
      { id: 10, hora: "14:00", fim: "18:00", nome: "Tarde Animada",      locutor: "Ana Paula",       ao_vivo: false },
      { id: 11, hora: "18:00", fim: "21:00", nome: "Cidade Prime",       locutor: "Carlos Henrique", ao_vivo: true  },
      { id: 12, hora: "21:00", fim: "00:00", nome: "Noite na Cidade",    locutor: "DJ Marcos",       ao_vivo: false }
    ]
  },
  {
    dia: "Quarta",
    slug: "quarta",
    programas: [
      { id: 13, hora: "06:00", fim: "09:00", nome: "Cidade Manhã",      locutor: "Carlos Henrique", ao_vivo: true  },
      { id: 14, hora: "09:00", fim: "12:00", nome: "Hit's do Dia",       locutor: "Fernanda Lima",   ao_vivo: false },
      { id: 15, hora: "12:00", fim: "14:00", nome: "Almoço Total",       locutor: "Rafael Torres",   ao_vivo: true  },
      { id: 16, hora: "14:00", fim: "18:00", nome: "Tarde Animada",      locutor: "Ana Paula",       ao_vivo: false },
      { id: 17, hora: "18:00", fim: "21:00", nome: "Cidade Prime",       locutor: "Carlos Henrique", ao_vivo: true  },
      { id: 18, hora: "21:00", fim: "00:00", nome: "Noite na Cidade",    locutor: "DJ Marcos",       ao_vivo: false }
    ]
  },
  {
    dia: "Quinta",
    slug: "quinta",
    programas: [
      { id: 19, hora: "06:00", fim: "09:00", nome: "Cidade Manhã",      locutor: "Carlos Henrique", ao_vivo: true  },
      { id: 20, hora: "09:00", fim: "12:00", nome: "Hit's do Dia",       locutor: "Fernanda Lima",   ao_vivo: false },
      { id: 21, hora: "12:00", fim: "14:00", nome: "Almoço Total",       locutor: "Rafael Torres",   ao_vivo: true  },
      { id: 22, hora: "14:00", fim: "18:00", nome: "Tarde Animada",      locutor: "Ana Paula",       ao_vivo: false },
      { id: 23, hora: "18:00", fim: "21:00", nome: "Cidade Prime",       locutor: "Carlos Henrique", ao_vivo: true  },
      { id: 24, hora: "21:00", fim: "00:00", nome: "Noite na Cidade",    locutor: "DJ Marcos",       ao_vivo: false }
    ]
  },
  {
    dia: "Sexta",
    slug: "sexta",
    programas: [
      { id: 25, hora: "06:00", fim: "09:00", nome: "Cidade Manhã",      locutor: "Carlos Henrique", ao_vivo: true  },
      { id: 26, hora: "09:00", fim: "12:00", nome: "Hit's do Dia",       locutor: "Fernanda Lima",   ao_vivo: false },
      { id: 27, hora: "12:00", fim: "14:00", nome: "Almoço Total",       locutor: "Rafael Torres",   ao_vivo: true  },
      { id: 28, hora: "14:00", fim: "18:00", nome: "Sexta Animada",      locutor: "Ana Paula",       ao_vivo: true  },
      { id: 29, hora: "18:00", fim: "21:00", nome: "Cidade Prime",       locutor: "Carlos Henrique", ao_vivo: true  },
      { id: 30, hora: "21:00", fim: "00:00", nome: "Virada de Semana",   locutor: "DJ Marcos",       ao_vivo: true  }
    ]
  },
  {
    dia: "Sábado",
    slug: "sabado",
    programas: [
      { id: 31, hora: "08:00", fim: "12:00", nome: "Sábado Total",       locutor: "Rafael Torres",   ao_vivo: true  },
      { id: 32, hora: "12:00", fim: "16:00", nome: "Especial Sertanejo", locutor: "Ana Paula",       ao_vivo: false },
      { id: 33, hora: "16:00", fim: "20:00", nome: "Top 40",             locutor: "Fernanda Lima",   ao_vivo: false },
      { id: 34, hora: "20:00", fim: "00:00", nome: "Sábado Night",       locutor: "DJ Marcos",       ao_vivo: true  }
    ]
  },
  {
    dia: "Domingo",
    slug: "domingo",
    programas: [
      { id: 35, hora: "08:00", fim: "12:00", nome: "Domingo Bom",        locutor: "Carlos Henrique", ao_vivo: true  },
      { id: 36, hora: "12:00", fim: "16:00", nome: "Família na Cidade",  locutor: "Ana Paula",       ao_vivo: false },
      { id: 37, hora: "16:00", fim: "20:00", nome: "Flashback Especial", locutor: "Fernanda Lima",   ao_vivo: false },
      { id: 38, hora: "20:00", fim: "00:00", nome: "Noite Romântica",    locutor: "Rafael Torres",   ao_vivo: false }
    ]
  }
];

/**
 * Retorna o programa em exibição no momento atual.
 * TODO (PHP): /api/programa-atual.php
 */
function getProgramaAtual() {
  const agora = new Date();
  const diaIdx = agora.getDay(); // 0=Dom, 1=Seg...
  const ordem = [6, 0, 1, 2, 3, 4, 5]; // mapeia getDay() para PROGRAMACAO[]
  const diaData = PROGRAMACAO[ordem[diaIdx]];
  const hhmm = agora.getHours() * 60 + agora.getMinutes();

  if (!diaData) return null;
  return diaData.programas.find(p => {
    const [sh, sm] = p.hora.split(':').map(Number);
    const [eh, em] = p.fim.split(':').map(Number);
    const start = sh * 60 + sm;
    const end   = eh * 60 + em || 24 * 60;
    return hhmm >= start && hhmm < end;
  }) || diaData.programas[0];
}
