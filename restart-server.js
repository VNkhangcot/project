const { spawn } = require('child_process');
const axios = require('axios');

async function restartServer() {
  console.log('🔄 Restarting server...');
  
  try {
    // Kill existing server process
    const killProcess = spawn('taskkill', ['/F', '/IM', 'node.exe'], { shell: true });
    
    await new Promise((resolve) => {
      killProcess.on('close', () => {
        console.log('✅ Old server process killed');
        resolve();
      });
    });
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Start new server
    console.log('🚀 Starting new server...');
    const serverProcess = spawn('node', ['server/server.js'], { 
      detached: true,
      stdio: 'ignore'
    });
    
    serverProcess.unref();
    
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test server
    try {
      const response = await axios.get('http://localhost:5000/health');
      console.log('✅ Server restarted successfully!');
      console.log('📊 Health check:', response.data.message);
    } catch (error) {
      console.log('❌ Server may not be ready yet');
    }
    
  } catch (error) {
    console.error('❌ Error restarting server:', error.message);
  }
}

restartServer();
