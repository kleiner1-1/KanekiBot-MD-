import fetch from "node-fetch"

let handler = async (m, { conn, text }) => {

  if (!text) {
    return m.reply(`❌ Ejemplo de uso:\n.argdox Juan Garcia`)
  }

  try {
    // convertir espacios a +
    let query = text.trim().replace(/ +/g, "+")

    let url = `https://api.mitzuki.xyz/dox/argentina?q=${query}&apikey=sk-7b04038cd4d9dd8bb44d55e2b8cc9d0b9213089c17dce2fd0555c012e0fd0f10`

    let res = await fetch(url)
    let json = await res.json()

    if (!json || !json.result || json.result.length === 0) {
      return m.reply("❌ No se encontraron resultados")
    }

    let teks = `╭━━〔 🔍 ARG DOX 〕━━⬣\n`
    
    json.result.slice(0, 5).forEach((data, i) => {
      teks += `
┣⪼ 📌 Resultado ${i + 1}
┃ 👤 Nombre: ${data.nombre || "No disponible"}
┃ 🆔 DNI: ${data.dni || "No disponible"}
┃ 📍 Dirección: ${data.direccion || "No disponible"}
┃ 🌎 Provincia: ${data.provincia || "No disponible"}
┃ 📞 Teléfono: ${data.telefono || "No disponible"}
`
    })

    teks += `╰━━━━━━━━━━━━⬣`

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
