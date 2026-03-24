'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, Session, LoginResponse } from '@/lib/api';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; session: Session } }
  | { type: 'AUTH_FAILURE'; payload: { error: string } }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        session: action.payload.session,
        isLoading: false,
        error: null,
      };
    
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        session: null,
        isLoading: false,
        error: action.payload.error,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        session: null,
        isLoading: false,
        error: null,
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    
    default:
      return state;
  }
}

interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load stored session on mount
  useEffect(() => {
    const storedSession = localStorage.getItem('mfa_session');
    const storedUser = localStorage.getItem('mfa_user');
    
    if (storedSession && storedUser) {
      try {
        const session = JSON.parse(storedSession);
        const user = JSON.parse(storedUser);
        
        // Check if session is still valid
        if (new Date(session.expiresAt) > new Date()) {
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user, session }
          });
        } else {
          // Session expired, clean up
          localStorage.removeItem('mfa_session');
          localStorage.removeItem('mfa_user');
        }
      } catch (error) {
        console.error('Failed to parse stored session:', error);
        localStorage.removeItem('mfa_session');
        localStorage.removeItem('mfa_user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const { apiClient } = await import('@/lib/api');
      const response = await apiClient.login({ email, password });
      
      if (response.success && response.data) {
        const { user, session } = response.data;
        
        // Store in localStorage
        localStorage.setItem('mfa_session', JSON.stringify(session));
        localStorage.setItem('mfa_user', JSON.stringify(user));
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, session }
        });
      } else {
        dispatch({
          type: 'AUTH_FAILURE',
          payload: { error: response.error?.message || 'Login failed' }
        });
      }
    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: { error: error instanceof Error ? error.message : 'Login failed' }
      });
    }
  };

  const register = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const { apiClient } = await import('@/lib/api');
      const response = await apiClient.register({ email, password });
      
      if (response.success && response.data) {
        const { id, email, emailVerified, riskTier, createdAt } = response.data;
        
        const user = { id, email, emailVerified, riskTier, isLocked: false, createdAt, updatedAt: createdAt };
        
        // Auto-login after registration
        await login(email, password);
      } else {
        dispatch({
          type: 'AUTH_FAILURE',
          payload: { error: response.error?.message || 'Registration failed' }
        });
      }
    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: { error: error instanceof Error ? error.message : 'Registration failed' }
      });
    }
  };

  const logout = async () => {
    try {
      const { apiClient } = await import('@/lib/api');
      const session = state.session;
      
      if (session?.token) {
        await apiClient.logout(session.token);
      }
      
      // Clear local storage
      localStorage.removeItem('mfa_session');
      localStorage.removeItem('mfa_user');
      
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage even if API call fails
      localStorage.removeItem('mfa_session');
      localStorage.removeItem('mfa_user');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const value: AuthContextType = {
    state,
    dispatch,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
