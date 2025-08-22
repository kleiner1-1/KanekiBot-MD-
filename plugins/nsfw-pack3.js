import axios from "axios";
import fs from "fs";

let handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.isGroup) return m.reply('🚫 Este comando solo se puede usar en grupos.');

  m.react("🔞");

  try {
    const res = await axios.get("https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/booty.json");
    const data = res.data;
    const url = data[Math.floor(Math.random() * data.length)];

    await conn.sendMessage(m.chat, {
      image: { url },
      caption: `🔥 Aquí tienes un *pack* 🔞\n\n𝖯𝗋𝖾𝖼𝗂𝗈𝗇𝖺 𝖾𝗅 𝖻𝗈𝗍𝗈́𝗇 𝗉𝖺𝗋𝖺 𝗅𝖺 𝗌𝗂𝗀𝗎𝗂𝖾𝗇𝗍𝖾 𝗂𝗆𝖺𝗀𝖾𝗇`,
      buttons: [
        {
          buttonId: `${usedPrefix + command}`,
          buttonText: { displayText: '😏 𝖲𝗂𝗀𝗎𝗂𝖾𝗇𝗍𝖾 Pack' },
          type: 1
        }
      ],
      footer: '🕯️ Ritual NSFW por DeliriusBot',
      headerType: 4
    }, { quoted: m });

    m.react("✅");

  } catch (e) {
    m.react("❌");
    console.error("❌ Error en pack5:", e);
    await conn.reply(m.chat, "💥 No se pudo invocar el pack . El altar digital falló.", m);
  }
};

handler.command = ["pack5"];
handler.tags = ["nsfw"];
handler.help = ["pack5"];
handler.group = true;

export default handler;