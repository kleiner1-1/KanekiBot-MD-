import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
    try {
        let q = m.quoted || m
        let mime = q.mimetype || ''

        if (!/image/.test(mime)) {
            return m.reply('Responde a una imagen')
        }

        let media = await q.download()

        let res = await fetch('https://api.popcat.xyz/speechbubble', {
            method: 'POST',
            body: media,
            headers: {
                'Content-Type': 'application/octet-stream'
            }
        })

        let buffer = await res.buffer()

        await conn.sendMessage(m.chat, {
            sticker: buffer
        }, { quoted: m })

    } catch (e) {
        console.log(e)
        m.reply('Error al crear el globo')
    }
}

handler.command = ['globo']
handler.group = true

export default handler
