import axios from 'axios'
import { load } from 'cheerio'

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

    let html = res.data
    const $ = load(html)
    
    // Extraer datos del HTML
    let result = {}
    
    // Buscar información en diferentes formatos posibles
    $('.result, .info, .data, table tr, div, p').each(function() {
      const text = $(this).text().trim()
      
      // Intentar extraer pares clave:valor
      if (text.includes(':')) {
        const parts = text.split(':')
        if (parts.length >= 2) {
          const key = parts[0].trim().toLowerCase()
          const value = parts.slice(1).join(':').trim()
          
          if (key.includes('documento') || key.includes('cedula')) {
            result.numero_documento = value
          } else if (key.includes('tipo')) {
            result.tipo_documento = value
          } else if (key.includes('nombre')) {
            result.nombres = value
          } else if (key.includes('apellido')) {
            result.apellidos = value
          } else if (key.includes('municipio')) {
            result.municipio = value
          } else if (key.includes('departamento')) {
            result.departamento = value
          } else if (key.includes('fecha')) {
            result.fecha_consulta = value
          } else if (key.includes('ficha')) {
            result.ficha = value
          }
        }
      }
    })
    
    // Si no se encontraron datos con el método anterior, intentar con regex
    if (Object.keys(result).length === 0) {
      const htmlText = html.replace(/\s+/g, ' ')
      
      // Patrones comunes para extraer información
      const patterns = {
        numero_documento: /(?:documento|cedula|número|numero)[\s:]+(\d+)/i,
        tipo_documento: /(?:tipo)[\s:]+([^\s\n]+)/i,
        nombres: /(?:nombre|nombres)[\s:]+([^\s\n]+)/i,
        apellidos: /(?:apellido|apellidos)[\s:]+([^\s\n]+)/i,
        municipio: /(?:municipio)[\s:]+([^\s\n]+)/i,
        departamento: /(?:departamento)[\s:]+([^\s\n]+)/i,
        fecha_consulta: /(?:fecha|consulta)[\s:]+([^\s\n]+)/i,
        ficha: /(?:ficha)[\s:]+([^\s\n]+)/i
      }
      
      for (const [key, pattern] of Object.entries(patterns)) {
        const match = htmlText.match(pattern)
        if (match) result[key] = match[1]
      }
    }

    if (Object.keys(result).length === 0) {
      return conn.reply(m.chat, '❌ No se encontró información en la respuesta de la API', m)
    }

    // LIMPIAR TEXTO
    const limpiar = (txt) => txt ? txt.replace(/\s+/g, ' ').trim() : 'No disponible'

    let txt = `╭━〔 🇨🇴 *CONSULTA CÉDULA* 〕━⬣
┃ 🆔 *Documento:* ${result.numero_documento || cedula}
┃ 📄 *Tipo:* ${result.tipo_documento || 'No disponible'}
┃ 👤 *Nombres:* ${limpiar(result.nombres)}
┃ 👤 *Apellidos:* ${limpiar(result.apellidos)}
┃ 📍 *Municipio:* ${result.municipio || 'No disponible'}
┃ 🗺️ *Departamento:* ${result.departamento || 'No disponible'}
┃ 📅 *Consulta:* ${result.fecha_consulta || 'No disponible'}
┃ 🔎 *Ficha:* ${result.ficha || 'No disponible'}
╰━━━━━━━━━━━━⬣`

    await conn.reply(m.chat, txt, m)

  } catch (e) {
    console.error(e)
    return conn.reply(m.chat, `❌ Error: ${e.message}`, m)
  }
}

handler.help = ['cedula <numero>']
handler.tags = ['tools']
handler.command = ['cedula', 'cc']

export default handler
