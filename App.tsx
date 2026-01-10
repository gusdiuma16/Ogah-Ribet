import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { BentoVision } from './components/BentoVision';
import { TalentConnect } from './components/TalentConnect';
import { UMKMShowcase } from './components/UMKMShowcase';
import { Transparency } from './components/Transparency';
import { AdminPanel } from './components/AdminPanel';

// Landing Page Assembly
const LandingPage: React.FC = () => (
  <Layout>
    <Hero />
    <BentoVision />
    <TalentConnect />
    <UMKMShowcase />
    <Transparency />
  </Layout>
);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Hidden Admin Route */}
        <Route path="/internal-update-jati" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
};

export default App;