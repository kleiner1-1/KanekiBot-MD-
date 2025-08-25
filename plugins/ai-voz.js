import fetch from 'node-fetch';

const KANEKI_API = 'https://myapiadonix.vercel.app/api/adonixvoz?q=';

async function fetchKanekiVoice(phrase) {
  try {
    const res = await fetch(KANEKI_API + encodeURIComponent(phrase));
    if (!res.ok) return null;
    const buffer = await res.buffer();
    return buffer;
  } catch (e) {
    console.log('❌ Error al invocar la voz de Kaneki:', e);
    return null;
  }
}

let handler = async (m, { text, conn, command }) => {
  if (!text) return m.reply(`
╭━━━〔 *KANEKI TE ESCUCHA...* 〕━━━
┃🗣️ *Por favor, escribe lo que deseas que diga.*
┃💡 *Ejemplo:* ${command} El ritual comienza ahora.
╰━━━━━━━━━━━━━━━━━━━━━━━━━━
`.trim());

  try {
    await m.reply('🎙️ *Kaneki está canalizando su voz...* 🕯️');

    const audio = await fetchKanekiVoice(text);
    if (!audio) return m.reply('❌ *No se pudo generar el audio.* Intenta con otra frase o más tarde.');

    const caption = `
╭━━━〔 *VOZ DE KANEKI 🔊* 〕━━━
┃📝 *Frase invocada:* ${text}
┃🎧 *Estilo:* KanekiBot ceremonial
╰━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Tu frase se convirtió en presencia sonora...
`.trim();

    await conn.sendMessage(m.chat, {
      audio,
      mimetype: 'audio/mp4',
      ptt: true,
      caption
    }, { quoted: m });

  } catch (e) {
    console.error('💥 Error general en el flujo de voz Kaneki:', e);
    m.reply(`
🚫 *Kaneki se quedó sin voz temporalmente*

╭━━━〔 *DETALLES DEL SILENCIO* 〕━━━
┃📄 *Error:* ${e.message}
┃🔁 *Sugerencia:* Intenta más tarde o cambia la frase
╰━━━━━━━━━━━━━━━━━━━━━━━━━━
🕯️ *La voz siempre regresa cuando el grupo la necesita...*
`.trim());
  }
};

handler.command = ['voz', 'kaneki', 'hablakaneki', 'vozceremonial'];
handler.help = ['voz <frase>'];
handler.tags = ['voz', 'kaneki'];
export default handler;