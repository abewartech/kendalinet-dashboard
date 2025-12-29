/**
 * UBUS API Client for OpenWrt LuCI 24.x
 * 
 * Official API endpoint: /ubus
 * This is the future-proof way to interact with OpenWrt system
 */

export interface UbusCallParams {
  namespace: string;
  method: string;
  params?: Record<string, any>;
}

export interface UbusResponse<T = any> {
  jsonrpc: string;
  id: number;
  result?: [number, T];
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

/**
 * Get session ID from LuCI (required for authenticated ubus calls)
 * In production, this should be obtained from LuCI session cookie
 */
async function getSessionId(): Promise<string> {
  // Default session ID for unauthenticated calls
  // In production, extract from LuCI session cookie
  return '00000000000000000000000000000000';
}

/**
 * Call ubus API endpoint
 * 
 * @param namespace - ubus namespace (e.g., 'system', 'network.interface.wan')
 * @param method - method name (e.g., 'info', 'status')
 * @param params - optional parameters object
 * @returns Promise with the result data
 */
export async function ubusCall<T = any>(
  namespace: string,
  method: string,
  params: Record<string, any> = {}
): Promise<T> {
  const sessionId = await getSessionId();
  
  const response = await fetch('/ubus', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for session
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'call',
      params: [sessionId, namespace, method, params],
    }),
  });

  if (!response.ok) {
    throw new Error(`ubus call failed: ${response.statusText}`);
  }

  const data: UbusResponse<T> = await response.json();

  if (data.error) {
    throw new Error(`ubus error: ${data.error.message}`);
  }

  // ubus returns result as [code, data]
  // code 0 = success
  if (data.result && Array.isArray(data.result) && data.result.length >= 2) {
    const [code, resultData] = data.result;
    if (code !== 0) {
      throw new Error(`ubus call returned error code: ${code}`);
    }
    return resultData as T;
  }

  throw new Error('Invalid ubus response format');
}

/**
 * Get system information using ubus
 */
export async function getSystemInfo() {
  return ubusCall<{
    localtime: number;
    uptime: number;
    load: number[];
    memory: {
      total: number;
      free: number;
      shared: number;
      buffered: number;
      available: number;
      cached: number;
    };
    root: {
      total: number;
      free: number;
      used: number;
      avail: number;
    };
    tmp: {
      total: number;
      free: number;
      used: number;
      avail: number;
    };
    swap: {
      total: number;
      free: number;
    };
  }>('system', 'info', {});
}

/**
 * Get network interface status using ubus
 */
export async function getNetworkInterfaceStatus(interfaceName: string = 'wan') {
  return ubusCall('network.interface', 'status', { interface: interfaceName });
}

/**
 * Get board information using ubus
 */
export async function getBoardInfo() {
  return ubusCall('system', 'board', {});
}

/**
 * Get device list from DHCP leases
 * Note: This still requires reading /tmp/dhcp.leases file
 * which might need a custom endpoint or CGI script
 */
export async function getDhcpLeases() {
  // This would need a custom endpoint since ubus doesn't directly expose DHCP leases
  // Fallback to custom API endpoint
  const response = await fetch('/cgi-bin/kendalinet/devices.sh');
  if (!response.ok) {
    throw new Error('Failed to fetch DHCP leases');
  }
  return response.json();
}

