/**
 * NOTÍCIAS - Dados Mock
 * ──────────────────────────────────────────────────────────────────
 * TODO (PHP): Substituir por fetch('/api/noticias.php?limit=10')
 * Para notícia individual: fetch('/api/noticias.php?id='+id)
 * ──────────────────────────────────────────────────────────────────
 */
const NOTICIAS = [
  {
    id: 1,
    titulo: "Cidade FM 87,9 celebra 20 anos de história em Palmas",
    slug: "cidade-fm-20-anos",
    categoria: "Institucional",
    data: "2025-01-15",
    autor: "Redação Cidade FM",
    resumo: "A emissora que nasceu com Palmas completa duas décadas levando informação, entretenimento e música de qualidade para toda a região norte do Tocantins.",
    conteudo: `
      <p>A Rádio Cidade FM 87,9 completa 20 anos de história em Palmas com muito a celebrar. Desde sua fundação, a emissora se consolidou como uma das principais referências em comunicação radiofônica no Tocantins.</p>
      <p>Durante essas duas décadas, a Cidade FM acompanhou o crescimento de Palmas, esteve presente nos momentos mais importantes da cidade e sempre levou informação de qualidade para seus ouvintes.</p>
      <p>Para comemorar a data, a emissora prepara uma programação especial com transmissões ao vivo, sorteios e muito mais. Fique ligado!</p>
    `,
    imagem: "assets/img/noticia-1.svg",
    destaque: true
  },
  {
    id: 2,
    titulo: "Nova temporada do 'Cidade Prime' começa com entrevistas exclusivas",
    slug: "cidade-prime-nova-temporada",
    categoria: "Programação",
    data: "2025-01-12",
    autor: "Carlos Henrique",
    resumo: "O programa vespertino mais ouvido de Palmas renova o formato e traz personalidades locais e nacionais para bate-papos exclusivos ao vivo.",
    conteudo: `
      <p>O Cidade Prime, um dos programas mais tradicionais da Rádio Cidade FM 87,9, inicia nova temporada com um formato renovado e ainda mais conteúdo para os ouvintes.</p>
      <p>A partir desta semana, o programa das 18h às 21h passa a contar com entrevistas exclusivas com artistas, políticos e personalidades do cenário local e nacional.</p>
    `,
    imagem: "assets/img/noticia-2.svg",
    destaque: true
  },
  {
    id: 3,
    titulo: "Rádio Cidade FM lança aplicativo para ouvir ao vivo em todo o Brasil",
    slug: "app-cidade-fm",
    categoria: "Tecnologia",
    data: "2025-01-08",
    autor: "Redação Cidade FM",
    resumo: "Agora você pode ouvir a Cidade FM 87,9 de qualquer lugar do país através do novo aplicativo disponível para Android e iOS.",
    conteudo: `
      <p>A Rádio Cidade FM 87,9 deu mais um passo na modernização de seus serviços com o lançamento do aplicativo oficial para smartphones.</p>
      <p>O app permite ouvir a transmissão ao vivo, acompanhar a programação da semana, receber notificações de programas especiais e interagir com os locutores.</p>
    `,
    imagem: "assets/img/noticia-3.svg",
    destaque: false
  },
  {
    id: 4,
    titulo: "Show ao vivo no estúdio: Ana Paula recebe banda local no Tarde Animada",
    slug: "show-ao-vivo-tarde-animada",
    categoria: "Programação",
    data: "2025-01-05",
    autor: "Ana Paula",
    resumo: "Quinta-feira vai ter show ao vivo no estúdio da Cidade FM! A locutora Ana Paula recebe uma das bandas mais queridas do Tocantins para uma apresentação especial.",
    conteudo: `
      <p>O Tarde Animada desta quinta-feira vai ser diferente! A locutora Ana Paula recebe no estúdio da Cidade FM 87,9 uma das bandas mais queridas do cenário musical tocantinense.</p>
      <p>A apresentação será transmitida ao vivo pela rádio e também pelas redes sociais da emissora a partir das 15h.</p>
    `,
    imagem: "assets/img/noticia-4.svg",
    destaque: false
  },
  {
    id: 5,
    titulo: "Promoção Cidade FM: ganhe ingressos para o maior show do verão em Palmas",
    slug: "promocao-ingressos-show",
    categoria: "Promoção",
    data: "2025-01-02",
    autor: "Redação Cidade FM",
    resumo: "Participe da nossa promoção e concorra a ingressos duplos para o show mais esperado do verão palmense. Regulamento completo no site.",
    conteudo: `
      <p>A Rádio Cidade FM 87,9 está dando ingressos para o maior show do verão em Palmas! Para participar, basta ouvir a rádio e aguardar a senha do dia.</p>
      <p>Quando o locutor anunciar a senha, ligue imediatamente para o nosso telefone e seja um dos ganhadores. São 10 pares de ingressos a serem sorteados ao longo da semana.</p>
    `,
    imagem: "assets/img/noticia-5.svg",
    destaque: false
  },
  {
    id: 6,
    titulo: "DJ Marcos lança playlist exclusiva do Sábado Night no Spotify",
    slug: "playlist-sabado-night-spotify",
    categoria: "Música",
    data: "2024-12-28",
    autor: "DJ Marcos",
    resumo: "O DJ da Cidade FM disponibilizou no Spotify a seleção completa das músicas que tocam no Sábado Night. Mais de 3 horas de puro dance e eletrônico.",
    conteudo: `
      <p>O DJ Marcos acaba de lançar no Spotify a playlist oficial do Sábado Night, o programa mais energético da Cidade FM 87,9.</p>
      <p>A seleção conta com mais de 3 horas de músicas eletrônicas, dance e pop que são tocadas toda semana no programa das 20h às 00h aos sábados.</p>
    `,
    imagem: "assets/img/noticia-6.svg",
    destaque: false
  }
];

/**
 * Retorna notícias por página (paginação preparada para API)
 * TODO (PHP): fetch('/api/noticias.php?page='+page+'&limit='+limit)
 */
function getNoticiasPaginadas(page = 1, limit = 6) {
  const start = (page - 1) * limit;
  return NOTICIAS.slice(start, start + limit);
}

/**
 * Retorna notícia por slug
 * TODO (PHP): fetch('/api/noticias.php?slug='+slug)
 */
function getNoticiaPorSlug(slug) {
  return NOTICIAS.find(n => n.slug === slug) || null;
}
