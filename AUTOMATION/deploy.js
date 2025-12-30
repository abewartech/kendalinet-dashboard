import { Client } from 'ssh2';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// === CONFIGURATION ===
const config = {
  host: '192.168.2.1',
  port: 22,
  username: 'root',
  password: '@appDEV1234!!!!',
  remotePath: '/www/cgi-bin/kendalinet',
  localPath: path.join(__dirname, 'kendalinet')
};
// =====================

const conn = new Client();

function runRemote(cmd) {
  return new Promise((resolve, reject) => {
    console.log(`📡 Executing: ${cmd}`);
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let output = '';
      stream.on('close', (code) => {
        if (code === 0) resolve(output);
        else reject(new Error(`Command failed with code ${code}: ${cmd}`));
      }).on('data', (data) => {
        output += data.toString();
        process.stdout.write(data.toString());
      }).stderr.on('data', (data) => {
        process.stderr.write(data.toString());
      });
    });
  });
}

async function deploy() {
  console.log(`\n🚀 Starting Deployment to ${config.username}@${config.host}...`);

  return new Promise((resolve, reject) => {
    conn.on('ready', async () => {
      console.log('✅ SSH Connection Ready');
      try {
        // 1. Ensure remote directory exists
        await runRemote(`mkdir -p ${config.remotePath}`);
        console.log('📁 Remote directory ready');

        // 2. Upload files
        await uploadFilesSequentially();

        // 3. Finalize
        await finalizePermissions();

        console.log('\n✨ ALL DONE! Deployment successful.');
        conn.end();
        resolve();
      } catch (err) {
        conn.end();
        reject(err);
      }
    }).on('error', (err) => {
      console.error('❌ Connection Error:', err.message);
      reject(err);
    }).connect({
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      readyTimeout: 15000,
      keepaliveInterval: 10000
    });
  });
}

async function uploadFilesSequentially() {
  const files = fs.readdirSync(config.localPath).filter(f => f.endsWith('.sh'));

  for (const file of files) {
    await uploadFilePipe(file);
  }
}

function uploadFilePipe(filename) {
  return new Promise((resolve, reject) => {
    const localFile = path.join(config.localPath, filename);
    const remoteFile = path.join(config.remotePath, filename).replace(/\\/g, '/');
    const content = fs.readFileSync(localFile);

    console.log(`📤 Uploading ${filename} (${content.length} bytes)...`);

    conn.exec(`cat > "${remoteFile}"`, (err, stream) => {
      if (err) return reject(err);

      stream.on('close', (code) => {
        if (code === 0) {
          console.log(`  ✅ ${filename} uploaded`);
          resolve();
        } else {
          reject(new Error(`Failed to upload ${filename} with code ${code}`));
        }
      }).on('data', (data) => {
        console.log(`[Upload-Out] ${data}`);
      }).stderr.on('data', (data) => {
        console.error(`[Upload-Err] ${data}`);
      });

      if (!stream.write(content)) {
        stream.once('drain', () => stream.end());
      } else {
        stream.end();
      }
    });
  });
}

async function finalizePermissions() {
  console.log('🔑 Setting permissions and restarting services...');
  const remoteCmd = [
    `chmod 755 ${config.remotePath}`,
    `chmod +x ${config.remotePath}/*.sh`,
    `chown root:root ${config.remotePath}/*.sh`,
    '/etc/init.d/uhttpd restart'
  ].join(' && ');

  return runRemote(remoteCmd);
}

deploy().catch(err => {
  console.error('\n❌ Deployment failed:', err.message);
  process.exit(1);
});
