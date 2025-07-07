import { useState } from 'react';
import QRCode from 'qrcode.react';
import socket from './lib/socket';
import generator from './utils/generator';

export default function Home() {
  const [bot, setBot] = useState('surgical','spectral');
  const [username, setUsername] = useState('');
  const [code, setCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const validateUsername = (name) => {
    // Ex: autoriser lettres, chiffres, tirets, underscore, espaces
    return /^[\w\s-]{3,30}$/.test(name);
  };

  const fetchCode = async () => {
    if (!validateUsername(username)) {
      setError('Nom/numéro invalide (3-30 caractères alphanumériques).');
      setCode(null);
      return;
    }
    setLoading(true);
    setError('');
    setCode(null);
    setCopied(false);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bot, username }),
      });
      if (!res.ok) throw new Error(`Erreur serveur ${res.status}`);
      const data = await res.json();
      if (data.code) setCode(data.code);
      else setError('Aucun code reçu, essaie de nouveau.');
    } catch (e) {
      setError(`Erreur : ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchCode();
  };

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 30, fontFamily: 'sans-serif' }}>
      <h1>🔐 Générateur Pair Code</h1>

      <form onSubmit={handleSubmit}>
        <label>Choisir le bot :</label>
        <br />
        <select value={bot} onChange={(e) => setBot(e.target.value)} disabled={loading}>
          <option value="surgical">😇 Surgical</option>
          <option value="spectral">😈 Spectral</option>
        </select>

        <br />
        <br />
        <label>Nom / numéro WhatsApp :</label>
        <br />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          required
          placeholder="ex: will123"
        />

        <br />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Connexion...' : 'Générer Pair Code'}
        </button>

        {code && (
          <>
            <button
              type="button"
              onClick={handleCopy}
              style={{ marginLeft: 10, cursor: 'pointer' }}
            >
              {copied ? '✔️ Copié' : '📋 Copier le code'}
            </button>
            <button
              type="button"
              onClick={fetchCode}
              disabled={loading}
              style={{ marginLeft: 10 }}
            >
              🔄 Rafraîchir
            </button>
          </>
        )}
      </form>

      <div style={{ marginTop: 20 }}>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {code && (
          <>
            <p>
              <strong>📟 Code généré :</strong> <code>{code}</code>
            </p>
            <p>Scanne le code dans WhatsApp pour lier ton bot.</p>
            <QRCode value={code} size={180} />
            <br />
            <a href={`/sessions/${bot}/${username}/creds.json`} download>
              📥 Télécharger session
            </a>
          </>
        )}
      </div>
    </div>
  );
}
