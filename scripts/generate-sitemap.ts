
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in environment variables.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_URL = 'https://godirect.ng';

const staticRoutes = [
    '/',
    '/properties',
    '/contact',
    '/about',
    '/login',
    '/signup',
];

async function generateSitemap() {
    console.log('Generating sitemap...');

    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Add static routes
    staticRoutes.forEach(route => {
        sitemapContent += `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
    });

    // Fetch properties
    try {
        const { data: properties, error } = await supabase
            .from('properties')
            .select('id, updated_at')
            .eq('status', 'available');

        if (error) throw error;

        if (properties) {
            properties.forEach(property => {
                sitemapContent += `
  <url>
    <loc>${BASE_URL}/properties/${property.id}</loc>
    <lastmod>${new Date(property.updated_at).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
            });
        }

        console.log(`Fetched ${properties?.length || 0} properties.`);

    } catch (err) {
        console.error('Error fetching properties:', err);
    }

    sitemapContent += `
</urlset>`;

    const publicDir = path.resolve(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir);
    }

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent);
    console.log('Sitemap generated successfully at public/sitemap.xml');
}

generateSitemap();
