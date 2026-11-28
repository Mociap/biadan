/* =====================================================================
   Gerador de "Pix Copia e Cola" (BR Code estático — padrão Banco Central)
   Não envia nada para servidor: o código é montado no navegador.
   ===================================================================== */

const Pix = (() => {
  // Remove acentos e caracteres não permitidos
  function limpar(texto, max) {
    return String(texto || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Za-z0-9 .\-@+*]/g, "")
      .trim()
      .substring(0, max);
  }

  // Campo no formato EMV: ID + tamanho (2 dígitos) + valor
  function campo(id, valor) {
    const tam = String(valor.length).padStart(2, "0");
    return id + tam + valor;
  }

  // CRC16-CCITT (polinômio 0x1021, valor inicial 0xFFFF)
  function crc16(payload) {
    let crc = 0xffff;
    for (let i = 0; i < payload.length; i++) {
      crc ^= payload.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
        crc &= 0xffff;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, "0");
  }

  // Normaliza a chave: telefone precisa estar em +55..., CPF/CNPJ só dígitos
  function normalizarChave(chave) {
    let c = String(chave).trim();
    if (c.includes("@")) return c.toLowerCase();                       // e-mail
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(c)) return c.toLowerCase();  // aleatória
    if (c.startsWith("+")) return "+" + c.replace(/\D/g, "");          // telefone
    const dig = c.replace(/\D/g, "");
    return dig; // CPF (11) ou CNPJ (14)
  }

  /**
   * Gera o código Pix copia e cola
   * @param {object} o { chave, nome, cidade, valor, descricao, txid }
   */
  function gerar({ chave, nome, cidade, valor, descricao = "", txid = "***" }) {
    const gui = campo("00", "br.gov.bcb.pix");
    const key = campo("01", normalizarChave(chave));
    let desc = "";
    const d = limpar(descricao, 40);
    if (d && (gui + key).length + 4 + d.length <= 99) desc = campo("02", d);

    const conta = campo("26", gui + key + desc);
    const tx = limpar(txid, 25).replace(/[^A-Za-z0-9]/g, "") || "***";

    let payload =
      campo("00", "01") +
      conta +
      campo("52", "0000") +
      campo("53", "986") +
      (valor > 0 ? campo("54", Number(valor).toFixed(2)) : "") +
      campo("58", "BR") +
      campo("59", limpar(nome, 25) || "NOIVOS") +
      campo("60", limpar(cidade, 15) || "BRASIL") +
      campo("62", campo("05", tx)) +
      "6304";

    return payload + crc16(payload);
  }

  return { gerar };
})();

if (typeof window !== "undefined") window.Pix = Pix;
if (typeof module !== "undefined" && module.exports) module.exports = Pix;

