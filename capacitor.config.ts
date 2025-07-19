import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.a6bc4feff7a2445daa8cbcbe3f3b79e3',
  appName: 'candid-lens-collective',
  webDir: 'dist',
  server: {
    url: 'https://a6bc4fef-f7a2-445d-aa8c-bcbe3f3b79e3.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;