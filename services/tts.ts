import { Language } from '../types';

let voices: SpeechSynthesisVoice[] = [];

// Helper to ensure voices are loaded (Chrome/Android is async)
const loadVoices = () => {
  voices = window.speechSynthesis.getVoices();
};

// Initialize voices
if ('speechSynthesis' in window) {
  loadVoices();
  // Chrome/Android fires this event when voices are ready
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

export const speak = (text: string, lang: Language) => {
  if (!('speechSynthesis' in window)) return;

  // Cancel any ongoing speech to prevent queue buildup and overlapping
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Ensure we have voices loaded
  if (voices.length === 0) loadVoices();

  const langCode = lang === 'id' ? 'id' : 'en';
  const specificLangCode = lang === 'id' ? 'id-ID' : 'en-US';

  // Filter for the requested language
  const availableVoices = voices.filter(v => v.lang.startsWith(langCode));

  // Strategy: Prioritize known high-quality "Natural" or "Google" female-sounding voices
  // Order of preference:
  // 1. Google Voices (High quality, usually female default for US/ID)
  // 2. "Natural" or "Premium" identifiers (iOS/macOS high quality)
  // 3. Known female voice names (Samantha, Zira, etc.)
  let preferredVoice = availableVoices.find(v => 
    v.name.includes('Google') || 
    v.name.includes('Natural') ||
    v.name.includes('Premium')
  );

  if (!preferredVoice) {
    preferredVoice = availableVoices.find(v => 
      v.name.includes('Female') || 
      v.name.includes('Zira') ||    // Windows Female
      v.name.includes('Samantha') || // macOS Female
      v.name.includes('Damayanti') || // Indo Female
      v.name.includes('Sinta')        // Indo Female
    );
  }

  // If we found a preferred voice, use it
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  utterance.lang = specificLangCode;
  
  // Tweak rate and pitch for a friendlier, more natural tone
  // Rate 0.9 is slightly slower and clearer for toddlers
  // Pitch 1.0-1.1 is standard female range; too high becomes robotic
  utterance.rate = 0.9;
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
};