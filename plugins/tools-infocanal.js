import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  try {
    if (!text) throw '📌 *Ejemplo de uso:*\n.rcanal https://whatsapp.com/channel/XXXXXXXXXXXX';

    const match = text.match(/channel\/([0-9A-Za-z]+)/);
    if (!match) return conn.reply(m.chat, `❌ *Enlace inválido.* Usa:\nhttps://whatsapp.com/channel/XXXXXXXXXXXX`, m);

    const code = match[1];
    const data = await conn.newsletterMetadata("invite", code);

    const fecha = new Date(data.creation_time * 1000).toLocaleDateString("es", { year: 'numeric', month: 'long', day: 'numeric' });

    const mensaje = `
╭━━━〔 *📣 CANAL DETECTADO* 〕━━⬣
┃ 🏷️ *Nombre:* ${data.name}
┃ 🆔 *ID:* ${data.id}
┃ 👥 *Seguidores:* ${data.subscribers}
┃ 📅 *Creado:* ${fecha}
┃ ✅ *Verificado:* ${data.verified ? 'Sí' : 'No'}
┃ 🔗 *Enlace:* 
┃ https://whatsapp.com/channel/${data.invite}
┃
┃ 📝 *Descripción:* 
┃ ${data.description || 'Sin descripción'}
╰━━━━━━━━━━━━━━━━━━━━⬣`.trim();

    await conn.sendMessage(m.chat, {
      text: mensaje,
      mentions: conn.parseMention(mensaje),
      contextInfo: {
        externalAdReply: {
          title: data.name,
          body: `${data.verified ? '✅ Canal verificado' : '❌ No verificado'} • ${data.subscribers} seguidores`,
          mediaType: 1,
          previewType: 0,
          renderLargerThumbnail: true,
          thumbnail: await (await fetch(data.picture_url || 'https://i.imgur.com/1Nq0v8c.png')).buffer(),
          sourceUrl: `https://whatsapp.com/channel/${data.invite}`
        }
      }
    }, { quoted: m });

    await m.react("✅");

  } catch (err) {
    console.error('[ERROR R-CANAL]', err);
    await conn.reply(m.chat, `❌ *Error al procesar el canal:*\n${err.message}`, m);
  }
};

handler.command = ["rcanal", "inspect", "id"];
handler.help = ["rcanal <link del canal>"];
handler.tags = ["tools"];
export default handler;
