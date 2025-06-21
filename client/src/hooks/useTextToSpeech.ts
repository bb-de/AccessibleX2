import { useState, useEffect, useCallback } from 'react';

export function useTextToSpeech({ lang }: { lang: string }) {
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isEnded, setIsEnded] = useState(true);
  const [supported, setSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);

      const handleVoicesChanged = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        
        // Find a suitable default voice
        const defaultVoice = 
          availableVoices.find(v => v.lang === lang && v.default) ||
          availableVoices.find(v => v.lang === lang) ||
          availableVoices.find(v => v.lang.startsWith(lang.split('-')[0])) ||
          availableVoices.find(v => v.default) ||
          availableVoices[0];

        setSelectedVoice(defaultVoice || null);
      };
      
      handleVoicesChanged(); // Initial load
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        window.speechSynthesis.cancel();
      };
    }
  }, [lang]);

  const speak = useCallback(() => {
    if (!supported || !text) return;
    
    // If paused, resume. Otherwise, start new.
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any previous speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice?.lang || lang;
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setIsEnded(false);
    };
    utterance.onpause = () => {
      setIsSpeaking(false);
      setIsPaused(true);
      setIsEnded(false);
    };
    utterance.onresume = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setIsEnded(true);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setIsEnded(true);
    };
    
    window.speechSynthesis.speak(utterance);

  }, [text, supported, selectedVoice, lang, isPaused]);

  const pause = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsSpeaking(false);
  }, [supported]);

  const cancel = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setIsEnded(true);
  }, [supported]);

  return {
    text,
    setText,
    isSpeaking,
    isPaused,
    isEnded,
    speak,
    pause,
    cancel,
    supported,
    voices,
    selectedVoice,
    setSelectedVoice,
  };
} 