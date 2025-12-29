import { useState, useEffect, useCallback } from 'react';

const HISTORY_STORAGE_KEY = 'kendalinet_notification_history';
const MAX_HISTORY_ITEMS = 100;

export interface NotificationHistoryItem {
  id: string;
  deviceName: string;
  deviceMac: string;
  deviceIp: string;
  timestamp: string;
  action?: 'allowed' | 'blocked' | 'pending';
}

export const useNotificationHistory = () => {
  const [history, setHistory] = useState<NotificationHistoryItem[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse notification history:', e);
      }
    }
  }, []);

  // Save history to localStorage
  const saveHistory = useCallback((items: NotificationHistoryItem[]) => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(items));
    setHistory(items);
  }, []);

  // Add new notification to history
  const addNotification = useCallback((
    deviceName: string,
    deviceMac: string,
    deviceIp: string
  ) => {
    const newItem: NotificationHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      deviceName,
      deviceMac,
      deviceIp,
      timestamp: new Date().toISOString(),
      action: 'pending'
    };

    setHistory(prev => {
      const updated = [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    return newItem.id;
  }, []);

  // Update action for a notification
  const updateAction = useCallback((id: string, action: 'allowed' | 'blocked') => {
    setHistory(prev => {
      const updated = prev.map(item =>
        item.id === id ? { ...item, action } : item
      );
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Clear all history
  const clearHistory = useCallback(() => {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    setHistory([]);
  }, []);

  // Get history filtered by date range
  const getHistoryByDateRange = useCallback((startDate: Date, endDate: Date) => {
    return history.filter(item => {
      const itemDate = new Date(item.timestamp);
      return itemDate >= startDate && itemDate <= endDate;
    });
  }, [history]);

  // Get statistics
  const getStats = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - 7);

    const thisMonth = new Date(today);
    thisMonth.setMonth(thisMonth.getMonth() - 1);

    return {
      total: history.length,
      todayCount: history.filter(h => new Date(h.timestamp) >= today).length,
      weekCount: history.filter(h => new Date(h.timestamp) >= thisWeek).length,
      monthCount: history.filter(h => new Date(h.timestamp) >= thisMonth).length,
      allowedCount: history.filter(h => h.action === 'allowed').length,
      blockedCount: history.filter(h => h.action === 'blocked').length,
      pendingCount: history.filter(h => h.action === 'pending').length
    };
  }, [history]);

  return {
    history,
    addNotification,
    updateAction,
    clearHistory,
    getHistoryByDateRange,
    getStats
  };
};
