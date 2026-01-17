import React from 'react';


import AuthProvider from './src/AuthProvider';
import RouteProtect from './src/RouteProtect';

export default function App() {
 
  return (
    <AuthProvider>
      <RouteProtect/>
    </AuthProvider>
  );
}