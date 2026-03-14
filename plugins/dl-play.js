// 🌿 Plugin: Play Audio por texto (YouTube).
// 🌿 Función: Descarga y reproduce música.
// 🌱 Autores: Izumi.xyz. BajoBots 
// ⚠️ No eliminar ni modificar créditos, respeta al creador del código.
import fetch from 'node-fetch'
import yts from 'yt-search'

let handler = async (m, { conn, text, args }) => {
  if (!text) {
    return m.reply("🍃 Ingresa el texto de lo que quieres buscar")
  }

  let ytres = await search(args.join(" "))
  if (!ytres.length) {
    return m.reply("🍃 No se encontraron resultados para tu búsqueda.")
  }

  let izumi = ytres[0]
  let txt = `🎬 *Título*: ${izumi.title}
⏱️ *Duración*: ${izumi.timestamp}
📅 *Publicado*: ${izumi.ago}
📺 *Canal*: ${izumi.author.name || 'Desconocido'}
🔗 *Url*: ${izumi.url}`
  await conn.sendFile(m.chat, izumi.image, 'thumbnail.jpg', txt, m)

  try {
    const videoId = izumi.url.split('v=')[1]?.split('&')[0] || izumi.url.split('/').pop()
    const apiUrl = `https://nex-magical.vercel.app/download/y?url=https%3A%2F%2Fyoutube.com%2Fwatch%3Fv%3D${videoId}`
    const response = await fetch(apiUrl)
    const data = await response.json()

    if (data.status !== true || !data.result.url) {
      throw new Error('Fallo al obtener el audio. JSON inesperado')
    }

    const { title, url } = data.result

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: url },
        mimetype: 'audio/mpeg',
        fileName: `${title || izumi.title}.mp3`
      },
      { quoted: m }
    )
  } catch (error) {
    console.error(error)
    m.reply(`❌ Lo siento, no pude descargar el audio.\n${error.message}`)
  }
}

handler.command = /^(play)$/i
export default handler

async function search(query, options = {}) {
  let result = await yts.search({ query, hl: "es", gl: "ES", ...options })
  return result.videos || []
}