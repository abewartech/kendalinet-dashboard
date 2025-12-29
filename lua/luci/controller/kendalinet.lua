module("luci.controller.kendalinet", package.seeall)

local SIMULATE = true -- Default simulation mode

function index()
    entry({"admin", "kendalinet"}, firstchild(), "KendaliNet", 90).dependent = false

    entry({"admin", "kendalinet", "api", "status"}, call("api_status")).leaf = true
    entry({"admin", "kendalinet", "api", "devices"}, call("api_devices")).leaf = true
    entry({"admin", "kendalinet", "api", "wifi"}, call("api_wifi")).leaf = true
    entry({"admin", "kendalinet", "api", "wifi_save"}, call("api_wifi_save")).leaf = true
end

-- API BERANDA – Speedometer & Kuota
function api_status()
    local sys  = require "luci.sys"
    local json = require "luci.jsonc"
    local ubus = require "luci.ubus".connect()

    local wan = ubus:call("network.interface.wan", "status", {}) or {}

    local rx = wan.statistics and wan.statistics.rx_bytes or 0
    local tx = wan.statistics and wan.statistics.tx_bytes or 0

    local data = {
        speed = (SIMULATE or luci.http.formvalue("demo") == "1") and math.random(10, 100) or 0,
        rx_mb = math.floor(rx / 1024 / 1024),
        tx_mb = math.floor(tx / 1024 / 1024),
        online = true,
        uptime = sys.uptime()
    }

    luci.http.prepare_content("application/json")
    luci.http.write(json.stringify(data))
end

-- API PERANGKAT – Device List
function api_devices()
    local json = require "luci.jsonc"
    local util = require "luci.util"

    local leases = util.exec("cat /tmp/dhcp.leases")
    local devices = {}

    for line in leases:gmatch("[^\r\n]+") do
        local ts, mac, ip, name = line:match("(%S+)%s+(%S+)%s+(%S+)%s+(%S+)")
        if mac and ip then
            devices[#devices+1] = {
                mac = mac,
                ip = ip,
                name = name or "unknown",
                online = true,
                bandwidth = (SIMULATE or luci.http.formvalue("demo") == "1") and math.random(1, 100) or 0
            }
        end
    end

    luci.http.prepare_content("application/json")
    luci.http.write(json.stringify(devices))
end

-- API WIFI SETTINGS – Get
function api_wifi()
    local uci  = require "luci.model.uci".cursor()
    local json = require "luci.jsonc"

    local ssid = uci:get("wireless", "default_radio0", "ssid")
    local hidden = uci:get("wireless", "default_radio0", "hidden")
    local key = uci:get("wireless", "default_radio0", "key")

    local data = {
        ssid = ssid,
        hidden = hidden == "1",
        password = key
    }

    luci.http.prepare_content("application/json")
    luci.http.write(json.stringify(data))
end

-- API WIFI SETTINGS – Save
function api_wifi_save()
    -- Security check for POST requests
    require("luci.dispatcher").test_post_security()

    local uci  = require "luci.model.uci".cursor()
    local http = require "luci.http"
    local json = require "luci.jsonc"

    local ssid   = http.formvalue("ssid")
    local hidden = http.formvalue("hidden")
    local key    = http.formvalue("password")

    if ssid then
        uci:set("wireless", "default_radio0", "ssid", ssid)
        uci:set("wireless", "default_radio0", "hidden", hidden == "true" and "1" or "0")
        if key then
            uci:set("wireless", "default_radio0", "key", key)
        end
        uci:commit("wireless")

        luci.sys.call("wifi reload >/dev/null")

        luci.http.prepare_content("application/json")
        luci.http.write(json.stringify({ success = true }))
    else
        luci.http.status(400, "Bad Request")
        luci.http.prepare_content("application/json")
        luci.http.write(json.stringify({ error = "Missing SSID" }))
    end
end
