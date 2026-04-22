import axios from 'axios'

let handler = async (m, { conn, args, usedPrefix, command }) => {

  if (!args[0]) {
    return conn.reply(m.chat, `❌ Uso:
${usedPrefix + command} 1041693639`, m)
  }

  let cedula = args[0]

  if (!/^\d+$/.test(cedula)) {
    return conn.reply(m.chat, '❌ Solo números.', m)
  }

  try {
    await conn.reply(m.chat, '⏳ Consultando...', m)

    const url = `https://colombia.hackpurgatory.org/colombia?cedula=${cedula}`

    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json,text/plain,*/*'
      }
    })

    let data = res.data

    // 🔥 Si viene HTML → intentar extraer JSON
    if (typeof data === 'string') {
      let match = data.match(/\{[\s\S]*\}/)
      if (match) {
        data = JSON.parse(match[0])
      } else {
        return conn.reply(m.chat, '❌ No se pudo obtener datos (bloqueo o HTML)', m)
      }
    }

    if (!data) {
      return conn.reply(m.chat, '❌ Sin resultados', m)
    }

    // limpiar
    const clean = (t) => t ? t.replace(/\s+/g, ' ').trim() : 'No disponible'

    let txt = `📋 *Consulta Colombia*

🆔 Documento: ${data.numero_documento || cedula}
👤 Nombre: ${clean(data.nombres || data.nombre)}
👤 Apellido: ${clean(data.apellidos || data.apellido)}
📍 Municipio: ${data.municipio || 'No disponible'}
🗺️ Departamento: ${data.departamento || 'No disponible'}
📅 Fecha: ${data.fecha_consulta || 'No disponible'}
`

    await conn.reply(m.chat, txt, m)

  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, '❌ Error (la web bloqueó la petición)', m)
  }
}

handler.help = ['cedula2 <numero>']
handler.tags = ['tools']
handler.command = ['cedula2']

export default handler
