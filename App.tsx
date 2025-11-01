import React from 'react';
import MarketAnalyzer from './components/MarketAnalyzer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen text-white font-sans bg-black relative">
       <div className="wave-bg"></div>
      <MarketAnalyzer />
    </div>
  );
};

export default App;