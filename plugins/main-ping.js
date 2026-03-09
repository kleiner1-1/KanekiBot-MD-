import speed from 'performance-now';
import { exec } from 'child_process';

let handler = async (m, { conn }) => {
  let timestamp = speed();

  exec('neofetch --stdout', async (error, stdout, stderr) => {
    let latency = speed() - timestamp;
    let info = stdout.toString('utf-8').replace(/Memory:/, 'Ram:');

    let texto = `╭─⏱️ 𝑷𝒊𝒏𝒈 - 𝑲𝒂𝒏𝒆𝒌𝒊𝑩𝒐𝒕
│
│ 🧠 *Velocidad:* ${latency.toFixed(2)} ms
│
╰─💻 *Sistema:*\n${info}`.trim();

    await conn.sendMessage(m.chat, {
      text: texto
    }, { quoted: m });
  });
};

handler.help = ['ping'];
handler.tags = ['main'];
handler.command = ['ping', 'p', 'speed'];

export default handler;