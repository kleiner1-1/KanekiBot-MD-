import fetch from 'node-fetch'
import FormData from 'form-data'
import { spawn } from 'child_process'
import fs from 'fs'

let handler = async (m, { conn }) => {
    try {
        let q = m.quoted || m
        let mime = q.mimetype || ''

        if (!/image/.test(mime)) {
            return m.reply('Responde a una imagen')
        }

        let media = await q.download()

        // 📤 subir a telegra.ph
        let form = new FormData()
        form.append('file', media, 'img.jpg')

        let upload = await fetch('https://telegra.ph/upload', {
            method: 'POST',
            body: form
        })

        let data = await upload.json()
        let url = 'https://telegra.ph' + data[0].src

        // 🎯 generar imagen globo
        let api = `https://some-random-api.com/canvas/speechbubble?avatar=${encodeURIComponent(url)}`
        let res = await fetch(api)
        let img = await res.buffer()

        // 📁 guardar temporal
        let input = './tmp/input.jpg'
        let output = './tmp/output.webp'

        fs.writeFileSync(input, img)

        // 🔄 convertir a webp con ffmpeg
        await new Promise((resolve, reject) => {
            spawn('ffmpeg', [
                '-i', input,
                '-vf', 'scale=512:512:force_original_aspect_ratio=decrease',
                '-vcodec', 'libwebp',
                '-lossless', '1',
                '-qscale', '50',
                '-preset', 'default',
                '-loop', '0',
                '-an',
                '-vsync', '0',
                output
            ])
            .on('close', resolve)
            .on('error', reject)
        })

        let sticker = fs.readFileSync(output)

        await conn.sendMessage(m.chat, {
            sticker: sticker
        }, { quoted: m })

        // 🧹 limpiar
        fs.unlinkSync(input)
        fs.unlinkSync(output)

    } catch (e) {
        console.log(e)
        m.reply('Error al crear el sticker')
    }
}

handler.command = ['globo']
handler.group = true

export default handler
