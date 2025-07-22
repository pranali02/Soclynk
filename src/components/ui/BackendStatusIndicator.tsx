import React, { useState, useEffect } from 'react';
import { checkBackendStatus } from '../../services/actor';
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
        
        // For development, always show as connected and use mock data
        setStatus('connected');
        console.log('Using mock data for development');
      } catch (error) {
        console.log('Using mock data for development');
        setStatus('connected');
      }
    };
    
    checkBackendConnection();
    
    // No need for periodic checks in mock data mode
  }, [reconnectAttempts]);
  
  const handleRetry = () => {
    setReconnectAttempts(0);
  };

  const openWSLHelp = () => {
    const popup = window.open('', 'WSL_Help', 'width=800,height=600');
    
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
              <pre>cd C:\\Users\\HP\\Desktop\\SOCLYNK</pre>
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
      popup.document.close();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {status === 'connecting' && (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <div className="animate-spin h-4 w-4 border-2 border-yellow-600 border-t-transparent rounded-full"></div>
          <span>Connecting to backend...</span>
        </div>
      )}
      
      {status === 'reconnecting' && (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <div className="animate-spin h-4 w-4 border-2 border-yellow-600 border-t-transparent rounded-full"></div>
          <span>Reconnecting to backend... (Attempt {reconnectAttempts}/{MAX_AUTO_RECONNECT})</span>
        </div>
      )}
      
      {status === 'error' && (
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow-lg flex flex-col">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>Backend connection error</span>
          </div>
          {errorMessage && <p className="text-sm mt-1">{errorMessage}</p>}
          <button 
            onClick={handleRetry}
            className="mt-2 bg-red-800 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      )}
      
      {status === 'wsl' && (
        <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg shadow-lg flex flex-col">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>WSL Connection Issue</span>
          </div>
          <p className="text-sm mt-1">{errorMessage}</p>
          <button 
            onClick={openWSLHelp}
            className="mt-2 bg-orange-800 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 transition-colors"
          >
            Show WSL Setup Instructions
          </button>
        </div>
      )}
      
      {status === 'connected' && (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 cursor-help" title="Using mock data for development">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Local Development Mode</span>
        </div>
      )}
    </div>
  );
};

export default BackendStatusIndicator; 