import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';

// Lazy-load heavy pages for faster initial load
const Lab = lazy(() => import('./pages/Lab').then(m => ({ default: m.Lab })));
const Missions = lazy(() => import('./pages/Missions').then(m => ({ default: m.Missions })));
const PeriodicTable = lazy(() => import('./pages/PeriodicTable').then(m => ({ default: m.PeriodicTable })));
const Sandbox = lazy(() => import('./pages/Sandbox').then(m => ({ default: m.Sandbox })));
const BakingSodaAnimation = lazy(() => import('./pages/BakingSodaAnimation').then(m => ({ default: m.BakingSodaAnimation })));
const Syllabus = lazy(() => import('./pages/Syllabus').then(m => ({ default: m.Syllabus })));

const LoadingFallback = () => (
  <div className="w-full h-screen flex items-center justify-center bg-[#050508]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      <span className="text-sm text-zinc-500 font-medium tracking-wider uppercase">Loading...</span>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-transparent text-white font-sans selection:bg-indigo-500/30">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center opacity-5 fixed -z-10 mix-blend-screen pointer-events-none" />
        <Navbar />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lab" element={<Lab />} />
            <Route path="/sandbox" element={<Sandbox />} />
            <Route path="/missions" element={<Missions />} />
            <Route path="/periodic-table" element={<PeriodicTable />} />
            <Route path="/baking-soda" element={<BakingSodaAnimation />} />
            <Route path="/syllabus" element={<Syllabus />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
