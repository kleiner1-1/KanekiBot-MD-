let handler = async (m, { conn, participants }) => {
    if (!m.quoted) throw '✳️ Responde a un mensaje.'

    let users = participants.map(u => u.id).filter(v => v !== conn.user.jid)

    await conn.sendMessage(m.chat, {
        text: m.quoted.text || '📢 Mensaje',
        mentions: users
    }, {
        quoted: m.quoted
    })
}

handler.help = ['totag']
handler.tags = ['group']
handler.command = /^(totag|tag)$/i
handler.admin = true
handler.group = true

export default handler
