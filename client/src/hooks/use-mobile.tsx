import * as React from "react"

const MOBILE_BREAKPOINT = 768

// Erweiterte Geräteerkennung mit User-Agent und Touch-Support
export function useDeviceDetection() {
  const [deviceInfo, setDeviceInfo] = React.useState<{
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isTouchDevice: boolean;
    deviceType: 'mobile' | 'tablet' | 'desktop';
    screenWidth: number;
    screenHeight: number;
    userAgent: string;
    orientation: 'portrait' | 'landscape';
    isPortrait: boolean;
    isLandscape: boolean;
    orientationAngle: number;
  }>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
    deviceType: 'desktop',
    screenWidth: 0,
    screenHeight: 0,
    userAgent: '',
    orientation: 'portrait',
    isPortrait: true,
    isLandscape: false,
    orientationAngle: 0
  });

  React.useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      // Touch-Gerät erkennen
      const isTouchDevice = 'ontouchstart' in window || 
                           navigator.maxTouchPoints > 0 || 
                           (navigator as any).msMaxTouchPoints > 0;

      // User-Agent-basierte Erkennung
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isTabletUA = /ipad|android(?=.*\b(?!.*mobile))/i.test(userAgent);
      
      // Bildschirmgröße-basierte Erkennung
      const isMobileScreen = screenWidth < 768;
      const isTabletScreen = screenWidth >= 768 && screenWidth < 1024;
      const isDesktopScreen = screenWidth >= 1024;

      // Kombinierte Erkennung (User-Agent + Bildschirmgröße + Touch-Support)
      let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
      let isMobile = false;
      let isTablet = false;
      let isDesktop = true;

      // Mobile-Geräte erkennen
      if (isMobileUA || (isMobileScreen && isTouchDevice)) {
        deviceType = 'mobile';
        isMobile = true;
        isTablet = false;
        isDesktop = false;
      }
      // Tablet-Geräte erkennen
      else if (isTabletUA || (isTabletScreen && isTouchDevice)) {
        deviceType = 'tablet';
        isMobile = false;
        isTablet = true;
        isDesktop = false;
      }
      // Desktop-Geräte (alles andere)
      else {
        deviceType = 'desktop';
        isMobile = false;
        isTablet = false;
        isDesktop = true;
      }

      // Orientierung nur für mobile und Tablet-Geräte erkennen
      let orientation: 'portrait' | 'landscape' = 'portrait';
      let isPortrait = true;
      let isLandscape = false;
      let orientationAngle = 0;

      if (isMobile || isTablet) {
        // Orientierung nur für mobile/Tablet-Geräte
        isPortrait = screenHeight > screenWidth;
        isLandscape = screenWidth > screenHeight;
        orientation = isPortrait ? 'portrait' : 'landscape';
        orientationAngle = (window as any).orientation || 0;
      } else {
        // Desktop-Geräte: Immer Landscape-Modus (keine Orientierungsänderungen)
        orientation = 'landscape';
        isPortrait = false;
        isLandscape = true;
        orientationAngle = 0;
      }

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        isTouchDevice,
        deviceType,
        screenWidth,
        screenHeight,
        userAgent,
        orientation,
        isPortrait,
        isLandscape,
        orientationAngle
      });
    };

    // Initiale Erkennung
    detectDevice();

    // Event-Listener für Bildschirmgrößenänderungen
    const handleResize = () => {
      // Kleine Verzögerung für bessere Stabilität bei Orientierungsänderungen
      setTimeout(detectDevice, 100);
    };

    // Event-Listener für Orientierungsänderungen (nur für mobile/Tablet)
    const handleOrientationChange = () => {
      // Nur für mobile und Tablet-Geräte reagieren
      const currentDeviceInfo = deviceInfo;
      if (currentDeviceInfo.isMobile || currentDeviceInfo.isTablet) {
        // Sofortige Reaktion auf Orientierungsänderungen
        setTimeout(detectDevice, 50);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [deviceInfo.isMobile, deviceInfo.isTablet]); // Abhängigkeiten hinzugefügt

  return deviceInfo;
}

// Legacy Hook für Rückwärtskompatibilität
export function useIsMobile() {
  const { isMobile } = useDeviceDetection();
  return isMobile;
}

// Neue Hooks für spezifische Gerätetypen
export function useIsTablet() {
  const { isTablet } = useDeviceDetection();
  return isTablet;
}

export function useIsDesktop() {
  const { isDesktop } = useDeviceDetection();
  return isDesktop;
}

export function useIsTouchDevice() {
  const { isTouchDevice } = useDeviceDetection();
  return isTouchDevice;
}

// Neue Hooks für Orientierung
export function useOrientation() {
  const { orientation, isPortrait, isLandscape, orientationAngle } = useDeviceDetection();
  return { orientation, isPortrait, isLandscape, orientationAngle };
}

export function useIsPortrait() {
  const { isPortrait } = useDeviceDetection();
  return isPortrait;
}

export function useIsLandscape() {
  const { isLandscape } = useDeviceDetection();
  return isLandscape;
}
