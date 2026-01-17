/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const BLOG_DATA_PATH = path.join(process.cwd(), 'public', 'data', 'blog-posts.json');

async function generateHumanLikeBlog() {
    try {
        console.log('🌐 Fetching global technical signals...');
        const response = await axios.get('https://hnrss.org/frontpage?points=30');

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

        // REAL BLOG TEMPLATE (Narrative Style - Neutral and Professional)
        const blogContent = `
### Current Trends in Scalable Systems

Modern software engineering is witnessing a significant pivot towards performance-centric architectures. As we navigate through the complexities of distributed computing in 2026, the boundary between local development and global cloud orchestration is blurring. Recent developments—specifically regarding **${news[0].title}**—highlight this shift. From a technical standpoint, this isn't just a minor update; it is a fundamental change in how we think about data integrity and response latency.

### Technical Deep Dive

We are seeing a massive surge in interest around decentralized intelligence. For instance, the progress made in **${news[1].title}** ([source](${news[1].link})) demonstrates that the industry is moving away from bloated monolithic structures in favor of leaner, highly specialized services. These shifts can fundamentally transform large-scale data management—ensuring that the tech stack is as responsive as the real-time requirements of the system.

Furthermore, updates like **${news[2].title}** are setting new benchmarks for developer velocity. The focus for modern engineering remains on how these tools can be integrated into existing PostgreSQL and Node.js pipelines without compromising on security or scalability.

### Strategic Conclusion

The next phase of engineering isn't about adoption; it's about optimization. Whether you are operating out of local tech hubs or building global enterprise solutions, the core mission remains: delivering premium, end-to-end experiences that stand the test of high-concurrency workloads. We must continue to audit these technical shifts not just as observers, but as architects of the next-generation web.

*This technical thought piece was automatically compiled to ensure the platform remains aligned with real-world engineering metrics.*`;

        const newPost = {
            "id": blogId,
            "title": blogTitle,
            "excerpt": `Technical analysis into ${news[0].title} and the evolving landscape of modern software architectures in 2026.`,
            "date": dateStr,
            "category": "Engineering",
            "author": "Engineering Team",
            "readTime": "8 min read",
            "content": blogContent,
            "tags": ["Technical Architecture", "Engineering Insight", "2026 Trends"]
        };

        const blogData = JSON.parse(fs.readFileSync(BLOG_DATA_PATH, 'utf8'));

        // Prevent duplicates
        if (!blogData.posts.some(p => p.title === blogTitle)) {
            // Push to the end as requested
            blogData.posts.push(newPost);
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
