import fetch from "node-fetch"

let handler = async (m, { conn, text }) => {

  if (!text) {
    return m.reply(`❌ Uso:\n.argdox Juan Garcia`)
  }

  try {
    let query = encodeURIComponent(text)

    let url = `https://api.mitzuki.xyz/dox/argentina?q=${query}&apikey=sk-7b04038cd4d9dd8bb44d55e2b8cc9d0b9213089c17dce2fd0555c012e0fd0f10`

    let res = await fetch(url, {
      headers: {
        "accept": "application/json",
        "user-agent": "Mozilla/5.0"
      }
    })

    let json = await res.json()

    // ✅ usar data real
    let results = json.data

    if (!results || results.length === 0) {
      return m.reply("❌ No se encontraron resultados")
    }

    let teks = `╭━━〔 🔍 ARG BUSQUEDA 〕━━⬣
┃ 🔎 Consulta: ${text}
┃ 📊 Resultados: ${results.length}
┣━━━━━━━━━━━━━━⬣`

    results.slice(0, 5).forEach((v, i) => {

      // 📍 domicilio principal
      let direccion = v.domicilios?.[0]?.domicilio || "No disponible"

      // 📞 telefono
      let telefono = v.telefonos?.[0] || "No disponible"

      teks += `
┣⪼ 📌 Resultado ${i + 1}
┃ 👤 Nombre: ${v.nombre_completo || "N/A"}
┃ 🆔 DNI: ${v.dni || "N/A"}
┃ 🎂 Nacimiento: ${v.fecha_nacimiento || "N/A"}
┃ 📍 Dirección: ${direccion}
┃ 🌎 Provincia: ${v.provincia || "N/A"}
┃ 📞 Teléfono: ${telefono}
┣━━━━━━━━━━━━━━⬣`
    })

    teks += `\n╰━━━━━━━━━━━━━━⬣`

    await conn.sendMessage(m.chat, {
      text: teks
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply("❌ Error al consultar la API")
  }
}

handler.help = ["argdox <nombre>"]
handler.tags = ["tools"]
handler.command = ["argdox"]

export default handler
