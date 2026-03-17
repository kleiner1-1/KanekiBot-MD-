let handler = async (m, { conn }) => {
  try {
    let numero = m.sender 
    await conn.reply(m.chat, `${numero}`, m)
  } catch (e) {
    await conn.reply(m.chat, `❌ Error al obtener tu número.`, m)
  }
}

handler.help = ['me']
handler.tags = ['info']
handler.command = /^me$/i

export default handler