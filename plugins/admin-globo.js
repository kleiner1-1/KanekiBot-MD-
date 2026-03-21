import fetch from 'node-fetch'
import FormData from 'form-data'

let handler = async (m, { conn }) => {
    try {
        let q = m.quoted || m
        let mime = q.mimetype || ''

        if (!/image/.test(mime)) {
            return m.reply('Responde a una imagen')
        }

        let media = await q.download()

        // 📤 subir imagen
        let form = new FormData()
        form.append('file', media, 'image.jpg')

        let upload = await fetch('https://telegra.ph/upload', {
            method: 'POST',
            body: form
        })

        let data = await upload.json()
        let url = 'https://telegra.ph' + data[0].src

        // 🎯 generar globo
        let api = `https://some-random-api.com/canvas/speechbubble?avatar=${encodeURIComponent(url)}`

        let res = await fetch(api)
        let buffer = await res.buffer()

        // ✅ convertir correctamente a sticker
        await conn.sendImageAsSticker(m.chat, buffer, m, {
            packname: 'Bot',
            author: 'Globo'
        })

    } catch (e) {
        console.log(e)
        m.reply('Error al crear el sticker')
    }
}

handler.command = ['globo']
handler.group = true

export default handler
