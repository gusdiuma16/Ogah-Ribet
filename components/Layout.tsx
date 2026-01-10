import React, { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-space-900 text-white font-sans selection:bg-accent-sky/30">
      <Navbar />
      <main>
        {children}
      </main>
      <footer className="py-12 border-t border-white/5 bg-space-900 text-center">
        <p className="text-gray-500 text-sm">
          © 2025 JatiHub. Karang Taruna Jati Cempaka. <br/>
          Built with Future Tech.
        </p>
      </footer>
    </div>
  );
};