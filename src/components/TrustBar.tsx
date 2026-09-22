import React from 'react';
import { ShieldCheck, UserCheck, LayoutGrid, CheckCircle2 } from 'lucide-react';

export const TrustBar: React.FC = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Trusted & Reliable',
      description: 'A name you can trust in real estate.',
      id: 'trust-feature-1'
    },
    {
      icon: UserCheck,
      title: 'Expert Guidance',
      description: 'Get personalized advice from our professionals.',
      id: 'trust-feature-2'
    },
    {
      icon: LayoutGrid,
      title: 'Wide Property Range',
      description: 'Residential, commercial & more.',
      id: 'trust-feature-3'
    },
    {
      icon: CheckCircle2,
      title: 'Easy & Secure Process',
      description: 'A smooth experience from start to finish.',
      id: 'trust-feature-4'
    }
  ];

  return (
    <section className="py-10 bg-white border-y border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id} 
                id={item.id}
                className="flex items-start gap-4 p-2 rounded-2xl transition-all hover:bg-stone-50"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#EAF5EF] text-[#0B3B2C] flex items-center justify-center shrink-0 border border-[#0B3B2C]/10">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm sm:text-base text-stone-900 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
