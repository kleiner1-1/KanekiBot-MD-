const https = require('https');

function consultarClientePorDNI(dni, callback) {
    const url = `https://clientes.credicuotas.com.ar/v1/onboarding/resolvecustomers/${dni}`;
    
    https.get(url, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                callback(null, jsonData);
            } catch (error) {
                callback(error, null);
            }
        });
    }).on('error', (error) => {
        callback(error, null);
    });
}

// Función para manejar mensajes de WhatsApp
function handleWhatsAppMessage(message) {
    // Verificar si el mensaje contiene el comando .dni
    if (message.toLowerCase().startsWith('.dni ')) {
        const dni = message.substring(5).trim();
        
        if (!dni) {
            return "Por favor, proporciona un número de DNI después del comando .dni";
        }
        
        consultarClientePorDNI(dni, (error, data) => {
            if (error) {
                return "Error al consultar la información: " + error.message;
            }
            
            // Formatear la respuesta para WhatsApp
            let respuesta = "📋 *Información del cliente*\n\n";
            
            // Agregar los campos relevantes de la respuesta
            if (data.nombre) respuesta += `👤 *Nombre:* ${data.nombre}\n`;
            if (data.apellido) respuesta += `👤 *Apellido:* ${data.apellido}\n`;
            if (data.dni) respuesta += `🆔 *DNI:* ${data.dni}\n`;
            if (data.estado) respuesta += `📊 *Estado:* ${data.estado}\n`;
            
            // Agregar otros campos según la estructura de la respuesta
            // Puedes personalizar esto según lo que devuelva la API
            
            return respuesta;
        });
    }
    
    // Respuesta por defecto si no es un comando reconocido
    return "Hola! Usa el comando .dni seguido de tu número de DNI para consultar tu información. Ejemplo: .dni 95157070";
}

// Ejemplo de cómo integrar con tu bot de WhatsApp
// Esto dependerá de la librería que estés usando para tu bot
// Por ejemplo, si usas whatsapp-web.js:

// client.on('message', message => {
//     if (message.body.startsWith('.dni')) {
//         const response = handleWhatsAppMessage(message.body);
//         message.reply(response);
//     }
// });
