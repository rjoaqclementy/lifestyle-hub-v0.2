import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Layout from './components/Layout';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import SoccerHub from './pages/SoccerHub';
import CreateMatch from './pages/soccer/CreateMatch';
import SoccerProfile from './pages/SoccerProfile';
import JoinHub from './pages/soccer/JoinHub';
import Play from './pages/soccer/Play';
import Lobby from './pages/soccer/Lobby';
import Match from './pages/soccer/Match';
import SetupAccount from './pages/SetupAccount';
import { supabase } from './lib/supabase';

const SharedMatchHandler = React.lazy(() => import('./components/soccer/match/SharedMatchHandler'));

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [setupRequired, setSetupRequired] = useState(false);

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkSetupRequired(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      await checkSetupRequired(user.id);
    }
    setLoading(false);
  };

  const checkSetupRequired = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', userId)
      .single();

    setSetupRequired(!profile?.onboarding_completed);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={user ? <Navigate to="/" replace /> : <Auth />} />
          <Route path="/m/:matchId" element={
            <React.Suspense fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            }>
              <SharedMatchHandler />
            </React.Suspense>
          } />
          <Route path="/soccer/match/:id" element={<Match />} />

          {/* Protected Routes */}
          <Route element={user ? <Outlet /> : <Navigate to="/auth" replace />}>
            <Route path="/setup" element={setupRequired ? <SetupAccount /> : <Navigate to="/" replace />} />
            <Route path="/profile" element={setupRequired ? <Navigate to="/setup" replace /> : <Profile />} />
            <Route path="/profile/edit" element={setupRequired ? <Navigate to="/setup" replace /> : <EditProfile />} />
            <Route path="/soccer" element={setupRequired ? <Navigate to="/setup" replace /> : <SoccerHub />} />
            <Route path="/soccer/join" element={setupRequired ? <Navigate to="/setup" replace /> : <JoinHub />} />
            <Route path="/soccer/profile" element={setupRequired ? <Navigate to="/setup" replace /> : <SoccerProfile />} />
            <Route path="/soccer/play" element={setupRequired ? <Navigate to="/setup" replace /> : <Play />} />
            <Route path="/soccer/create-match" element={setupRequired ? <Navigate to="/setup" replace /> : <CreateMatch />} />
            <Route path="/soccer/lobby" element={setupRequired ? <Navigate to="/setup" replace /> : <Lobby />} />
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;