/* =====================================================================
   CONFIGURAÇÃO DO SITE — EDITE APENAS ESTE ARQUIVO
   ===================================================================== */

const CONFIG = {
  // ---- Dados do casal ----
  noiva: "Anna Beatriz",
  noivo: "Daniel",
  dataCasamento: "2026-12-12T18:00:00-03:00",    // formato AAAA-MM-DDTHH:MM:SS-03:00 (horário de Brasília)
  localCerimonia: "Igreja Evangélica Batista em Intermares — Cabedelo/PB",

  // ---- Fotos ----
  fotoCasal: "img/biaDan1.jpeg",  // foto redonda do topo (troque por uma foto dos noivos, ex.: img/casal.jpg)
  galeria: [                      // 3 fotos da seção "O Casal" (troque pelos arquivos reais na pasta img/)
    "img/biaDan1.jpeg",
    "img/biaDan2.jpeg",
    "img/biaDan3.jpeg",
  ],

  // ---- Textos (cada item da lista é um parágrafo) ----
  textoBoasVindas: [
    "<b>Criamos este site com muito carinho para compartilhar com vocês cada detalhe do nosso casamento.</b>",
    "Estamos muito felizes e com o coração grato por viver esse momento tão especial cercados de pessoas queridas.",
    "Logo após o casamento, daremos início a um grande sonho: estamos de mudança para estudarmos fora do Brasil! " +
    "Por conta disso, preparamos nossa lista de presentes de forma prática, com itens e lembranças simbólicas para quem desejar nos abençoar nessa nova fase de estudos e vida a dois.",
    "A presença de vocês é o nosso maior presente! Não deixem de <b>confirmar sua presença</b> para celebrarmos juntos esse grande dia.",
  ],
  textoCasal: [
    "Histórias de amor existem e, às vezes, nem nós mesmos acreditamos em todo o tempo que já estamos juntos.",
    "Mas o brilho dos nossos olhares nos faz lembrar o porquê de chegarmos até aqui sem sentir o tempo passar... Vamos nos casar!",
    "Estamos preparando tudo com muito carinho para celebrar cada momento com nossos amigos e familiares queridos!",
  ],
  textoCerimonia: [
    "Nossa <b>cerimônia e recepção</b> acontecerão no mesmo local. Contamos com a sua presença para celebrar esse momento tão especial!",
  ],
  // Endereço exibido no card e usado no mapa/rotas (pode ajustar se o pino não cair no lugar certo)
  enderecoCompleto: "Av. Mar Tirreno, 1000 — Intermares, Cabedelo/PB",
  enderecoMapa: "Igreja Evangélica Batista em Intermares, Av. Mar Tirreno, 1000, Intermares, Cabedelo - PB",

  // ---- Padrinhos (edite os nomes e coloque as fotos reais em img/) ----
  textoPadrinhos: [
    "<b>Aos nossos queridos padrinhos:</b>",
    "É uma emoção única e indescritível tê-los ao nosso lado e poder partilhar com vocês toda a felicidade dessa nova etapa em nossas vidas: nosso casamento! Por isso, desejamos tê-los como testemunhas do nosso sonho e do nosso amor!",
  ],
  padrinhos: [
    { nomes: "Euclécio", foto: "img/Padrinhos/Euclecio.jpeg" },
    { nomes: "Odete", foto: "img/Padrinhos/Odete.jpeg" },
    { nomes: "Everson", foto: "img/padrinho-placeholder.svg" },
    { nomes: "Lenir", foto: "img/Padrinhos/Lenir.jpeg" },
    { nomes: "Ana", foto: "img/Padrinhos/Ana.jpeg" },
    { nomes: "Eduardo e Nicolly", foto: "img/Padrinhos/Eduardo e Nicolly.jpeg" },
    { nomes: "Gabriel e Thais", foto: "img/Padrinhos/Gabriel e Thais.jpeg" },
    { nomes: "Samuel", foto: "img/Padrinhos/Samuel.jpeg" },
  ],

  // ---- Banco de dados e PagBank (Google Sheets + Apps Script) ----
  // O token do PagBank fica protegido nas Propriedades do script em db/Code.gs.
  apiUrl: "https://script.google.com/macros/s/AKfycbySG7Ea1dt1u4F9SO7txLmm9VADqdRPO8GuOWvfkzPrvTymkx3KGRL4lSxegIYAFpQ52A/exec",
};

/* =====================================================================
   LISTA DE PRESENTES
   - imagem: arquivo dentro da pasta img/ (ou um link https://...)
   - valor: preço total em reais
   - cotas: (opcional) divide o presente em N partes iguais;
            o convidado escolhe quantas cotas quer dar
   - categoria: "casa" ou "cozinha" (itens com cotas também aparecem no filtro "Cotas")
   ===================================================================== */

const PRESENTES = [
  // ---- Destaques variados / Sugestão dos noivos ----
  {
    id: "lua-de-mel",
    nome: "Lua de Mel",
    descricao: "Ajude os noivos com uma parte da nossa sonhada viagem de lua de mel em um chalé romântico e acolhedor.",
    imagem: "img/chale-aconchegante.jpg",
    valor: 3000,
    cotas: 6,
    categoria: "viagem",
  },
  {
    id: "panelas",
    nome: "Jogo de Panelas Antiaderentes (5 peças)",
    descricao: "Conjunto antiaderente completo para as primeiras receitas a dois.",
    imagem: "img/panelas.jpg",
    valor: 280,
    categoria: "cozinha",
  },
  {
    id: "geladeira",
    nome: "Geladeira Frost Free",
    descricao: "Ajude com uma parte da geladeira da nossa cozinha nova.",
    imagem: "img/geladeira.jpg",
    valor: 2500,
    cotas: 5,
    categoria: "cozinha",
  },
  {
    id: "jogo-cama-200",
    nome: "Jogo de Cama Casal (Percal 200 Fios)",
    descricao: "Lençóis macios em percal 200 fios para noites de sono tranquilas.",
    imagem: "img/jogo-cama.jpg",
    valor: 200,
    categoria: "casa",
  },
  {
    id: "airfryer",
    nome: "Fritadeira Elétrica (Air Fryer)",
    descricao: "Fritadeira sem óleo para refeições práticas e saudáveis no dia a dia.",
    imagem: "img/airfryer.jpg",
    valor: 480,
    categoria: "cozinha",
  },
  {
    id: "cafeteira",
    nome: "Cafeteira Elétrica",
    descricao: "Para começar todas as manhãs com aquele cafezinho fresco passado na hora.",
    imagem: "img/cafeteira.jpg",
    valor: 220,
    categoria: "cozinha",
  },
  {
    id: "smart-tv",
    nome: "Smart TV 50 polegadas",
    descricao: "Contribuição para nossa TV de 50 polegadas e muitas sessões de cinema a dois.",
    imagem: "img/smart-tv.jpg",
    valor: 1800,
    cotas: 4,
    categoria: "casa",
  },
  {
    id: "tacas",
    nome: "Jogo de Taças para Água/Vinho (6 peças)",
    descricao: "Conjunto elegante com 6 taças para brindar nossas conquistas.",
    imagem: "img/tacas.jpg",
    valor: 120,
    limite: 6,
    categoria: "cozinha",
  },
  {
    id: "toalhas",
    nome: "Jogo de Toalhas de Banho",
    descricao: "Toalhas macias e felpudas para o nosso banheiro.",
    imagem: "img/toalhas.jpg",
    valor: 140,
    limite: 6,
    categoria: "casa",
  },
  {
    id: "maquina-lavar",
    nome: "Máquina de Lavar Roupas",
    descricao: "Ajude com uma parte da lavadora para facilitar a nossa rotina.",
    imagem: "img/maquina-lavar.jpg",
    valor: 1600,
    cotas: 4,
    categoria: "casa",
  },
  {
    id: "fogao",
    nome: "Fogão 4 Bocas com Forno",
    descricao: "Fogão moderno para preparar receitas e momentos especiais na nossa nova cozinha.",
    imagem: "img/fogao.jpg",
    valor: 900,
    limite: 3,
    categoria: "cozinha",
  },
  {
    id: "ventilador",
    nome: "Ventilador de Coluna",
    descricao: "Ventilador potente e silencioso para garantir muito conforto e frescor em nossa casa.",
    imagem: "img/ventilador.jpg",
    valor: 220,
    limite: 6,
    categoria: "casa",
  },
  {
    id: "ventilador-giratorio",
    nome: "Ventilador Giratório",
    descricao: "Ventilador potente, silencioso e giratório para manter o ambiente sempre fresco.",
    imagem: "img/ventilador-giratorio.jpg",
    valor: 200,
    limite: 6,
    categoria: "casa",
  },
  {
    id: "jantar-20",
    nome: "Jogo de Pratos (20 peças)",
    descricao: "Conjunto de pratos de porcelana com 20 peças para o dia a dia e pequenos jantares.",
    imagem: "img/jantar.jpg",
    valor: 260,
    categoria: "cozinha",
  },
  {
    id: "liquidificador",
    nome: "Liquidificador",
    descricao: "Potente e prático para sucos, vitaminas e receitas rápidas.",
    imagem: "img/liquidificador.jpg",
    valor: 150,
    limite: 6,
    categoria: "cozinha",
  },
  {
    id: "sofa",
    nome: "Sofá Retrátil",
    descricao: "Contribuição para o sofá confortável que vai acolher vocês quando forem nos visitar.",
    imagem: "img/sofa.jpg",
    valor: 2000,
    cotas: 5,
    categoria: "casa",
  },
  {
    id: "faqueiro",
    nome: "Faqueiro em Aço Inox (42 peças)",
    descricao: "Conjunto completo em aço inox para deixar a mesa posta ainda mais bonita.",
    imagem: "img/faqueiro.jpg",
    valor: 240,
    categoria: "cozinha",
  },
  {
    id: "aspirador",
    nome: "Aspirador de Pó Vertical",
    descricao: "Leve e prático para manter cada cantinho da casa sempre limpo.",
    imagem: "img/aspirador.jpg",
    valor: 390,
    categoria: "casa",
  },
  {
    id: "colchao-queen",
    nome: "Colchão Queen Size",
    descricao: "Ajude com uma parte para garantir o descanso e conforto do casal.",
    imagem: "img/colchao.jpg",
    valor: 1800,
    cotas: 3,
    categoria: "casa",
  },
  {
    id: "batedeira",
    nome: "Batedeira Planetária",
    descricao: "Ideal para preparar bolos, pães e sobremesas especiais.",
    imagem: "img/batedeira.jpg",
    valor: 520,
    categoria: "cozinha",
  },
  {
    id: "assadeiras",
    nome: "Conjunto de Assadeiras de Vidro",
    descricao: "Travessas refratárias versáteis que vão direto do forno para a mesa.",
    imagem: "img/assadeiras.jpg",
    valor: 110,
    limite: 6,
    categoria: "cozinha",
  },
  {
    id: "microondas",
    nome: "Micro-ondas 20L",
    descricao: "Praticidade indispensável para aquecer e preparar refeições rapidinho.",
    imagem: "img/microondas.jpg",
    valor: 580,
    categoria: "cozinha",
  },
  {
    id: "sanduicheira",
    nome: "Sanduicheira/Grill",
    descricao: "Para lanches quentinhos e grelhados rápidos no café ou jantar.",
    imagem: "img/sanduicheira.jpg",
    valor: 130,
    limite: 6,
    categoria: "cozinha",
  },
  {
    id: "jogo-cama-400",
    nome: "Jogo de Cama Casal (400 Fios)",
    descricao: "Toque acetinado de 400 fios para ocasiões ainda mais aconchegantes.",
    imagem: "img/jogo-cama-400.jpg",
    valor: 360,
    categoria: "casa",
  },
  {
    id: "panela-pressao",
    nome: "Panela de Pressão Elétrica",
    descricao: "Segura, silenciosa e programável para cozinhar sem preocupações.",
    imagem: "img/panela-pressao.jpg",
    valor: 420,
    categoria: "cozinha",
  },
  {
    id: "mixer",
    nome: "Mixer de Mão com Processador",
    descricao: "Multifuncional e compacto para molhos, cremes e temperos.",
    imagem: "img/mixer.jpg",
    valor: 210,
    categoria: "cozinha",
  },
  {
    id: "ferro-passar",
    nome: "Ferro de Passar a Vapor",
    descricao: "Para deixar as roupas sempre alinhadas com rapidez e facilidade.",
    imagem: "img/ferro-passar.jpg",
    valor: 180,
    categoria: "casa",
  },
  {
    id: "jantar-42",
    nome: "Jogo de Pratos Completo (42 peças)",
    descricao: "Conjunto completo de pratos de porcelana para receber toda a família e os amigos.",
    imagem: "img/jantar-completo.jpg",
    valor: 460,
    categoria: "cozinha",
  },
  {
    id: "manta",
    nome: "Manta/Cobertor de Microfibra",
    descricao: "Macia e quentinha para acompanhar nossas noites de descanso e filmes.",
    imagem: "img/manta.jpg",
    valor: 170,
    categoria: "casa",
  },
  {
    id: "sobremesa",
    nome: "Jogo de Sobremesa (Tigelas e taças)",
    descricao: "Conjunto delicado para servir doces, frutas e sorvetes.",
    imagem: "img/sobremesa.jpg",
    valor: 95,
    limite: 6,
    categoria: "cozinha",
  },
  {
    id: "utensilios-silicone",
    nome: "Conjunto de Utensílios de Silicone para Cozinha",
    descricao: "Kit com espátulas, concha e pegadores que protegem as panelas.",
    imagem: "img/utensilios-silicone.jpg",
    valor: 90,
    limite: 6,
    categoria: "cozinha",
  },
  {
    id: "tabua-frios",
    nome: "Tábua de Frios em Bambu",
    descricao: "Charme e praticidade para servir petiscos e receber visitas.",
    imagem: "img/tabua-frios.jpg",
    valor: 85,
    limite: 6,
    categoria: "cozinha",
  },
];

