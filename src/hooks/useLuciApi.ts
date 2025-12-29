import { useState, useEffect } from 'react';

const API_BASE = '/cgi-bin/luci/admin/kendalinet/api';

export const useLuciApi = (enabled: boolean) => {
    const [status, setStatus] = useState<any>(null);
    const [devices, setDevices] = useState<any[]>([]);
    const [wifi, setWifi] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStatus = async () => {
        try {
            const res = await fetch(`${API_BASE}/status`);
            if (!res.ok) throw new Error('Failed to fetch status');
            const data = await res.json();
            setStatus(data);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const fetchDevices = async () => {
        try {
            const res = await fetch(`${API_BASE}/devices`);
            if (!res.ok) throw new Error('Failed to fetch devices');
            const data = await res.json();
            setDevices(data);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const fetchWifi = async () => {
        try {
            const res = await fetch(`${API_BASE}/wifi`);
            if (!res.ok) throw new Error('Failed to fetch wifi');
            const data = await res.json();
            setWifi(data);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const saveWifi = async (ssid: string, hidden: boolean, password?: string) => {
        try {
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
        } catch (err: any) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    useEffect(() => {
        if (!enabled) return;

        setLoading(true);
        const loadData = async () => {
            await Promise.all([fetchStatus(), fetchDevices(), fetchWifi()]);
            setLoading(false);
        };

        loadData();

        const interval = setInterval(() => {
            fetchStatus();
            fetchDevices();
        }, 5000);

        return () => clearInterval(interval);
    }, [enabled]);

    return { status, devices, wifi, loading, error, fetchStatus, fetchDevices, fetchWifi, saveWifi };
};
