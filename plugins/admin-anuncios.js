let handler = async (m, { conn, text }) => {
    try {
        if (!m.isGroup) return m.reply('Solo en grupos')

        if (!text) {
            return m.reply('Uso:\n.programar 10m Reunión\n.programar 1h Aviso importante')
        }

        let args = text.split(' ')
        let tiempo = args[0]
        let mensaje = args.slice(1).join(' ')

        if (!mensaje) return m.reply('Escribe el mensaje')

        // ⏱️ convertir tiempo
        let ms = 0
        if (tiempo.endsWith('s')) ms = parseInt(tiempo) * 1000
        else if (tiempo.endsWith('m')) ms = parseInt(tiempo) * 60000
        else if (tiempo.endsWith('h')) ms = parseInt(tiempo) * 3600000
        else return m.reply('Usa tiempo válido: 10s, 5m, 1h')

        if (isNaN(ms)) return m.reply('Tiempo inválido')

        // 💬 confirmación
        await m.reply(`⏱️ Anuncio programado en ${tiempo}`)

        // ⏳ ejecutar
        setTimeout(async () => {
            let txt = `╭━━━〔 📢 Anuncio 〕━━━⬣\n`
            txt += `┃\n`
            txt += `┃  ${mensaje}\n`
            txt += `┃\n`
            txt += `┃  • Grupo: activo\n`
            txt += `╰━━━━━━━━━━━━⬣`

            await conn.sendMessage(m.chat, { text: txt })
        }, ms)

    } catch (e) {
        console.log(e)
        m.reply('Error')
    }
}

handler.command = ['programar']
handler.group = true
handler.admin = true

export default handler
