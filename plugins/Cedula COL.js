import axios from 'axios'

let handler = async (m, { conn, args, usedPrefix, command }) => {

  if (!args[0]) {
    return conn.reply(m.chat, `❌ *Uso incorrecto*
Ejemplo:
${usedPrefix + command} 1041693639`, m)
  }

  let cedula = args[0]

  if (!/^\d+$/.test(cedula)) {
    return conn.reply(m.chat, '❌ La cédula debe ser numérica.', m)
  }

  try {
    await conn.reply(m.chat, '⏳ *Consultando base de datos...*', m)

    const url = `https://hackpurgatory.org/tools/colombiaid.html?search=${cedula}`

    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    })

    let data = res.data

    // 🔥 CASO 1: VIENE JSON (ideal)
    if (typeof data === 'object' && data.success) {

      const limpiar = (txt) => txt ? txt.replace(/\s+/g, ' ').trim() : 'No disponible'

      let txt = `╭━〔 🇨🇴 *CONSULTA CÉDULA* 〕━⬣
┃ 🆔 *Documento:* ${data.numero_documento}
┃ 📄 *Tipo:* ${data.tipo_documento}
┃ 👤 *Nombres:* ${limpiar(data.nombres)}
┃ 👤 *Apellidos:* ${limpiar(data.apellidos)}
┃ 📍 *Municipio:* ${data.municipio}
┃ 🗺️ *Departamento:* ${data.departamento}
╰━━━━━━━━━━━━⬣`

      return conn.reply(m.chat, txt, m)
    }

    // 🔥 CASO 2: VIENE HTML (LO NORMAL)
    if (typeof data === 'string') {

      // Extraer datos con regex
      const get = (regex) => {
        let match = data.match(regex)
        return match ? match[1].trim() : 'No disponible'
      }

      let nombres = get(/Nombres:\s*<\/b>\s*([^<]+)/i)
      let apellidos = get(/Apellidos:\s*<\/b>\s*([^<]+)/i)
      let documento = get(/Número de documento:\s*<\/b>\s*([^<]+)/i)
      let municipio = get(/Municipio:\s*<\/b>\s*([^<]+)/i)
      let departamento = get(/Departamento:\s*<\/b>\s*([^<]+)/i)

      // Si no encontró nada real
      if (nombres === 'No disponible' && apellidos === 'No disponible') {
        return conn.reply(m.chat, '❌ No se encontró información válida', m)
      }

      let txt = `╭━〔 🇨🇴 *CONSULTA CÉDULA* 〕━⬣
┃ 🆔 *Documento:* ${documento}
┃ 👤 *Nombres:* ${nombres}
┃ 👤 *Apellidos:* ${apellidos}
┃ 📍 *Municipio:* ${municipio}
┃ 🗺️ *Departamento:* ${departamento}
╰━━━━━━━━━━━━⬣`

      return conn.reply(m.chat, txt, m)
    }

    return conn.reply(m.chat, '❌ No se pudo interpretar la respuesta', m)

  } catch (e) {
    console.error(e)
    return conn.reply(m.chat, '❌ Error al consultar la API', m)
  }
}

handler.help = ['cedula <numero>']
handler.tags = ['tools']
handler.command = ['cedula', 'cc']

export default handler
