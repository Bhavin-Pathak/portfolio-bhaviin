/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const BLOG_DATA_PATH = path.join(process.cwd(), 'src', 'static', 'blog-posts.json');
const SEO_CONFIG_PATH = path.join(process.cwd(), 'src', 'static', 'seo-config.json');

async function generateHumanLikeBlog() {
    try {
        console.log('🌐 Fetching global technical signals...');
        const response = await axios.get('https://hnrss.org/frontpage?points=30');
        const seoConfig = JSON.parse(fs.readFileSync(SEO_CONFIG_PATH, 'utf8'));

        // Pick 2 random keywords for natural injection
        const allKeywords = seoConfig.defaultKeywords.split(',');
        const randomKeywords = allKeywords.sort(() => 0.5 - Math.random()).slice(0, 2).map(k => k.trim());

        // Parse 3 top news items
        const rawItems = response.data.match(/<item>([\s\S]*?)<\/item>/g) || [];
        const news = rawItems.slice(0, 3).map(item => {
            return {
                title: item.match(/<title>([\s\S]*?)<\/title>/)[1].replace('<![CDATA[', '').replace(']]>', '').trim(),
                link: item.match(/<link>([\s\S]*?)<\/link>/)[1].trim()
            };
        });

        if (news.length < 3) return;

        const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        const monthYear = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

        const blogTitle = `The State of Distributed Engineering: ${monthYear} Insights`;
        const blogId = `engineering-insights-${Date.now()}`;

        // REAL BLOG TEMPLATE (Narrative Style)
        const blogContent = `
### The Evolution of Modern Architectures

In my journey as a **${randomKeywords[0]}**, I have always believed that the most resilient systems aren't just built on code, but on a deep understanding of current industry shifts. As we navigate through 2026, the boundary between local development and global cloud orchestration is blurring faster than ever.

Recent developments in the ecosystem—specifically regarding **${news[0].title}**—highlight a critical pivot towards more localized, performance-centric logic. From a technical standpoint, this isn't just a minor update; it is a fundamental change in how we think about data integrity and latency.

### Breaking Down the Global Narrative

We are seeing a massive surge in interest around decentralized intelligence. For instance, the progress made in **${news[1].title}** ([source](${news[1].link})) demonstrates that the industry is finally moving away from bloated monolithic structures in favor of leaner, highly specialized services. At Meril Life Sciences, we've often discussed how these shifts can fundamentally transform healthcare data management—ensuring that the tech stack is as responsive as the medical professionals using it.

Furthermore, updates like **${news[2].title}** are setting new benchmarks for developer velocity. As a **${randomKeywords[1]}**, my focus remains on how these tools can be integrated into existing PostgreSQL and Node.js pipelines without compromising on security or scalability.

### Final Thoughts: Looking Ahead

The next phase of engineering isn't about adoption; it's about optimization. Whether you are operating out of Vapi's tech hubs or building global enterprise solutions, the core mission remains: delivering premium, end-to-end experiences that stand the test of high-concurrency workloads. 

We must continue to audit these technical shifts not just as observers, but as architects of the next-generation web.

*This technical thought piece was automatically compiled to ensure my portfolio remains at the intersection of theory and real-world engineering metrics.*`;

        const newPost = {
            "id": blogId,
            "title": blogTitle,
            "excerpt": `Bhavin Pathak provides a deep-dive analysis into ${news[0].title} and the evolving landscape of modern software architectures in 2026.`,
            "date": dateStr,
            "category": "Engineering",
            "author": "Bhavin Pathak",
            "readTime": "8 min read",
            "content": blogContent,
            "tags": ["Technical Architecture", "Engineering Insight", "2026 Trends"]
        };

        const blogData = JSON.parse(fs.readFileSync(BLOG_DATA_PATH, 'utf8'));

        // Prevent duplicates
        if (!blogData.posts.some(p => p.title === blogTitle)) {
            blogData.posts.unshift(newPost);
            fs.writeFileSync(BLOG_DATA_PATH, JSON.stringify(blogData, null, 4));
            console.log(`✅ Success! Real-style Blog Generated: ${blogTitle}`);
        } else {
            console.log('⏭️ Blog already updated for this month.');
        }

    } catch (error) {
        console.error('❌ Error in Human-Like Generator:', error.message);
    }
}

generateHumanLikeBlog();
