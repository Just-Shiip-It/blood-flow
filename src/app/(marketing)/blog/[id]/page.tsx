import React from 'react';
import { 
  Calendar, 
  Clock, 
  Tag,
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Bookmark,
  MessageCircle,
  ThumbsUp
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOG_POSTS } from '@/lib/blog-data';

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const selectedPost = BLOG_POSTS.find(p => p.id === id);

  if (!selectedPost) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Nav Bar for Article */}
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 sm:px-6 lg:px-8 py-4">
            <div className="container mx-auto max-w-4xl flex items-center justify-between">
                <Link 
                   href="/blog"
                   className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft size={18} /> Back to Journal
                </Link>
                <div className="flex items-center gap-3">
                     <button className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-full hover:bg-rose-50">
                         <Bookmark size={20} />
                     </button>
                     <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50">
                         <Share2 size={20} />
                     </button>
                </div>
            </div>
        </div>

        <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
             {/* Article Header */}
             <div className="text-center mb-12">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                    <Tag size={12} /> {selectedPost.category}
                 </div>
                 <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 mb-6 leading-tight">
                     {selectedPost.title}
                 </h1>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-500 font-medium">
                     <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                             {selectedPost.author.charAt(0)}
                         </div>
                         <span>{selectedPost.author}</span>
                     </div>
                     <span className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full"></span>
                     <div className="flex items-center gap-4">
                         <span className="flex items-center gap-1.5"><Calendar size={14} /> {selectedPost.date}</span>
                         <span className="flex items-center gap-1.5"><Clock size={14} /> {selectedPost.readTime}</span>
                     </div>
                 </div>
             </div>

             {/* Hero Image */}
             <div className="rounded-4xl overflow-hidden shadow-2xl mb-12 lg:-mx-12 h-[400px] md:h-[500px] relative">
                 <img 
                    src={selectedPost.imageUrl} 
                    alt={selectedPost.title} 
                    className="w-full h-full object-cover"
                 />
             </div>

             {/* Content Body */}
             <div className="prose prose-lg prose-slate mx-auto max-w-2xl font-serif">
                 {selectedPost.content}
             </div>

             {/* Tags & Actions */}
             <div className="max-w-2xl mx-auto border-t border-slate-100 mt-12 pt-8">
                 <div className="flex flex-wrap gap-2 mb-8">
                    {selectedPost.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                            #{tag}
                        </span>
                    ))}
                 </div>
                 
                 <div className="flex items-center justify-between">
                     <div className="flex gap-4">
                         <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">
                             <ThumbsUp size={18} /> Like
                         </button>
                         <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">
                             <MessageCircle size={18} /> Comment
                         </button>
                     </div>
                     <div className="flex gap-2 text-slate-400">
                         <Facebook size={20} className="hover:text-blue-600 cursor-pointer transition-colors" />
                         <Twitter size={20} className="hover:text-blue-400 cursor-pointer transition-colors" />
                         <Linkedin size={20} className="hover:text-blue-700 cursor-pointer transition-colors" />
                     </div>
                 </div>
             </div>
        </article>

        {/* Related/Next Read */}
        <div className="bg-slate-50 py-20 border-t border-slate-200">
            <div className="container mx-auto px-4 max-w-4xl">
                <h3 className="font-bold text-slate-900 mb-8 font-serif text-2xl">Up Next</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {BLOG_POSTS.filter(p => p.id !== selectedPost.id).slice(0, 2).map(post => (
                        <Link 
                            key={post.id} 
                            href={`/blog/${post.id}`}
                            className="group cursor-pointer bg-white p-4 rounded-3xl shadow-sm hover:shadow-md transition-all flex gap-4 items-center"
                        >
                            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                                <img src={post.imageUrl} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-rose-600 uppercase mb-1 block">{post.category}</span>
                                <h4 className="font-bold font-serif text-slate-900 leading-tight group-hover:text-rose-600 transition-colors line-clamp-2">
                                    {post.title}
                                </h4>
                                <span className="text-xs text-slate-400 mt-2 block">{post.readTime}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
}
