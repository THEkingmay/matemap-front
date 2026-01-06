import AuthProvider from './src/AuthProvider';
import RootStack from './src/navigations/rootStack'; 

export default function App() {
  return (
    <AuthProvider>
      <RootStack/>
    </AuthProvider>
  );
}
