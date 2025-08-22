import axios from "axios";
import fs from "fs";

let handler = async (m, { conn, usedPrefix, command}) => {
  try {
    let res = await axios.get("https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/booty.json");
    let data = res.data;
    let url = data[Math.floor(Math.random() * data.length)];

    let message = {
      image: { url},
      caption: "🔥 Aquí tienes un *pack* 🔞",
      footer: '𝖯𝗋𝖾𝖼𝗂𝗈𝗇𝖺 𝖾𝗅 𝖻𝗈𝗍𝗈́𝗇 𝗉𝖺𝗋𝖺 𝗅𝖺 𝗌𝗂𝗀𝗎𝗂𝖾𝗇𝗍𝖾 𝗂𝗆𝖺𝗀𝖾𝗇',
      buttons: [
        {
          buttonId: usedPrefix + command,
          buttonText: { displayText: '𝖲𝗂𝗀𝗎𝗂𝖾𝗇𝗍𝖾'},
          type: 1
}
      ],
      headerType: 4
};

    await conn.sendMessage(m.chat, message, { quoted: m});

} catch (e) {
    console.error("❌ Error en pack5:", e);
    await conn.reply(m.chat, "❌ No se pudo obtener el contenido.", m);
}
};

handler.command = ["pack5"];
handler.tags = ["nsfw"];
handler.help = ["pack5"];
handler.register = false;

export default handler;