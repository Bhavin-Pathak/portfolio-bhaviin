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

        // Simple XML parsing logic to get titles and descriptions
        const items = response.data.match(/<item>([\s\S]*?)<\/item>/g).slice(0, 5);

        let newsList = items.map(item => {
            const title = item.match(/<title>([\s\S]*?)<\/title>/)[1].replace('<![CDATA[', '').replace(']]>', '');
            const link = item.match(/<link>([\s\S]*?)<\/link>/)[1];
            return `<li><strong>${title}</strong>: Exploring the implications of this update on scalable architectures. <a href="${link}">Read source</a></li>`;
        }).join('\n');

        const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        const id = `tech-roundup-${Date.now()}`;

        // Create a Professional SEO-Optimized Template
        const newPost = {
            "id": id,
            "title": `Engineering Digest: Latest Innovations in ${new Date().toLocaleString('default', { month: 'long' })} 2026`,
            "excerpt": `Bhavin Pathak analyzes the latest technical shifts in the global engineering ecosystem, focusing on AI and scalable systems.`,
            "date": dateStr,
            "category": "Tech Roundup",
            "author": "Bhavin Pathak",
            "readTime": "6 min read",
            "content": `### The 2026 Technical Landscape\n\nAs a professional developer focused on ${seoConfig.defaultKeywords}, staying updated with the rapid pulse of the industry is non-negotiable. This week, we are witnessing a significant shift in how distributed systems handle high-concurrency workloads. \n\n### Top Global Tech Highlights\n\n<ul>\n${newsList}\n</ul>\n\n### Bhavin's Engineering Perspective\n\nFrom a software architect's viewpoint, these developments underline a critical trend: the convergence of AI logic with edge computing. Whether it is optimized PostgreSQL queries or React-based micro-frontends, the goal remains the same—delivering premium performance.\n\nAt Meril Life Sciences and beyond, I have observed that the most successful projects are those that embrace these technical shifts early. Integrating these updates into our workflow ensures that we remain at the forefront of the industry.\n\n*This audit was automatically compiled to ensure the community stays informed on the latest engineering benchmarks.*`,
            "tags": ["Automation", "Engineering", "Latest Tech"]
        };

        // Update JSON file
        const blogData = JSON.parse(fs.readFileSync(BLOG_DATA_PATH, 'utf8'));
        blogData.posts.unshift(newPost);

        fs.writeFileSync(BLOG_DATA_PATH, JSON.stringify(blogData, null, 4));
        console.log(`✅ Success! No-Key Blog Generated: ${newPost.title}`);

    } catch (error) {
        console.error('❌ Error in No-Key Generator:', error.message);
    }
}

generateBlogWithoutKey();
