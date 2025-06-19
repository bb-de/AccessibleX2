import React, { useState, useRef } from 'react';

const STATUS = {
  idle: 'Bereit',
  playing: 'Liest vor...',
  paused: 'Pausiert',
  error: 'Fehler beim Vorlesen',
};

export function SpeechControls({ initialText = '' }: { initialText?: string }) {
  const [status, setStatus] = useState<'idle' | 'playing' | 'paused' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [rate, setRate] = useState(1.0);
  const [currentText, setCurrentText] = useState(initialText);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Start Vorlesen
  const handleStart = () => {
    if (!currentText) {
      setError('Kein Text zum Vorlesen markiert.');
      setStatus('error');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new window.SpeechSynthesisUtterance(currentText);
    utterance.rate = rate;
    utterance.onstart = () => {
      setStatus('playing');
      setError(null);
    };
    utterance.onpause = () => setStatus('paused');
    utterance.onresume = () => setStatus('playing');
    utterance.onend = () => setStatus('idle');
    utterance.onerror = (e) => {
      setStatus('error');
      setError('Fehler beim Vorlesen');
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Pause
  const handlePause = () => {
    window.speechSynthesis.pause();
    setStatus('paused');
  };

  // Stop
  const handleStop = () => {
    window.speechSynthesis.cancel();
    setStatus('idle');
  };

  // Geschwindigkeit ändern
  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRate = parseFloat(e.target.value);
    setRate(newRate);
    // Wenn gerade vorgelesen wird, neu starten
    if (status === 'playing' && utteranceRef.current) {
      handleStop();
      setTimeout(handleStart, 100);
    }
  };

  // Text aus aktueller Selektion übernehmen
  const handleUseSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection && selection.toString().trim();
    if (selectedText) {
      setCurrentText(selectedText);
      setError(null);
      setStatus('idle');
    } else {
      setError('Bitte markieren Sie zuerst einen Text.');
      setStatus('error');
    }
  };

  return (
    <div style={{ background: '#222', color: 'white', padding: 20, fontSize: 18, zIndex: 99999, borderRadius: 12, minWidth: 340, boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
      <div style={{ marginBottom: 12, fontWeight: 'bold', fontSize: 20 }}>Vorlesefunktion</div>
      <div style={{ marginBottom: 8 }}>
        <textarea
          value={currentText}
          onChange={e => setCurrentText(e.target.value)}
          rows={3}
          style={{ width: '100%', borderRadius: 6, padding: 8, fontSize: 16, color: '#222' }}
          placeholder="Text zum Vorlesen eingeben oder markieren..."
        />
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <button onClick={handleStart} style={{ padding: '6px 14px', borderRadius: 6, background: '#2563eb', color: 'white', border: 'none', fontWeight: 'bold' }}>Start</button>
        <button onClick={handlePause} style={{ padding: '6px 14px', borderRadius: 6, background: '#f59e42', color: 'white', border: 'none', fontWeight: 'bold' }}>Pause</button>
        <button onClick={handleStop} style={{ padding: '6px 14px', borderRadius: 6, background: '#ef4444', color: 'white', border: 'none', fontWeight: 'bold' }}>Stopp</button>
        <button onClick={handleUseSelection} style={{ padding: '6px 14px', borderRadius: 6, background: '#10b981', color: 'white', border: 'none', fontWeight: 'bold' }}>Markierten Text übernehmen</button>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label style={{ marginRight: 8 }}>Geschwindigkeit: {rate.toFixed(2)}x</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.05"
          value={rate}
          onChange={handleRateChange}
          style={{ verticalAlign: 'middle' }}
        />
      </div>
      <div style={{ marginBottom: 4 }}>
        <span>Status: <b>{STATUS[status]}</b></span>
      </div>
      {error && <div style={{ color: '#f87171', marginTop: 4 }}>{error}</div>}
    </div>
  );
} 