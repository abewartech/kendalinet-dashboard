import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kendalinet.dashboard',
  appName: 'KendaliNet',
  webDir: 'dist',
  server: {
    androidScheme: 'http'
  }
};

export default config;
