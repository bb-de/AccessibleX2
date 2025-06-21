import React from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Tablet, Monitor, Hand, Globe, MonitorSmartphone, RotateCw } from 'lucide-react';
import { detectBrowser, detectOS } from '@/lib/device-detection';

export function DeviceInfo() {
  const { deviceInfo } = useAccessibility();
  
  // Browser und OS-Informationen ermitteln
  const browser = detectBrowser();
  const os = detectOS();

  const getDeviceIcon = () => {
    if (deviceInfo.isMobile) return <Smartphone className="w-4 h-4" />;
    if (deviceInfo.isTablet) return <Tablet className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  const getDeviceColor = () => {
    if (deviceInfo.isMobile) return 'bg-blue-500';
    if (deviceInfo.isTablet) return 'bg-green-500';
    return 'bg-purple-500';
  };

  const getBrowserColor = () => {
    switch (browser.toLowerCase()) {
      case 'chrome': return 'text-blue-600';
      case 'firefox': return 'text-orange-600';
      case 'safari': return 'text-blue-500';
      case 'edge': return 'text-blue-700';
      case 'opera': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getOSColor = () => {
    switch (os.toLowerCase()) {
      case 'windows': return 'text-blue-600';
      case 'macos': return 'text-gray-600';
      case 'linux': return 'text-orange-600';
      case 'android': return 'text-green-600';
      case 'ios': return 'text-gray-800';
      default: return 'text-gray-600';
    }
  };

  const getOrientationColor = () => {
    return deviceInfo.isPortrait ? 'text-blue-600' : 'text-green-600';
  };

  const getOrientationIcon = () => {
    return deviceInfo.isPortrait ? (
      <div className="w-4 h-4 border-2 border-current rounded-sm flex items-center justify-center">
        <div className="w-1 h-2 bg-current"></div>
      </div>
    ) : (
      <div className="w-4 h-4 border-2 border-current rounded-sm flex items-center justify-center">
        <div className="w-2 h-1 bg-current"></div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getDeviceIcon()}
          Geräteerkennung
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Gerätetyp:</span>
          <Badge className={getDeviceColor()}>
            {deviceInfo.deviceType === 'mobile' && 'Mobil'}
            {deviceInfo.deviceType === 'tablet' && 'Tablet'}
            {deviceInfo.deviceType === 'desktop' && 'Desktop'}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Touch-Gerät:</span>
          <div className="flex items-center gap-2">
            {deviceInfo.isTouchDevice ? (
              <>
                <Hand className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">Ja</span>
              </>
            ) : (
              <span className="text-sm text-gray-500">Nein</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Orientierung:</span>
          <div className="flex items-center gap-2">
            {deviceInfo.isDesktop ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 rounded-sm flex items-center justify-center">
                  <div className="w-2 h-1 bg-gray-400"></div>
                </div>
                <span className="text-sm text-gray-500">Desktop (fest)</span>
              </>
            ) : (
              <>
                {getOrientationIcon()}
                <span className={`text-sm ${getOrientationColor()}`}>
                  {deviceInfo.isPortrait ? 'Hochformat' : 'Querformat'}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium">Bildschirmbreite:</span>
            <p className="text-sm text-gray-600">{deviceInfo.screenWidth}px</p>
          </div>
          <div>
            <span className="text-sm font-medium">Bildschirmhöhe:</span>
            <p className="text-sm text-gray-600">{deviceInfo.screenHeight}px</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-500" />
            <div>
              <span className="text-sm font-medium">Browser:</span>
              <p className={`text-sm ${getBrowserColor()}`}>{browser}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MonitorSmartphone className="w-4 h-4 text-green-500" />
            <div>
              <span className="text-sm font-medium">Betriebssystem:</span>
              <p className={`text-sm ${getOSColor()}`}>{os}</p>
            </div>
          </div>
        </div>

        {deviceInfo.isMobile && (
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
            <RotateCw className="w-4 h-4 text-blue-600" />
            <div>
              <span className="text-sm font-medium text-blue-800">Orientierungswinkel:</span>
              <p className="text-sm text-blue-600">{deviceInfo.orientationAngle}°</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <span className="text-sm font-medium">User Agent:</span>
          <p className="text-xs text-gray-500 bg-gray-100 p-2 rounded break-all">
            {deviceInfo.userAgent}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {deviceInfo.isMobile && (
            <Badge variant="secondary">Mobile</Badge>
          )}
          {deviceInfo.isTablet && (
            <Badge variant="secondary">Tablet</Badge>
          )}
          {deviceInfo.isDesktop && (
            <Badge variant="secondary">Desktop</Badge>
          )}
          {deviceInfo.isTouchDevice && (
            <Badge variant="outline">Touch</Badge>
          )}
          {deviceInfo.isPortrait && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700">Hochformat</Badge>
          )}
          {deviceInfo.isLandscape && (
            <Badge variant="outline" className="bg-green-50 text-green-700">Querformat</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 