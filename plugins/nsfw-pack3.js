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
      caption: `🔥 Aquí tienes un *pack ritualizado* 🔞\n\nNo te la jales.`
    }, { quoted: m });

    m.react("✅");

  } catch (e) {
    m.react("❌");
    console.error("❌ Error en pack5:", e);
    await conn.reply(m.chat, "💥 El altar falló. No se pudo invocar el pack.", m);
  }
};

handler.command = ["pack5"];
handler.tags = ["nsfw"];
handler.help = ["pack5"];
handler.group = true;

export default handler;