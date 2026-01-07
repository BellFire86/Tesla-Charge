
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <svg className="w-8 h-8 text-red-600 fill-current" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z" />
        </svg>
        <h1 className="text-xl font-bold tracking-widest uppercase">Tesla Charge</h1>
      </div>
      <div className="text-xs text-white/40 uppercase tracking-tighter">
        Near Me
      </div>
    </header>
  );
};

export default Header;
