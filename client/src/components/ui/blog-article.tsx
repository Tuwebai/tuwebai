import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedShape from './animated-shape';

interface Reply {
  id: number;
  name: string;
  image?: string;
  text: string;
  date: string;
  likes: number;
}

interface Comment {
  id: number;
  name: string;
  image?: string;
  text: string;
  date: string;
  likes: number;
  replies?: Reply[];
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  authorImage?: string;
  image: string;
  readTime: string;
  content?: string;
  tags?: string[];
  comments?: Comment[];
  likes?: number;
  views?: number;
}

const BlogArticle: React.FC<{ post: BlogPost }> = ({ post }) => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-[#0a0a0f] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-1 pt-24 pb-16">
        <AnimatedShape type={1} className="top-[10%] right-[-150px]" delay={1} />
        <AnimatedShape type={2} className="bottom-[10%] left-[-100px]" delay={2} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Link to="/blog" className="inline-flex items-center text-gray-400 hover:text-white mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver al blog
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Article Header */}
              <div className="mb-12 text-center">
                <span className="inline-block px-4 py-1 bg-[#00CCFF]/10 text-[#00CCFF] rounded-full text-sm mb-4">
                  {post.category}
                </span>
                <h1 className="font-rajdhani font-bold text-3xl md:text-5xl mb-6">{post.title}</h1>
                
                <div className="flex flex-wrap justify-center items-center gap-6 mb-6 text-sm text-gray-400">
                  <div className="flex items-center">
                    {post.authorImage && (
                      <img 
                        src={post.authorImage} 
                        alt={post.author} 
                        className="w-8 h-8 rounded-full mr-2 object-cover border border-gray-700"
                      />
                    )}
                    <span>{post.author}</span>
                  </div>
                  
                  <span>{post.date}</span>
                  
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {post.readTime}
                  </span>
                  
                  {post.views && (
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      {post.views} lecturas
                    </span>
                  )}
                </div>
                
                <div className="mb-10 h-[400px] rounded-xl overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6 justify-center">
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Article Content */}
              {post.content ? (
                <div 
                  className="prose prose-invert prose-blue max-w-none mx-auto mb-12"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                ></div>
              ) : (
                <p className="text-gray-300 mb-12 text-center">{post.excerpt}</p>
              )}
              
              {/* Article Footer */}
              <div className="border-t border-gray-800 pt-8 mb-12">
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <button className="flex items-center text-gray-400 hover:text-[#00CCFF] transition-colors">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                      Me gusta ({post.likes || 0})
                    </button>
                    
                    <button className="flex items-center text-gray-400 hover:text-[#00CCFF] transition-colors">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                      </svg>
                      Compartir
                    </button>
                  </div>
                  
                  <button className="text-white px-4 py-2 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg hover:shadow-lg hover:shadow-[#00CCFF]/20 transition-shadow">
                    Más artículos de {post.author}
                  </button>
                </div>
              </div>
              
              {/* Comments */}
              {post.comments && post.comments.length > 0 && (
                <div className="border-t border-gray-800 pt-8">
                  <h3 className="font-bold text-2xl mb-6 text-white">Comentarios ({post.comments.length})</h3>
                  
                  {/* Comment Form */}
                  <div className="flex gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex-shrink-0"></div>
                    <div className="flex-grow">
                      <textarea 
                        placeholder="Escribe un comentario..." 
                        className="w-full bg-[#1a1a23] border border-gray-800 rounded-lg p-4 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent"
                        rows={3}
                      ></textarea>
                      <div className="flex justify-end mt-3">
                        <button className="px-4 py-2 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white text-sm font-medium hover:shadow-lg hover:shadow-[#00CCFF]/20 transition-shadow">
                          Publicar comentario
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Comment List */}
                  <div className="space-y-8">
                    {post.comments.map(comment => (
                      <div key={comment.id} className="border-b border-gray-800 pb-8 last:border-b-0">
                        <div className="flex gap-4">
                          {comment.image ? (
                            <img 
                              src={comment.image} 
                              alt={comment.name} 
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold">
                              {comment.name.charAt(0)}
                            </div>
                          )}
                          <div className="flex-grow">
                            <div className="flex justify-between mb-2">
                              <span className="font-medium text-white">{comment.name}</span>
                              <span className="text-sm text-gray-500">{comment.date}</span>
                            </div>
                            <p className="text-gray-300 text-sm mb-3">{comment.text}</p>
                            <div className="flex gap-4 text-sm">
                              <button className="text-gray-500 hover:text-[#00CCFF]">Me gusta ({comment.likes})</button>
                              <button className="text-gray-500 hover:text-[#00CCFF]">Responder</button>
                            </div>
                            
                            {/* Replies */}
                            {comment.replies && comment.replies.length > 0 && (
                              <div className="mt-4 space-y-4 pl-4 border-l border-gray-800">
                                {comment.replies.map(reply => (
                                  <div key={reply.id} className="flex gap-3">
                                    {reply.image ? (
                                      <img 
                                        src={reply.image} 
                                        alt={reply.name} 
                                        className="w-8 h-8 rounded-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-semibold">
                                        {reply.name.charAt(0)}
                                      </div>
                                    )}
                                    <div>
                                      <div className="flex gap-2 mb-1">
                                        <span className="font-medium text-white text-sm">{reply.name}</span>
                                        <span className="text-xs text-gray-500">{reply.date}</span>
                                      </div>
                                      <p className="text-gray-300 text-sm mb-2">{reply.text}</p>
                                      <button className="text-gray-500 hover:text-[#00CCFF] text-xs">Me gusta ({reply.likes})</button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Related Articles */}
      <section className="py-16 bg-[#0c0c14]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-rajdhani font-bold text-3xl mb-4">Artículos relacionados</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Descubre más contenido relacionado con {post.category.toLowerCase()}.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Placeholder articles for now */}
            {[1, 2, 3].map(item => (
              <div 
                key={item} 
                className="bg-[#121217] rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-900 animate-pulse"></div>
                </div>
                <div className="p-6">
                  <div className="w-24 h-6 bg-gray-800 rounded mb-4 animate-pulse"></div>
                  <div className="w-full h-6 bg-gray-800 rounded mb-2 animate-pulse"></div>
                  <div className="w-2/3 h-6 bg-gray-800 rounded mb-4 animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-800 rounded mb-2 animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-800 rounded mb-2 animate-pulse"></div>
                  <div className="w-2/3 h-4 bg-gray-800 rounded mb-4 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link 
              to="/blog" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium hover:shadow-lg hover:shadow-[#00CCFF]/20 transition-shadow"
            >
              Ver todos los artículos
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-1">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-[#121217] rounded-xl p-8 border border-gray-800">
            <div className="text-center mb-8">
              <h2 className="font-rajdhani font-bold text-3xl mb-4 gradient-text">
                ¿Te ha gustado este artículo?
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Suscríbete a nuestro newsletter y recibe en tu correo contenido exclusivo sobre {post.category.toLowerCase()}.
              </p>
            </div>
            
            <form className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Tu email"
                  className="flex-grow px-4 py-3 bg-[#0a0a0f]/70 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium shadow-lg shadow-[#00CCFF]/20 hover:shadow-[#9933FF]/30"
                >
                  Suscribirse
                </button>
              </div>
              <p className="text-gray-500 text-xs mt-3 text-center">
                Al suscribirte, aceptas nuestra política de privacidad. Nunca compartiremos tu email.
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogArticle;