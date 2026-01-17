/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// --- CONFIGURATION ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const BLOG_DATA_PATH = path.join(process.cwd(), 'src', 'static', 'blog-posts.json');
const SEO_CONFIG_PATH = path.join(process.cwd(), 'src', 'static', 'seo-config.json');

async function generateBlog() {
    if (!GEMINI_API_KEY) {
        console.error('❌ Error: GEMINI_API_KEY is missing in environment variables.');
        return;
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    // Multi-Model Fallback strategy for better reliability
    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro"];
    let model;
    let success = false;

    for (const modelName of modelsToTry) {
        try {
            console.log(`📡 Attempting to use model: ${modelName}...`);
            model = genAI.getGenerativeModel({ model: modelName });
            // Test if the model exists with a very small prompt
            await model.generateContent("test");
            success = true;
            console.log(`✅ Using model: ${modelName}`);
            break;
        } catch (e) {
            console.warn(`⚠️ Model ${modelName} failed or not found. Trying next...`);
        }
    }

    if (!success) {
        throw new Error("❌ All AI models failed. Please check your API key permissions.");
    }

    const seoConfig = JSON.parse(fs.readFileSync(SEO_CONFIG_PATH, 'utf8'));

    const prompt = `
    Context: You are writing a professional software engineering blog post for Bhavin Pathak's portfolio.
    Keywords to include: ${seoConfig.defaultKeywords}.
    Objective: High SEO ranking, professional yet engaging tone, authoritative.
    
    Topic: Latest tech trend in January 2026 (AI, Web Dev, or Cloud).
    
    Return ONLY a JSON object with this exact structure:
    {
        "id": "url-friendly-slug",
        "title": "SEO Optimized Catchy Title",
        "excerpt": "A deep 150-character summary for meta tags",
        "date": "${new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}",
        "category": "Technology",
        "author": "Bhavin Pathak",
        "readTime": "7 min read",
        "content": "Detailed blog content with markdown headings (###). Minimum 400 words. Focus on scalable architectures and AI integration.",
        "tags": ["Tech", "Engineering", "AI"]
    }`;

    try {
        console.log('🤖 Generating new blog post using AI...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean JSON in case AI adds markdown blocks or extra characters
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        // Remove any leading/trailing non-JSON characters just in case
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("AI did not return valid JSON");

        const newPost = JSON.parse(jsonMatch[0]);

        // Update JSON file
        const blogData = JSON.parse(fs.readFileSync(BLOG_DATA_PATH, 'utf8'));

        // Check if ID already exists (unlikely with new content)
        if (blogData.posts.some(p => p.id === newPost.id)) {
            newPost.id = newPost.id + '-' + Date.now();
        }

        // Add to the top of the list
        blogData.posts.unshift(newPost);

        // Keep it clean (limit to 10 latest if you want, or keep all)
        fs.writeFileSync(BLOG_DATA_PATH, JSON.stringify(blogData, null, 4));
        console.log(`✅ Success! New blog added: ${newPost.title}`);

    } catch (error) {
        console.error('❌ Failed to generate blog:', error);
    }
}

generateBlog();
