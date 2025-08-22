let handler = async (m, { conn, args, usedPrefix, command }) => {
    let chat = global.db.data.chats[m.chat];
    
    if (args[0] === 'on') {
        if (chat.nsfw) {
            return m.reply(`⚠️ El modo NSFW ya está activado.`);
        }
        chat.nsfw = true;
        m.reply(`✅ El modo NSFW se ha activado correctamente.`);
    } else if (args[0] === 'off') {
        if (!chat.nsfw) {
            return m.reply(`⚠️ El modo NSFW ya está desactivado.`);
        }
        chat.nsfw = false;
        m.reply(`❌ El modo NSFW se ha desactivado correctamente.`);
    } else {
        return m.reply(`
*Uso incorrecto del comando*
Por favor, usa:
*${usedPrefix + command} on* para activar
*${usedPrefix + command} off* para desactivar
        `);
    }
}

handler.help = ['nsfw on', 'nsfw off'];
handler.tags = ['group'];
handler.command = 'nsfw';
handler.group = true;
handler.admin = true;

export default handler;
