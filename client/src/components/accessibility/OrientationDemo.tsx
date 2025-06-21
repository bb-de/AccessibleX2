import React, { useEffect, useState } from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  RotateCw,
  SmartphoneIcon,
  TabletIcon,
  MonitorIcon
} from 'lucide-react';

export function OrientationDemo() {
  const { deviceInfo } = useAccessibility();
  const [orientationHistory, setOrientationHistory] = useState<Array<{
    timestamp: Date;
    orientation: 'portrait' | 'landscape';
    screenWidth: number;
    screenHeight: number;
  }>>([]);

  // Orientierungsänderungen verfolgen
  useEffect(() => {
    // Nur für mobile und Tablet-Geräte Orientierungsänderungen verfolgen
    if (deviceInfo.isMobile || deviceInfo.isTablet) {
      const newEntry = {
        timestamp: new Date(),
        orientation: deviceInfo.orientation,
        screenWidth: deviceInfo.screenWidth,
        screenHeight: deviceInfo.screenHeight
      };

      setOrientationHistory(prev => {
        const updated = [...prev, newEntry];
        // Nur die letzten 5 Einträge behalten
        return updated.slice(-5);
      });
    }
  }, [deviceInfo.orientation, deviceInfo.screenWidth, deviceInfo.screenHeight, deviceInfo.isMobile, deviceInfo.isTablet]);

  const getDeviceIcon = () => {
    if (deviceInfo.isMobile) return <Smartphone className="w-6 h-6" />;
    if (deviceInfo.isTablet) return <Tablet className="w-6 h-6" />;
    return <Monitor className="w-6 h-6" />;
  };

  const getOrientationAdvice = () => {
    if (deviceInfo.isMobile) {
      if (deviceInfo.isPortrait) {
        return {
          title: 'Mobile - Hochformat',
          description: 'Optimal für vertikales Scrollen und Touch-Bedienung',
          recommendations: [
            'Größere Touch-Targets verwenden',
            'Vertikale Navigation bevorzugen',
            'Textgröße erhöhen für bessere Lesbarkeit'
          ]
        };
      } else {
        return {
          title: 'Mobile - Querformat',
          description: 'Mehr Platz für Inhalte, aber kleinere Touch-Targets',
          recommendations: [
            'Kompaktere Darstellung möglich',
            'Horizontale Navigation nutzen',
            'Zwei-Spalten-Layout erwägen'
          ]
        };
      }
    } else if (deviceInfo.isTablet) {
      if (deviceInfo.isPortrait) {
        return {
          title: 'Tablet - Hochformat',
          description: 'Ausgewogene Darstellung zwischen Mobile und Desktop',
          recommendations: [
            'Mittlere Touch-Targets verwenden',
            'Flexible Layouts implementieren',
            'Stift-Unterstützung aktivieren'
          ]
        };
      } else {
        return {
          title: 'Tablet - Querformat',
          description: 'Desktop-ähnliche Erfahrung mit Touch-Unterstützung',
          recommendations: [
            'Desktop-Layouts anpassen',
            'Touch + Maus-Hybrid-Interaktionen',
            'Erweiterte Funktionen verfügbar machen'
          ]
        };
      }
    } else {
      return {
        title: 'Desktop',
        description: 'Vollständige Desktop-Funktionalität',
        recommendations: [
          'Maus und Tastatur optimiert',
          'Erweiterte Einstellungen verfügbar',
          'Vollständige Barrierefreiheits-Features'
        ]
      };
    }
  };

  const advice = getOrientationAdvice();

  const getResponsiveLayout = () => {
    if (deviceInfo.isMobile) {
      return deviceInfo.isPortrait ? 'mobile-portrait' : 'mobile-landscape';
    } else if (deviceInfo.isTablet) {
      return deviceInfo.isPortrait ? 'tablet-portrait' : 'tablet-landscape';
    } else {
      return 'desktop';
    }
  };

  const layout = getResponsiveLayout();

  return (
    <div className="space-y-6">
      {/* Aktuelle Orientierung */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCw className="w-5 h-5" />
            Orientierungsänderungen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Aktueller Status */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {getDeviceIcon()}
                <div>
                  <h4 className="font-medium">{advice.title}</h4>
                  <p className="text-sm text-gray-600">{advice.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-sm text-blue-800">Layout-Modus</h5>
                  <p className="text-lg font-bold text-blue-600">{layout}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-sm text-green-800">Aktuelle Orientierung</h5>
                  <p className="text-lg font-bold text-green-600">
                    {deviceInfo.isPortrait ? 'Hochformat' : 'Querformat'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {deviceInfo.screenWidth} × {deviceInfo.screenHeight}
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {deviceInfo.orientationAngle}°
                </Badge>
                {deviceInfo.isTouchDevice && (
                  <Badge variant="outline" className="bg-orange-50 text-orange-700">
                    Touch
                  </Badge>
                )}
              </div>
            </div>

            {/* Empfehlungen */}
            <div className="space-y-3">
              <h4 className="font-medium">Empfohlene Anpassungen:</h4>
              <ul className="space-y-2">
                {advice.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orientierungsverlauf */}
      <Card>
        <CardHeader>
          <CardTitle>Orientierungsverlauf</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {deviceInfo.isDesktop ? (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-2">Desktop-Geräte haben keine Orientierungsänderungen</p>
                <p className="text-sm text-gray-400">Das Layout bleibt konstant im Landscape-Modus</p>
              </div>
            ) : orientationHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Drehen Sie Ihr Gerät, um Orientierungsänderungen zu sehen
              </p>
            ) : (
              orientationHistory.map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      entry.orientation === 'portrait' ? 'bg-blue-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <span className="font-medium text-sm">
                        {entry.orientation === 'portrait' ? 'Hochformat' : 'Querformat'}
                      </span>
                      <p className="text-xs text-gray-600">
                        {entry.screenWidth} × {entry.screenHeight}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {entry.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
          
          {orientationHistory.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setOrientationHistory([])}
              >
                Verlauf löschen
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Responsive Anpassungen Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Responsive Anpassungen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`grid gap-4 ${
            deviceInfo.isDesktop ? 'grid-cols-3' :
            deviceInfo.isMobile && deviceInfo.isPortrait ? 'grid-cols-1' :
            deviceInfo.isMobile && deviceInfo.isLandscape ? 'grid-cols-2' :
            deviceInfo.isTablet ? 'grid-cols-2' :
            'grid-cols-3'
          }`}>
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <h4 className="font-medium text-blue-800">Navigation</h4>
              <p className="text-sm text-blue-600">
                {deviceInfo.isDesktop ? 'Desktop' :
                 deviceInfo.isMobile && deviceInfo.isPortrait ? 'Vertikal' :
                 deviceInfo.isMobile && deviceInfo.isLandscape ? 'Horizontal' :
                 'Flexibel'}
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <h4 className="font-medium text-green-800">Touch-Targets</h4>
              <p className="text-sm text-green-600">
                {deviceInfo.isDesktop ? 'Maus/Tastatur' :
                 deviceInfo.isMobile ? 'Groß' :
                 deviceInfo.isTablet ? 'Mittel' :
                 'Standard'}
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <h4 className="font-medium text-purple-800">Textgröße</h4>
              <p className="text-sm text-purple-600">
                {deviceInfo.isDesktop ? 'Standard' :
                 deviceInfo.isMobile ? 'Erhöht' :
                 deviceInfo.isTablet ? 'Angepasst' :
                 'Standard'}
              </p>
            </div>
          </div>
          
          {deviceInfo.isDesktop && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700 text-center">
                Desktop-Layout bleibt konstant und reagiert nicht auf Orientierungsänderungen
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 