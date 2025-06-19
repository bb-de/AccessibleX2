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

// Neue Funktion: Overlay unabhängig von React als DOM-Element anzeigen
export function exportSpeechControlsOverlay(show: boolean) {
  const overlayId = 'speech-controls-plain-overlay';
  if (show) {
    if (document.getElementById(overlayId)) return; // Schon vorhanden
    const container = document.createElement('div');
    container.id = overlayId;
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '140px';
    container.style.zIndex = '1000001';
    container.style.background = '#222';
    container.style.color = 'white';
    container.style.padding = '20px';
    container.style.fontSize = '18px';
    container.style.borderRadius = '12px';
    container.style.minWidth = '340px';
    container.style.boxShadow = '0 4px 24px rgba(0,0,0,0.2)';
    container.innerHTML = `
      <div style="margin-bottom: 12px; font-weight: bold; font-size: 20px;">Vorlesefunktion</div>
      <textarea id="speech-controls-textarea" rows="3" style="width: 100%; border-radius: 6px; padding: 8px; font-size: 16px; color: #222;" placeholder="Text zum Vorlesen eingeben oder markieren..."></textarea>
      <div style="display: flex; gap: 8px; margin-bottom: 8px; margin-top: 8px;">
        <button id="speech-controls-start" style="padding: 6px 14px; border-radius: 6px; background: #2563eb; color: white; border: none; font-weight: bold;">Start</button>
        <button id="speech-controls-pause" style="padding: 6px 14px; border-radius: 6px; background: #f59e42; color: white; border: none; font-weight: bold;">Pause</button>
        <button id="speech-controls-stop" style="padding: 6px 14px; border-radius: 6px; background: #ef4444; color: white; border: none; font-weight: bold;">Stopp</button>
        <button id="speech-controls-selection" style="padding: 6px 14px; border-radius: 6px; background: #10b981; color: white; border: none; font-weight: bold;">Markierten Text übernehmen</button>
      </div>
      <div style="margin-bottom: 8px;">
        <label style="margin-right: 8px;">Geschwindigkeit: <span id="speech-controls-rate-label">1.00x</span></label>
        <input id="speech-controls-rate" type="range" min="0.5" max="2" step="0.05" value="1" style="vertical-align: middle;" />
      </div>
      <div style="margin-bottom: 4px;">
        <span>Status: <b id="speech-controls-status">Bereit</b></span>
      </div>
      <div id="speech-controls-error" style="color: #f87171; margin-top: 4px;"></div>
      <button id="speech-controls-close" style="position: absolute; top: 8px; right: 12px; background: none; border: none; color: #fff; font-size: 22px; cursor: pointer;">×</button>
    `;
    document.body.appendChild(container);

    // Logik für Text-to-Speech
    let status: 'idle' | 'playing' | 'paused' | 'error' = 'idle';
    let error: string | null = null;
    let rate: number = 1.0;
    let currentText: string = '';
    let utterance: SpeechSynthesisUtterance | null = null;

    const statusMap: Record<'idle' | 'playing' | 'paused' | 'error', string> = {
      idle: 'Bereit',
      playing: 'Liest vor...',
      paused: 'Pausiert',
      error: 'Fehler beim Vorlesen',
    };

    function updateStatus(newStatus: typeof status, newError: string | null = null) {
      status = newStatus;
      error = newError;
      (container.querySelector('#speech-controls-status') as HTMLElement | null)!.textContent = statusMap[status];
      (container.querySelector('#speech-controls-error') as HTMLElement | null)!.textContent = error || '';
    }

    function handleStart() {
      const textarea = container.querySelector('#speech-controls-textarea') as HTMLTextAreaElement | null;
      currentText = textarea?.value || '';
      if (!currentText) {
        updateStatus('error', 'Kein Text zum Vorlesen markiert.');
        return;
      }
      window.speechSynthesis.cancel();
      utterance = new window.SpeechSynthesisUtterance(currentText);
      utterance.rate = rate;
      utterance.onstart = () => updateStatus('playing');
      utterance.onpause = () => updateStatus('paused');
      utterance.onresume = () => updateStatus('playing');
      utterance.onend = () => updateStatus('idle');
      utterance.onerror = () => updateStatus('error', 'Fehler beim Vorlesen');
      window.speechSynthesis.speak(utterance);
    }
    function handlePause() {
      window.speechSynthesis.pause();
      updateStatus('paused');
    }
    function handleStop() {
      window.speechSynthesis.cancel();
      updateStatus('idle');
    }
    function handleRateChange(e: Event) {
      const target = e.target as HTMLInputElement;
      rate = parseFloat(target.value);
      (container.querySelector('#speech-controls-rate-label') as HTMLElement | null)!.textContent = rate.toFixed(2) + 'x';
      if (status === 'playing' && utterance) {
        handleStop();
        setTimeout(handleStart, 100);
      }
    }
    function handleUseSelection() {
      const selection = window.getSelection();
      const selectedText = selection && selection.toString().trim();
      if (selectedText) {
        const textarea = container.querySelector('#speech-controls-textarea') as HTMLTextAreaElement | null;
        if (textarea) textarea.value = selectedText;
        updateStatus('idle');
      } else {
        updateStatus('error', 'Bitte markieren Sie zuerst einen Text.');
      }
    }
    function handleClose() {
      handleStop();
      document.body.removeChild(container);
    }
    (container.querySelector('#speech-controls-start') as HTMLButtonElement | null)!.onclick = handleStart;
    (container.querySelector('#speech-controls-pause') as HTMLButtonElement | null)!.onclick = handlePause;
    (container.querySelector('#speech-controls-stop') as HTMLButtonElement | null)!.onclick = handleStop;
    (container.querySelector('#speech-controls-rate') as HTMLInputElement | null)!.oninput = handleRateChange;
    (container.querySelector('#speech-controls-selection') as HTMLButtonElement | null)!.onclick = handleUseSelection;
    (container.querySelector('#speech-controls-close') as HTMLButtonElement | null)!.onclick = handleClose;
    updateStatus('idle');
  } else {
    const el = document.getElementById(overlayId);
    if (el) document.body.removeChild(el);
  }
} 