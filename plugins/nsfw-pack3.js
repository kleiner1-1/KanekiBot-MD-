const axios = import("axios");
const fs = import("fs");

const handler = async (msg, { conn }) => {
  const chatId = msg.key.remoteJid;

  const activos = fs.existsSync('./activos.json')
    ? JSON.parse(fs.readFileSync('./activos.json', 'utf-8'))
    : {};

  if (!activos.modocaliente || !activos.modocaliente[chatId]) {
    await conn.sendMessage(chatId, {
      text: "🔞 El *modo caliente* está desactivado en este grupo.\nActívalo con: *.modocaliente on*"
    }, { quoted: msg });
    return;
  }

  try {
    const res = await axios.get("https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/booty.json");
    const data = res.data;
    const url = data[Math.floor(Math.random() * data.length)];

    await conn.sendMessage(chatId, {
      image: { url },
      caption: "🔥 Aquí tienes un *pack* 🔞",
      footer: '𝖯𝗋𝖾𝖼𝗂𝗈𝗇𝖺 𝖾𝗅 𝖻𝗈𝗍𝗈́𝗇 𝗉𝖺𝗋𝖺 𝗅𝖺 𝗌𝗂𝗀𝗎𝗂𝖾𝗇𝗍𝖾 𝗂𝗆𝖺𝗀𝖾𝗇',
      buttons: [
        {
          buttonId: '.pack',
          buttonText: { displayText: '𝖲𝗂𝗀𝗎𝗂𝖾𝗇𝗍𝖾' },
          type: 1
        }
      ]
    }, { quoted: msg });

  } catch (e) {
    console.error("❌ Error en .pack:", e);
    await conn.sendMessage(chatId, {
      text: "❌ No se pudo obtener el contenido."
    }, { quoted: msg });
  }
};

handler.command = ["pack3"];
handler.tags = ["nsfw"];
handler.help = ["pack"];

export default handler