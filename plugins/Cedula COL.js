import axios from 'axios'

let handler = async (m, { conn, args, usedPrefix, command }) => {

  if (!args[0]) {
    return conn.reply(m.chat, `❌ *Uso incorrecto*

📌 Ejemplo:
${usedPrefix + command} 1041693639`, m)
  }

  let cedula = args[0]

  if (!/^\d+$/.test(cedula)) {
    return conn.reply(m.chat, '❌ La cédula debe contener solo números.', m)
  }

  try {
    await conn.reply(m.chat, '⏳ *Consultando Colombia...*', m)

    const url = `https://hackpurgatory.org/tools/colombiaid.html?search=${cedula}`

    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    })

    let data = res.data

    // 🔥 SI NO ES JSON, INTENTAR EXTRAERLO
    if (typeof data === 'string') {
      try {
        let match = data.match(/\{[\s\S]*\}/)
        if (match) data = JSON.parse(match[0])
      } catch (e) {
        return conn.reply(m.chat, '❌ Error leyendo datos (HTML detectado)', m)
      }
    }

    if (!data || !data.success) {
      return conn.reply(m.chat, '❌ No se encontró información', m)
    }

    // LIMPIAR TEXTO
    const limpiar = (txt) => txt ? txt.replace(/\s+/g, ' ').trim() : 'No disponible'

    let txt = `╭━〔 🇨🇴 *CONSULTA CÉDULA* 〕━⬣
┃ 🆔 *Documento:* ${data.numero_documento || cedula}
┃ 📄 *Tipo:* ${data.tipo_documento || 'No disponible'}
┃ 👤 *Nombres:* ${limpiar(data.nombres)}
┃ 👤 *Apellidos:* ${limpiar(data.apellidos)}
┃ 📍 *Municipio:* ${data.municipio || 'No disponible'}
┃ 🗺️ *Departamento:* ${data.departamento || 'No disponible'}
┃ 📅 *Consulta:* ${data.fecha_consulta || 'No disponible'}
┃ 🔎 *Ficha:* ${data.ficha || 'No disponible'}
╰━━━━━━━━━━━━⬣`

    await conn.reply(m.chat, txt, m)

  } catch (e) {
    console.error(e)

    return conn.reply(m.chat, `❌ Error real de conexión o API caída`, m)
  }
}

handler.help = ['cedula <numero>']
handler.tags = ['tools']
handler.command = ['cedula', 'cc']

export default handler
