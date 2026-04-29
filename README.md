# Rádio Cidade FM 87,9 — Site Institucional

Site moderno desenvolvido com HTML5, CSS3 e JavaScript puro.  
Estrutura preparada para integração futura com PHP + MySQL.

---

## 📁 Estrutura de Arquivos

```
radio-cidade/
├── index.html                  ← SPA principal
├── assets/
│   ├── css/
│   │   └── main.css            ← Todos os estilos (variáveis, layout, componentes)
│   ├── js/
│   │   ├── programacao.js      ← Dados mock da grade (→ substituir por API PHP)
│   │   ├── locutores.js        ← Dados mock dos locutores (→ substituir por API PHP)
│   │   ├── noticias.js         ← Dados mock das notícias (→ substituir por API PHP)
│   │   └── app.js              ← Router SPA, Player, renderizadores de páginas
│   └── img/                    ← Imagens (adicionar aqui)
└── README.md
```

---

## ⚙️ Configuração Rápida

1. Abra `assets/js/app.js`
2. Edite o objeto `CONFIG` no topo do arquivo:

```js
const CONFIG = {
  streamUrl: 'https://SUA_URL_DE_STREAM_AQUI',  // ← URL do stream Icecast/Shoutcast/Zeno
  whatsapp: '556399999999',                       // ← DDD + número sem espaços
  instagram: 'https://instagram.com/seu_perfil',
  facebook:  'https://facebook.com/sua_pagina',
};
```

---

## 🔌 Integração Futura com PHP + MySQL

Cada arquivo de dados mock indica onde fazer a troca:

### programacao.js
```js
// ANTES (mock):
const PROGRAMACAO = [ ... ];

// DEPOIS (PHP):
fetch('/api/programacao.php')
  .then(r => r.json())
  .then(data => { window.PROGRAMACAO = data; renderProgramacao(); });
```

### locutores.js
```js
fetch('/api/locutores.php').then(r => r.json()).then(data => window.LOCUTORES = data);
```

### noticias.js
```js
fetch('/api/noticias.php?page=1&limit=6').then(r => r.json()).then(data => window.NOTICIAS = data);
```

### Formulário de contato (app.js → handleContato)
```js
// ANTES (mock):
showToast('Mensagem enviada!');

// DEPOIS (PHP):
fetch('/api/contato.php', { method: 'POST', body: new FormData(e.target) })
  .then(r => r.json())
  .then(res => showToast(res.message));
```

### Now Playing (player em tempo real)
```js
// Polling a cada 30s:
setInterval(() => {
  fetch('/api/now-playing.php')
    .then(r => r.json())
    .then(d => { document.getElementById('player-track').textContent = d.track; });
}, 30000);
```

---

## 🎨 Personalização Visual

Todas as cores estão em variáveis CSS em `assets/css/main.css`:

```css
:root {
  --vermelho:      #E8001D;   /* Cor primária */
  --vermelho-dark: #B0001A;   /* Hover */
  --preto:         #0A0A0A;   /* Background principal */
  --branco:        #FFFFFF;
}
```

---

## 📻 URLs de Stream compatíveis

- **Zeno.fm**: `https://stream.zeno.fm/SEU_ID`
- **Icecast**: `http://SEU_HOST:PORT/stream`
- **Shoutcast**: `http://SEU_HOST:PORT/;stream.mp3`
- **Radionomy / StreamAMG**: consultar painel do provedor

---

## 🌐 Deploy

O site é 100% estático. Pode ser hospedado em:
- Qualquer hospedagem compartilhada (Hostgator, Locaweb, etc.)
- GitHub Pages
- Netlify / Vercel (arrastar a pasta)

Para o PHP futuro, usar hospedagem com suporte a PHP 8+ e MySQL 8+.

---

## ✅ Checklist antes de ir ao ar

- [ ] Alterar `streamUrl` no CONFIG
- [ ] Alterar número do WhatsApp
- [ ] Atualizar redes sociais
- [ ] Adicionar logo real em `assets/img/`
- [ ] Atualizar dados dos locutores em `locutores.js`
- [ ] Atualizar programação em `programacao.js`
- [ ] Testar em mobile (Chrome DevTools)
- [ ] Configurar HTTPS no domínio (obrigatório para áudio autoplay)
