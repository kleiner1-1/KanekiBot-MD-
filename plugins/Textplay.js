
import fetch from "node-fetch"
import yts from 'yt-search'

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `*Ingrese nombre o link*\n\n*Ejemplo:* ${usedPrefix}${command} Yan Block 444`, m)

    const isVideo = command === 'play2'
    await m.react(isVideo ? '🎥' : '🎧')

    try {
        let videoUrl = text
        let duration = ''

        if (!text.match(/youtu/gi)) {
            const search = await yts(text)
            if (!search.all.length) {
                await m.react('❌')
                return m.reply('❌ Sin resultados')
            }
            videoUrl = search.videos[0].url
            duration = search.videos[0].timestamp
        }

        const endpoint = isVideo ? 'ytmp4' : 'ytmp3'
        const apiUrl = `https://api.delirius.store/download/${endpoint}?url=${encodeURIComponent(videoUrl)}${isVideo ? '&format=360p' : ''}`
        
        const res = await fetch(apiUrl)
        const json = await res.json()

        if (!json.status || !json.data) {
            await m.react('❌')
            return m.reply('⚠️ Error API')
        }

        const { title, author, image, download } = json.data

        let info = `📌 *${title}*\n👤 *${author}*\n⏱️ *${duration}*\n📦 *${isVideo ? 'MP4' : 'MP3'}*\n\n*By: Barboza Developer*`

        if (isVideo) {
            await conn.sendMessage(m.chat, { 
                video: { url: download }, 
                caption: info,
                mimetype: 'video/mp4'
            }, { quoted: m })
        } else {
            await conn.sendMessage(m.chat, { image: { url: image }, caption: info }, { quoted: m })
            await conn.sendMessage(m.chat, { 
                audio: { url: download }, 
                mimetype: 'audio/mpeg',
                fileName: `${title}.mp3`
            }, { quoted: m })
        }

        await m.react('✅')

    } catch (e) {
        await m.react('❌')
        conn.reply(m.chat, '🛑 Error', m)
    }
}

handler.command = ['playx', 'playx2']

export default handler
