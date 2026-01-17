import { motion } from "framer-motion";
import { LiquidContainer } from "../components/LiquidContainer.js";
import Header from "../components/Header.js";
import { BookOpen, ExternalLink, Loader2 } from "lucide-react";
import { pageVariants } from "../utils/animations.js";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO.js";
import { useEffect, useState } from "react";

export default function BlogView() {
    const navigate = useNavigate();
    const [blogData, setBlogData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch fresh blog data with cache-busting
        fetch(`/data/blog-posts.json?t=${new Date().getTime()}`)
            .then(res => res.json())
            .then(data => {
                // Since we now push new blogs to the end of the array,
                // we reverse it for display so newest appears first.
                const displayData = {
                    ...data,
                    posts: [...data.posts].reverse()
                };
                setBlogData(displayData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading blogs:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (!blogData) return null;

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen bg-transparent overflow-x-hidden flex flex-col"
        >
            <SEO
                title="Insights"
                description="Read the latest articles and insights from Bhavin Pathak on technology, software development, AI, and career growth."
                url="/blog"
            />
            <Header
                title={blogData.pageTitle}
                subtitle={blogData.pageSubtitle}
            />

            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-28 md:pt-36 pb-12 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogData.posts.map((post, idx) => (
                        <motion.div
                            key={post.id}
                            whileHover={{ scale: 1.05, y: -10 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="h-full"
                        >
                            <LiquidContainer delay={idx * 0.1} className="p-6 flex flex-col h-full bg-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                                        {post.title}
                                    </h3>
                                    <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300 whitespace-nowrap ml-2">
                                        {post.category}
                                    </span>
                                </div>

                                <p className="text-gray-400 text-sm mb-6 flex-grow leading-relaxed line-clamp-1">
                                    {post.excerpt}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    <span className="text-xs text-blue-300 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">
                                        {post.date}
                                    </span>
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-white/10 mt-auto">
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <BookOpen className="w-4 h-4" /> Professional
                                    </div>
                                    <button
                                        onClick={() => navigate(`/blog/${post.id}`)}
                                        className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors ml-auto group/btn"
                                    >
                                        <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /> Read Article
                                    </button>
                                </div>
                            </LiquidContainer>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
