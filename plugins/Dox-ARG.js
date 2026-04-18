import axios from 'axios'

let handler = async (m, { conn, args, usedPrefix, command }) => {

  if (!args[0]) {
    return conn.reply(m.chat, `❌ *Uso incorrecto*
Ejemplo:
${usedPrefix + command} 95168788`, m)
  }

  let dni = args[0]

  if (!/^\d+$/.test(dni)) {
    return conn.reply(m.chat, '❌ El DNI debe ser numérico', m)
  }

  try {
    await conn.reply(m.chat, '⏳ Consultando...', m)

    const url = `https://clientes.credicuotas.com.ar/v1/onboarding/resolvecustomers/${dni}`
    const res = await axios.get(url)

    let data = res.data

    // 🔥 FIX IMPORTANTE
    if (Array.isArray(data)) {
      data = data[0] // agarrar el primer resultado
    }

    // Si viene dentro de otra propiedad (por si acaso)
    if (data?.data) {
      data = data.data
      if (Array.isArray(data)) data = data[0]
    }

    if (!data || typeof data !== 'object') {
      return conn.reply(m.chat, `❌ No se encontró información`, m)
    }

    let txt = `╭━〔 🔍 *CONSULTA DNI* 〕━⬣
┃ 👤 *Nombre:* ${data.nombre || data.firstName || 'No disponible'}
┃ 👤 *Apellido:* ${data.apellido || data.lastName || 'No disponible'}
┃ 🆔 *DNI:* ${data.dni || dni}
┃ 📧 *Email:* ${data.email || 'No disponible'}
┃ 📱 *Teléfono:* ${data.telefono || data.phone || 'No disponible'}
┃ 📊 *Estado:* ${data.estado || 'No disponible'}
╰━━━━━━━━━━━━⬣`

    await conn.reply(m.chat, txt, m)

  } catch (e) {
    console.error(e)

    return conn.reply(m.chat, `❌ Error al consultar`, m)
  }
}

handler.help = ['dni <numero>']
handler.tags = ['tools']
handler.command = ['dni']

export default handler
