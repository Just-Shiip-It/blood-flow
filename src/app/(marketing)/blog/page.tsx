"use client";

import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  Clock, 
  Mail,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BLOG_POSTS, CATEGORIES } from '@/lib/blog-data';

export default function BlogListingPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  return (
    <div className="bg-white min-h-screen pb-24 font-sans text-slate-900">
      
      {/* NEW HERO DESIGN: Centered, Emotional, Clean */}
      <div className="relative bg-white pt-20 pb-32 overflow-hidden">
        {/* Abstract organic shapes for emotional/soft feel */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-40 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-rose-100 rounded-full blur-[120px] mix-blend-multiply"></div>
            <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-orange-50 rounded-full blur-[100px] mix-blend-multiply"></div>
            <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] mix-blend-multiply"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <span className="inline-block py-1 px-3 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold uppercase tracking-wider mb-6">
                    The LifeFlow Journal
                </span>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-slate-900 mb-8 tracking-tight leading-none">
                    The Pulse of <br className="hidden md:block"/>
                    <span className="italic text-rose-600">Humanity.</span>
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Celebrating the silent heroes among us. Read stories of connection, resilience, and the life-saving science of blood donation.
                </p>

                {/* Search Bar - Centered and elegant */}
                <div className="max-w-lg mx-auto relative group">
                    <div className="absolute inset-0 bg-rose-200 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                    <div className="relative bg-white rounded-full shadow-lg shadow-slate-200/50 border border-slate-200 flex items-center p-2 transition-all group-focus-within:ring-4 group-focus-within:ring-rose-100 group-focus-within:border-rose-300">
                        <Search className="ml-4 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search for stories, tips, or science..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none px-4 text-slate-700 placeholder:text-slate-400 h-10"
                        />
                        <button className="bg-slate-900 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors">
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
      </div>

      {/* Categories Bar - Sticky */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-y border-slate-100 mb-16">
          <div className="container mx-auto px-4">
              <div className="flex items-center justify-center gap-8 overflow-x-auto scrollbar-hide py-4">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`text-sm font-bold transition-colors whitespace-nowrap relative ${
                            activeCategory === cat ? 'text-rose-600' : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        {cat}
                        {activeCategory === cat && (
                            <motion.div 
                                layoutId="activeCategory" 
                                className="absolute -bottom-4 left-0 right-0 h-0.5 bg-rose-600"
                            />
                        )}
                    </button>
                ))}
              </div>
          </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {filteredPosts.length > 0 ? (
          <>
            {/* Featured Post - Redesigned to be wider and more editorial */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="mb-24 group"
            >
               <Link href={`/blog/${featuredPost.id}`} className="block">
                   <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                       <div className="lg:w-2/3 relative overflow-hidden rounded-4xl shadow-2xl">
                            <img 
                                src={featuredPost.imageUrl} 
                                alt={featuredPost.title} 
                                className="w-full aspect-video object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-60"></div>
                       </div>
                       <div className="lg:w-1/3 flex flex-col justify-center py-4">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Featured</span>
                                <span className="text-slate-400 text-xs font-bold uppercase">{featuredPost.category}</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-900 mb-6 leading-tight group-hover:text-rose-600 transition-colors">
                                {featuredPost.title}
                            </h2>
                            <p className="text-lg text-slate-500 mb-8 line-clamp-3 leading-relaxed">
                                {featuredPost.excerpt}
                            </p>
                            
                            <div className="flex items-center gap-4 mt-auto">
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                    {featuredPost.author.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{featuredPost.author}</p>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <span>{featuredPost.date}</span>
                                        <span>•</span>
                                        <span>{featuredPost.readTime}</span>
                                    </div>
                                </div>
                            </div>
                       </div>
                   </div>
               </Link>
            </motion.div>

            {/* Grid for other posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
               {regularPosts.map((post, idx) => (
                 <motion.div 
                   key={post.id} 
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: idx * 0.1 }}
                   className="flex flex-col group cursor-pointer"
                 >
                    <Link href={`/blog/${post.id}`} className="flex flex-col h-full">
                      <div className="relative h-64 overflow-hidden rounded-3xl mb-6 shadow-md">
                         <img 
                           src={post.imageUrl} 
                           alt={post.title} 
                           className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                         />
                         <div className="absolute top-4 left-4">
                            <span className="bg-white/90 backdrop-blur-md text-xs font-bold px-3 py-1.5 rounded-full shadow-sm text-slate-900">
                               {post.category}
                            </span>
                         </div>
                      </div>

                      <div className="flex-1 flex flex-col">
                         <div className="flex items-center gap-3 text-xs text-slate-400 mb-3 font-medium uppercase tracking-wide">
                            <span>{post.date}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span>{post.readTime}</span>
                         </div>

                         <h3 className="text-xl font-bold font-serif text-slate-900 mb-3 leading-tight group-hover:text-rose-600 transition-colors">
                            {post.title}
                         </h3>
                         
                         <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed flex-1">
                            {post.excerpt}
                         </p>

                         <span className="inline-flex items-center text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors mt-auto">
                            Read Story <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                         </span>
                      </div>
                    </Link>
                 </motion.div>
               ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search size={24} />
             </div>
             <h3 className="text-lg font-bold text-slate-900">No stories found</h3>
             <p className="text-slate-500">Try adjusting your search or category filter.</p>
          </div>
        )}

        {/* Newsletter Section */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-center relative overflow-hidden mb-20">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
               <div className="absolute top-[-50%] right-[-10%] w-[500px] h-[500px] bg-rose-600 rounded-full blur-[100px]"></div>
               <div className="absolute bottom-[-50%] left-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[100px]"></div>
            </div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
               <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl text-rose-400 mb-6 backdrop-blur-sm border border-white/10">
                  <Mail size={24} />
               </div>
               <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">Stories worth sharing.</h2>
               <p className="text-slate-300 text-lg mb-10 leading-relaxed">
                  Join 15,000+ subscribers receiving the best donor stories, health tips, and community updates directly to their inbox.
               </p>
               
               <form className="flex flex-col sm:flex-row items-center gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full sm:flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 backdrop-blur-sm"
                  />
                  <Button className="w-full sm:w-auto rounded-full px-8 py-4 bg-white text-slate-900 hover:bg-rose-50 font-bold h-auto">
                     Subscribe
                  </Button>
               </form>
               <p className="text-xs text-slate-500 mt-6">No spam, unsubscribe anytime.</p>
            </div>
        </div>

      </div>
    </div>
  );
}
