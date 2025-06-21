/**
 * Utility-Funktionen für die Geräteerkennung
 * Können sowohl in React-Komponenten als auch in reinem JavaScript verwendet werden
 */

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  screenWidth: number;
  screenHeight: number;
  userAgent: string;
  platform: string;
  browser: string;
  os: string;
}

/**
 * Erkennt Touch-Geräte
 */
export function detectTouchDevice(): boolean {
  return 'ontouchstart' in window || 
         navigator.maxTouchPoints > 0 || 
         (navigator as any).msMaxTouchPoints > 0;
}

/**
 * Erkennt mobile Geräte basierend auf User-Agent
 */
export function detectMobileUA(): boolean {
  const userAgent = navigator.userAgent.toLowerCase();
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
}

/**
 * Erkennt Tablet-Geräte basierend auf User-Agent
 */
export function detectTabletUA(): boolean {
  const userAgent = navigator.userAgent.toLowerCase();
  return /ipad|android(?=.*\b(?!.*mobile))/i.test(userAgent);
}

/**
 * Erkennt das Betriebssystem
 */
export function detectOS(): string {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/windows/i.test(userAgent)) return 'Windows';
  if (/macintosh|mac os x/i.test(userAgent)) return 'macOS';
  if (/linux/i.test(userAgent)) return 'Linux';
  if (/android/i.test(userAgent)) return 'Android';
  if (/iphone|ipad|ipod/i.test(userAgent)) return 'iOS';
  if (/blackberry/i.test(userAgent)) return 'BlackBerry';
  
  return 'Unknown';
}

/**
 * Erkennt den Browser
 */
export function detectBrowser(): string {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/chrome/i.test(userAgent) && !/edge/i.test(userAgent)) return 'Chrome';
  if (/firefox/i.test(userAgent)) return 'Firefox';
  if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return 'Safari';
  if (/edge/i.test(userAgent)) return 'Edge';
  if (/opera|opr/i.test(userAgent)) return 'Opera';
  if (/msie|trident/i.test(userAgent)) return 'Internet Explorer';
  
  return 'Unknown';
}

/**
 * Erkennt die Plattform (Desktop, Mobile, Tablet)
 */
export function detectPlatform(): string {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
    if (/ipad|android(?=.*\b(?!.*mobile))/i.test(userAgent)) {
      return 'tablet';
    }
    return 'mobile';
  }
  
  return 'desktop';
}

/**
 * Vollständige Geräteerkennung
 */
export function detectDevice(): DeviceInfo {
  const userAgent = navigator.userAgent;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  
  // Touch-Gerät erkennen
  const isTouchDevice = detectTouchDevice();
  
  // User-Agent-basierte Erkennung
  const isMobileUA = detectMobileUA();
  const isTabletUA = detectTabletUA();
  
  // Bildschirmgröße-basierte Erkennung
  const isMobileScreen = screenWidth < 768;
  const isTabletScreen = screenWidth >= 768 && screenWidth < 1024;

  // Robustere kombinierte Erkennung
  let deviceType: 'mobile' | 'tablet' | 'desktop';

  if (isMobileUA) {
    deviceType = 'mobile';
  } else if (isTabletUA) {
    deviceType = 'tablet';
  } else if (isMobileScreen) {
    deviceType = 'mobile';
  } else if (isTabletScreen) {
    deviceType = 'tablet';
  } else {
    deviceType = 'desktop';
  }

  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';
  const isDesktop = deviceType === 'desktop';

  return {
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,
    deviceType,
    screenWidth,
    screenHeight,
    userAgent,
    platform: detectPlatform(),
    browser: detectBrowser(),
    os: detectOS()
  };
}

/**
 * Event-Listener für Geräteänderungen
 */
export function onDeviceChange(callback: (deviceInfo: DeviceInfo) => void): () => void {
  const handleResize = () => {
    callback(detectDevice());
  };

  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleResize);
  };
}

/**
 * Utility-Funktionen für spezifische Gerätetypen
 */
export const isMobile = () => detectDevice().isMobile;
export const isTablet = () => detectDevice().isTablet;
export const isDesktop = () => detectDevice().isDesktop;
export const isTouchDevice = () => detectDevice().isTouchDevice;

/**
 * Responsive Breakpoints
 */
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1024
} as const;

/**
 * Prüft, ob die aktuelle Bildschirmgröße einem bestimmten Breakpoint entspricht
 */
export function isBreakpoint(breakpoint: keyof typeof BREAKPOINTS): boolean {
  const width = window.innerWidth;
  
  switch (breakpoint) {
    case 'MOBILE':
      return width < BREAKPOINTS.MOBILE;
    case 'TABLET':
      return width >= BREAKPOINTS.MOBILE && width < BREAKPOINTS.TABLET;
    case 'DESKTOP':
      return width >= BREAKPOINTS.DESKTOP;
    default:
      return false;
  }
} 