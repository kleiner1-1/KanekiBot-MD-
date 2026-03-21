let handler = async (m, { conn }) => {
    try {
        if (!m.isGroup) return m.reply('Solo en grupos')

        global.db.data.ship = global.db.data.ship || {}

        let user1 = m.sender

        // 👇 detectar usuario correctamente
        let user2 = m.mentionedJid && m.mentionedJid[0]

        // si no menciona, usar el usuario al que responde
        if (!user2 && m.quoted) user2 = m.quoted.sender

        if (!user2) return m.reply('Responde a alguien o menciona\nEj: .ship @user')

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

        // limitar
        global.db.data.ship[chat] = global.db.data.ship[chat].slice(-10)

        let txt = `@${user1.split('@')[0]} ❤️ @${user2.split('@')[0]}\n`
        txt += `Compatibilidad: ${porcentaje}%\n${estado}`

        await conn.sendMessage(m.chat, {
            text: txt,
            mentions: [user1, user2]
        }, { quoted: m })

    } catch (e) {
        console.log(e)
        m.reply('Error en el comando')
    }
}

handler.command = ['ship']
handler.group = true

export default handler
