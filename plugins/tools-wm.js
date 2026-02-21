import fs from 'fs'
import { Sticker } from 'wa-sticker-formatter'

let handler = async (m, { conn, text }) => {

  // Verificar que esté respondiendo a un sticker
  if (!m.quoted) return m.reply('⚠️ Responde a un sticker.')
  if (!m.quoted.mimetype || !/webp/.test(m.quoted.mimetype))
    return m.reply('⚠️ Solo funciona respondiendo a un sticker.')

  try {

    // Obtener nombre del usuario automáticamente
    let username = await conn.getName(m.sender)

    // Si el usuario escribe texto, usarlo. Si no, usar su nombre
    let wmText = text ? text : username

    // Descargar sticker
    let media = await m.quoted.download()

    // Crear nuevo sticker con watermark
    let sticker = new Sticker(media, {
      pack: wmText,      // Nombre del pack
      author: wmText,    // Autor del sticker
      type: 'full',
      categories: ['✨'],
      quality: 70
    })

    let buffer = await sticker.toBuffer()

    await conn.sendFile(m.chat, buffer, 'wm.webp', '', m)

  } catch (e) {
    console.error(e)
    m.reply('❌ Error al crear el sticker.')
  }
}

handler.help = ['wm <texto opcional>']
handler.tags = ['sticker']
handler.command = ['wm']

export default handler