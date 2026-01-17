/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');
const axios = require('axios'); // We'll use axios to fetch news

// --- CONFIGURATION ---
const BLOG_DATA_PATH = path.join(process.cwd(), 'src', 'static', 'blog-posts.json');
const SEO_CONFIG_PATH = path.join(process.cwd(), 'src', 'static', 'seo-config.json');

async function generateBlogWithoutKey() {
    try {
        console.log('🌐 Fetching latest technical news from the web...');

        // Fetching from Hacker News RSS (No Key Required)
        const response = await axios.get('https://hnrss.org/frontpage?points=50');
        const seoConfig = JSON.parse(fs.readFileSync(SEO_CONFIG_PATH, 'utf8'));

        // Simple XML parsing logic with safety checks
        const rawItems = response.data.match(/<item>([\s\S]*?)<\/item>/g) || [];
        const items = rawItems.slice(0, 5);

        if (items.length === 0) {
            console.log('⚠️ No news items found in the RSS feed.');
            return;
        }

        const blogData = JSON.parse(fs.readFileSync(BLOG_DATA_PATH, 'utf8'));

        let newsList = items.map(item => {
            const titleMatch = item.match(/<title>([\s\S]*?)<\/title>/);
            const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/);

            if (!titleMatch || !linkMatch) return null;

            const title = titleMatch[1].replace('<![CDATA[', '').replace(']]>', '').trim();
            const link = linkMatch[1].trim();
            return `<li><strong>${title}</strong>: Examining how this technical shift impacts modern software engineering. <a href="${link}" target="_blank" rel="noopener noreferrer">Source</a></li>`;
        }).filter(Boolean).join('\n');

        if (!newsList) {
            console.log('⚠️ Failed to parse any valid news items.');
            return;
        }

        const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        const title = `Engineering Digest: Technical Evolution in ${new Date().toLocaleString('default', { month: 'long' })} 2026`;

        // Check if this title already exists to avoid duplicate blogs on retry
        if (blogData.posts.some(p => p.title === title)) {
            console.log('⏭️ Blog with this title already exists. Skipping...');
            return;
        }

        const id = `tech-roundup-${Date.now()}`;

        // Create a Professional SEO-Optimized Template
        const newPost = {
            "id": id,
            "title": title,
            "excerpt": `Bhavin Pathak analyzes critical shifts in the global engineering ecosystem, focusing on AI, cloud scalability, and modern web architectures.`,
            "date": dateStr,
            "category": "Tech Roundup",
            "author": "Bhavin Pathak",
            "readTime": "6 min read",
            "content": `### The 2026 Engineering Landscape\n\nIn the ever-evolving world of software development, staying ahead of trends in ${seoConfig.defaultKeywords} is the hallmark of a professional architect. This digest breaks down some of the most impactful updates from the global community.\n\n### Key Technical Highlights\n\n<ul>\n${newsList}\n</ul>\n\n### Architectural Insight\n\nFrom my perspective as an SDE-1 focusing on high-performance systems, these updates signal a move toward more decentralized AI processing. Whether we are discussing Node.js event-loop optimizations or PostgreSQL partitioning strategies, the goal remains the same: building resilient, player-centric (or user-centric) systems.\n\nContinuing these technical deep-dives allows us to refine our internal practices at Meril and beyond, ensuring our stack remains state-of-the-art.\n\n*This technical audit was automatically compiled to keep the community and stakeholders informed on latest metrics.*`,
            "tags": ["Automation", "Engineering", "Latest Tech"]
        };

        // Add to the top of the list
        blogData.posts.unshift(newPost);

        fs.writeFileSync(BLOG_DATA_PATH, JSON.stringify(blogData, null, 4));
        console.log(`✅ Success! No-Key Blog Generated: ${newPost.title}`);

    } catch (error) {
        console.error('❌ Error in No-Key Generator:', error.message);
    }
}

generateBlogWithoutKey();
