import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PostProvider } from './context/PostContext';
import { SocialLayout } from './layouts/SocialLayout';
import { Home } from './pages/Home';
import { Friends } from './pages/Friends';
import { Groups } from './pages/Groups';
import { Marketplace } from './pages/Marketplace';
import { Memories } from './pages/Memories';
import { NotFound } from './pages/NotFound';
import { Profile } from './pages/Profile';
import { AuthPage } from './pages/AuthPage';
import { usePost } from './hooks/usePost';

function AppRoutes() {
  const { currentUser } = usePost();

  if (!currentUser) {
    return <AuthPage />;
  }

  return (
    <Routes>
      <Route element={<SocialLayout />}>
        <Route index element={<Home />} />
        <Route path="perfil" element={<Profile />} />
        <Route path="amigos" element={<Friends />} />
        <Route path="grupos" element={<Groups />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="recuerdos" element={<Memories />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <PostProvider>
        <AppRoutes />
      </PostProvider>
    </BrowserRouter>
  );
}

export default App;
