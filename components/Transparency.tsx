import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dataService } from '../services/dataService';
import { FinancialRecord, ProgramProgress } from '../types';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-space-800 border border-white/10 p-3 rounded-lg shadow-xl">
        <p className="text-white font-bold mb-1">{label}</p>
        <p className="text-emerald-400 text-sm">
          Income: Rp {payload[0].value.toLocaleString()}
        </p>
        <p className="text-rose-400 text-sm">
          Expense: Rp {payload[1].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export const Transparency: React.FC = () => {
  const [financials, setFinancials] = useState<FinancialRecord[]>([]);
  const [programs, setPrograms] = useState<ProgramProgress[]>([]);

  useEffect(() => {
    dataService.getTransparencyData().then(data => {
      setFinancials(data.financial);
      setPrograms(data.programs);
    });
  }, []);

  return (
    <section id="transparency" className="py-24 bg-space-900/50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Financial Chart */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
              Open Treasury
            </h2>
            <div className="bg-space-800/30 border border-white/5 rounded-3xl p-6 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financials}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: '#ffffff05'}} />
                  <Bar dataKey="income" fill="#34d399" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="expense" fill="#fb7185" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">Data fetched live from Treasury Google Sheet</p>
          </div>

          {/* Program Progress */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-accent-sky rounded-full"></span>
              Program Status
            </h2>
            <div className="space-y-6">
              {programs.map((prog) => (
                <div key={prog.id} className="bg-space-800/30 border border-white/5 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-white">{prog.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-md font-medium
                      ${prog.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 
                        prog.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'
                      }`}>
                      {prog.status}
                    </span>
                  </div>
                  <div className="w-full bg-space-900 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-accent-sky h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${prog.progress}%` }}
                    />
                  </div>
                  <div className="text-right mt-2 text-xs text-gray-400">{prog.progress}% Completed</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};