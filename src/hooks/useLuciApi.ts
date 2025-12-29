import { useState, useEffect } from 'react';
import { ubusCall, getSystemInfo, getNetworkInterfaceStatus, getBoardInfo } from '@/lib/ubusApi';

// Tentukan base URL router (IP Lokal).
const ROUTER_DOMAIN = 'http://192.168.2.1';

// Deteksi lingkungan yang lebih kuat untuk Android APK (Capacitor)
const IS_CAPACITOR =
    // @ts-ignore
    (window.Capacitor && window.Capacitor.isNative) ||
    window.location.hostname === 'localhost' && !window.location.port.includes('80');

const BASE_URL = IS_CAPACITOR ? ROUTER_DOMAIN : '';
const API_BASE = `${BASE_URL}/cgi-bin/luci/admin/kendalinet/api`;
const CGI_BASE = `${BASE_URL}/cgi-bin/kendalinet`;

console.log(`[KendaliNet] Environment: ${IS_CAPACITOR ? 'Capacitor/Native' : 'Web/Proxy'} | Base: ${BASE_URL || '(Relative)'}`);

if (IS_CAPACITOR) {
    console.log(`[KendaliNet] Running in Capacitor mode. API Base: ${BASE_URL}`);
}

export type ApiMethod = 'ubus' | 'luci' | 'cgi';

export interface UseLuciApiOptions {
    enabled?: boolean;
    method?: ApiMethod;
}

export const useLuciApi = (enabled: boolean = true, method: ApiMethod = 'cgi') => {
    const [status, setStatus] = useState<any>(null);
    const [devices, setDevices] = useState<any[]>([]);
    const [wifi, setWifi] = useState<any>(null);
    const [system, setSystem] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStatus = async () => {
        const url = method === 'cgi' ? `${CGI_BASE}/status.sh` : `${API_BASE}/status`;
        try {
            setError(null);
            let data: any;

            if (method === 'ubus') {
                try {
                    const [systemInfo, wanStatus] = await Promise.all([
                        getSystemInfo(),
                        getNetworkInterfaceStatus('wan').catch(() => null)
                    ]);

                    const rx = wanStatus?.statistics?.rx_bytes || 0;
                    const tx = wanStatus?.statistics?.tx_bytes || 0;

                    data = {
                        speed: 0,
                        rx_mb: Math.floor(rx / 1024 / 1024),
                        tx_mb: Math.floor(tx / 1024 / 1024),
                        online: wanStatus?.up || false,
                        uptime: systemInfo.uptime || 0
                    };
                } catch (ubusErr: any) {
                    console.warn('UBUS API failed, trying LuCI controller fallback:', ubusErr.message);
                    const res = await fetch(`${API_BASE}/status`);
                    if (!res.ok) throw new Error(`HTTP ${res.status}: Fallback status failed`);
                    data = await res.json();
                }
            } else if (method === 'cgi') {
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP ${res.status}: status.sh failed`);
                data = await res.json();
            } else {
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP ${res.status}: API status failed`);
                data = await res.json();
            }

            setStatus(data);
        } catch (err: any) {
            const errorMessage = `[Status] Fail: ${err.message} | Path: ${url}`;
            setError(prev => prev ? `${prev}\n${errorMessage}` : errorMessage);
            console.error(errorMessage);
        }
    };

    const fetchDevices = async () => {
        const url = method === 'cgi' || method === 'ubus' ? `${CGI_BASE}/devices.sh` : `${API_BASE}/devices`;
        try {
            setError(null);
            let data: any[];

            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch devices`);
            data = await res.json();

            setDevices(data || []);
        } catch (err: any) {
            const errorMessage = `[Devices] Fail: ${err.message} | Path: ${url}`;
            setError(prev => prev ? `${prev}\n${errorMessage}` : errorMessage);
            console.error(errorMessage);
            setDevices([]);
        }
    };

    const fetchWifi = async () => {
        const url = method === 'cgi' ? `${CGI_BASE}/wifi.sh` : `${API_BASE}/wifi`;
        try {
            setError(null);
            let data: any;

            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch wifi`);
            data = await res.json();

            setWifi(data);
        } catch (err: any) {
            const errorMessage = `[WiFi] Fail: ${err.message} | Path: ${url}`;
            setError(prev => prev ? `${prev}\n${errorMessage}` : errorMessage);
            console.error(errorMessage);
        }
    };

    const fetchSystem = async () => {
        const url = method === 'cgi' ? `${CGI_BASE}/system.sh` : `${API_BASE}/system`;
        try {
            setError(null);
            let data: any;

            if (method === 'ubus') {
                try {
                    // Use ubus API for system info
                    const [systemInfo, boardInfo] = await Promise.all([
                        getSystemInfo(),
                        getBoardInfo().catch(() => ({}))
                    ]);

                    const memory = systemInfo.memory || { total: 0, available: 0, free: 0 };
                    const total_mem = memory.total;
                    const available_mem = memory.available || memory.free;
                    const used_mem = total_mem - available_mem;
                    const mem_percent = total_mem > 0 ? Math.floor((used_mem / total_mem) * 100) : 0;

                    data = {
                        model: boardInfo.model || 'OpenWrt Device',
                        firmware: boardInfo.release?.description || 'OpenWrt',
                        cpu_load: systemInfo.load?.[0] ? (systemInfo.load[0] / 65536).toFixed(2) : '0.00',
                        memory_percent: mem_percent,
                        uptime: systemInfo.uptime || 0,
                        hostname: boardInfo.hostname || 'OpenWrt'
                    };
                } catch (ubusErr: any) {
                    // If ubus fails, try fallback to LuCI controller
                    console.warn('UBUS API failed, trying LuCI controller fallback:', ubusErr.message);
                    const res = await fetch(`${API_BASE}/system`);
                    if (!res.ok) throw new Error(`HTTP ${res.status}: Fallback system failed`);
                    data = await res.json();
                }
            } else if (method === 'cgi') {
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP ${res.status}: system.sh failed`);
                data = await res.json();
            } else {
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP ${res.status}: API system failed`);
                data = await res.json();
            }

            setSystem(data);
        } catch (err: any) {
            const errorMessage = `[System] Fail: ${err.message} | Path: ${url}`;
            setError(prev => prev ? `${prev}\n${errorMessage}` : errorMessage);
            console.error(errorMessage);
        }
    };

    const saveWifi = async (ssid: string, hidden: boolean, password?: string) => {
        try {
            if (method === 'cgi') {
                // CGI method - send as JSON
                const res = await fetch(`${CGI_BASE}/wifi_save.sh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ssid, hidden, password }),
                });
                if (!res.ok) throw new Error('Failed to save wifi');
                return await res.json();
            } else {
                // Legacy LuCI controller method
                const formData = new FormData();
                formData.append('ssid', ssid);
                formData.append('hidden', hidden ? 'true' : 'false');
                if (password) {
                    formData.append('password', password);
                }

                const res = await fetch(`${API_BASE}/wifi_save`, {
                    method: 'POST',
                    body: formData,
                });
                if (!res.ok) throw new Error('Failed to save wifi');
                return await res.json();
            }
        } catch (err: any) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    useEffect(() => {
        if (!enabled) return;

        setLoading(true);
        const loadData = async () => {
            await Promise.all([fetchStatus(), fetchDevices(), fetchWifi(), fetchSystem()]);
            setLoading(false);
        };

        loadData();

        const interval = setInterval(() => {
            fetchStatus();
            fetchDevices();
            fetchSystem();
        }, 5000);

        return () => clearInterval(interval);
    }, [enabled, method]);

    return { status, devices, wifi, system, loading, error, fetchStatus, fetchDevices, fetchWifi, fetchSystem, saveWifi };
};
