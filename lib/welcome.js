import { DOMImplementation, XMLSerializer } from 'xmldom';
import JsBarcode from 'jsbarcode';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';

const src = join(__dirname, '..', 'src');
const _svg = readFileSync(join(src, 'welcome.svg'), 'utf-8');

// Generar código de barras estilizado
const barcode = data => {
    const xmlSerializer = new XMLSerializer();
    const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
    const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    JsBarcode(svgNode, data, {
        xmlDocument: document,
        height: 40,
        margin: 0,
        fontSize: 12
    });

    return xmlSerializer.serializeToString(svgNode);
};

// Setters
const imageSetter = (img, value) => img.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', value);
const textSetter = (el, value) => el.textContent = value;

let { document: svg } = new JSDOM(_svg).window;

// Generador de SVG estilizado
const genSVG = async ({
    wid = '',
    pp = join(src, 'avatar_contact.png'),
    title = '',
    name = '',
    text = '',
    background = ''
} = {}) => {
    let el = {
        code: ['#_1661899539392 > g:nth-child(6) > image', imageSetter, toBase64(await toImg(barcode(wid.replace(/[^0-9]/g, '')), 'png'), 'image/png')],
        pp: ['#_1661899539392 > g:nth-child(3) > image', imageSetter, pp],
        text: ['#_1661899539392 > text.fil1.fnt0', textSetter, text],
        title: ['#_1661899539392 > text.fil2.fnt1', textSetter, title.toUpperCase()],
        name: ['#_1661899539392 > text.fil2.fnt2', textSetter, name],
        bg: ['#_1661899539392 > g:nth-child(2) > image', imageSetter, background],
    };

    for (let [selector, set, value] of Object.values(el)) {
        set(svg.querySelector(selector), value);
    }

    return svg.body.innerHTML;
};

// Convertidor a imagen desde SVG
const toImg = (svg, format = 'png') => new Promise((resolve, reject) => {
    if (!svg) return resolve(Buffer.alloc(0));
    let bufs = [];
    let im = spawn('magick', ['convert', 'svg:-', format + ':-']);
    im.on('error', e => reject(e));
    im.stdout.on('data', chunk => bufs.push(chunk));
    im.stdin.write(Buffer.from(svg));
    im.stdin.end();
    im.on('close', code => {
        if (code !== 0) reject(code);
        resolve(Buffer.concat(bufs));
    });
});

// Convierte imagen o buffer a base64
const toBase64 = (buffer, mime) => `data:${mime};base64,${buffer.toString('base64')}`;

// Función exportada para generar el SVG completo
const render = async ({
    wid = '',
    pp = toBase64(readFileSync(join(src, 'avatar_contact.png')), 'image/png'),
    name = '',
    title = '',
    text = '',
    background = toBase64(readFileSync(join(src, 'Aesthetic', 'Aesthetic_000.jpeg')), 'image/jpeg'),
} = {}, format = 'png') => {
    let svg = await genSVG({
        wid, pp, name, text, background, title
    });
    return await toImg(svg, format);
};

if (require.main === module) {
    render({
        wid: '1234567890',
        name: 'John Doe',
        text: '🌟 Bienvenido al grupo\n¡Disfruta tu estadía!',
        title: '⚔ GRUPO KANEKI ⚔'
    }, 'jpg').then(result => {
        process.stdout.write(result);
    });
} else module.exports = render;
