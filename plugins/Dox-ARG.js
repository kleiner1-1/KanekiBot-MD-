import axios from 'axios'

let handler = async (m, { conn, args, usedPrefix, command }) => {

  if (!args[0]) {
    return conn.reply(m.chat, `❌ *Uso incorrecto*
Ejemplo:
${usedPrefix + command} 95167877`, m)
  }

  let dni = args[0]

  if (!/^\d+$/.test(dni)) {
    return conn.reply(m.chat, '❌ El DNI debe ser numérico', m)
  }

  try {
    await conn.reply(m.chat, '⏳ Consultando...', m)

    const url = `https://clientes.credicuotas.com.ar/v1/onboarding/resolvecustomers/${dni}`
    const res = await axios.get(url)

    let data = res.data;

    // La API devuelve un array, tomamos el primer objeto
    if (Array.isArray(data)) {
      if (data.length === 0) {
        return conn.reply(m.chat, `❌ No se encontró información para el DNI: ${dni}`, m);
      }
      data = data[0];
    }
    
    // Verificamos que el objeto final sea válido
    if (!data || typeof data !== 'object') {
      return conn.reply(m.chat, `❌ No se pudo procesar la información del DNI: ${dni}`, m);
    }

    // --- FORMATEO CORREGIDO ---
    // Usamos los nombres de propiedad correctos que nos dio la API
    let txt = `╭━〔 🔍 *CONSULTA DNI* 〕━⬣
┃ 👤 *Nombre Completo:* ${data.nombrecompleto || 'No disponible'}
┃ 🆔 *DNI:* ${data.dni || 'No disponible'}
┃ 🆔 *CUIT:* ${data.cuit || 'No disponible'}
┃ 🎂 *Fecha de Nacimiento:* ${data.fechanacimiento || 'No disponible'}
┃ ⚤ *Sexo:* ${data.sexo === 'M' ? 'Masculino' : data.sexo === 'F' ? 'Femenino' : data.sexo || 'No disponible'}
╰━━━━━━━━━━━━⬣`

    await conn.reply(m.chat, txt, m);

  } catch (e) {
    console.error(e);
    if (e.response) {
      if (e.response.status === 404) {
        return conn.reply(m.chat, `❌ No se encontró información para el DNI: ${dni}`, m);
      }
      return conn.reply(m.chat, `❌ Error del servidor (${e.response.status}).`, m);
    } else if (e.request) {
      return conn.reply(m.chat, `❌ No se pudo conectar con el servidor.`, m);
    } else {
      return conn.reply(m.chat, `❌ Ocurrió un error inesperado.`, m);
    }
  }
}

handler.help = ['dni <numero>']
handler.tags = ['tools']
handler.command = ['dni']

export default handler
