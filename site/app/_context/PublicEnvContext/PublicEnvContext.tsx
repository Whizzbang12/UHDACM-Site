'use client'

/**
 * This file is used to circumvent the process.env missing issue when importing public_env_vars directly.
 * 
 * This allows it to take in the public_env as a prop from a server component
 * and client components can use public env by calling `usePublicEnv`.
 * 
 */


import { public_env_vars_type } from '@/app/_utils/public_env_vars';
import React, { createContext, useContext } from 'react';
const EnvContext = createContext<any | null>(null);

interface EnvProviderProps {
  children: React.ReactNode;
  env: public_env_vars_type; // Replace `any` with the imported type later
}

export const PublicEnvProvider: React.FC<EnvProviderProps> = ({ children, env }) => {
  return <EnvContext.Provider value={env}>{children}</EnvContext.Provider>;
};

/**
 * Used to import public_env_vars into client components
 * 
 * Webpack client components cannot use process.env client side,
 * This hack lets use bypass this limitation.
 * 
 * @returns 
 */
export const usePublicEnv = () => {
  const context = useContext<EnvProviderProps['env']>(EnvContext);
  if (!context) {
    throw new Error('useEnv must be used within an EnvProvider');
  }
  return context;
};