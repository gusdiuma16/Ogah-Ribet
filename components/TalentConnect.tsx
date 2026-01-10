import React, { useEffect, useState } from 'react';
import { Briefcase, CheckCircle } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Talent } from '../types';

export const TalentConnect: React.FC = () => {
  const [talents, setTalents] = useState<Talent[]>([]);

  useEffect(() => {
    dataService.getTalents().then(setTalents);
  }, []);

  return (
    <section id="talent" className="py-24 bg-space-900 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Jati-Talent Connect</h2>
            <p className="text-gray-400">Directory skill anak muda Jati Cempaka. Siap kolaborasi.</p>
          </div>
          <button className="px-6 py-2 rounded-lg border border-accent-sky/50 text-accent-sky hover:bg-accent-sky/10 transition-colors text-sm font-semibold">
            Join Directory
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {talents.map((talent) => (
            <div key={talent.id} className="group bg-space-800/30 backdrop-blur-sm border border-white/5 hover:border-accent-sky/30 rounded-2xl p-6 transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img src={talent.avatarUrl} alt={talent.name} className="w-14 h-14 rounded-full border-2 border-space-800 object-cover" />
                  <div>
                    <h3 className="font-bold text-white">{talent.name}</h3>
                    <p className="text-sm text-gray-400">{talent.role}</p>
                  </div>
                </div>
                {talent.availableForHire && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Open
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {talent.skills.map((skill, idx) => (
                  <span key={idx} className="text-xs text-gray-300 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    {skill}
                  </span>
                ))}
              </div>

              <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 group-hover:bg-accent-sky group-hover:text-space-900">
                <Briefcase className="w-4 h-4" /> Contact Talent
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};