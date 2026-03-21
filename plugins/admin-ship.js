let handler = async (m, { conn }) => {
    if (!m.isGroup) throw 'Solo en grupos'

    global.db.data.ship = global.db.data.ship || {}

    let user1 = m.sender

    // 👇 detectar mención correctamente
    let user2 = m.mentionedJid?.[0] || 
                m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

    if (!user2) throw 'Menciona a alguien\nEj: .ship @usuario'

    // porcentaje
    let porcentaje = Math.floor(Math.random() * 101)

    let estado = 'No se sabe...'
    if (porcentaje <= 20) estado = 'No combinan mucho'
    else if (porcentaje <= 50) estado = 'Puede funcionar'
    else if (porcentaje <= 80) estado = 'Van bien'
    else estado = 'Muy buena pareja'

    // guardar historial
    let chat = m.chat
    if (!global.db.data.ship[chat]) global.db.data.ship[chat] = []

    global.db.data.ship[chat].push({
        u1: user1,
        u2: user2,
        p: porcentaje
    })

    global.db.data.ship[chat] = global.db.data.ship[chat].slice(-15)

    let img = `https://api.popcat.xyz/ship?user1=${user1.split('@')[0]}&user2=${user2.split('@')[0]}`

    let txt = `@${user1.split('@')[0]} ❤️ @${user2.split('@')[0]}\n`
    txt += `Compatibilidad: ${porcentaje}%\n${estado}`

    await conn.sendMessage(m.chat, {
        image: { url: img },
        caption: txt,
        mentions: [user1, user2]
    })
}

handler.command = /^ship$/i
handler.group = true

export default handler
