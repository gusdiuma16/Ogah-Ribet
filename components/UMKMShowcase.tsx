import React, { useEffect, useState } from 'react';
import { ShoppingBag, ArrowUpRight } from 'lucide-react';
import { dataService } from '../services/dataService';
import { UMKMProduct } from '../types';

export const UMKMShowcase: React.FC = () => {
  const [products, setProducts] = useState<UMKMProduct[]>([]);

  useEffect(() => {
    dataService.getUMKM().then(setProducts);
  }, []);

  return (
    <section id="umkm" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <span className="text-accent-indigo text-sm font-bold tracking-widest uppercase mb-2 block">Local Pride</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Curated UMKM Showcase</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {products.map((product) => (
            <div key={product.id} className="group relative aspect-square rounded-3xl overflow-hidden cursor-pointer">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-space-900/90 via-space-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-xs text-accent-sky font-semibold mb-1">{product.category}</span>
                <h3 className="text-lg font-bold text-white leading-tight mb-1">{product.name}</h3>
                <p className="text-sm text-gray-300 mb-3">by {product.owner}</p>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-white">Rp {product.price.toLocaleString()}</span>
                  <div className="w-8 h-8 rounded-full bg-white text-space-900 flex items-center justify-center">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">
            <ShoppingBag className="w-4 h-4" /> View All Products
          </button>
        </div>
      </div>
    </section>
  );
};