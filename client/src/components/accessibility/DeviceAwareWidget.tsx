import React from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Hand, 
  Mouse, 
  Keyboard,
  Volume2,
  Eye,
  Settings
} from 'lucide-react';

export function DeviceAwareWidget() {
  const { deviceInfo } = useAccessibility();

  // Gerätespezifische Anpassungen
  const getDeviceSpecificFeatures = () => {
    if (deviceInfo.isMobile) {
      return [
        { icon: Hand, label: 'Touch-Optimiert', description: 'Größere Touch-Targets' },
        { icon: Volume2, label: 'Sprachsteuerung', description: 'Voice-over-Unterstützung' },
        { icon: Eye, label: 'Bildschirmlesegerät', description: 'Optimiert für Screenreader' }
      ];
    } else if (deviceInfo.isTablet) {
      return [
        { icon: Hand, label: 'Touch & Stift', description: 'Touch und Stift-Unterstützung' },
        { icon: Keyboard, label: 'Externe Tastatur', description: 'Bluetooth-Tastatur-Unterstützung' },
        { icon: Settings, label: 'Adaptive UI', description: 'Anpassbare Benutzeroberfläche' }
      ];
    } else {
      return [
        { icon: Mouse, label: 'Maus-Navigation', description: 'Präzise Maussteuerung' },
        { icon: Keyboard, label: 'Tastatur-Shortcuts', description: 'Erweiterte Keyboard-Navigation' },
        { icon: Settings, label: 'Erweiterte Einstellungen', description: 'Vollständige Konfigurationsoptionen' }
      ];
    }
  };

  const getRecommendedSettings = () => {
    if (deviceInfo.isMobile) {
      return {
        textSize: 'Erhöht',
        contrast: 'Hoch',
        touchTargets: 'Groß',
        reason: 'Optimiert für Touch-Bedienung und mobile Nutzung'
      };
    } else if (deviceInfo.isTablet) {
      return {
        textSize: 'Mittel',
        contrast: 'Standard',
        touchTargets: 'Mittel',
        reason: 'Ausgewogen für Touch und Desktop-Nutzung'
      };
    } else {
      return {
        textSize: 'Standard',
        contrast: 'Standard',
        touchTargets: 'Maus/Tastatur',
        reason: 'Desktop-Layout bleibt konstant - keine Orientierungsänderungen'
      };
    }
  };

  const features = getDeviceSpecificFeatures();
  const recommendations = getRecommendedSettings();

  return (
    <div className="space-y-6">
      {/* Gerätespezifische Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {deviceInfo.isMobile && <Smartphone className="w-5 h-5" />}
            {deviceInfo.isTablet && <Tablet className="w-5 h-5" />}
            {deviceInfo.isDesktop && <Monitor className="w-5 h-5" />}
            Gerätespezifische Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <feature.icon className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">{feature.label}</h4>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Empfohlene Einstellungen */}
      <Card>
        <CardHeader>
          <CardTitle>Empfohlene Einstellungen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-sm text-blue-800">Textgröße</h4>
                <p className="text-lg font-bold text-blue-600">{recommendations.textSize}</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-sm text-green-800">Kontrast</h4>
                <p className="text-lg font-bold text-green-600">{recommendations.contrast}</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-sm text-purple-800">Touch-Targets</h4>
                <p className="text-lg font-bold text-purple-600">{recommendations.touchTargets}</p>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">{recommendations.reason}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Geräte-spezifische Aktionen */}
      <Card>
        <CardHeader>
          <CardTitle>Geräte-spezifische Aktionen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {deviceInfo.isMobile && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">Mobile Optimierung</h4>
                  <p className="text-xs text-gray-600">Aktivieren Sie mobile-spezifische Features</p>
                </div>
                <Button size="sm" variant="outline">Aktivieren</Button>
              </div>
            )}
            
            {deviceInfo.isTablet && (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">Tablet-Modus</h4>
                  <p className="text-xs text-gray-600">Optimieren Sie für Tablet-Nutzung</p>
                </div>
                <Button size="sm" variant="outline">Optimieren</Button>
              </div>
            )}
            
            {deviceInfo.isDesktop && (
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">Desktop-Features</h4>
                  <p className="text-xs text-gray-600">Erweiterte Desktop-Funktionen aktivieren</p>
                </div>
                <Button size="sm" variant="outline">Aktivieren</Button>
              </div>
            )}

            {deviceInfo.isTouchDevice && (
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">Touch-Optimierung</h4>
                  <p className="text-xs text-gray-600">Touch-Gerät erkannt - Optimierungen aktiv</p>
                </div>
                <Badge variant="secondary">Aktiv</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 