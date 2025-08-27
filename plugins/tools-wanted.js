import fetch from 'node-fetch';

const KANEKI_WANTED_API = 'https://api.popcat.xyz/v2/wanted?image=';

async function fetchWantedAudio(imageUrl) {
  try {
    const res = await fetch(KANEKI_WANTED_API + encodeURIComponent(imageUrl));
    if (!res.ok) return null;
    const buffer = await res.buffer();
    return buffer;
  } catch (e) {
    console.log('❌ Error al invocar el cartel sonoro de Kaneki:', e);
    return null;
  }
}

let handler = async (m, { conn, command }) => {
  const target = m.mentionedJid?.[0] || m.sender;

  await m.reply('🕯️ *Kaneki está abriendo el expediente... el alma será marcada.*');

  try {
    const profilePicUrl = await conn.profilePictureUrl(target, 'image').catch(() => null);
    if (!profilePicUrl) return m.reply('😶 *No se encontró la imagen del alma. Kaneki permanece en silencio.*');

    const image = await fetchWantedAudio(profilePicUrl);
    if (!image) return m.reply('❌ *No se pudo generar el cartel. La voz de Kaneki se desvaneció.*');

    const caption = `
╭━━━〔 *KANEKI - SE BUSCA* 〕━━━
┃🕯️ *Alma marcada:* ${target.split('@')[0]}
┃🎙️ *Estilo:* KanekiBot 
╰━━━━━━━━━━━━━━━━━━━━━━━━━━
🩸 La voz ha susurrado su nombre... el cartel ya existe.
`.trim();

    await conn.sendMessage(m.chat, {
      image,
      caption
    }, { quoted: m });

  } catch (e) {
    console.error('💥 Error en el flujo de cartel Kaneki:', e);
    m.reply(`
🚫 *Kaneki se quedó sin voz temporalmente*

╭━━━〔 *DETALLES DEL SILENCIO* 〕━━━
┃📄 *Error:* ${e.message}
┃🔁 *Sugerencia:* Intenta más tarde o menciona otra alma
╰━━━━━━━━━━━━━━━━━━━━━━━━━━
🕯️ *La voz siempre regresa cuando el grupo la necesita...*
`.trim());
  }
};

handler.command = ['wanted', 'cartelkaneki', 'sebuscakaneki'];
handler.help = ['wanted <@usuario>'];
handler.tags = ['tools'];
export default handler;