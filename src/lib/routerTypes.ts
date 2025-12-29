export interface RouterProfile {
  id: string;
  name: string;
  ipAddress: string;
  username: string;
  password: string;
  isActive: boolean;
  lastConnected?: string;
  status?: 'online' | 'offline' | 'unknown';
}

export interface RouterStatus {
  routerId: string;
  isOnline: boolean;
  uptime?: number;
  downloadSpeed?: number;
  uploadSpeed?: number;
  connectedDevices?: number;
  lastChecked: string;
}
