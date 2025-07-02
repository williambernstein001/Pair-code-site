// ✅ pages/api/generate.js

import { generateCode } from '@/utils/generator'; import { startSocket } from '@/lib/socket';

export default async function handler(req, res) { if (req.method !== 'POST') { return res.status(405).json({ error: 'Méthode non autorisée' }); }

const { bot, username } = req.body; if (!bot || !username) { return res.status(400).json({ error: 'Bot et nom d’utilisateur requis' }); }

const code = generateCode(8); const connected = await startSocket({ bot, username, code });

if (connected) { return res.status(200).json({ code, ready: true }); } else { return res.status(500).json({ error: 'Connexion échouée' }); } }

