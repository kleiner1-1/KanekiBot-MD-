let handler = async (m, { conn, text, participants }) => {
    if (!m.isGroup) throw '❌ Este comando es solo para grupos'

    let users = participants.map(u => u.id)

    // 📌 Caso 1: Si responde a una imagen
    if (m.quoted && (m.quoted.mtype === 'imageMessage' || m.quoted.mtype === 'videoMessage')) {
        let media = await m.quoted.download()

        await conn.sendMessage(m.chat, {
            image: media, // cambia a video: media si quieres soportar video
            caption: `📢 *NOTIFICACIÓN GENERAL*\n\n${text || 'Mensaje para todos'}\n\n👥 Etiquetando a todos...`,
            mentions: users
        }, { quoted: m })

    } 
    // 📌 Caso 2: Solo texto
    else {
        await conn.sendMessage(m.chat, {
            text: `📢 *NOTIFICACIÓN GENERAL*\n\n${text || 'Mensaje para todos'}\n\n👥 Etiquetando a todos...`,
            mentions: users
        }, { quoted: m })
    }
}

handler.help = ['notify <mensaje>']
handler.tags = ['group']
handler.command = /^(notify|notificar|n)$/i
handler.admin = true
handler.group = true

export default handler
