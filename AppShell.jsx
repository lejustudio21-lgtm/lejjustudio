import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import Layout from './Layout';
import AgentWidget from './AgentWidget';
import Footer from './Footer';
import MantraSpace from './MantraSpace';

export default function AppShell({ children }) {
  const navigate = useNavigate();
  const [state, setState] = useState({ loading: true, user: null, signed: false });

  useEffect(() => {
    const check = async () => {
      try {
        const me = await base44.auth.me();
        if (!me) {
          navigate('/login');
          return;
        }
        if (!me.sovereignty_signed_date) {
          navigate('/onboarding');
          return;
        }
        setState({ loading: false, user: me, signed: true });
      } catch {
        navigate('/login');
      }
    };
    check();
  }, []);

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-carbon">
        <div className="w-8 h-8 border-2 border-white/10 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Layout>
      {children}
      <Footer />
      <AgentWidget />
      <MantraSpace autoOpen={true} />
    </Layout>
  );
}