import fetch from "node-fetch"

const cooldown = new Map()

let handler = async (m, { conn, text, usedPrefix, command }) => {

  if (!text) {
    return conn.reply(m.chat, `✧ Uso correcto:\n${usedPrefix + command} Juan Garcia`, m)
  }

  // ⏱️ Cooldown (5s)
  let time = cooldown.get(m.sender)
  if (time && Date.now() - time < 5000) {
    return m.reply("⏳ Espera unos segundos antes de usar este comando otra vez.")
  }
  cooldown.set(m.sender, Date.now())

  try {
    let query = text.trim().replace(/ +/g, "+")
    let apiKey = "TU_API_KEY_AQUI" // 🔒 NO expongas tu key

    let url = `https://api.mitzuki.xyz/dox/argentina?q=${query}&apikey=${apiKey}`

    await m.react("🔍")

    let res = await fetch(url)
    let json = await res.json()

    if (!json || !json.result || json.result.length === 0) {
      return conn.reply(m.chat, "❌ No se encontraron resultados.", m)
    }

    let hasil = json.result.slice(0, 5)

    let teks = `
╭━━〔 𝗞𝗔𝗡𝗘𝗞𝗜 • 𝗗𝗢𝗫 𝗔𝗥𝗚 〕━━⬣
┃ 🔍 Búsqueda: ${text}
┃ 📊 Resultados: ${hasil.length}
┣━━━━━━━━━━━━━━⬣
`

    for (let i of hasil) {
      teks += `
┣⪼ 👤 ${i.nombre || "No disponible"}
┃ 🆔 DNI: ${i.dni || "N/A"}
┃ 📍 Dirección: ${i.direccion || "N/A"}
┃ 🌎 Provincia: ${i.provincia || "N/A"}
┃ 📞 Teléfono: ${i.telefono || "N/A"}
┣━━━━━━━━━━━━━━⬣`
    }

    teks += `
┃ ⚠️ Uso educativo
╰━━━━━━━━━━━━━━⬣`

    // 📄 Enviar como documento estilo Kaneki
    await conn.sendMessage(m.chat, {
      document: Buffer.from(teks),
      mimetype: "text/plain",
      fileName: `KANEKI-D0X-${text}.txt`,
      caption: "📄 Resultado de búsqueda"
    }, { quoted: m })

    await m.react("✅")

  } catch (e) {
    console.error(e)
    m.reply("❌ Error al consultar la API.")
  }
}

handler.help = ["argdox <nombre>"]
handler.tags = ["tools"]
handler.command = ["argdox"]

export default handler
