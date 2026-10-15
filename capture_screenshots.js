const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const args = [
  '--remote-debugging-port=9222',
  '--remote-allow-origins=*',
  '--headless=new',
  '--disable-gpu',
  '--window-size=430,932',
  'http://localhost:8082'
];

console.log('Launching Chrome for screenshot capture...');
const proc = spawn(chromePath, args);

function poll(retries = 20) {
  if (retries <= 0) {
    console.error('Timeout waiting for Chrome debug port');
    proc.kill();
    process.exit(1);
  }
  const req = http.get('http://localhost:9222/json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const tabs = JSON.parse(data);
        const tab = tabs.find(t => t.type === 'page' || t.url.includes('localhost:8082'));
        if (tab && tab.webSocketDebuggerUrl) {
          captureAll(tab.webSocketDebuggerUrl);
        } else {
          setTimeout(() => poll(retries - 1), 500);
        }
      } catch (e) {
        setTimeout(() => poll(retries - 1), 500);
      }
    });
  });
  req.on('error', () => {
    setTimeout(() => poll(retries - 1), 500);
  });
}

const targets = [
  { name: 'screen_home.png', path: '/' },
  { name: 'screen_library.png', path: '/(tabs)/library' },
  { name: 'screen_practice.png', path: '/(tabs)/practice' },
  { name: 'screen_progress.png', path: '/(tabs)/progress' },
  { name: 'screen_pose_detail.png', path: '/pose/tadasana' },
];

let currentIndex = 0;

function captureAll(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let msgId = 1;

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      const handler = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.onopen = async () => {
    console.log('WebSocket connected. Emulating mobile viewport...');
    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 412,
      height: 892,
      deviceScaleFactor: 2,
      mobile: true
    });

    for (const target of targets) {
      console.log(`Navigating to ${target.path}...`);
      await send('Page.navigate', { url: `http://localhost:8082${target.path}` });
      // Wait for rendering
      await new Promise(r => setTimeout(r, 2500));

      console.log(`Capturing ${target.name}...`);
      const res = await send('Page.captureScreenshot', { format: 'png' });
      if (res && res.data) {
        const outPath = path.join(__dirname, target.name);
        fs.writeFileSync(outPath, Buffer.from(res.data, 'base64'));
        console.log(`Saved ${target.name} (${fs.statSync(outPath).size} bytes)`);
      }
    }

    console.log('All screenshots captured successfully!');
    ws.close();
    proc.kill();
    process.exit(0);
  };
}

setTimeout(poll, 1000);
