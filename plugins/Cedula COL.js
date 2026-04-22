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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3',
        'Referer': 'https://hackpurgatory.org/'
      }
    })

    const html = res.data
    const $ = load(html)

    // Extraer datos específicos de la página
    let result = {
      numero_documento: cedula,
      tipo_documento: '',
      nombres: '',
      apellidos: '',
      municipio: '',
      departamento: '',
      fecha_consulta: '',
      ficha: ''
    }

    // Intentar diferentes selectores para encontrar los datos
    // Método 1: Buscar en tablas
    $('table tr').each(function() {
      const cells = $(this).find('td, th')
      if (cells.length >= 2) {
        const label = cells.eq(0).text().trim().toLowerCase()
        const value = cells.eq(1).text().trim()
        
        if (label.includes('documento') || label.includes('cedula')) {
          result.numero_documento = value
        } else if (label.includes('tipo')) {
          result.tipo_documento = value
        } else if (label.includes('nombre')) {
          result.nombres = value
        } else if (label.includes('apellido')) {
          result.apellidos = value
        } else if (label.includes('municipio')) {
          result.municipio = value
        } else if (label.includes('departamento')) {
          result.departamento = value
        } else if (label.includes('fecha')) {
          result.fecha_consulta = value
        } else if (label.includes('ficha')) {
          result.ficha = value
        }
      }
    })

    // Método 2: Buscar en divs con clases específicas
    if (!result.nombres || !result.apellidos) {
      $('.info, .data, .result, .card').each(function() {
        const text = $(this).text()
        
        // Usar regex para extraer datos
        if (!result.nombres) {
          const nombreMatch = text.match(/nombre[s]?:\s*([^\n]+)/i)
          if (nombreMatch) result.nombres = nombreMatch[1].trim()
        }
        
        if (!result.apellidos) {
          const apellidoMatch = text.match(/apellido[s]?:\s*([^\n]+)/i)
          if (apellidoMatch) result.apellidos = apellidoMatch[1].trim()
        }
        
        if (!result.municipio) {
          const municipioMatch = text.match(/municipio:\s*([^\n]+)/i)
          if (municipioMatch) result.municipio = municipioMatch[1].trim()
        }
        
        if (!result.departamento) {
          const deptoMatch = text.match(/departamento:\s*([^\n]+)/i)
          if (deptoMatch) result.departamento = deptoMatch[1].trim()
        }
        
        if (!result.tipo_documento) {
          const tipoMatch = text.match(/tipo:\s*([^\n]+)/i)
          if (tipoMatch) result.tipo_documento = tipoMatch[1].trim()
        }
        
        if (!result.fecha_consulta) {
          const fechaMatch = text.match(/fecha:\s*([^\n]+)/i)
          if (fechaMatch) result.fecha_consulta = fechaMatch[1].trim()
        }
        
        if (!result.ficha) {
          const fichaMatch = text.match(/ficha:\s*([^\n]+)/i)
          if (fichaMatch) result.ficha = fichaMatch[1].trim()
        }
      })
    }

    // Método 3: Buscar en todo el documento
    if (!result.nombres || !result.apellidos) {
      const bodyText = $('body').text()
      
      if (!result.nombres) {
        const nombreMatch = bodyText.match(/nombre[s]?:\s*([^\n]+)/i)
        if (nombreMatch) result.nombres = nombreMatch[1].trim()
      }
      
      if (!result.apellidos) {
        const apellidoMatch = bodyText.match(/apellido[s]?:\s*([^\n]+)/i)
        if (apellidoMatch) result.apellidos = apellidoMatch[1].trim()
      }
      
      if (!result.municipio) {
        const municipioMatch = bodyText.match(/municipio:\s*([^\n]+)/i)
        if (municipioMatch) result.municipio = municipioMatch[1].trim()
      }
      
      if (!result.departamento) {
        const deptoMatch = bodyText.match(/departamento:\s*([^\n]+)/i)
        if (deptoMatch) result.departamento = deptoMatch[1].trim()
      }
      
      if (!result.tipo_documento) {
        const tipoMatch = bodyText.match(/tipo:\s*([^\n]+)/i)
        if (tipoMatch) result.tipo_documento = tipoMatch[1].trim()
      }
      
      if (!result.fecha_consulta) {
        const fechaMatch = bodyText.match(/fecha:\s*([^\n]+)/i)
        if (fechaMatch) result.fecha_consulta = fechaMatch[1].trim()
      }
      
      if (!result.ficha) {
        const fichaMatch = bodyText.match(/ficha:\s*([^\n]+)/i)
        if (fichaMatch) result.ficha = fichaMatch[1].trim()
      }
    }

    // Si aún no tenemos datos, mostrar mensaje de error
    if (!result.nombres && !result.apellidos) {
      return conn.reply(m.chat, '❌ No se encontró información para esta cédula', m)
    }

    // LIMPIAR TEXTO
    const limpiar = (txt) => txt ? txt.replace(/\s+/g, ' ').trim() : 'No disponible'

    let txt = `╭━〔 🇨🇴 *CONSULTA CÉDULA* 〕━⬣
┃ 🆔 *Documento:* ${result.numero_documento}
┃ 📄 *Tipo:* ${limpiar(result.tipo_documento)}
┃ 👤 *Nombres:* ${limpiar(result.nombres)}
┃ 👤 *Apellidos:* ${limpiar(result.apellidos)}
┃ 📍 *Municipio:* ${limpiar(result.municipio)}
┃ 🗺️ *Departamento:* ${limpiar(result.departamento)}
┃ 📅 *Consulta:* ${limpiar(result.fecha_consulta)}
┃ 🔎 *Ficha:* ${limpiar(result.ficha)}
╰━━━━━━━━━━━━⬣`

    await conn.reply(m.chat, txt, m)

  } catch (e) {
    console.error(e)
    return conn.reply(m.chat, `❌ Error al consultar la API: ${e.message}`, m)
  }
}

handler.help = ['cedula <numero>']
handler.tags = ['tools']
handler.command = ['cedula', 'cc']

export default handler
