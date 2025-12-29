import { useState, useEffect } from 'react';
import { ubusCall, getSystemInfo, getNetworkInterfaceStatus, getBoardInfo } from '@/lib/ubusApi';

const API_BASE = '/cgi-bin/luci/admin/kendalinet/api';
const CGI_BASE = '/cgi-bin/kendalinet';

export type ApiMethod = 'ubus' | 'luci' | 'cgi';

export interface UseLuciApiOptions {
    enabled?: boolean;
    method?: ApiMethod;
}

export const useLuciApi = (enabled: boolean = true, method: ApiMethod = 'ubus') => {
    const [status, setStatus] = useState<any>(null);
    const [devices, setDevices] = useState<any[]>([]);
    const [wifi, setWifi] = useState<any>(null);
    const [system, setSystem] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStatus = async () => {
        try {
            let data: any;

            if (method === 'ubus') {
                // Use ubus API - future-proof method
                const [systemInfo, wanStatus] = await Promise.all([
                    getSystemInfo(),
                    getNetworkInterfaceStatus('wan').catch(() => null)
                ]);

                const rx = wanStatus?.statistics?.rx_bytes || 0;
                const tx = wanStatus?.statistics?.tx_bytes || 0;

                data = {
                    speed: 0, // Speed calculation would need additional logic
                    rx_mb: Math.floor(rx / 1024 / 1024),
                    tx_mb: Math.floor(tx / 1024 / 1024),
                    online: wanStatus?.up || false,
                    uptime: systemInfo.uptime || 0
                };
            } else if (method === 'cgi') {
                // Use custom CGI scripts
                const res = await fetch(`${CGI_BASE}/status.sh`);
                if (!res.ok) throw new Error('Failed to fetch status');
                data = await res.json();
            } else {
                // Legacy LuCI controller method
                const res = await fetch(`${API_BASE}/status`);
                if (!res.ok) throw new Error('Failed to fetch status');
                data = await res.json();
            }

            setStatus(data);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const fetchDevices = async () => {
        try {
            let data: any[];

            if (method === 'ubus' || method === 'cgi') {
                // For ubus/cgi, use custom endpoint (ubus doesn't directly expose DHCP leases)
                const endpoint = method === 'cgi' ? `${CGI_BASE}/devices.sh` : `${CGI_BASE}/devices.sh`;
                const res = await fetch(endpoint);
                if (!res.ok) throw new Error('Failed to fetch devices');
                data = await res.json();
            } else {
                // Legacy LuCI controller method
                const res = await fetch(`${API_BASE}/devices`);
                if (!res.ok) throw new Error('Failed to fetch devices');
                data = await res.json();
            }

            setDevices(data);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const fetchWifi = async () => {
        try {
            let data: any;

            if (method === 'cgi') {
                const res = await fetch(`${CGI_BASE}/wifi.sh`);
                if (!res.ok) throw new Error('Failed to fetch wifi');
                data = await res.json();
            } else {
                // ubus doesn't have direct WiFi config, fallback to LuCI
                const res = await fetch(`${API_BASE}/wifi`);
                if (!res.ok) throw new Error('Failed to fetch wifi');
                data = await res.json();
            }

            setWifi(data);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const fetchSystem = async () => {
        try {
            let data: any;

            if (method === 'ubus') {
                // Use ubus API for system info
                const [systemInfo, boardInfo] = await Promise.all([
                    getSystemInfo(),
                    getBoardInfo().catch(() => ({}))
                ]);

                const memory = systemInfo.memory || {};
                const total_mem = memory.total || 0;
                const available_mem = memory.available || memory.free || 0;
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
            } else if (method === 'cgi') {
                const res = await fetch(`${CGI_BASE}/system.sh`);
                if (!res.ok) throw new Error('Failed to fetch system info');
                data = await res.json();
            } else {
                // Legacy LuCI controller method
                const res = await fetch(`${API_BASE}/system`);
                if (!res.ok) throw new Error('Failed to fetch system info');
                data = await res.json();
            }

            setSystem(data);
        } catch (err: any) {
            setError(err.message);
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
