import React from 'react';
import ToastManager from 'toastify-react-native';

import AuthProvider from './src/AuthProvider';
import RouteProtect from './src/RouteProtect';

export default function App() {
 
  return (
    <AuthProvider>
      <RouteProtect/>
      <ToastManager/>
    </AuthProvider>
  );
}