// ✅ lib/socket.js

import { useMultiFileAuthState, makeWASocket, fetchLatestBaileysVersion, usePairingCode } from '@whiskeysockets/baileys'; import { Boom } from '@hapi/boom'; import fs from 'fs'; import path from 'path';

export async function startSocket({ bot, username, code }) { try { const sessionPath = path.resolve(process.cwd(), 'sessions', bot, username); fs.mkdirSync(sessionPath, { recursive: true });

const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
const { version } = await fetchLatestBaileysVersion();

const sock = makeWASocket({
  version,
  auth: state,
  printQRInTerminal: false,
  browser: ['PairCodeSite', 'Chrome', '1.0.0']
});

await usePairingCode(sock, code);

sock.ev.on('creds.update', saveCreds);

const number = sock?.user?.id?.split(':')[0];
if (number) {
  await sock.sendMessage(number + '@s.whatsapp.net', {
    text: `✅ Connexion réussie pour ${bot} \nNom: ${username} \nSession enregistrée.`
  });
}

return true;

} catch (error) { console.error('Erreur connexion :', error); return false; } }

