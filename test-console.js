// Einfaches Test-Script für die Browser-Konsole
// Kopieren Sie diesen Code und fügen Sie ihn in die Browser-Konsole ein

console.log('=== Accessibility Settings Test ===');

// 1. Aktuelle Einstellungen prüfen
console.log('1. Aktuelle localStorage Einstellungen:');
const currentSettings = localStorage.getItem('accessibility-settings');
console.log(currentSettings ? JSON.parse(currentSettings) : 'Keine Einstellungen');

// 2. Test-Einstellung setzen
console.log('\n2. Test-Einstellung setzen...');
const testSetting = {
  ...JSON.parse(currentSettings || '{}'),
  textSize: 3,
  darkMode: true,
  contrastMode: 'high'
};

localStorage.setItem('accessibility-settings', JSON.stringify(testSetting));
console.log('✅ Test-Einstellung gespeichert:', testSetting);

// 3. Seite neu laden simulieren
console.log('\n3. Simuliere Seitenneuladen...');
console.log('Laden Sie die Seite jetzt neu (F5) und schauen Sie in die Konsole');

// 4. React State prüfen (falls verfügbar)
console.log('\n4. React State prüfen:');
if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  console.log('React DevTools verfügbar - schauen Sie in die React DevTools');
} else {
  console.log('React DevTools nicht verfügbar');
}

console.log('\n=== Test abgeschlossen ===');
console.log('Laden Sie die Seite neu und schauen Sie in die Konsole für Debug-Ausgaben'); 