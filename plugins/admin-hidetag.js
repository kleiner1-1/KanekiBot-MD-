let handler = async (m, { conn, participants }) => {
    if (!m.isGroup) throw '❌ Solo en grupos'
    if (!m.quoted) throw '⚠️ Responde a una imagen o mensaje'

    let users = participants.map(u => conn.decodeJid(u.id))

    await conn.copyNForward(m.chat, m.quoted, true, {
        mentions: users
    })
}

handler.help = ['hidetag']
handler.tags = ['group']
handler.command = ['hidetag', 'notify' , 'n'] 
handler.group = true
handler.admin = true

export default handler
