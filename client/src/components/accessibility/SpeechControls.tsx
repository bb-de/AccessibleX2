// Copyright (c) 2024 brandingbrothers.de. All rights reserved.
import React, { useState, useRef, useEffect } from 'react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useAccessibility } from '@/hooks/useAccessibility';
import { translations } from '@/lib/translation';
import { X } from 'lucide-react';

const STATUS = {
  idle: 'Bereit',
  playing: 'Liest vor...',
  paused: 'Pausiert',
  error: 'Fehler beim Vorlesen',
};

export function SpeechControls({ isMobile }: { isMobile: boolean }) {
  console.log('SpeechControls: isMobile =', isMobile);
  if (isMobile) return <MobileSpeechControls />;
  const { settings, updateSetting, language } = useAccessibility();
  const trans = translations[language];
  const dragRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const {
    text,
    setText,
    isPaused,
    isSpeaking,
    isEnded,
    speak,
    pause,
    cancel,
    supported,
    voices,
    selectedVoice,
    setSelectedVoice,
  } = useTextToSpeech({ lang: language });

  useEffect(() => {
    if (isMobile) {
      // Position zurücksetzen, damit die CSS-Klasse die volle Kontrolle hat
      setPosition({ x: 0, y: 0 });
    }
  }, [isMobile]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !dragRef.current) return;
    setIsDragging(true);
    const rect = dragRef.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || isMobile) return;
    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
    e.preventDefault();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isMobile]);

  const handleUseSelection = () => {
    const selectedText = window.getSelection()?.toString().trim();
    if (selectedText) {
      setText(selectedText);
    }
  };

  const containerClasses = "fixed z-[100000] bg-gray-800 text-white p-4 rounded-lg shadow-2xl speech-controls-container";

  if (!supported) {
    return (
      <div className={containerClasses}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold">{trans.textToSpeech}</h3>
          <button 
            onClick={() => updateSetting('textToSpeech', false)}
            className="text-gray-400 hover:text-white"
            aria-label={trans.closeAccessibilityMenu}
          >
            <X size={20} />
          </button>
        </div>
        <p>{trans.textToSpeechNotSupported || 'Text-to-Speech is not supported by your browser.'}</p>
      </div>
    );
  }
  
  const containerStyle: React.CSSProperties = isMobile ? {} : {
    transform: `translate(${position.x}px, ${position.y}px)`,
  };

  return (
    <div ref={dragRef} className={containerClasses} style={containerStyle}>
      <div style={{background:'red',color:'#fff',fontWeight:'bold',padding:4}}>DESKTOP-VARIANTE</div>
      {/* Auffällige Debug-Zeile für Mobilstatus und Body-Klassen */}
      <div style={{
        position: 'absolute',
        top: 8,
        left: 8,
        zIndex: 999999,
        background: 'rgba(255,0,0,0.85)',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 22,
        padding: 8,
        borderRadius: 6,
        pointerEvents: 'none',
        fontFamily: 'monospace',
      }}>
        isMobile: {String(isMobile)} | body.className: {typeof document !== 'undefined' ? document.body.className : ''}
      </div>
      <div 
        className={`flex justify-between items-center mb-4 ${!isMobile ? 'cursor-move' : ''}`}
        onMouseDown={handleMouseDown}
      >
        <h3 className="text-lg font-bold">{trans.textToSpeech}</h3>
        <button 
          onClick={() => updateSetting('textToSpeech', false)}
          className="text-gray-400 hover:text-white cursor-pointer"
          aria-label={trans.closeAccessibilityMenu}
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <select
            value={selectedVoice?.voiceURI || ''}
            onChange={(e) => {
              const voice = voices.find(v => v.voiceURI === e.target.value);
              if (voice) setSelectedVoice(voice);
            }}
            className="w-full bg-gray-700 border-gray-600 rounded-md p-2 text-sm"
            aria-label="Select voice"
          >
            {voices.map(voice => (
              <option key={voice.voiceURI} value={voice.voiceURI}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full bg-gray-700 border-gray-600 rounded-md p-2 text-sm"
          placeholder={trans.selectTextToReadAloud || 'Select text to read aloud...'}
          aria-label="Text to read"
        />
        <div className="flex justify-between items-center gap-2 flex-wrap">
          {isSpeaking && !isPaused ? (
            <button onClick={pause} className="px-3 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-md flex-grow">Pause</button>
          ) : (
            <button onClick={speak} className="px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md flex-grow">{isPaused ? 'Resume' : 'Speak'}</button>
          )}
          <button onClick={cancel} disabled={!isSpeaking && isEnded} className="px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md flex-grow disabled:bg-red-800 disabled:cursor-not-allowed">Stop</button>
          <button onClick={handleUseSelection} className="px-3 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md flex-grow">Use selection</button>
        </div>
      </div>
    </div>
  );
}

function MobileSpeechControls(props: Omit<React.ComponentProps<typeof SpeechControls>, 'isMobile'>) {
  console.log('MobileSpeechControls gerendert');
  const { settings, updateSetting, language } = useAccessibility();
  const trans = translations[language];
  const {
    text,
    setText,
    isPaused,
    isSpeaking,
    isEnded,
    speak,
    pause,
    cancel,
    supported,
    voices,
    selectedVoice,
    setSelectedVoice,
  } = useTextToSpeech({ lang: language });

  if (!supported) {
    return (
      <div className="fixed top-4 right-4 bg-gray-800 text-white p-2 rounded-lg shadow-2xl z-[100000] speech-controls-container">
        <div style={{background:'lime',color:'#000',fontWeight:'bold',padding:4}}>MOBILE-VARIANTE</div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base font-bold">{trans.textToSpeech}</h3>
          <button 
            onClick={() => updateSetting('textToSpeech', false)}
            className="text-gray-400 hover:text-white"
            aria-label={trans.closeAccessibilityMenu}
          >
            <X size={20} />
          </button>
        </div>
        <p>{trans.textToSpeechNotSupported || 'Text-to-Speech is not supported by your browser.'}</p>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-gray-800 text-white p-2 rounded-lg shadow-2xl z-[100000] speech-controls-container">
      <div style={{background:'lime',color:'#000',fontWeight:'bold',padding:4}}>MOBILE-VARIANTE</div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-bold">{trans.textToSpeech}</h3>
        <button 
          onClick={() => updateSetting('textToSpeech', false)}
          className="text-gray-400 hover:text-white"
          aria-label={trans.closeAccessibilityMenu}
        >
          <X size={20} />
        </button>
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <select
            value={selectedVoice?.voiceURI || ''}
            onChange={(e) => {
              const voice = voices.find(v => v.voiceURI === e.target.value);
              if (voice) setSelectedVoice(voice);
            }}
            className="w-full bg-gray-700 border-gray-600 rounded-md p-1 text-xs"
            aria-label="Select voice"
          >
            {voices.map(voice => (
              <option key={voice.voiceURI} value={voice.voiceURI}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          className="w-full bg-gray-700 border-gray-600 rounded-md p-1 text-xs"
          placeholder={trans.selectTextToReadAloud || 'Select text to read aloud...'}
          aria-label="Text to read"
        />
        <div className="flex justify-between items-center gap-1 flex-wrap">
          {isSpeaking && !isPaused ? (
            <button onClick={pause} className="px-2 py-1 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded-md flex-grow">Pause</button>
          ) : (
            <button onClick={speak} className="px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-md flex-grow">{isPaused ? 'Resume' : 'Speak'}</button>
          )}
          <button onClick={cancel} disabled={!isSpeaking && isEnded} className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-md flex-grow disabled:bg-red-800 disabled:cursor-not-allowed">Stop</button>
          <button onClick={() => {
            const selectedText = window.getSelection()?.toString().trim();
            if (selectedText) setText(selectedText);
          }} className="px-2 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded-md flex-grow">Use selection</button>
        </div>
      </div>
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

export function exportSpeechControlsOverlayWithLabels(show: boolean, labels: SpeechControlsLabels, defaultLang: string = 'de-DE', isMobile: boolean = false) {
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
          ${isMobile
            ? `width: 45vw; max-width: 180px; min-width: unset; right: 1rem; left: unset; top: 1rem; padding: 8px; position: fixed;`
            : `min-width: 340px; left: calc(100vw - 500px); top: 60px; padding: 20px; position: absolute;`}
          box-shadow: 0 4px 24px rgba(0,0,0,0.2);
          z-index: 1000001;
          user-select: none;
        }
        #speech-controls-plain-overlay textarea {
          width: 100%; border-radius: 6px; padding: 8px; font-size: 16px; color: #222;
        }
        #speech-controls-plain-overlay button {
          ${isMobile
            ? 'padding: 2px 4px; font-size: 8px; border-radius: 6px; border: none; font-weight: bold; margin-right: 1px; margin-bottom: 1px; cursor: pointer;'
            : 'padding: 6px 14px; border-radius: 6px; border: none; font-weight: bold; margin-right: 4px; margin-bottom: 2px; cursor: pointer;'}
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

    // Automatisches Übernehmen von kopiertem/markiertem Text auf Mobilgeräten
    if (isMobile) {
      const updateSelection = () => {
        const selection = window.getSelection();
        const selectedText = selection && selection.toString().trim();
        if (selectedText) {
          const textarea = container.querySelector('#speech-controls-textarea') as HTMLTextAreaElement | null;
          if (textarea) textarea.value = selectedText;
        }
      };
      document.addEventListener('selectionchange', updateSelection);
      // Clean up beim Schließen
      (container.querySelector('#speech-controls-close') as HTMLButtonElement | null)!.addEventListener('click', () => {
        document.removeEventListener('selectionchange', updateSelection);
      });
    }
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