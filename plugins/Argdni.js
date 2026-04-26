import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {

  if (!text) {
    return m.reply(`╭─❖ 「 USO INCORRECTO 」 ❖─╮
┃ ✧ Ejemplo:
┃ ➤ .dni 20092147
╰───────────────⬣`)
  }

  try {

    let url = `https://api.mitzuki.xyz/dox/argentina?q=${text}&apikey=sk-7b04038cd4d9dd8bb44d55e2b8cc9d0b9213089c17dce2fd0555c012e0fd0f10`
    let res = await fetch(url)
    let json = await res.json()

    if (!json.status || !json.data || json.data.length === 0) {
      return m.reply(`╭─❖ 「 ERROR 」 ❖─╮
┃ ❌ No se encontró información
╰───────────────⬣`)
    }

    let u = json.data[0]

    // 📍 domicilios bonitos
    let domicilios = u.domicilios?.length
      ? u.domicilios.map((d, i) => `┃   ${i + 1}. ${d.domicilio} ${d.piso_dpto || ''}`).join('\n')
      : '┃   • No disponible'

    // 📞 teléfonos bonitos
    let telefonos = u.telefonos?.length
      ? u.telefonos.map((t, i) => `┃   ${i + 1}. ${t}`).join('\n')
      : '┃   • No disponible'

    let mensaje = `
╭━━━〔 🩸 KANEKI • DATA SCAN 〕━━━⬣
┃ 🧬 Estado: ✔️ Conectado
┃ 📡 Fuente: Mitzuki API
╰━━━━━━━━━━━━━━━━━━⬣

╭─❖ 「 👤 IDENTIDAD 」 ❖─╮
┃ ✧ Nombre: ${u.nombre_completo}
┃ ✧ DNI: ${u.dni}
┃ ✧ Nacimiento: ${u.fecha_nacimiento}
╰───────────────⬣

╭─❖ 「 🌎 UBICACIÓN 」 ❖─╮
┃ ✧ Provincia: ${u.provincia}
┃ ✧ Municipio: ${u.municipio}
╰───────────────⬣

╭─❖ 「 📍 DOMICILIOS 」 ❖─╮
${domicilios}
╰───────────────⬣

╭─❖ 「 📞 CONTACTO 」 ❖─╮
${telefonos}
╰───────────────⬣

╭━━━〔 ⚠️ INFO 〕━━━⬣
┃ ✧ Registros: ${json.total}
┃ ✧ ID Persona: ${u.idpersona}
╰━━━━━━━━━━━━━━━━━━⬣

> 🩸 KanekiBot • Sistema de Inteligencia
> ⚡ Respuesta generada automáticamente
`

    await conn.sendMessage(m.chat, { text: mensaje }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply(`╭─❖ 「 ERROR DEL SISTEMA 」 ❖─╮
┃ ❌ Fallo al consultar la API
╰───────────────⬣`)
  }
}

handler.help = ['dni <numero>']
handler.tags = ['tools']
handler.command = ['dni', 'argdni']

export default handler
