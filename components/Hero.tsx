import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { HERO_TITLE, HERO_SUBTITLE } from '../constants';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-indigo/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-sky/20 rounded-full blur-[128px] pointer-events-none" />

      <div className="container mx-auto px-6 text-center z-10 relative">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-accent-sky/30 bg-accent-sky/10 backdrop-blur-sm">
          <span className="text-xs font-semibold text-accent-sky tracking-wider uppercase">Karang Taruna 2.0</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
            {HERO_TITLE}
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          {HERO_SUBTITLE}
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <button className="px-8 py-4 rounded-full bg-accent-sky text-space-900 font-bold hover:bg-accent-sky/90 transition-all flex items-center gap-2 shadow-[0_0_20px_-5px_#38BDF8]">
            Explore Ecosystem <ArrowRight className="w-4 h-4" />
          </button>
          <button className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all backdrop-blur-sm">
            View Proposal
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce opacity-50">
        <ChevronDown className="w-6 h-6 text-white" />
      </div>
    </section>
  );
};