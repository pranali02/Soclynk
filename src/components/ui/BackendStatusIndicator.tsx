import React, { useState, useEffect } from 'react';
import { getAnonymousActor, checkBackendStatus } from '../../services/actor';
import { canisterId as backendCanisterId } from '../../declarations/onchain360_backend';

const BackendStatusIndicator: React.FC = () => {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error' | 'reconnecting' | 'wsl'>('connecting');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [canisterId, setCanisterId] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const MAX_AUTO_RECONNECT = 3;
  
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        setStatus(reconnectAttempts > 0 ? 'reconnecting' : 'connecting');
        setErrorMessage(null);
        
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const savedLocalId = localStorage.getItem('localCanisterId');
        const cid = isLocal 
          ? backendCanisterId || savedLocalId || 'rrkah-fqaaa-aaaaa-aaaaq-cai' 
          : 'vizcg-th777-77774-qaaea-cai';
          
        setCanisterId(cid);
        
        // First detect if the error is WSL-specific
        const isWSLEnabled = await fetch('http://127.0.0.1:4943', {
          method: 'HEAD',
          headers: { 'accept': '*/*' },
          mode: 'no-cors',
          cache: 'no-cache',
        }).then(() => true).catch(() => false);

        if (!isWSLEnabled && isLocal) {
          setStatus('wsl');
          setErrorMessage('WSL connection issue detected. Please check if dfx is running through dfx-start.bat');
          return;
        }
        
        const isConnected = await checkBackendStatus();
        if (!isConnected) {
          throw new Error('Failed to connect to backend canister');
        }
        
        setStatus('connected');
        setReconnectAttempts(0);
      } catch (error) {
        console.error('Backend connection failed:', error);
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error connecting to backend');
      }
    };
    
    checkBackendConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkBackendConnection, 30000);
    return () => clearInterval(interval);
  }, [reconnectAttempts]);
  
  const handleManualReconnect = async () => {
    setReconnectAttempts(prev => prev + 1);
  };
  
  const handleStartDfx = async () => {
    try {
      setStatus('reconnecting');
      
      // Create a popup that provides instructions
      const popupWidth = 500;
      const popupHeight = 600;
      const left = (window.innerWidth - popupWidth) / 2;
      const top = (window.innerHeight - popupHeight) / 2;
      
      const popup = window.open('', 'WSL DFX Instructions', 
        `width=${popupWidth},height=${popupHeight},left=${left},top=${top},menubar=no,toolbar=no,location=no,scrollbars=yes`);
        
      if (popup) {
        popup.document.write(`
          <html>
            <head>
              <title>Start DFX via WSL</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
                pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
                .step { margin-bottom: 20px; }
                .note { background: #ffffd0; padding: 10px; border-left: 4px solid #e0e000; }
              </style>
            </head>
            <body>
              <h2>Starting DFX via WSL</h2>
              <p>Follow these steps to start dfx through WSL:</p>
              
              <div class="step">
                <h3>Step 1: Open Command Prompt or PowerShell</h3>
                <p>Open a new terminal window.</p>
              </div>
              
              <div class="step">
                <h3>Step 2: Navigate to project directory</h3>
                <pre>cd C:\\Users\\HP\\Desktop\\ONCHAIN360</pre>
              </div>
              
              <div class="step">
                <h3>Step 3: Start DFX using the batch file</h3>
                <pre>.\\dfx-start.bat</pre>
                <p>Keep this terminal window open.</p>
              </div>
              
              <div class="step">
                <h3>Step 4: Open another terminal and deploy the backend</h3>
                <pre>.\\dfx-status.bat</pre>
              </div>
              
              <div class="step">
                <h3>Step 5: Refresh this webpage</h3>
                <p>After the backend is deployed, refresh the browser tab.</p>
              </div>
              
              <div class="note">
                <p><strong>Note:</strong> This application uses WSL (Windows Subsystem for Linux) for running dfx. The direct Windows version may not work properly.</p>
              </div>
            </body>
          </html>
        `);
      }
      
      setErrorMessage('Please follow the instructions in the popup window to start dfx via WSL');
    } catch (error) {
      setErrorMessage(`Failed to open instructions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50 p-2 rounded-lg shadow-lg bg-opacity-90 dark:bg-opacity-90 transition-all duration-300 ease-in-out">
      {status === 'connecting' && (
        <div className="flex items-center space-x-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-2 rounded-lg">
          <div className="animate-pulse w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-sm font-medium">Connecting to backend...</span>
        </div>
      )}
      
      {status === 'reconnecting' && (
        <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-2 rounded-lg">
          <div className="animate-pulse w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-sm font-medium">Reconnecting (attempt {reconnectAttempts}/{MAX_AUTO_RECONNECT})...</span>
        </div>
      )}
      
      {status === 'connected' && (
        <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-2 rounded-lg">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm font-medium">
            Backend connected
            {canisterId && (
              <span className="text-xs ml-2 opacity-70">ID: {canisterId.slice(0, 5)}...{canisterId.slice(-5)}</span>
            )}
          </span>
        </div>
      )}
      
      {status === 'wsl' && (
        <div className="flex flex-col bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-3 py-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-sm font-medium">WSL Backend Issue</span>
          </div>
          <div className="mt-1 text-xs max-w-xs overflow-hidden text-ellipsis">
            This app needs to run dfx through WSL (Windows Subsystem for Linux)
          </div>
          <div className="mt-2 text-xs flex flex-wrap gap-2">
            <button 
              className="bg-orange-200 dark:bg-orange-800 px-2 py-1 rounded hover:bg-orange-300 dark:hover:bg-orange-700 transition-colors"
              onClick={handleStartDfx}
            >
              Start WSL DFX
            </button>
          </div>
        </div>
      )}
      
      {status === 'error' && (
        <div className="flex flex-col bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-3 py-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm font-medium">Backend connection error</span>
          </div>
          {errorMessage && (
            <div className="mt-1 text-xs max-w-xs overflow-hidden text-ellipsis">
              {errorMessage}
            </div>
          )}
          <div className="mt-2 text-xs flex flex-wrap gap-2">
            <button 
              className="bg-red-200 dark:bg-red-800 px-2 py-1 rounded hover:bg-red-300 dark:hover:bg-red-700 transition-colors"
              onClick={() => window.location.reload()}
            >
              Reload app
            </button>
            <button 
              className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded hover:bg-blue-300 dark:hover:bg-blue-700 transition-colors"
              onClick={handleManualReconnect}
              disabled={reconnectAttempts >= MAX_AUTO_RECONNECT}
            >
              Reconnect
            </button>
            <button 
              className="bg-green-200 dark:bg-green-800 px-2 py-1 rounded hover:bg-green-300 dark:hover:bg-green-700 transition-colors"
              onClick={handleStartDfx}
            >
              Start DFX
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackendStatusIndicator; 