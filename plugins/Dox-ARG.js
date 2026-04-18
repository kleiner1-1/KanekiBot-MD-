import axios from 'axios'

let handler = async (m, { conn, args, usedPrefix, command }) => {

  if (!args[0]) {
    return conn.reply(m.chat, `❌ *Uso incorrecto*
Ejemplo:
${usedPrefix + command} 95168788`, m)
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

    // --- INICIO DEL ARREGLO CLAVE ---

    // 1. Si la respuesta es un array, tomamos el primer elemento.
    if (Array.isArray(data)) {
      if (data.length === 0) {
        return conn.reply(m.chat, `❌ No se encontró información para el DNI: ${dni}`, m);
      }
      data = data[0];
    }

    // 2. Si los datos están anidados dentro de una propiedad 'data' (común en muchas APIs)
    if (data && typeof data === 'object' && data.data) {
      // Si 'data.data' es un array, tomamos el primer elemento.
      if (Array.isArray(data.data)) {
        if (data.data.length === 0) {
          return conn.reply(m.chat, `❌ No se encontró información para el DNI: ${dni}`, m);
        }
        data = data.data[0];
      } else {
        // Si no, simplemente asignamos el objeto anidado.
        data = data.data;
      }
    }

    // --- FIN DEL ARREGLO CLAVE ---

    // 3. Verificación final: si después de todo esto, 'data' no es un objeto válido, damos un error más útil.
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      console.error("Estructura de datos inesperada:", JSON.stringify(res.data, null, 2));
      return conn.reply(m.chat, `❌ La API devolvió una estructura de datos inesperada. Revisa la consola para más detalles.`, m);
    }

    // 4. Ahora sí, construimos el mensaje con los datos ya limpios.
    let txt = `╭━〔 🔍 *CONSULTA DNI* 〕━⬣
┃ 👤 *Nombre:* ${data.nombre || data.firstName || 'No disponible'}
┃ 👤 *Apellido:* ${data.apellido || data.lastName || 'No disponible'}
┃ 🆔 *DNI:* ${data.dni || dni}
┃ 📧 *Email:* ${data.email || 'No disponible'}
┃ 📱 *Teléfono:* ${data.telefono || data.phone || 'No disponible'}
┃ 📊 *Estado:* ${data.estado || data.status || 'No disponible'}
╰━━━━━━━━━━━━⬣`

    await conn.reply(m.chat, txt, m);

  } catch (e) {
    console.error(e);

    // Manejo de errores más específico
    if (e.response) {
      // El servidor respondió con un estado de error (4xx, 5xx)
      console.error("Error de API:", e.response.status, e.response.data);
      if (e.response.status === 404) {
        return conn.reply(m.chat, `❌ No se encontró información para el DNI: ${dni}`, m);
      }
      return conn.reply(m.chat, `❌ Error del servidor (${e.response.status}). Inténtalo más tarde.`, m);
    } else if (e.request) {
      // La petición se hizo pero no hubo respuesta
      console.error("Error de red:", e.request);
      return conn.reply(m.chat, `❌ No se pudo conectar con el servidor. Verifica tu conexión.`, m);
    } else {
      // Algo pasó al configurar la petición
      console.error("Error desconocido:", e.message);
      return conn.reply(m.chat, `❌ Ocurrió un error inesperado.`, m);
    }
  }
}

handler.help = ['dni <numero>']
handler.tags = ['tools']
handler.command = ['dni']

export default handler
