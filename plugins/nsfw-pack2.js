import axios from "axios";
import fs from "fs";

let handler = async (m, { conn, usedPrefix, command }) => {
  let chatId = m.chat;

  
  let activos = fs.existsSync('./activos.json')
    ? JSON.parse(fs.readFileSync('./activos.json', 'utf-8'))
    : {};

  
  if (!activos.modocaliente || !activos.modocaliente[chatId]) {
    return conn.reply(m.chat, `🔞 El *modo caliente* está desactivado en este grupo.\n\nActívalo con: *${usedPrefix}modocaliente on*`, m);
  }

  try {
    
    let res = await axios.get("https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/booty.json");
    let data = res.data;
    let url = data[Math.floor(Math.random() * data.length)];

    
    await conn.sendMessage(m.chat, {
      image: { url },
      caption: "🔥 Aquí tienes un *pack* 🔞",
      footer: '𝖯𝗋𝖾𝖼𝗂𝗈𝗇𝖺 𝖾𝗅 𝖻𝗈𝗍𝗈́𝗇 𝗉𝖺𝗋𝖺 𝗅𝖺 𝗌𝗂𝗀𝗎𝗂𝖾𝗇𝗍𝖾 𝗂𝗆𝖺𝗀𝖾𝗇',
      buttons: [
        {
          buttonId: `${usedPrefix + command}`,
          buttonText: { displayText: '𝖲𝗂𝗀𝗎𝗂𝖾𝗇𝗍𝖾' },
          type: 1
        }
      ]
    }, { quoted: m });

  } catch (e) {
    console.error("❌ Error en .pack:", e);
    await conn.reply(m.chat, "❌ No se pudo obtener el contenido.", m);
  }
};

handler.command = ["pack2"];
handler.tags = ["nsfw"];
handler.help = ["pack2"];
handler.register = false; 

export default handler;
