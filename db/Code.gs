/**
 * Google Apps Script — Banco de Dados + PagBank Checkout (Anna Beatriz & Daniel)
 * Planilha vinculada: "Casamento Anna Beatriz & Daniel — Banco de Dados"
 *
 * Proteções incluídas:
 *  - Bloqueio contra envios vazios ou gigantes (> 16 KB)
 *  - Validação de campos obrigatórios e limites de tamanho/quantidade
 *  - Trava contra duplo clique / reenvio repetido (CacheService 30s + LockService)
 *  - Campo honeypot (_hp) para filtrar robôs genéricos sem atrapalhar convidados
 *  - Limpeza e limite máximo de rascunhos PEND_ no PropertiesService (máx. 80)
 */

const ABA_CONFIRMACOES = "Confirmacoes";
const ABA_PRESENTES = "Presentes";
const ABA_COTAS = "Cotas";
const PREFIXO_PENDENTE = "PEND_";

const MAX_PAYLOAD_BYTES = 16384;
const MAX_PENDENTES = 80;
const LIMITE_PENDENTE_MS = 48 * 60 * 60 * 1000;
const JANELA_DUPLICADO_SEG = 30;

function jsonResposta(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function textoSeguro(valor, maxLen) {
  return String(valor || "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .trim()
    .slice(0, maxLen);
}

function inteiroEntre(valor, min, max, fallback) {
  const n = parseInt(valor, 10);
  if (isNaN(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function ehEnvioDuplicado(assinatura) {
  const cache = CacheService.getScriptCache();
  const digest = Utilities.base64EncodeWebSafe(
    Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, assinatura)
  ).slice(0, 40);
  const key = "DUP_" + digest;
  if (cache.get(key)) return true;
  cache.put(key, "1", JANELA_DUPLICADO_SEG);
  return false;
}

function limparPendentesAntigos(props, limiteMaximo) {
  const all = props.getProperties();
  const agora = Date.now();
  const ativos = [];

  Object.keys(all).forEach((key) => {
    if (key.indexOf(PREFIXO_PENDENTE) !== 0) return;
    let pedido;
    try {
      pedido = JSON.parse(all[key]);
    } catch (e) {
      props.deleteProperty(key);
      return;
    }

    const criadoEm = Number(pedido && pedido.criadoEm) || 0;
    if (!criadoEm || agora - criadoEm > LIMITE_PENDENTE_MS) {
      props.deleteProperty(key);
      return;
    }

    ativos.push({ key, criadoEm });
  });

  if (ativos.length >= limiteMaximo) {
    ativos.sort((a, b) => a.criadoEm - b.criadoEm);
    const remover = ativos.length - limiteMaximo + 1;
    for (let i = 0; i < remover; i++) {
      props.deleteProperty(ativos[i].key);
    }
  }
}

function getPagBankConfig() {
  const props = PropertiesService.getScriptProperties();
  const token = String(props.getProperty("PAGBANK_TOKEN") || "").trim();
  const isSandbox = String(props.getProperty("PAGBANK_ENV") || "").toLowerCase() === "sandbox";
  const baseApi = isSandbox ? "https://sandbox.api.pagseguro.com" : "https://api.pagseguro.com";
  return { token, baseApi, props };
}

function lerCotasDisponiveis(ss) {
  const sheet = ss.getSheetByName(ABA_COTAS);
  if (!sheet) return {};
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return {};

  const rows = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
  const cotas = {};
  rows.forEach((row) => {
    const id = String(row[0] || "").trim();
    if (!id) return;
    const total = Number(row[3]) || 0;
    const recebidas = Number(row[4]) || 0;
    const restantes = Math.max(0, total - recebidas);
    cotas[id] = { total, recebidas, restantes };
  });
  return cotas;
}

function consultarPagBankJson(url, token) {
  const resp = UrlFetchApp.fetch(url, {
    method: "get",
    headers: {
      Authorization: "Bearer " + token,
      Accept: "application/json",
    },
    muteHttpExceptions: true,
  });
  const status = resp.getResponseCode();
  const text = resp.getContentText() || "{}";
  let data = {};
  try {
    data = JSON.parse(text);
  } catch (e) {
    return { ok: false, status, data: {} };
  }
  return { ok: status >= 200 && status < 300, status, data };
}

function temCobrancaPaga(data) {
  if (!data) return false;
  if (Array.isArray(data.charges) && data.charges.some((c) => c && c.status === "PAID")) {
    return true;
  }
  if (Array.isArray(data.orders)) {
    return data.orders.some(
      (ord) => ord && Array.isArray(ord.charges) && ord.charges.some((c) => c && c.status === "PAID")
    );
  }
  return false;
}

function registrarPresenteConfirmado(ss, props, referenceId) {
  const key = PREFIXO_PENDENTE + referenceId;
  const raw = props.getProperty(key);
  if (!raw) {
    return { recorded: false, alreadyProcessed: true };
  }

  let pedido;
  try {
    pedido = JSON.parse(raw);
  } catch (e) {
    props.deleteProperty(key);
    return { recorded: false, alreadyProcessed: false };
  }

  let sheetPres = ss.getSheetByName(ABA_PRESENTES);
  if (!sheetPres) {
    sheetPres = ss.insertSheet(ABA_PRESENTES);
    sheetPres.appendRow([
      "Data/Hora",
      "Quem comprou",
      "Presente",
      "Quantidade",
      "Valor (R$)",
      "Recado dos noivos",
      "Status Pagamento",
      "Detalhes / IDs",
    ]);
  }
  const lastPres = sheetPres.getLastRow();
  if (lastPres >= 2) {
    const existing = sheetPres.getRange(2, 8, lastPres - 1, 1).getValues();
    if (existing.some((r) => String(r[0] || "").indexOf(referenceId) !== -1)) {
      props.deleteProperty(key);
      return { recorded: false, alreadyProcessed: true };
    }
  }

  const itens = Array.isArray(pedido.itens) ? pedido.itens : [];
  const detalhes =
    itens.map((it) => `${it.id}:${it.qtd}`).join(", ") +
    ` | ${referenceId}` +
    (pedido.checkoutId ? ` | ${pedido.checkoutId}` : "");

  sheetPres.appendRow([
    new Date(),
    textoSeguro(pedido.nome, 60),
    textoSeguro(pedido.resumo, 400),
    Number(pedido.qtdTotal) || 1,
    Number(pedido.total) || 0,
    textoSeguro(pedido.recado, 400),
    "Conferido",
    detalhes,
  ]);

  const sheetCotas = ss.getSheetByName(ABA_COTAS);
  if (sheetCotas && itens.length) {
    const lastRow = sheetCotas.getLastRow();
    if (lastRow >= 2) {
      const ids = sheetCotas.getRange(2, 1, lastRow - 1, 1).getValues();
      const mapaLinhas = {};
      ids.forEach((r, i) => {
        const id = String(r[0] || "").trim();
        if (id) mapaLinhas[id] = i + 2;
      });

      itens.forEach((it) => {
        const rowNum = mapaLinhas[it.id];
        if (rowNum) {
          const cell = sheetCotas.getRange(rowNum, 5);
          const atual = Number(cell.getValue()) || 0;
          cell.setValue(atual + (Number(it.qtd) || 0));
        }
      });
    }
  }

  props.deleteProperty(key);
  return { recorded: true, alreadyProcessed: false };
}

function criarCheckoutPagBank(body, referenceId) {
  const { token, baseApi, props } = getPagBankConfig();
  if (!token) {
    return {
      ok: false,
      error: "PAGBANK_TOKEN não configurado nas Propriedades do script.",
    };
  }

  const nome = textoSeguro(body.nome, 60);
  if (nome.length < 2) {
    return { ok: false, error: "Informe um nome válido (mínimo 2 letras)." };
  }

  const itensBrutos = Array.isArray(body.itens) ? body.itens.slice(0, 30) : [];
  const items = itensBrutos
    .map((it) => {
      const qty = inteiroEntre(it && it.qtd, 1, 20, 0);
      const unitCentavos = Math.round((Number(it && it.unitario) || 0) * 100);
      if (qty < 1 || unitCentavos < 100 || unitCentavos > 10000000) return null;
      return {
        reference_id: textoSeguro(it.id || "item", 64) || "item",
        name: textoSeguro(it.nome || "Presente de casamento", 100) || "Presente de casamento",
        quantity: qty,
        unit_amount: unitCentavos,
      };
    })
    .filter(Boolean);

  if (!items.length) {
    return { ok: false, error: "Nenhum item válido para checkout." };
  }

  const totalCalculado = items.reduce((s, it) => s + (it.unit_amount * it.quantity) / 100, 0);
  const assinatura = `presente|${nome.toLowerCase()}|${totalCalculado.toFixed(2)}|${items.map((i) => i.reference_id + ":" + i.quantity).join(",")}`;
  if (ehEnvioDuplicado(assinatura)) {
    return { ok: false, error: "Solicitação já enviada. Aguarde alguns segundos antes de tentar novamente." };
  }

  const payload = {
    reference_id: referenceId,
    customer_modifiable: true,
    items,
  };

  const baseReturn = textoSeguro(body.redirectUrl, 300);
  if (/^https:\/\/[^/]+/i.test(baseReturn) && !/localhost|127\.0\.0\.1/i.test(baseReturn)) {
    const sep = baseReturn.indexOf("?") === -1 ? "?" : "&";
    payload.redirect_url = `${baseReturn}${sep}presente=retorno&ref=${encodeURIComponent(referenceId)}`;
  }

  const serviceUrl = ScriptApp.getService().getUrl();
  if (serviceUrl && /^https:\/\//i.test(serviceUrl)) {
    payload.payment_notification_urls = [serviceUrl];
  }

  const resp = UrlFetchApp.fetch(`${baseApi}/checkouts`, {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + token,
      Accept: "application/json",
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });

  const status = resp.getResponseCode();
  const text = resp.getContentText() || "{}";
  let data = {};
  try {
    data = JSON.parse(text);
  } catch (e) {
    return { ok: false, status, error: "Resposta inválida do PagBank." };
  }

  if (status < 200 || status >= 300) {
    const firstErr = data.error_messages && data.error_messages[0];
    const msg = (firstErr && (firstErr.description || firstErr.error)) || "Erro PagBank HTTP " + status;
    return { ok: false, status, error: msg };
  }

  const links = Array.isArray(data.links) ? data.links : [];
  const payLink = links.find((l) => l.rel === "PAY");
  if (!payLink || !payLink.href) {
    return { ok: false, status, error: "Link de pagamento não retornado pelo PagBank." };
  }

  limparPendentesAntigos(props, MAX_PENDENTES);

  const checkoutId = String(data.id || "").slice(0, 80);
  const registroPendente = JSON.stringify({
    criadoEm: Date.now(),
    checkoutId,
    nome,
    recado: textoSeguro(body.recado, 400),
    resumo: textoSeguro(body.resumo, 400),
    qtdTotal: items.reduce((s, it) => s + it.quantity, 0),
    total: Math.round(totalCalculado * 100) / 100,
    itens: items.map((it) => ({ id: it.reference_id, qtd: it.quantity })),
  });

  if (registroPendente.length <= 8500) {
    props.setProperty(PREFIXO_PENDENTE + referenceId, registroPendente);
  }

  return { ok: true, checkoutId, payUrl: payLink.href };
}

function confirmarCheckoutNoPagBank(ss, referenceId) {
  const { token, baseApi, props } = getPagBankConfig();
  const refSegura = textoSeguro(referenceId, 60);
  if (!refSegura) return { pago: false };

  const raw = props.getProperty(PREFIXO_PENDENTE + refSegura);
  if (!raw) {
    return { pago: true, alreadyProcessed: true };
  }

  let pedido;
  try {
    pedido = JSON.parse(raw);
  } catch (e) {
    return { pago: false };
  }

  if (!token || !pedido.checkoutId) {
    return { pago: false };
  }

  const check = consultarPagBankJson(`${baseApi}/checkouts/${encodeURIComponent(pedido.checkoutId)}`, token);
  if (check.ok && temCobrancaPaga(check.data)) {
    const reg = registrarPresenteConfirmado(ss, props, refSegura);
    return { pago: true, recorded: reg.recorded, alreadyProcessed: reg.alreadyProcessed };
  }
  return { pago: false };
}

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ref = e && e.parameter && textoSeguro(e.parameter.confirmar, 60);

    if (ref) {
      const lock = LockService.getScriptLock();
      let confirmacao = { pago: false };
      if (lock.tryLock(10000)) {
        try {
          confirmacao = confirmarCheckoutNoPagBank(ss, ref);
        } finally {
          lock.releaseLock();
        }
      }
      return jsonResposta({
        ok: true,
        pago: Boolean(confirmacao.pago),
        cotas: lerCotasDisponiveis(ss),
      });
    }

    return jsonResposta({ ok: true, cotas: lerCotasDisponiveis(ss) });
  } catch (err) {
    return jsonResposta({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  const rawBody = (e && e.postData && e.postData.contents) || "";
  if (!rawBody || rawBody.length > MAX_PAYLOAD_BYTES) {
    return jsonResposta({ ok: false, error: "Requisição vazia ou acima do limite permitido." });
  }

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    return jsonResposta({ ok: false, error: "Servidor ocupado, tente novamente." });
  }

  try {
    const body = JSON.parse(rawBody);
    if (!body || typeof body !== "object") {
      return jsonResposta({ ok: false, error: "Payload inválido." });
    }

    // Honeypot preenchido por robô: descarta silenciosamente sem gravar na planilha
    if (body._hp && String(body._hp).trim() !== "") {
      return jsonResposta({ ok: true });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const agora = new Date();

    // 1. Confirmação de presença (RSVP)
    if (body.tipo === "rsvp") {
      const nome = textoSeguro(body.nome, 80);
      if (nome.length < 2) {
        return jsonResposta({ ok: false, error: "Informe seu nome completo (mínimo 2 letras)." });
      }

      const vai = Boolean(body.vai);
      const adultos = vai ? inteiroEntre(body.adultos, 1, 10, 1) : 0;
      const criancas = vai ? inteiroEntre(body.criancas, 0, 10, 0) : 0;
      const obs = textoSeguro(body.obs, 400);

      const assinatura = `rsvp|${nome.toLowerCase()}|${vai}|${adultos}|${criancas}`;
      if (ehEnvioDuplicado(assinatura)) {
        return jsonResposta({ ok: true, duplicado: true });
      }

      let sheet = ss.getSheetByName(ABA_CONFIRMACOES);
      if (!sheet) {
        sheet = ss.insertSheet(ABA_CONFIRMACOES);
        sheet.appendRow([
          "Data/Hora",
          "Nome",
          "Confirmou Presença",
          "Adultos",
          "Crianças",
          "Observações",
        ]);
      }
      sheet.appendRow([
        agora,
        nome,
        vai ? "Sim" : "Não",
        adultos,
        criancas,
        obs,
      ]);
      return jsonResposta({ ok: true });
    }

    // 2. Criação de Checkout no PagBank (só grava em Presentes quando pago)
    if (body.tipo === "presente") {
      const referenceId = "BIADAN-" + agora.getTime() + "-" + Math.floor(Math.random() * 1000);
      const checkout = criarCheckoutPagBank(body, referenceId);
      if (!checkout.ok) {
        return jsonResposta({
          ok: false,
          status: checkout.status || 500,
          error: checkout.error,
        });
      }
      return jsonResposta({
        ok: true,
        payUrl: checkout.payUrl,
        checkoutId: checkout.checkoutId,
        referenceId,
      });
    }

    // 3. Webhook de pagamento do PagBank (payment_notification_urls)
    if (body.id && String(body.id).indexOf("ORDE_") === 0 && body.reference_id) {
      const { token, baseApi, props } = getPagBankConfig();
      const referenceId = textoSeguro(body.reference_id, 60);
      if (referenceId && props.getProperty(PREFIXO_PENDENTE + referenceId) && token) {
        const orderCheck = consultarPagBankJson(`${baseApi}/orders/${encodeURIComponent(body.id)}`, token);
        if (orderCheck.ok && temCobrancaPaga(orderCheck.data)) {
          registrarPresenteConfirmado(ss, props, referenceId);
        }
      }
      return jsonResposta({ ok: true });
    }

    return jsonResposta({ ok: false, error: "Requisição inválida." });
  } catch (err) {
    return jsonResposta({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Limpa rascunhos expirados (> 48h) e confirma qualquer pagamento aprovado
 * na API do PagBank caso o convidado tenha fechado a aba antes de redirecionar.
 */
function verificarPagamentosPendentes() {
  const { token, baseApi, props } = getPagBankConfig();
  if (!token) return;

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return;

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const all = props.getProperties();
    const agora = Date.now();

    Object.keys(all).forEach((key) => {
      if (key.indexOf(PREFIXO_PENDENTE) !== 0) return;
      const referenceId = key.slice(PREFIXO_PENDENTE.length);
      let pedido;
      try {
        pedido = JSON.parse(all[key]);
      } catch (e) {
        props.deleteProperty(key);
        return;
      }

      if (pedido.checkoutId) {
        const check = consultarPagBankJson(`${baseApi}/checkouts/${encodeURIComponent(pedido.checkoutId)}`, token);
        if (check.ok && temCobrancaPaga(check.data)) {
          registrarPresenteConfirmado(ss, props, referenceId);
          return;
        }
      }

      if (!pedido.criadoEm || agora - pedido.criadoEm > LIMITE_PENDENTE_MS) {
        props.deleteProperty(key);
      }
    });
  } finally {
    lock.releaseLock();
  }
}
