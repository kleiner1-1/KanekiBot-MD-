let handler = async (m, { conn, text, participants }) => {
    if (!m.isGroup) throw '❌ Solo para grupos'

    let users = participants.map(u => conn.decodeJid(u.id))

    // 📌 Si responde a imagen
    if (m.quoted && m.quoted.mimetype && m.quoted.mimetype.startsWith('image/')) {
        let media = await m.quoted.download()

        await conn.sendMessage(m.chat, {
            image: media,
            caption: text || '',
            mentions: users
        }, { quoted: m })
    } 
    // 📌 Si responde a video
    else if (m.quoted && m.quoted.mimetype && m.quoted.mimetype.startsWith('video/')) {
        let media = await m.quoted.download()

        await conn.sendMessage(m.chat, {
            video: media,
            caption: text || '',
            mentions: users
        }, { quoted: m })
    } 
    // 📌 Texto normal
    else {
        await conn.sendMessage(m.chat, {
            text: text || m.quoted?.text || '📢 Notificación',
            mentions: users
        }, { quoted: m })
    }
}

handler.help = ['hidetag', 'notify']
handler.tags = ['group']
handler.command = ['hidetag', 'notify' , 'n'] 
handler.group = true
handler.admin = true

export default handler
