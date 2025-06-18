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

  // DEBUG: Sichtbarkeitstest
  return (
    <div style={{ background: 'red', color: 'white', padding: 20, fontSize: 24, zIndex: 99999 }}>
      TEST: Speech Controls Overlay
    </div>
  );
} 