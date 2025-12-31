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
    const [dnsInfo, setDnsInfo] = useState<any>(null);
    const [firewallInfo, setFirewallInfo] = useState<any>(null);
    const [vouchersInfo, setVouchersInfo] = useState<any>(null);
    const [securityInfo, setSecurityInfo] = useState<any>(null);
    const [scheduleInfo, setScheduleInfo] = useState<any>(null);
    const [trafficInfo, setTrafficInfo] = useState<any>(null);
    const [ztStatus, setZtStatus] = useState<any>(null);
    const [ztNetworks, setZtNetworks] = useState<any[]>([]);
    const [ztPeers, setZtPeers] = useState<any[]>([]);
    const [mwan3Status, setMwan3Status] = useState<any>(null);
    const [mwan3Interfaces, setMwan3Interfaces] = useState<any[]>([]);
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
                    console.warn('UBUS API failed, trying fallback:', ubusErr.message);
                    const res = await fetch(`${CGI_BASE}/status.sh`);
                    data = await res.json();
                }
            } else {
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP ${res.status}: status.sh failed`);
                data = await res.json();
            }

            setStatus(data);
        } catch (err: any) {
            console.error(`[Status] Fail: ${err.message}`);
        }
    };

    const fetchDevices = async () => {
        const url = `${CGI_BASE}/devices.sh`;
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch devices`);
            const data = await res.json();
            setDevices(data || []);
        } catch (err: any) {
            console.error(`[Devices] Fail: ${err.message}`);
            setDevices([]);
        }
    };

    const fetchWifi = async () => {
        const url = `${CGI_BASE}/wifi.sh`;
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch wifi`);
            const data = await res.json();
            setWifi(data);
        } catch (err: any) {
            console.error(`[WiFi] Fail: ${err.message}`);
        }
    };

    const fetchSystem = async () => {
        const url = `${CGI_BASE}/system.sh`;
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch system`);
            const data = await res.json();
            setSystem(data);
        } catch (err: any) {
            console.error(`[System] Fail: ${err.message}`);
        }
    };

    const fetchDns = async () => {
        const url = `${CGI_BASE}/dns.sh`;
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch DNS`);
            const data = await res.json();
            setDnsInfo(data);
        } catch (err: any) {
            console.error(`[DNS] Fail: ${err.message}`);
        }
    };

    const fetchFirewall = async () => {
        const url = `${CGI_BASE}/firewall.sh`;
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch Firewall`);
            const data = await res.json();
            setFirewallInfo(data);
        } catch (err: any) {
            console.error(`[Firewall] Fail: ${err.message}`);
        }
    };

    const fetchVouchers = async () => {
        const url = `${CGI_BASE}/vouchers_list.sh`;
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch Vouchers`);
            const data = await res.json();
            setVouchersInfo(data);
        } catch (err: any) {
            console.error(`[Vouchers] Fail: ${err.message}`);
        }
    };

    const createVoucher = async (params: { duration: number, quota: number, speedLimit: number }) => {
        try {
            const res = await fetch(`${CGI_BASE}/vouchers_create.sh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params),
            });
            return await res.json();
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    };

    const deleteVoucher = async (code: string) => {
        try {
            const res = await fetch(`${CGI_BASE}/vouchers_delete.sh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            });
            return await res.json();
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    };

    const fetchSecurity = async () => {
        const url = `${CGI_BASE}/security.sh`;
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch Security`);
            const data = await res.json();
            setSecurityInfo(data);
        } catch (err: any) {
            console.error(`[Security] Fail: ${err.message}`);
        }
    };

    const fetchSchedule = async () => {
        const url = `${CGI_BASE}/schedule.sh`;
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch Schedule`);
            const data = await res.json();
            setScheduleInfo(data);
        } catch (err: any) {
            console.error(`[Schedule] Fail: ${err.message}`);
        }
    };

    const fetchTraffic = async () => {
        const url = `${CGI_BASE}/traffic.sh`;
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch Traffic`);
            const data = await res.json();
            setTrafficInfo(data);
        } catch (err: any) {
            console.error(`[Traffic] Fail: ${err.message}`);
        }
    };

    const fetchZtStatus = async () => {
        try {
            const res = await fetch(`${CGI_BASE}/zerotier_status.sh`);
            const data = await res.json();
            setZtStatus(data);
        } catch (err) {
            console.error('[ZeroTier Status] Fail:', err);
        }
    };

    const fetchZtNetworks = async () => {
        try {
            const res = await fetch(`${CGI_BASE}/zerotier_networks.sh`);
            const data = await res.json();
            setZtNetworks(data.networks || []);
        } catch (err) {
            console.error('[ZeroTier Networks] Fail:', err);
        }
    };

    const fetchZtPeers = async () => {
        try {
            const res = await fetch(`${CGI_BASE}/zerotier_peers.sh`);
            const data = await res.json();
            setZtPeers(data.peers || []);
        } catch (err) {
            console.error('[ZeroTier Peers] Fail:', err);
        }
    };

    const toggleZt = async (enabled: boolean) => {
        try {
            const res = await fetch(`${CGI_BASE}/zerotier_toggle.sh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enabled }),
            });
            return await res.json();
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    };

    const joinZt = async (networkId: string) => {
        try {
            const res = await fetch(`${CGI_BASE}/zerotier_join.sh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ networkId }),
            });
            return await res.json();
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    };

    const leaveZt = async (networkId: string) => {
        try {
            const res = await fetch(`${CGI_BASE}/zerotier_leave.sh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ networkId }),
            });
            return await res.json();
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    };

    const setZtFlags = async (params: { networkId: string, allowDefault?: boolean, allowGlobal?: boolean, allowManaged?: boolean }) => {
        try {
            const res = await fetch(`${CGI_BASE}/zerotier_set_flags.sh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params),
            });
            return await res.json();
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    };

    const toggleZtBridge = async (networkId: string, enabled: boolean) => {
        try {
            const res = await fetch(`${CGI_BASE}/zerotier_bridge.sh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ networkId, enabled }),
            });
            return await res.json();
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    };

    const toggleZtFirewall = async (enabled: boolean) => {
        try {
            const res = await fetch(`${CGI_BASE}/zerotier_firewall.sh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enabled }),
            });
            return await res.json();
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    };

    const fetchMwan3Status = async () => {
        try {
            const res = await fetch(`${CGI_BASE}/mwan3_status.sh`);
            const data = await res.json();
            setMwan3Status(data);
        } catch (err) {
            console.error('[mwan3 Status] Fail:', err);
        }
    };

    const fetchMwan3Interfaces = async () => {
        try {
            const res = await fetch(`${CGI_BASE}/mwan3_list.sh`);
            const data = await res.json();
            setMwan3Interfaces(data.interfaces || []);
        } catch (err) {
            console.error('[mwan3 Interfaces] Fail:', err);
        }
    };

    const toggleMwan3 = async (enabled: boolean) => {
        try {
            const res = await fetch(`${CGI_BASE}/mwan3_toggle.sh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enabled }),
            });
            return await res.json();
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    };

    const setMwan3Mode = async (mode: string) => {
        try {
            const res = await fetch(`${CGI_BASE}/mwan3_set_mode.sh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode }),
            });
            return await res.json();
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    };

    const addMwan3Wan = async (params: { name: string, iface: string, weight: number, metric?: number }) => {
        try {
            const res = await fetch(`${CGI_BASE}/mwan3_add_wan.sh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params),
            });
            return await res.json();
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    };

    const deleteMwan3Wan = async (iface: string) => {
        try {
            const res = await fetch(`${CGI_BASE}/mwan3_delete_wan.sh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ iface }),
            });
            return await res.json();
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    };

    const setMwan3Weight = async (iface: string, weight: number) => {
        try {
            const res = await fetch(`${CGI_BASE}/mwan3_set_weight.sh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ iface, weight }),
            });
            return await res.json();
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    };

    const saveWifi = async (ssid: string, hidden: boolean, password?: string) => {
        try {
            const res = await fetch(`${CGI_BASE}/wifi_save.sh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ssid, hidden, password }),
            });
            return await res.json();
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    };

    const saveDns = async (provider: string, dns1?: string, dns2?: string) => {
        try {
            const res = await fetch(`${CGI_BASE}/dns_save.sh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provider, dns1, dns2 }),
            });
            return await res.json();
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    };

    const applyBandwidthLimit = async (mac: string, rate: number) => {
        try {
            const res = await fetch(`${CGI_BASE}/bandwidth_limit.sh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mac, rate }),
            });
            return await res.json();
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    };

    const optimizeNetwork = async (action: 'clear_cache' | 'wifi_optimize' | 'reboot') => {
        try {
            const res = await fetch(`${CGI_BASE}/optimize.sh?action=${action}`, {
                method: 'GET',
            });
            return await res.json();
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    };

    useEffect(() => {
        if (!enabled) return;

        setLoading(true);
        const loadData = async () => {
            await Promise.all([
                fetchStatus(),
                fetchDevices(),
                fetchWifi(),
                fetchSystem(),
                fetchDns(),
                fetchFirewall(),
                fetchVouchers(),
                fetchSecurity(),
                fetchSchedule(),
                fetchTraffic(),
                fetchZtStatus(),
                fetchZtNetworks(),
                fetchZtPeers(),
                fetchMwan3Status(),
                fetchMwan3Interfaces()
            ]);
            setLoading(false);
        };

        loadData();

        const interval = setInterval(() => {
            fetchStatus();
            fetchDevices();
            fetchSystem();
            fetchTraffic();
        }, 5000);

        return () => clearInterval(interval);
    }, [enabled, method]);

    return {
        status,
        devices,
        wifi,
        system,
        dnsInfo,
        firewallInfo,
        vouchersInfo,
        scheduleInfo,
        trafficInfo,
        ztStatus,
        ztNetworks,
        ztPeers,
        mwan3Status,
        mwan3Interfaces,
        loading,
        error,
        fetchStatus,
        fetchDevices,
        fetchWifi,
        fetchSystem,
        fetchTraffic,
        fetchVouchers,
        createVoucher,
        deleteVoucher,
        fetchZtStatus,
        fetchZtNetworks,
        fetchZtPeers,
        toggleZt,
        joinZt,
        leaveZt,
        setZtFlags,
        toggleZtBridge,
        toggleZtFirewall,
        fetchMwan3Status,
        fetchMwan3Interfaces,
        toggleMwan3,
        setMwan3Mode,
        addMwan3Wan,
        deleteMwan3Wan,
        setMwan3Weight,
        saveWifi,
        saveDns,
        applyBandwidthLimit,
        optimizeNetwork
    };
};
