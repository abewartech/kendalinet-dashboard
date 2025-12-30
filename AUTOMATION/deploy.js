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

async function deploy() {
  console.log(`🚀 Starting SSH2 Deployment (Safe Mode) to ${config.username}@${config.host}...`);

  return new Promise((resolve, reject) => {
    conn.on('ready', () => {
      console.log('✅ SSH Connection Ready');

      // 1. Ensure remote directory exists
      conn.exec(`mkdir -p ${config.remotePath}`, (err, stream) => {
        if (err) return reject(err);
        stream.on('close', () => {
          console.log('📁 Directory ensured');
          uploadFilesSequentially().then(resolve).catch(reject);
        });
      });
    }).on('error', (err) => {
      console.error('❌ Connection Error:', err.message);
      reject(err);
    }).connect({
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      readyTimeout: 10000
    });
  });
}

async function uploadFilesSequentially() {
  const files = fs.readdirSync(config.localPath).filter(f => f.endsWith('.sh'));

  for (const file of files) {
    await uploadFilePipe(file);
  }

  await finalizePermissions();
}

function uploadFilePipe(filename) {
  return new Promise((resolve, reject) => {
    const localFile = path.join(config.localPath, filename);
    const remoteFile = path.join(config.remotePath, filename).replace(/\\/g, '/');
    const content = fs.readFileSync(localFile);

    console.log(`📤 Uploading ${filename} (${content.length} bytes)...`);

    // We use cat to write the file to bypass SFTP requirements
    conn.exec(`cat > "${remoteFile}"`, (err, stream) => {
      if (err) return reject(err);

      stream.on('close', (code) => {
        if (code === 0) {
          console.log(`  ✅ ${filename} uploaded`);
          resolve();
        } else {
          reject(new Error(`Failed to upload ${filename} with code ${code}`));
        }
      }).on('error', (err) => {
        reject(err);
      });

      stream.write(content);
      stream.end();
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

  return new Promise((resolve, reject) => {
    conn.exec(remoteCmd, (err, stream) => {
      if (err) return reject(err);
      stream.on('close', (code) => {
        console.log('✨ Deployment Complete!');
        conn.end();
        resolve();
      }).on('data', (data) => console.log(data.toString()))
        .stderr.on('data', (data) => console.error(data.toString()));
    });
  });
}

deploy().catch(err => {
  console.error('\n❌ Deployment failed:', err.message);
  process.exit(1);
});
