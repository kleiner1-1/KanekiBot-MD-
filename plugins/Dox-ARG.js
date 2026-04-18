import axios from 'axios'

let handler = async (m, { conn, args, usedPrefix, command }) => {

  // Validar entrada
  if (!args[0]) {
    return conn.reply(m.chat, `❌ *Uso incorrecto*

📌 Ejemplo:
${usedPrefix + command} 95157070`, m)
  }

  let dni = args[0]

  // Validar que sea numérico
  if (!/^\d+$/.test(dni)) {
    return conn.reply(m.chat, '❌ El DNI debe contener solo números.', m)
  }

  try {
    await conn.reply(m.chat, '⏳ *Consultando datos...*', m)

    const url = `https://clientes.credicuotas.com.ar/v1/onboarding/resolvecustomers/${dni}`
    const { data } = await axios.get(url)

    if (!data || Object.keys(data).length === 0) {
      return conn.reply(m.chat, `❌ No se encontró información para el DNI: ${dni}`, m)
    }

    let txt = `╭━〔 🔍 *CONSULTA DNI* 〕━⬣
┃ 👤 *Nombre:* ${data.nombre || 'No disponible'}
┃ 👤 *Apellido:* ${data.apellido || 'No disponible'}
┃ 🆔 *DNI:* ${data.dni || dni}
┃ 📧 *Email:* ${data.email || 'No disponible'}
┃ 📱 *Teléfono:* ${data.telefono || 'No disponible'}
┃ 📊 *Estado:* ${data.estado || 'No disponible'}
╰━━━━━━━━━━━━⬣`

    // Mostrar campos extra automáticamente
    for (let key in data) {
      if (!['nombre','apellido','dni','email','telefono','estado'].includes(key)) {
        txt += `\n┃ 🔹 *${key}:* ${data[key]}`
      }
    }

    await conn.reply(m.chat, txt, m)

  } catch (e) {
    console.error(e)

    if (e.response) {
      if (e.response.status === 404) {
        return conn.reply(m.chat, `❌ DNI no encontrado`, m)
      } else {
        return conn.reply(m.chat, `❌ Error del servidor (${e.response.status})`, m)
      }
    } else {
      return conn.reply(m.chat, '❌ Error al conectar con la API', m)
    }
  }
}

// Configuración del comando
handler.help = ['dni <numero>']
handler.tags = ['tools']
handler.command = ['dni']

export default handler
