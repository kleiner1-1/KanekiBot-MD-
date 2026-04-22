import axios from 'axios'

let handler = async (m, { conn, args, usedPrefix, command }) => {

  if (!args[0]) {
    return conn.reply(m.chat, `❌ *Uso incorrecto*

📌 Ejemplo:
${usedPrefix + command} 1041693729`, m)
  }

  let cedula = args[0]

  if (!/^\d+$/.test(cedula)) {
    return conn.reply(m.chat, '❌ La cédula debe contener solo números.', m)
  }

  try {
    await conn.reply(m.chat, '⏳ *Consultando base de datos Colombia...*', m)

    const url = `https://hackpurgatory.org/tools/colombiaid.html?search=${cedula}`
    const { data } = await axios.get(url)

    if (!data || !data.success) {
      return conn.reply(m.chat, '❌ No se encontró información', m)
    }

    // 🔥 LIMPIAR TEXTO (QUITAR \r\n y espacios raros)
    const limpiar = (txt) => txt ? txt.replace(/\s+/g, ' ').trim() : 'No disponible'

    let nombres = limpiar(data.nombres)
    let apellidos = limpiar(data.apellidos)

    let txt = `╭━〔 🇨🇴 *CONSULTA CÉDULA* 〕━⬣
┃ 🆔 *Documento:* ${data.numero_documento}
┃ 📄 *Tipo:* ${data.tipo_documento}
┃ 👤 *Nombres:* ${nombres}
┃ 👤 *Apellidos:* ${apellidos}
┃ 📍 *Municipio:* ${data.municipio}
┃ 🗺️ *Departamento:* ${data.departamento}
┃ 📅 *Consulta:* ${data.fecha_consulta}
┃ 🔎 *Ficha:* ${data.ficha}
╰━━━━━━━━━━━━⬣`

    await conn.reply(m.chat, txt, m)

  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, '❌ Error al conectar con la API', m)
  }
}

handler.help = ['cedula <numero>']
handler.tags = ['tools']
handler.command = ['cedula', 'cc']

export default handler
