/* =====================================================================
   Lógica do site (não precisa editar — use config.js)
   ===================================================================== */
(() => {
  const $ = (id) => document.getElementById(id);
  const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const CATS = { casa: "Casa", cozinha: "Cozinha" };
  const fuso = { timeZone: "America/Recife" };

  /* ---------- Cabeçalho, fotos e textos ---------- */
  const data = new Date(CONFIG.dataCasamento);
  const diaLongo = data
    .toLocaleDateString("pt-BR", { ...fuso, day: "2-digit", month: "long", year: "numeric" })
    .replace(/\bde ([a-zç])/g, (_, l) => "de " + l.toUpperCase());
  const hora = data
    .toLocaleTimeString("pt-BR", { ...fuso, hour: "2-digit", minute: "2-digit" })
    .replace(":00", "h")
    .replace(":", "h");

  $("nomeNoiva").textContent = CONFIG.noiva;
  $("nomeNoivo").textContent = CONFIG.noivo;
  $("topLogo").textContent = `${CONFIG.noiva[0]} & ${CONFIG.noivo[0]}`;
  $("rodapeNomes").textContent = `${CONFIG.noiva} & ${CONFIG.noivo}`;
  $("dataTexto").textContent = `${diaLongo} · ${hora}`;
  $("rodapeData").textContent = `${diaLongo} · ${hora} · ${CONFIG.localCerimonia}`;
  document.title = `${CONFIG.noiva} & ${CONFIG.noivo} — Casamento`;

  $("fotoCasal").src = CONFIG.fotoCasal || "img/hero.jpg";

  const renderParagrafos = (el, lista) => {
    el.innerHTML = (lista || []).map((t) => `<p>${t}</p>`).join("");
  };
  renderParagrafos($("textoBoasVindas"), CONFIG.textoBoasVindas);
  renderParagrafos($("textoCasal"), CONFIG.textoCasal);
  renderParagrafos($("textoPadrinhos"), CONFIG.textoPadrinhos);
  renderParagrafos($("textoCerimonia"), CONFIG.textoCerimonia);

  /* Galeria de fotos (O Casal) */
  if (CONFIG.galeria && CONFIG.galeria.length) {
    $("galeria").innerHTML = CONFIG.galeria
      .map(
        (src) =>
          `<img src="${src || "img/foto-placeholder.svg"}" alt="Foto do casal" loading="lazy" onerror="this.src='img/foto-placeholder.svg'" />`
      )
      .join("");
  } else {
    $("galeria").classList.add("oculto");
  }

  /* Padrinhos */
  if (CONFIG.padrinhos && CONFIG.padrinhos.length) {
    $("listaPadrinhos").innerHTML = CONFIG.padrinhos
      .map(
        (p) =>
          `<div class="padrinho"><img src="${p.foto || "img/padrinho-placeholder.svg"}" alt="${p.nomes}" loading="lazy" onerror="this.src='img/padrinho-placeholder.svg'" /><p>${p.nomes}</p></div>`
      )
      .join("");
  }

  /* Cerimônia, Recepção e Mapa */
  const localNome = CONFIG.localCerimonia.split("—")[0].trim() || "Local da cerimônia";
  const enderecoTxt = CONFIG.enderecoCompleto || CONFIG.enderecoMapa || CONFIG.localCerimonia;
  const qMapa = encodeURIComponent(CONFIG.enderecoMapa || enderecoTxt);
  const urlMaps = `https://www.google.com/maps/dir/?api=1&destination=${qMapa}`;
  $("cerimoniaData").textContent = `${diaLongo} · ${hora}`;
  $("cerimoniaLocal").textContent = localNome;
  $("cerimoniaEndereco").textContent = enderecoTxt;
  $("mapa").src = `https://maps.google.com/maps?q=${qMapa}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  $("mapaOverlay").href = urlMaps;
  $("btnComoChegar").href = urlMaps;
  $("btnWaze").href = `https://waze.com/ul?q=${qMapa}&navigate=yes`;

  /* Contagem regressiva (Efeito Folha de Papel 3D / Flip Card) */
  function criarVirador(cardId) {
    const card = $(cardId);
    if (!card) return () => {};
    const topNum = card.querySelector(".flip-top .flip-num");
    const bottomNum = card.querySelector(".flip-bottom .flip-num");
    const leaf = card.querySelector(".flip-leaf");
    const frontNum = card.querySelector(".flip-leaf-front .flip-num");
    const backNum = card.querySelector(".flip-leaf-back .flip-num");

    let valorAtual = null;

    return function atualizar(novoValor, forcar) {
      const str = String(novoValor).padStart(2, "0");
      if (str.length > 2) {
        card.setAttribute("data-digits", "3");
      } else {
        card.removeAttribute("data-digits");
      }

      if (valorAtual === null || forcar) {
        valorAtual = str;
        topNum.textContent = str;
        bottomNum.textContent = str;
        frontNum.textContent = str;
        backNum.textContent = str;
        return;
      }

      if (valorAtual === str) return;

      const valorAntigo = valorAtual;
      valorAtual = str;

      topNum.textContent = str;
      bottomNum.textContent = valorAntigo;
      frontNum.textContent = valorAntigo;
      backNum.textContent = str;

      card.classList.remove("virando");
      void card.offsetWidth; // Força reflow para reiniciar animação CSS suave
      card.classList.add("virando");

      const onEnd = () => {
        card.classList.remove("virando");
        bottomNum.textContent = str;
        frontNum.textContent = str;
        leaf.removeEventListener("animationend", onEnd);
      };
      leaf.addEventListener("animationend", onEnd, { once: true });
    };
  }

  const virarDias = criarVirador("flipDias");
  const virarHoras = criarVirador("flipHoras");
  const virarMin = criarVirador("flipMin");
  const virarSeg = criarVirador("flipSeg");

  function contagem(forcar) {
    let diff = Math.max(0, data - new Date());
    const d = Math.floor(diff / 864e5); diff -= d * 864e5;
    const h = Math.floor(diff / 36e5); diff -= h * 36e5;
    const m = Math.floor(diff / 6e4); diff -= m * 6e4;
    const s = Math.floor(diff / 1e3);

    virarDias(d, forcar);
    virarHoras(h, forcar);
    virarMin(m, forcar);
    virarSeg(s, forcar);
  }

  contagem(true);
  setInterval(() => contagem(false), 1000);

  /* Barra fixa ao rolar + menu mobile */
  window.addEventListener("scroll", () => {
    $("topbar").classList.toggle("visivel", window.scrollY > 360);
  });
  $("menuToggle").addEventListener("click", () => $("menu").classList.toggle("aberto"));
  $("menu").querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => $("menu").classList.remove("aberto"))
  );

  /* ---------- Lista de Presentes e Carrinho ---------- */
  let filtro = "todos";
  let ordem = "padrao";
  let cotasInfo = {}; // { [id]: { total, recebidas, restantes } }
  const carrinho = []; // { id, nome, imagem, unitario, qtd, max }

  const LIMITE_ITEM_SEM_COTA = 3;
  const valorUnitario = (p) => (p.cotas > 1 ? Math.round((p.valor / p.cotas) * 100) / 100 : p.valor);
  const limiteItem = (p) => (p.cotas > 1 ? p.cotas : p.limite || LIMITE_ITEM_SEM_COTA);
  const cotasRestantes = (p) => {
    const padrao = limiteItem(p);
    return cotasInfo[p.id] ? cotasInfo[p.id].restantes : padrao;
  };

  async function enviarParaPlanilha(payload) {
    if (!CONFIG.apiUrl) return { ok: true, local: true };
    const resp = await fetch(CONFIG.apiUrl, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return resp.json();
  }

  async function carregarCotas() {
    if (!CONFIG.apiUrl) return;
    try {
      const resp = await fetch(CONFIG.apiUrl);
      const data = await resp.json();
      if (data && data.ok && data.cotas) {
        cotasInfo = data.cotas;
        renderLista();
      }
    } catch {
      // Mantém valores padrão do config.js se estiver offline
    }
  }

  function renderLista() {
    let lista = PRESENTES.filter((p) =>
      filtro === "todos"
        ? true
        : filtro === "cotas"
          ? p.cotas > 1
          : p.categoria === filtro
    );
    if (ordem === "az") lista = [...lista].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    if (ordem === "menor") lista = [...lista].sort((a, b) => valorUnitario(a) - valorUnitario(b));
    if (ordem === "maior") lista = [...lista].sort((a, b) => valorUnitario(b) - valorUnitario(a));

    const grade = $("grade");
    grade.innerHTML = "";
    lista.forEach((p) => {
      const cota = p.cotas > 1;
      const restantes = cotasRestantes(p);
      const esgotado = restantes <= 0;
      const unit = valorUnitario(p);
      const noCarrinho = carrinho.find((it) => it.id === p.id);
      const badgeCota = esgotado
        ? `<span class="badge badge-esgotado">${cota ? "Cotas esgotadas" : "Esgotado"}</span>`
        : cota
          ? `<span class="badge badge-cota">${cotasInfo[p.id] ? `Restam ${restantes} de ${p.cotas}` : `Cota 1 de ${p.cotas}`}</span>`
          : "";
      const btnTexto = esgotado
        ? cota
          ? "Cotas esgotadas"
          : "Esgotado"
        : noCarrinho
          ? `No carrinho (${noCarrinho.qtd}) · +1`
          : "Presentear";
      const card = document.createElement("article");
      card.className = `card${esgotado ? " esgotado" : ""}`;
      card.innerHTML = `
        <div class="card-img">
          <img src="${p.imagem}" alt="${p.nome}" loading="lazy" onerror="this.src='img/foto-placeholder.svg'" />
          <span class="badge">${CATS[p.categoria] || ""}</span>
          ${badgeCota}
        </div>
        <h3>${p.nome}</h3>
        <p class="card-desc">${p.descricao}</p>
        <div class="preco">
          ${brl(unit)}
          ${cota ? `<small>por cota · ${p.cotas} cotas (total ${brl(p.valor)})</small>` : ""}
        </div>
        <button class="btn ${noCarrinho && !esgotado ? "btn-contorno" : ""}" ${esgotado ? "disabled" : ""}>${btnTexto}</button>`;
      if (!esgotado) card.querySelector(".btn").addEventListener("click", () => adicionarAoCarrinho(p));
      grade.appendChild(card);
    });
  }

  document.querySelectorAll(".filtro").forEach((b) =>
    b.addEventListener("click", () => {
      document.querySelectorAll(".filtro").forEach((x) => x.classList.remove("ativo"));
      b.classList.add("ativo");
      filtro = b.dataset.cat;
      renderLista();
    })
  );
  $("ordem").addEventListener("change", (e) => {
    ordem = e.target.value;
    renderLista();
  });
  renderLista();
  carregarCotas();

  function totalDoCarrinho() {
    return Math.round(carrinho.reduce((s, it) => s + it.unitario * it.qtd, 0) * 100) / 100;
  }

  function atualizarBotaoCarrinho() {
    const totalItens = carrinho.reduce((s, it) => s + it.qtd, 0);
    const resumo = totalItens
      ? `Ver carrinho (${totalItens} · ${brl(totalDoCarrinho())})`
      : "Carrinho vazio";
    $("carrinhoTexto").textContent = resumo;
    $("carrinhoFlutuanteTexto").textContent = totalItens
      ? `Carrinho (${totalItens}) · ${brl(totalDoCarrinho())}`
      : "";
    $("btnCarrinhoFlutuante").classList.toggle("oculto", totalItens === 0);
    renderLista();
  }

  function adicionarAoCarrinho(p) {
    const limite = Math.max(0, cotasRestantes(p));
    if (limite === 0) {
      toast(p.cotas > 1 ? "As cotas deste presente já foram preenchidas." : "Este presente já foi esgotado.");
      return;
    }
    const existente = carrinho.find((it) => it.id === p.id);
    if (existente) {
      if (!existente.max || existente.qtd < existente.max) existente.qtd++;
      else toast(`Limite de ${existente.max} ${p.cotas > 1 ? "cotas" : "unidades"} atingido para este item.`);
    } else {
      carrinho.push({
        id: p.id,
        nome: p.nome,
        imagem: p.imagem,
        unitario: valorUnitario(p),
        qtd: 1,
        max: limite,
      });
    }
    atualizarBotaoCarrinho();
    abrirModal(1);
  }

  $("btnCarrinho").addEventListener("click", () => abrirModal(1));
  $("btnCarrinhoFlutuante").addEventListener("click", () => abrirModal(1));

  /* ---------- Modal (Carrinho -> Identificação) ---------- */
  function mostrarEtapa(n) {
    const etapas = ["etapaCarrinho", "etapaDados"];
    etapas.forEach((id, i) => $(id).classList.toggle("oculto", i !== n - 1));
    $("modal").querySelector(".modal-box").scrollTop = 0;
  }

  function renderCarrinho() {
    const box = $("itensCarrinho");
    if (!carrinho.length) {
      box.innerHTML = `<p class="c-vazio">Seu carrinho está vazio. Escolha um presente na lista!</p>`;
      $("totalCarrinho").textContent = brl(0);
      $("btnFinalizar").classList.add("oculto");
      return;
    }
    $("btnFinalizar").classList.remove("oculto");
    box.innerHTML = "";
    carrinho.forEach((it, idx) => {
      const row = document.createElement("div");
      row.className = "c-item";
      row.innerHTML = `
        ${it.imagem ? `<img src="${it.imagem}" alt="" />` : ""}
        <div class="c-info">
          <strong>${it.nome}</strong>
          <small>${brl(it.unitario)} cada</small>
        </div>
        <div class="c-qty">
          <button type="button" class="menos" aria-label="Menos">−</button>
          <span>${it.qtd}</span>
          <button type="button" class="mais" aria-label="Mais">+</button>
        </div>
        <button type="button" class="c-remover" title="Remover" aria-label="Remover item">&times;</button>`;

      row.querySelector(".menos").addEventListener("click", () => {
        if (it.qtd > 1) it.qtd--;
        else carrinho.splice(idx, 1);
        atualizarBotaoCarrinho();
        renderCarrinho();
      });
      row.querySelector(".mais").addEventListener("click", () => {
        if (it.qtd < it.max) it.qtd++;
        atualizarBotaoCarrinho();
        renderCarrinho();
      });
      row.querySelector(".c-remover").addEventListener("click", () => {
        carrinho.splice(idx, 1);
        atualizarBotaoCarrinho();
        renderCarrinho();
      });
      box.appendChild(row);
    });
    $("totalCarrinho").textContent = brl(totalDoCarrinho());
  }

  function abrirModal(etapa) {
    renderCarrinho();
    mostrarEtapa(etapa);
    $("modal").classList.add("aberto");
    $("modal").setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function fecharModal() {
    $("modal").classList.remove("aberto");
    $("modal").setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  $("modalFechar").addEventListener("click", fecharModal);
  $("btnMais").addEventListener("click", fecharModal);
  $("modal").addEventListener("click", (e) => { if (e.target === $("modal")) fecharModal(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && $("modal").classList.contains("aberto")) fecharModal();
  });

  $("btnFinalizar").addEventListener("click", () => {
    const tot = totalDoCarrinho();
    if (tot < 1) { toast("O valor mínimo é R$ 1,00."); return; }
    $("totalDados").textContent = brl(tot);
    mostrarEtapa(2);
  });
  $("voltarCarrinho").addEventListener("click", () => { renderCarrinho(); mostrarEtapa(1); });

  /* ---------- Pagar com PagBank ---------- */
  let enviandoPagamento = false;
  $("btnPagar").addEventListener("click", async () => {
    if (enviandoPagamento) return;
    const nome = $("nomeConvidado").value.trim();
    if (nome.length < 2) {
      $("nomeConvidado").focus();
      toast("Por favor, informe seu nome para os noivos.");
      return;
    }

    const total = totalDoCarrinho();
    if (total < 1) { toast("O valor mínimo é R$ 1,00."); return; }

    const btn = $("btnPagar");
    const recado = $("recado").value.trim();
    const resumo = carrinho
      .map((it) => `${it.qtd > 1 ? it.qtd + "x " : ""}${it.nome}`)
      .join(", ");
    const qtdTotal = carrinho.reduce((s, it) => s + it.qtd, 0);
    const itens = carrinho.map((it) => ({
      id: it.id,
      nome: it.nome,
      qtd: it.qtd,
      unitario: it.unitario,
    }));
    const baseUrl = window.location.href.split("#")[0].split("?")[0];

    enviandoPagamento = true;
    btn.disabled = true;
    btn.textContent = "Redirecionando ao PagBank...";
    try {
      const res = await enviarParaPlanilha({
        tipo: "presente",
        nome,
        recado,
        resumo,
        qtdTotal,
        total,
        itens,
        redirectUrl: baseUrl,
      });
      if (!res || !res.ok || !res.payUrl) {
        toast((res && res.error) || "Não foi possível gerar o pagamento no PagBank.");
        return;
      }
      carrinho.length = 0;
      $("nomeConvidado").value = "";
      $("recado").value = "";
      atualizarBotaoCarrinho();
      window.location.href = res.payUrl;
    } catch {
      toast("Não foi possível conectar ao pagamento agora. Tente novamente.");
    } finally {
      enviandoPagamento = false;
      btn.disabled = false;
      btn.textContent = "Pagar com PagBank";
    }
  });

  async function verificarRetornoPagBank() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("presente") !== "retorno") return;
    const ref = params.get("ref") || "";
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
    }
    if (CONFIG.apiUrl && ref) {
      try {
        const resp = await fetch(`${CONFIG.apiUrl}?confirmar=${encodeURIComponent(ref)}`);
        const data = await resp.json();
        if (data && data.cotas) {
          cotasInfo = data.cotas;
          renderLista();
        }
        if (data && data.pago) {
          toast("Pagamento confirmado! Muito obrigado pelo presente!");
          return;
        }
      } catch {
        // Segue com mensagem neutra se estiver offline
      }
    }
    toast("Obrigado! Assim que o PagBank confirmar o pagamento, seu presente será registrado.");
  }
  verificarRetornoPagBank();

  /* ---------- Confirmação de Presença (RSVP) ---------- */
  for (let i = 1; i <= 10; i++) $("rAdultos").add(new Option(i, i));
  for (let i = 0; i <= 10; i++) $("rCriancas").add(new Option(i, i));

  document.querySelectorAll('input[name="vai"]').forEach((r) =>
    r.addEventListener("change", () => {
      const vai = document.querySelector('input[name="vai"]:checked').value === "sim";
      $("rQtd").classList.toggle("oculto", !vai);
    })
  );

  function abrirModalRsvp(nome, vai) {
    $("rsvpModalTitulo").textContent = vai ? "Presença confirmada!" : "Obrigado por nos avisar!";
    $("rsvpModalMsg").textContent = vai
      ? `Obrigado, ${nome}! Ficamos muito felizes em saber que você vai celebrar esse grande dia conosco.`
      : `Obrigado pelo carinho e por nos avisar, ${nome}. Sentiremos sua falta no nosso grande dia!`;
    $("modalRsvp").classList.add("aberto");
    $("modalRsvp").setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  $("btnFecharRsvp").addEventListener("click", () => {
    $("modalRsvp").classList.remove("aberto");
    $("modalRsvp").setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", "#presentes");
    }
    $("presentes").scrollIntoView({ behavior: "smooth" });
  });

  let enviandoRsvp = false;
  $("rsvp").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (enviandoRsvp) return;
    const nome = $("rNome").value.trim();
    if (nome.length < 2) {
      $("rNome").focus();
      toast("Por favor, informe seu nome completo.");
      return;
    }
    const vai = document.querySelector('input[name="vai"]:checked').value === "sim";
    const adultos = Number($("rAdultos").value) || 1;
    const criancas = Number($("rCriancas").value) || 0;
    const obs = $("rObs").value.trim();
    const hp = $("rEmpresa") ? $("rEmpresa").value : "";
    const btn = e.target.querySelector('button[type="submit"]');

    enviandoRsvp = true;
    btn.disabled = true;
    btn.textContent = "Enviando...";
    try {
      const res = await enviarParaPlanilha({ tipo: "rsvp", nome, vai, adultos, criancas, obs, _hp: hp });
      if (res && res.ok === false) {
        toast(res.error || "Não foi possível enviar sua confirmação.");
        return;
      }
      e.target.reset();
      $("rQtd").classList.remove("oculto");
      abrirModalRsvp(nome, vai);
    } catch {
      toast("Não foi possível enviar sua confirmação. Tente novamente.");
    } finally {
      enviandoRsvp = false;
      btn.disabled = false;
      btn.textContent = "Enviar confirmação";
    }
  });

  /* ---------- Toast ---------- */
  let tId;
  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(tId);
    tId = setTimeout(() => t.classList.remove("show"), 2600);
  }
})();
