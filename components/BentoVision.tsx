import React, { useEffect, useState } from 'react';
import { Target, Rocket, Users, TrendingUp } from 'lucide-react';
import { dataService } from '../services/dataService';
import { VisionStat } from '../types';

export const BentoVision: React.FC = () => {
  const [stats, setStats] = useState<VisionStat[]>([]);

  useEffect(() => {
    dataService.getStats().then(setStats);
  }, []);

  return (
    <section id="vision" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Visionary Blueprint</h2>
          <p className="text-gray-400 max-w-xl">Mengubah cara organisasi kepemudaan bekerja dengan pendekatan startup yang agile, transparan, dan berdampak.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
          
          {/* Main Vision Card - Large */}
          <div className="md:col-span-2 md:row-span-2 bg-space-800/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 flex flex-col justify-between group hover:border-accent-indigo/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-accent-indigo/20 flex items-center justify-center text-accent-indigo mb-6">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">The North Star</h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                Menjadikan Karang Taruna Jati Cempaka sebagai inkubator digital pertama di tingkat kelurahan yang mencetak technopreneur dan pemimpin masa depan yang adaptif terhadap Revolusi Industri 4.0.
              </p>
              <div className="h-32 bg-gradient-to-br from-accent-indigo/10 to-transparent rounded-2xl border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.05]" />
              </div>
            </div>
          </div>

          {/* Mission Card 1 */}
          <div className="md:col-span-1 bg-space-800/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:bg-space-800/70 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <Rocket className="text-accent-sky w-5 h-5" />
              <h4 className="font-semibold text-white">Digitalisasi UMKM</h4>
            </div>
            <p className="text-sm text-gray-400">Membantu 100+ UMKM lokal go-digital dengan branding dan platform e-commerce terintegrasi.</p>
          </div>

          {/* Mission Card 2 */}
          <div className="md:col-span-1 bg-space-800/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:bg-space-800/70 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-purple-400 w-5 h-5" />
              <h4 className="font-semibold text-white">Talent Pool</h4>
            </div>
            <p className="text-sm text-gray-400">Database terpusat untuk menghubungkan skill pemuda dengan peluang kerja profesional.</p>
          </div>

          {/* Real-time Stats */}
          <div className="md:col-span-2 bg-gradient-to-r from-space-800 to-space-900 border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-around gap-6">
            {stats.length === 0 ? (
              <p className="text-gray-500 animate-pulse">Loading Live Data...</p>
            ) : (
              stats.map((stat, idx) => (
                <div key={idx} className="text-center w-full">
                  <div className="text-3xl font-bold text-white mb-1 flex items-center justify-center gap-2">
                    {stat.value}
                    {stat.trend && (
                      <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" /> {stat.trend}
                      </span>
                    )}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">{stat.label}</div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </section>
  );
};