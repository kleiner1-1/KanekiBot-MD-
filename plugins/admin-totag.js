let handler = async (m, { conn, text, participants }) => {
    if (!m.isGroup) throw '❌ Solo en grupos'

    let users = participants.map(u => u.id)

    // 📌 Si hay imagen (detecta sin usar quoted directo peligroso)
    let q = m.message?.extendedTextMessage?.contextInfo?.quotedMessage

    if (q?.imageMessage) {
        let buffer = await conn.downloadMediaMessage({
            message: { imageMessage: q.imageMessage }
        })

        await conn.sendMessage(m.chat, {
            image: buffer,
            caption: `📢 *NOTIFICACIÓN*\n\n${text || 'Mensaje para todos'}`,
            mentions: users
        })

    } else {
        await conn.sendMessage(m.chat, {
            text: `📢 *NOTIFICACIÓN*\n\n${text || 'Mensaje para todos'}`,
            mentions: users
        })
    }
}

handler.help = ['notify']
handler.tags = ['group']
handler.command = /^(notify|n|notificar)$/i
handler.admin = true
handler.group = true

export default handler
