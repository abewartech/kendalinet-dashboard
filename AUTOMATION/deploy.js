import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// === CONFIGURATION ===
const config = {
  host: '192.168.2.1',
  user: 'root',
  remotePath: '/www/cgi-bin/kendalinet',
  localPath: path.join(__dirname, 'kendalinet')
};
// =====================

function deploy() {
  console.log(`🚀 Starting Push to ${config.user}@${config.host}...`);

  try {
    // 1. Ensure remote directory exists
    console.log('📁 Ensuring remote directory exists...');
    execSync(`ssh ${config.user}@${config.host} "mkdir -p ${config.remotePath}"`, { stdio: 'inherit' });

    // 2. Get list of files
    const files = fs.readdirSync(config.localPath).filter(f => f.endsWith('.sh'));

    if (files.length === 0) {
      console.error('❌ No .sh scripts found!');
      return;
    }

    // 3. Push all .sh files using a single SCP command to reduce password prompts
    console.log(`📤 Pushing all .sh scripts...`);
    try {
      // Use -O for legacy protocol (Dropbear compatibility)
      // On Windows, the wildcard expansion might be tricky, so we specify the folder
      execSync(`scp -O "${config.localPath}\\*.sh" ${config.user}@${config.host}:${config.remotePath}/`, { stdio: 'inherit' });
      console.log(`  ✅ All scripts uploaded`);
    } catch (e) {
      // If wildcard fails, fallback to individual files but warn about passwords
      console.warn('⚠️ Wildcard push failed, trying individual files...');
      for (const file of files) {
        const localFilePath = path.join(config.localPath, file);
        execSync(`scp -O "${localFilePath}" ${config.user}@${config.host}:${config.remotePath}/`, { stdio: 'inherit' });
        console.log(`  ✅ ${file} uploaded`);
      }
    }

    // 4. Set permissions and restart service
    console.log('🔑 Setting permissions and restarting web server...');
    const remoteCmd = [
      `chmod 755 ${config.remotePath}`,
      `chmod +x ${config.remotePath}/*.sh`,
      `chown root:root ${config.remotePath}/*.sh`,
      '/etc/init.d/uhttpd restart'
    ].join(' && ');

    execSync(`ssh ${config.user}@${config.host} "${remoteCmd}"`, { stdio: 'inherit' });

    console.log('\n✨ Deployment Complete!');
    console.log(`🔗 Test Link: http://${config.host}/cgi-bin/kendalinet/status.sh`);

  } catch (error) {
    console.error('\n❌ Deployment failed:');
    console.error(error.message);
  }
}

deploy();
