let handler = async (m, { conn, text, participants }) => {
    if (!m.isGroup) throw '❌ Solo en grupos'
    if (!m.quoted) throw '⚠️ Responde a una imagen o mensaje'

    let users = participants.map(u => conn.decodeJid(u.id))
    let q = m.quoted

    // 📷 IMAGEN
    if (q.mtype === 'imageMessage') {
        let media = await q.download()

        await conn.sendMessage(m.chat, {
            image: media,
            caption: q.text || q.caption || '',
            mentions: users
        })
    }

    // 🎥 VIDEO
    else if (q.mtype === 'videoMessage') {
        let media = await q.download()

        await conn.sendMessage(m.chat, {
            video: media,
            caption: q.text || q.caption || '',
            mentions: users
        })
    }

    // 📝 TEXTO
    else {
        await conn.sendMessage(m.chat, {
            text: q.text || text || '📢 Notificación',
            mentions: users
        })
    }
}

handler.help = ['hidetag']
handler.tags = ['group']
handler.command = ['hidetag', 'notify' , 'n']
handler.group = true
handler.admin = true

export default handler
