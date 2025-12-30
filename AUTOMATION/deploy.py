import os
import subprocess
import sys

# === CONFIGURATION ===
ROUTER_IP = "192.168.2.1"
ROUTER_USER = "root"
REMOTE_CGI_DIR = "/www/cgi-bin/kendalinet"
LOCAL_SCRIPTS_DIR = os.path.join(os.path.dirname(__file__), "kendalinet")
# =====================

def run_command(command):
    try:
        print(f"Executing: {command}")
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Error: {e.stderr}")
        return None

def main():
    print(f"🚀 Starting Push to {ROUTER_USER}@{ROUTER_IP}...")

    # 1. Create remote directory if not exists
    print("📁 Ensuring remote directory exists...")
    ssh_cmd = f"ssh {ROUTER_USER}@{ROUTER_IP} \"mkdir -p {REMOTE_CGI_DIR}\""
    run_command(ssh_cmd)

    # 2. Get list of files to push
    files = [f for f in os.listdir(LOCAL_SCRIPTS_DIR) if f.endswith('.sh')]
    
    if not files:
        print("❌ No .sh scripts found in LOCAL_SCRIPTS_DIR")
        return

    # 3. Push files using SCP
    print(f"📤 Pushing {len(files)} scripts...")
    for file in files:
        local_path = os.path.join(LOCAL_SCRIPTS_DIR, file)
        scp_cmd = f"scp \"{local_path}\" {ROUTER_USER}@{ROUTER_IP}:{REMOTE_CGI_DIR}/"
        if run_command(scp_cmd) is not None:
            print(f"  ✅ {file} uploaded")

    # 4. Set permissions and restart uhttpd
    print("🔑 Setting permissions and restarting web server...")
    remote_cmd = (
        f"chmod 755 {REMOTE_CGI_DIR} && "
        f"chmod +x {REMOTE_CGI_DIR}/*.sh && "
        f"chown root:root {REMOTE_CGI_DIR}/*.sh && "
        "/etc/init.d/uhttpd restart"
    )
    ssh_final_cmd = f"ssh {ROUTER_USER}@{ROUTER_IP} \"{remote_cmd}\""
    
    if run_command(ssh_final_cmd) is not None:
        print("\n✨ Deployment Complete!")
        print(f"🔗 Test Link: http://{ROUTER_IP}/cgi-bin/kendalinet/status.sh")
    else:
        print("\n❌ Deployment failed at the final step.")

if __name__ == "__main__":
    main()
