import React, { useEffect, useState } from 'react';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SignupFlow from '../components/auth/SignupFlow';
import ParticlesBackground from '../components/auth/ParticlesBackground';

const Auth = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        // Check if there's a pending match redirect
        const matchId = localStorage.getItem('pendingMatchRedirect');
        if (matchId) {
          localStorage.removeItem('pendingMatchRedirect');
          navigate(`/soccer/match/${matchId}`);
        } else {
          navigate('/');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4">
      {/* Animated Background */}
      <ParticlesBackground />

      {/* Glowing Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#573cff] rounded-full mix-blend-multiply filter blur-[128px] animate-pulse opacity-20" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse opacity-20" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block"
          >
            <img
              src="https://gfcesyuegnfgyntvqsmv.supabase.co/storage/v1/object/public/Public/logo.png"
              alt="Lifestyle Hub"
              className="h-12 w-auto mx-auto mb-4"
            />
          </motion.div>
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold mb-2"
          >
            Welcome to Lifestyle Hub
          </motion.h2>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400"
          >
            {view === 'signin' 
              ? 'Sign in to your account to continue'
              : 'Create an account to get started'
            }
          </motion.p>
        </div>

        {/* Auth Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="card backdrop-blur-sm bg-gray-900/90 border border-gray-800/50"
        >
          {view === 'signin' ? (
            <>
              <SupabaseAuth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: '#573cff',
                        brandAccent: '#573cff',
                        brandButtonText: 'white',
                        defaultButtonBackground: '#1f2937',
                        defaultButtonBackgroundHover: '#374151',
                      },
                      space: {
                        inputPadding: '12px 16px',
                        buttonPadding: '12px 16px',
                      },
                      borderWidths: {
                        buttonBorderWidth: '0px',
                        inputBorderWidth: '1px',
                      },
                      radii: {
                        borderRadiusButton: '8px',
                        buttonBorderRadius: '8px',
                        inputBorderRadius: '8px',
                      },
                      fontSizes: {
                        baseButtonSize: '14px',
                        baseInputSize: '14px',
                      },
                    },
                  },
                  className: {
                    container: 'auth-container',
                    button: 'auth-button !bg-[#573cff] hover:!bg-[#573cff]/80 transition-colors duration-200',
                    input: 'auth-input',
                    label: 'text-sm font-medium text-gray-400 mb-1',
                    message: 'text-sm text-red-500',
                    anchor: 'text-[#573cff] hover:text-[#573cff]/80 transition-colors duration-200',
                  },
                }}
                providers={['google']}
                redirectTo={window.location.origin}
                view="sign_in"
                showLinks={false}
              />
              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setView('signup')}
                    className="text-[#573cff] hover:text-[#573cff]/80 font-medium hover:underline transition-colors duration-200"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              <SignupFlow onComplete={() => navigate('/')} />
              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <button
                    onClick={() => setView('signin')}
                    className="text-[#573cff] hover:text-[#573cff]/80 font-medium hover:underline transition-colors duration-200"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Auth;