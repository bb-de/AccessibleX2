// Debug-Script für Accessibility Settings
// Führen Sie dies in der Browser-Konsole aus

console.log('=== Accessibility Settings Debug ===');

// 1. Aktuelle localStorage-Werte prüfen
console.log('1. localStorage Werte:');
console.log('accessibility-settings:', localStorage.getItem('accessibility-settings'));
console.log('accessibility-language:', localStorage.getItem('accessibility-language'));

// 2. Test-Einstellungen speichern
console.log('\n2. Test-Einstellungen speichern...');
const testSettings = {
  contrastMode: 'high',
  saturation: 80,
  monochrome: 20,
  textColor: 'blue',
  titleColor: 'red',
  backgroundColor: 'white',
  textSize: 2,
  lineHeight: 1,
  letterSpacing: 1,
  darkMode: true,
  hideImages: false,
  stopAnimations: true,
  highlightTitles: true,
  highlightLinks: true,
  textToSpeech: false,
  readingMask: false,
  readingGuide: false,
  fontFamily: 'readable',
  wordSpacing: 30,
  textAlign: 'left',
  keyboardNavigation: true,
  highlightFocus: true,
  customCursor: true,
  cursorSize: 'bigger',
  cursorColor: 'red',
  virtualKeyboard: false,
  pageStructure: false
};

try {
  localStorage.setItem('accessibility-settings', JSON.stringify(testSettings));
  console.log('✅ Test-Einstellungen gespeichert');
} catch (error) {
  console.error('❌ Fehler beim Speichern:', error);
}

// 3. Gespeicherte Einstellungen wieder laden
console.log('\n3. Gespeicherte Einstellungen laden...');
try {
  const savedSettings = localStorage.getItem('accessibility-settings');
  if (savedSettings) {
    const parsedSettings = JSON.parse(savedSettings);
    console.log('✅ Einstellungen erfolgreich geladen:', parsedSettings);
    
    // Prüfen, ob alle Werte korrekt sind
    console.log('\n4. Werte-Vergleich:');
    console.log('textSize:', parsedSettings.textSize, 'vs erwartet:', testSettings.textSize);
    console.log('darkMode:', parsedSettings.darkMode, 'vs erwartet:', testSettings.darkMode);
    console.log('contrastMode:', parsedSettings.contrastMode, 'vs erwartet:', testSettings.contrastMode);
  } else {
    console.log('❌ Keine Einstellungen gefunden');
  }
} catch (error) {
  console.error('❌ Fehler beim Laden:', error);
}

// 5. localStorage Speicherplatz prüfen
console.log('\n5. localStorage Speicherplatz:');
try {
  const testKey = 'test-storage';
  let testData = '';
  let counter = 0;
  
  while (true) {
    testData += 'x'.repeat(1000);
    localStorage.setItem(testKey, testData);
    counter++;
  }
} catch (error) {
  console.log(`Speicherplatz erreicht nach ${counter} KB`);
  localStorage.removeItem('test-storage');
}

// 6. React State prüfen (falls verfügbar)
console.log('\n6. React State prüfen:');
if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  console.log('React DevTools verfügbar');
} else {
  console.log('React DevTools nicht verfügbar');
}

// 7. Accessibility Widget prüfen
console.log('\n7. Accessibility Widget prüfen:');
const widget = document.querySelector('[data-accessibility-widget]');
if (widget) {
  console.log('✅ Widget gefunden:', widget);
} else {
  console.log('❌ Widget nicht gefunden');
}

// 8. CSS-Styles prüfen
console.log('\n8. CSS-Styles prüfen:');
const accessibilityStyles = document.getElementById('accessibility-styles');
if (accessibilityStyles) {
  console.log('✅ Accessibility Styles gefunden:', accessibilityStyles.textContent.substring(0, 100) + '...');
} else {
  console.log('❌ Accessibility Styles nicht gefunden');
}

console.log('\n=== Debug abgeschlossen ==='); 