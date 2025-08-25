import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const thumbnailCard = 'https://files.catbox.moe/1xq0zj.jpg'; // Imagen ceremonial

  if (!text) {
    return conn.sendMessage(m.chat, {
      text: `🗣️ *Escribe el texto que deseas convertir en voz ceremonial.*\n\n📌 *Ejemplo:* ${usedPrefix + command} Hoy el grupo se reúne en complicidad sonora.`,
      footer: '🔊 Kaneki-Bot - Voz ritual en acto',
      contextInfo: {
        externalAdReply: {
          title: 'KanekiBot 🔊',
          body: 'Convierte palabras en presencia sonora',
          thumbnailUrl: thumbnailCard,
          sourceUrl: 'https://myapiadonix.vercel.app'
        }
      }
    }, { quoted: m });
  }

  try {
    const audioUrl = `https://myapiadonix.vercel.app/api/adonixvoz?q=${encodeURIComponent(text)}`;
    const audioRes = await fetch(audioUrl);
    const audioBuffer = await audioRes.buffer();

    const caption = `
╭━━━〔 *KANEKI-BOT - VOZ RITUAL 🔊* 〕━━━
┃📝 *Texto invocado:* ${text}
┃🎙️ *Estado:* Voz generada con éxito
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔊 *Enviando audio ceremonial...*
`.trim();

    await conn.sendMessage(m.chat, {
      image: { url: thumbnailCard },
      caption,
      footer: '🎧 Voz generada por KanekiBot',
      contextInfo: {
        externalAdReply: {
          title: 'Escucha tu voz ritual',
          body: 'Haz clic para reproducir o compartir',
          thumbnailUrl: thumbnailCard,
          sourceUrl: audioUrl
        }
      }
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      mimetype: 'audio/mpeg',
      fileName: `voz_kaneki.mp3`
    }, { quoted: m });

  } catch (err) {
    console.error('❌ Error:', err);
    m.reply(`💥 *Ocurrió un error al procesar tu solicitud.*\n📛 ${err.message}`);
  }
};

handler.command = ['voz', 'vozritual', 'hablakaneki'];
export default handler;