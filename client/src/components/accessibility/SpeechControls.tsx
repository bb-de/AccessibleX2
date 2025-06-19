// Copyright (c) 2024 brandingbrothers.de. All rights reserved.
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

// Labels für Mehrsprachigkeit
export type SpeechControlsLabels = {
  title: string;
  language: string;
  start: string;
  pause: string;
  stop: string;
  useSelection: string;
  speed: string;
  status: string;
  statusIdle: string;
  statusPlaying: string;
  statusPaused: string;
  statusError: string;
  errorNoText: string;
  errorNoSelection: string;
  close: string;
};

export function exportSpeechControlsOverlayWithLabels(show: boolean, labels: SpeechControlsLabels, defaultLang: string = 'de-DE') {
  const overlayId = 'speech-controls-plain-overlay';
  if (show) {
    if (document.getElementById(overlayId)) return; // Schon vorhanden
    const container = document.createElement('div');
    container.id = overlayId;
    container.innerHTML = `
      <style>
        #speech-controls-plain-overlay {
          background: #222;
          color: white;
          border-radius: 12px;
          min-width: 340px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.2);
          padding: 20px;
          position: absolute;
          top: 60px;
          left: calc(100vw - 500px);
          z-index: 1000001;
          user-select: none;
        }
        #speech-controls-plain-overlay textarea {
          width: 100%; border-radius: 6px; padding: 8px; font-size: 16px; color: #222;
        }
        #speech-controls-plain-overlay button {
          padding: 6px 14px; border-radius: 6px; border: none; font-weight: bold;
          margin-right: 4px; margin-bottom: 2px; cursor: pointer;
        }
        #speech-controls-plain-overlay #speech-controls-start { background: #2563eb; color: white; }
        #speech-controls-plain-overlay #speech-controls-pause { background: #f59e42; color: white; }
        #speech-controls-plain-overlay #speech-controls-stop { background: #ef4444; color: white; }
        #speech-controls-plain-overlay #speech-controls-selection { background: #10b981; color: white; }
        #speech-controls-plain-overlay #speech-controls-close { position: absolute; top: 8px; right: 12px; background: none; border: none; color: #fff; font-size: 22px; cursor: pointer; }
        #speech-controls-plain-overlay label { font-weight: normal; }
        #speech-controls-plain-overlay .speech-controls-row { display: flex; gap: 8px; margin-bottom: 8px; margin-top: 8px; }
        #speech-controls-plain-overlay .speech-controls-title { margin-bottom: 12px; font-weight: bold; font-size: 20px; cursor: move; user-select: none; }
        #speech-controls-plain-overlay .speech-controls-status { margin-bottom: 4px; }
        #speech-controls-plain-overlay .speech-controls-error { color: #f87171; margin-top: 4px; }
        #speech-controls-plain-overlay .speech-controls-lang-row { margin-bottom: 10px; }
        #speech-controls-plain-overlay select {
          border-radius: 6px; padding: 4px 8px; font-size: 15px;
          color: #111; background: #fff; border: 1px solid #ccc;
        }
      </style>
      <div class="speech-controls-title" id="speech-controls-drag">${labels.title}</div>
      <div class="speech-controls-lang-row">
        <label for="speech-controls-lang" style="margin-right: 8px;">${labels.language}</label>
        <select id="speech-controls-lang">
          <option value="de-DE">Deutsch</option>
          <option value="en-US">Englisch</option>
          <option value="fr-FR">Französisch</option>
        </select>
      </div>
      <textarea id="speech-controls-textarea" rows="3" placeholder="${labels.errorNoText}"></textarea>
      <div class="speech-controls-row">
        <button id="speech-controls-start">${labels.start}</button>
        <button id="speech-controls-pause">${labels.pause}</button>
        <button id="speech-controls-stop">${labels.stop}</button>
        <button id="speech-controls-selection">${labels.useSelection}</button>
      </div>
      <div style="margin-bottom: 8px;">
        <label style="margin-right: 8px;">${labels.speed} <span id="speech-controls-rate-label">1.00x</span></label>
        <input id="speech-controls-rate" type="range" min="0.5" max="2" step="0.05" value="1" style="vertical-align: middle;" />
      </div>
      <div class="speech-controls-status">
        <span>${labels.status} <b id="speech-controls-status">${labels.statusIdle}</b></span>
      </div>
      <div id="speech-controls-error" class="speech-controls-error"></div>
      <button id="speech-controls-close">${labels.close}</button>
    `;
    document.body.appendChild(container);

    // Drag & Drop Logik
    const dragHandle = container.querySelector('#speech-controls-drag') as HTMLElement | null;
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    if (dragHandle) {
      dragHandle.addEventListener('mousedown', (e: MouseEvent) => {
        isDragging = true;
        const rect = container.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
        document.body.style.userSelect = 'none';
      });
      document.addEventListener('mousemove', (e: MouseEvent) => {
        if (isDragging) {
          container.style.left = `${e.clientX - dragOffsetX}px`;
          container.style.top = `${e.clientY - dragOffsetY}px`;
        }
      });
      document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.userSelect = '';
      });
    }

    // Logik für Text-to-Speech
    let status: 'idle' | 'playing' | 'paused' | 'error' = 'idle';
    let error: string | null = null;
    let rate: number = 1.0;
    let currentText: string = '';
    let utterance: SpeechSynthesisUtterance | null = null;
    let lang: string = defaultLang;

    const statusMap: Record<'idle' | 'playing' | 'paused' | 'error', string> = {
      idle: labels.statusIdle,
      playing: labels.statusPlaying,
      paused: labels.statusPaused,
      error: labels.statusError,
    };

    // Sprache ändern
    const langSelect = container.querySelector('#speech-controls-lang') as HTMLSelectElement | null;
    if (langSelect) {
      langSelect.value = lang;
      langSelect.onchange = (e: Event) => {
        const target = e.target as HTMLSelectElement;
        lang = target.value;
      };
    }

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
        updateStatus('error', labels.errorNoText);
        return;
      }
      window.speechSynthesis.cancel();
      utterance = new window.SpeechSynthesisUtterance(currentText);
      utterance.rate = rate;
      utterance.lang = lang;
      utterance.onstart = () => updateStatus('playing');
      utterance.onpause = () => updateStatus('paused');
      utterance.onresume = () => updateStatus('playing');
      utterance.onend = () => updateStatus('idle');
      utterance.onerror = () => updateStatus('error', labels.statusError);
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
        handleStart(); // Automatisch vorlesen nach Übernahme
      } else {
        updateStatus('error', labels.errorNoSelection);
      }
    }
    function handleClose() {
      handleStop();
      // Dispatch CustomEvent, damit das Widget das Setting zurücksetzt
      window.dispatchEvent(new CustomEvent('speechControlsClosed'));
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

// Für Kompatibilität: Standard-Export mit deutschen Labels
export function exportSpeechControlsOverlay(show: boolean) {
  return exportSpeechControlsOverlayWithLabels(show, {
    title: 'Vorlesefunktion',
    language: 'Sprache:',
    start: 'Start',
    pause: 'Pause',
    stop: 'Stopp',
    useSelection: 'Markierten Text übernehmen',
    speed: 'Geschwindigkeit:',
    status: 'Status:',
    statusIdle: 'Bereit',
    statusPlaying: 'Liest vor...',
    statusPaused: 'Pausiert',
    statusError: 'Fehler beim Vorlesen',
    errorNoText: 'Text zum Vorlesen eingeben oder markieren...',
    errorNoSelection: 'Bitte markieren Sie zuerst einen Text.',
    close: '×',
  }, 'de-DE');
} 