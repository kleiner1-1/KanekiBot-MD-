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

    // --- INICIO DE LA DEPURACIÓN CLAVE ---
    // Esta línea imprimirá en la consola de tu bot el objeto exacto que devuelve la API
    console.log("Respuesta de la API para DNI " + dni + ":", JSON.stringify(data, null, 2));
    // --- FIN DE LA DEPURACIÓN CLAVE ---

    if (Array.isArray(data)) {
      if (data.length === 0) {
        return conn.reply(m.chat, `❌ No se encontró información para el DNI: ${dni}`, m);
      }
      data = data[0];
    }

    if (data && typeof data === 'object' && data.data) {
      if (Array.isArray(data.data)) {
        if (data.data.length === 0) {
          return conn.reply(m.chat, `❌ No se encontró información para el DNI: ${dni}`, m);
        }
        data = data.data[0];
      } else {
        data = data.data;
      }
    }

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return conn.reply(m.chat, `❌ La API devolvió una estructura de datos inesperada. Revisa la consola para más detalles.`, m);
    }

    // Ahora, intentamos construir el mensaje, pero si no funciona, ya sabremos por qué gracias al console.log de arriba
    let txt = `╭━〔 🔍 *CONSULTA DNI* 〕━⬣
┃ 👤 *Nombre:* ${data.nombre || data.firstName || data.name || 'No disponible'}
┃ 👤 *Apellido:* ${data.apellido || data.lastName || data.surname || 'No disponible'}
┃ 🆔 *DNI:* ${data.dni || dni}
┃ 📧 *Email:* ${data.email || data.mail || 'No disponible'}
┃ 📱 *Teléfono:* ${data.telefono || data.phone || data.celular || 'No disponible'}
┃ 📊 *Estado:* ${data.estado || data.status || 'No disponible'}
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
