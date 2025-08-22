import axios from 'axios';

let handler = async (m, { conn, usedPrefix, command }) => {
    // ⚠️ Se agregó la verificación de seguridad para NSFW.
    if (m.isGroup) {
        let isnsfw = global.db.data.chats[m.chat].isnsfw;
        if (!isnsfw) {
            return m.reply(`🚫 El comando ${usedPrefix + command} solo puede ser usado si el modo NSFW está activado en este grupo. \n\nPuedes activarlo con: ${usedPrefix}enable nsfw`);
        }
    } else {
        return m.reply('🚫 Este comando solo se puede usar en grupos.');
    }

    m.react("🔞");

    try {
        const apiUrl = `https://delirius-apiofc.vercel.app/nsfw/girls`;
        const res = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        
        if (!res.data) {
            m.react("❌");
            return m.reply(`⚠️ La API no devolvió datos de imagen válidos.`);
        }

        await conn.sendMessage(m.chat, {
            image: res.data,
            caption: `Disfruta 🥵`,
        }, { quoted: m });

        m.react("✅");

    } catch (e) {
        m.react("❌");
        let mensaje = "Ocurrió un error inesperado al procesar tu solicitud.";
        let tipo = "Error desconocido";

        if (e.response) {
            tipo = `Error HTTP ${e.response.status}`;
            mensaje = `La API respondió con un error: ${e.response.statusText}.`;
        } else if (e.request) {
            tipo = "Error de conexión";
            mensaje = "No se pudo conectar con el servidor de la API. Revisa tu conexión a internet.";
        } else {
            tipo = e.name || "Error inesperado";
            mensaje = e.message || "Ocurrió un problema. Intenta de nuevo.";
        }
        
        await conn.reply(m.chat, `💥 Error: ${mensaje}\nTipo: ${tipo}`, m);
        console.error(`[NSFW] Error capturado: ${tipo} → ${e.message}`);
    }
};

handler.help = ['pack'];
handler.command = ['girls','pack'];
handler.tags = ['nsfw'];
handler.group = true;

export default handler;
