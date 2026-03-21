let handler = async (m, { conn, participants }) => {
    try {
        if (!m.isGroup) return m.reply('Solo en grupos')

        global.db.data.ship = global.db.data.ship || {}

        let chat = m.chat
        let user1 = m.sender
        let user2

        let mention = m.mentionedJid && m.mentionedJid[0]

        // 👉 @me = random
        if (m.text.includes('@me')) {
            let users = participants.map(u => u.id)
                .filter(u => u !== user1)

            user2 = users[Math.floor(Math.random() * users.length)]
        }

        // 👉 mención
        else if (mention) {
            user2 = mention
        }

        // 👉 responder
        else if (m.quoted) {
            user2 = m.quoted.sender
        }

        if (!user2) return m.reply('Menciona a alguien, usa @me o responde')

        // evitar repetir
        let last = global.db.data.ship[chat]?.slice(-5) || []
        let intento = 0
        while (last.some(x => x.u1 === user1 && x.u2 === user2) && intento < 5) {
            let users = participants.map(u => u.id).filter(u => u !== user1)
            user2 = users[Math.floor(Math.random() * users.length)]
            intento++
        }

        // porcentaje
        let porcentaje = Math.floor(Math.random() * 101)

        let estado = 'Nada claro'
        if (porcentaje <= 20) estado = 'No combinan mucho'
        else if (porcentaje <= 50) estado = 'Puede que sí'
        else if (porcentaje <= 80) estado = 'Se ven bien'
        else estado = 'Muy buena pareja'

        // guardar historial
        if (!global.db.data.ship[chat]) global.db.data.ship[chat] = []

        global.db.data.ship[chat].push({
            u1: user1,
            u2: user2,
            p: porcentaje
        })

        global.db.data.ship[chat] = global.db.data.ship[chat].slice(-15)

        // 💍 pareja oficial
        if (!global.db.data.shipCouple) global.db.data.shipCouple = {}

        let parejaOficial = ''
        if (porcentaje >= 90) {
            global.db.data.shipCouple[chat] = { u1: user1, u2: user2 }
            parejaOficial = '\n💍 Ahora son la pareja del grupo'
        }

        // 💬 mensaje
        let txt = `💘 *Match*\n\n`
        txt += `@${user1.split('@')[0]} × @${user2.split('@')[0]}\n\n`
        txt += `• Compatibilidad: *${porcentaje}%*\n`
        txt += `• ${estado}${parejaOficial}`

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
