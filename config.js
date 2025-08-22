import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import axios from 'axios';
import moment from 'moment-timezone';

global.owner = [
  ['573113406369', "Bajo Bots", true],
  ['584146277368', "Barboza Mod", true],
  ['5355699866', "Carlos", true],
  ['573113406369@s.whatsapp.net', "Bajo", true],
] 

global.mods = [] 
global.prems = []
global.APIs = {
  xteam: 'https://api.xteam.xyz', 
  nrtm: 'https://fg-nrtm.ddns.net',
  bg: 'http://bochil.ddns.net',
  fgmods: 'https://api-fgmods.ddns.net'
}
global.APIKeys = {
  'https://api.xteam.xyz': 'd90a9e986e18778b',
  'https://zenzapis.xyz': '675e34de8a', 
  'https://api-fgmods.ddns.net': 'TU-APIKEY'
}

// Sticker WM & prefijo
global.prefijo = ""; // déjalo en blanco para multi - prefijo
global.packname = "𝐤𝐚𝐧𝐞𝐤𝐢 𝐛𝐨𝐭 𝐯𝟏 | Bajo ν1";
global.footer = "> Bʏ Bᴀᴊᴏ Bᴏᴛs ~";
global.wm = "𝐤𝐚𝐧𝐞𝐤𝐢 𝐛𝐨𝐭 𝐯𝟏 | Bajo ν1";
global.author = " 𝐤𝐚𝐧𝐞𝐤𝐢 𝐛𝐨𝐭 𝐯𝟏  ~"
global.link = 'https://chat.whatsapp.com/IVgxD0TWWuSA0lVoexudIS';
global.logo = 'https://qu.ax/tyxJP.jpg'; 
global.botname = '☠️ 𝗞𝗮𝗻𝗲𝗸𝗶𝗕𝗼𝘁-𝗠𝗗 ☠️'

global.canalreg = '120363417208139711@boletin informativo'

global.namecanal = '𝐊𝐀𝐍𝐄𝐊𝐈𝐁𝐎𝐓-𝐌𝐃'
global.canal = 'https://whatsapp.com/channel/0029Vb63Kf9KwqSQLOQOtk3N'
global.idcanal = '120363419009027760@boletin informativo'

global.ch = {
cap1: '120363419009027760@newsletter',
}

global.wait = "\`Cargando . . . Espera un momento.\`"
global.rwait = '⌛'
global.dmoji = '🤭'
global.done = '✅'
global.error = '❌' 
global.xmoji = '🔥' 
//############
global.imagen = fs.readFileSync('./src/img.jpg');
global.cheerio = cheerio;
global.fs = fs;
global.fetch = fetch;
global.axios = axios;
global.moment = moment;
//############
global.jadi = "Data/Sesiones/Subbots"
global.Sesion = "Data/Sesiones/Principal"
global.dbname = "Data/database.json"

//Tiempo del bot
global.d = new Date(new Date + 3600000)
global.locale = 'es'
global.dia = d.toLocaleDateString(locale, { weekday: 'long' })
global.fecha = d.toLocaleDateString('es', { day: 'numeric', month: 'numeric', year: 'numeric' })
global.mes = d.toLocaleDateString('es', { month: 'long' })
global.año = d.toLocaleDateString('es', { year: 'numeric' })
global.tiempo = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })
global.botdate = `⫹⫺ Date :  ${moment.tz('America/Los_Angeles').format('DD/MM/YY')}` //Asia/Jakarta
global.bottime = `𝗧 𝗜 𝗠 𝗘 : ${moment.tz('America/Los_Angeles').format('HH:mm:ss')}`

global.multiplier = 250
global.maxwarn = '2' // máxima advertencias

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
