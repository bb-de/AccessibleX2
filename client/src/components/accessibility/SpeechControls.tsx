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
    <div className="fixed right-6 bottom-6 w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-[10000] flex flex-col gap-3 control-panel">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="inline w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6h13M9 6l-7 7 7 7" /></svg>
        </span>
        <span className="font-semibold text-gray-700">Speech Controls</span>
        <button className="ml-auto text-xs text-blue-500 underline" onClick={handleUseSelection}>Markierung übernehmen</button>
      </div>
      <button className="w-full py-2 rounded-lg bg-green-600 text-white font-semibold flex items-center justify-center gap-2 text-lg btn-material" onClick={handleStart}>
        <span>▶️</span> Start
      </button>
      <button className="w-full py-2 rounded-lg bg-orange-200 text-orange-900 font-semibold flex items-center justify-center gap-2 text-lg btn-material" onClick={handlePause}>
        <span>⏸️</span> Pause
      </button>
      <button className="w-full py-2 rounded-lg bg-red-300 text-red-900 font-semibold flex items-center justify-center gap-2 text-lg btn-material" onClick={handleStop}>
        <span>⏹️</span> Stop
      </button>
      <div className="bg-gray-50 rounded-md p-2 mt-1">
        <div className="text-xs text-gray-500">Status:</div>
        <div className={`font-semibold ${status === 'error' ? 'text-red-600' : 'text-gray-700'}`}>{error ? error : STATUS[status]}</div>
      </div>
      <div className="mt-2">
        <label className="text-xs text-gray-700 font-medium">Geschwindigkeit:</label>
        <input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={handleRateChange} className="w-full accent-blue-600" />
        <div className="text-center text-sm mt-1">{rate.toFixed(1)}x</div>
      </div>
    </div>
  );
} 