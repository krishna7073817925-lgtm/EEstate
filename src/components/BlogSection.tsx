import React, { useState } from 'react';
import { ArrowRight, Calendar, X } from 'lucide-react';

interface Article {
  id: string;
  image: string;
  date: string;
  title: string;
  excerpt: string;
  content: string;
}

export const BlogSection: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const articles: Article[] = [
    {
      id: 'blog-1',
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
      date: 'May 10, 2026',
      title: 'Top 5 Things to Consider Before Buying a Home',
      excerpt: 'Location, budget buffers, structural inspections, school districts, and long-term resale potential.',
      content: 'Purchasing real estate is one of the most consequential decisions you will ever make. Before submitting an offer, ensure you verify property zoning, conduct thorough foundation and plumbing surveys, evaluate neighborhood appreciation trends, and calculate total cost of ownership including property taxes and maintenance.'
    },
    {
      id: 'blog-2',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      date: 'May 5, 2026',
      title: 'Best Real Estate Investment Opportunities in 2026',
      excerpt: 'Navigating urban development corridors, plot appreciation, and sustainable energy residences.',
      content: 'Emerging tech hubs and residential plot developments with municipal planning approvals offer standout capital appreciation. Investing in energy-efficient builds with smart microgrid integration provides both recurring utility savings and premium tenant demand.'
    },
    {
      id: 'blog-3',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      date: 'April 28, 2026',
      title: 'Tips for a Successful Home Buying Journey',
      excerpt: 'From mortgage pre-approval to final walkthrough checks, master every stage of the closing process.',
      content: 'A smooth closing begins with clear documentation and pre-underwritten financing. When attending viewings, inspect natural daylight, sound insulation, water pressure, and inspect electrical panels. Our certified agents at EEstates ensure you never face unexpected surprises.'
    }
  ];

  return (
    <section id="blog-section" className="py-20 bg-white border-t border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#0B3B2C] mb-2">
              <span>Insights & Tips</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Latest from Our Blog
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-[#0B3B2C] cursor-pointer hover:underline flex items-center gap-1">
              View All Articles <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedArticle(item)}
              className="group cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="aspect-[16/10] rounded-3xl overflow-hidden bg-stone-100 shadow-sm border border-stone-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex items-center gap-2 text-stone-400 text-xs font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-[#0B3B2C]" />
                  <span>{item.date}</span>
                </div>

                <h3 className="font-heading font-bold text-lg text-stone-900 group-hover:text-[#0B3B2C] transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-stone-500 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                  {item.excerpt}
                </p>
              </div>

              <div className="pt-4 flex items-center gap-2 text-xs font-bold text-[#0B3B2C] group-hover:translate-x-1 transition-transform">
                <span>Read More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Article Modal Reader */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-100 text-stone-500"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-5">
              <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-bold text-[#0B3B2C]">{selectedArticle.date}</span>
            <h2 className="font-heading font-bold text-2xl text-stone-900 mt-1 mb-4">
              {selectedArticle.title}
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {selectedArticle.content}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
