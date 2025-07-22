import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '../types';
import { getAuthenticatedActor, checkBackendStatus } from '../services/actor';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Canister ID from environment
const CANISTER_ID = 'uxrrr-q7777-77774-qaaaq-cai';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Define window.ic for Plug Wallet
declare global {
  interface Window {
    ic?: {
      plug?: {
        requestConnect: (_options?: any) => Promise<boolean>;
        isConnected: () => Promise<boolean>;
        disconnect: () => Promise<void>;
        getPrincipal: () => Promise<any>;
        agent: any;
        requestBalance: () => Promise<any>;
        batchTransactions: (_transactions: any[]) => Promise<any>;
        createActor: (_options: any) => Promise<any>;
      };
    };
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Using canister ID in AuthContext:', CANISTER_ID);
  }, []);

  // Check if user is already connected on mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      setIsLoading(true);
      setBackendError(null);
      
      // Check if Plug is available
      if (!window.ic?.plug) {
        console.log('Plug wallet not available');
        setIsLoading(false);
        return;
      }

      // Check if already connected
      const connected = await window.ic.plug.isConnected();
      if (connected) {
        const principalId = await window.ic.plug.getPrincipal();
        setPrincipal(principalId.toString());
        
        // Verify agent is available
        if (!window.ic.plug.agent) {
          console.log('Plug agent not available');
          setIsLoading(false);
          return;
        }
        
        // Check backend status first
        const backendAvailable = await checkBackendStatus();
        if (!backendAvailable) {
          console.warn('Backend not available, but wallet is connected');
          setBackendError('Backend connection unavailable. Some features may be limited.');
          setIsAuthenticated(true); // Still allow user to be authenticated
          setIsLoading(false);
          return;
        }
        
        try {
          // Get user data from backend
          const actor = await getAuthenticatedActor();
          const userData = await actor.get_current_user();
          
          if (userData && userData.length > 0) {
            const userObj = userData[0];
            setUser({
              id: userObj.id.toString(),
              username: userObj.username,
              bio: userObj.bio,
              profile_picture: userObj.profile_picture?.[0] || undefined,
              created_at: userObj.created_at,
              followers_count: userObj.followers_count,
              following_count: userObj.following_count,
              posts_count: userObj.posts_count,
            });
            setIsAuthenticated(true);
          } else {
            // User is connected but has no profile
            setIsAuthenticated(true);
            setUser(null);
          }
        } catch (error) {
          console.error('Backend error during connection check:', error);
          setBackendError('Backend connection failed. You can still use the app with limited functionality.');
          setIsAuthenticated(true); // Allow user to stay authenticated
        }
      }
    } catch (error) {
      console.error('Error checking connection:', error);
      setBackendError('Connection check failed. Please try refreshing the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      setBackendError(null);
      
      // Check if Plug is available
      if (!window.ic?.plug) {
        alert('Please install Plug Wallet to connect');
        return;
      }

      // Request connection with correct canister ID
      const whitelist = [CANISTER_ID];
      console.log('Connecting with whitelist:', whitelist);
      
      const connected = await window.ic.plug.requestConnect({
        whitelist,
        host: 'http://127.0.0.1:4943',
      });

      if (connected) {
        const principalId = await window.ic.plug.getPrincipal();
        setPrincipal(principalId.toString());
        console.log('Connected with principal:', principalId.toString());
        
        // Verify agent is available
        if (!window.ic.plug.agent) {
          throw new Error('Plug agent not available');
        }
        
        // Check backend status
        const backendAvailable = await checkBackendStatus();
        if (!backendAvailable) {
          console.warn('Backend not available during login');
          setBackendError('Backend connection unavailable. You can browse the app but some features may be limited.');
          setIsAuthenticated(true);
          setUser(null);
          return;
        }
        
        try {
          // Get user data from backend
          const actor = await getAuthenticatedActor();
          const userData = await actor.get_current_user();
          
          if (userData && userData.length > 0) {
            const userObj = userData[0];
            console.log('User data found:', userObj);
            setUser({
              id: userObj.id.toString(),
              username: userObj.username,
              bio: userObj.bio,
              profile_picture: userObj.profile_picture?.[0] || undefined,
              created_at: userObj.created_at,
              followers_count: userObj.followers_count,
              following_count: userObj.following_count,
              posts_count: userObj.posts_count,
            });
            setIsAuthenticated(true);
          } else {
            // User doesn't exist, set authenticated but no user data
            console.log('No user data found, user needs to create profile');
            setUser(null);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Backend error during login:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          setBackendError(`Backend connection failed: ${errorMessage}. You can still browse the app.`);
          setIsAuthenticated(true); // Still allow login
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Error connecting to Plug:', error);
      alert('Failed to connect to Plug Wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (window.ic?.plug) {
        await window.ic.plug.disconnect();
      }
      setUser(null);
      setIsAuthenticated(false);
      setPrincipal(null);
      setBackendError(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated,
    isLoading,
    principal,
    backendError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 