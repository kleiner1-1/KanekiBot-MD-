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

  await conn.reply(m.chat, '⏳ Consultando...', m)

  try {
    const url = `https://colombia.hackpurgatory.org/colombia?cedula=${cedula}`

    const res = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0',
      }
    })

    let data = res.data

    // Si no es JSON válido → fallback
    if (typeof data !== 'object') {
      throw new Error('Bloqueado')
    }

    const clean = (t) => t ? t.replace(/\s+/g, ' ').trim() : 'No disponible'

    let txt = `📋 *Consulta Colombia*

🆔 ${data.numero_documento || cedula}
👤 ${clean(data.nombres)}
👤 ${clean(data.apellidos)}
📍 ${data.municipio || 'No disponible'}
🗺️ ${data.departamento || 'No disponible'}
`

    await conn.reply(m.chat, txt, m)

  } catch (e) {

    // 🔥 RESPUESTA REALISTA
    await conn.reply(m.chat, `❌ No se pudo obtener información

⚠️ La página está protegida y bloquea bots.

💡 Opciones reales:
• Usar navegador manual
• Usar API privada
• Usar sistema scraping avanzado

Si quieres algo que sí funcione siempre,
dime: *modo sistema real*`, m)
  }
}

handler.help = ['cedula <numero>']
handler.tags = ['tools']
handler.command = ['cedula']

export default handler
