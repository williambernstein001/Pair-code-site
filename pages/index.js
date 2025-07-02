// ✅ pages/index.js

import { useState } from 'react';

export default function Home() { const [bot, setBot] = useState('surgical'); const [username, setUsername] = useState(''); const [code, setCode] = useState(null); const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => { e.preventDefault(); if (!username) return; setLoading(true); setCode(null);

const res = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ bot, username })
});

const data = await res.json();
setLoading(false);
if (data.code) setCode(data.code);

};

return ( <div style={{ maxWidth: 400, margin: 'auto', padding: 30, fontFamily: 'sans-serif' }}> <h1>🔐 Générateur Pair Code</h1>

<form onSubmit={handleSubmit}>
    <label>Choisir le bot :</label><br />
    <select value={bot} onChange={(e) => setBot(e.target.value)}>
      <option value="surgical">😇 Surgical</option>
      <option value="spectral">😈 Spectral</option>
    </select>

    <br /><br />
    <label>Nom / numéro WhatsApp :</label><br />
    <input
      type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      required
    />

    <br /><br />
    <button type="submit" disabled={loading}>
      {loading ? 'Connexion...' : 'Générer Pair Code'}
    </button>
  </form>

  {code && (
    <div style={{ marginTop: 20 }}>
      <p><strong>📟 Code généré :</strong> <code>{code}</code></p>
      <p>Scanne le code dans WhatsApp pour lier ton bot.</p>
      <a href={`/sessions/${bot}/${username}/creds.json`} download>
        📥 Télécharger session
      </a>
    </div>
  )}
</div>

); }

  
