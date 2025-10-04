import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env file manually
const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envLines = envContent.split('\n');

    envLines.forEach(line => {
        if (line.trim() && !line.startsWith('#')) {
            const [key, value] = line.split('=');
            process.env[key.trim()] = value.trim();
        }
    });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Supabase URL or key not found in environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProperties() {
    try {
        console.log('Fetching properties...');
        const { data, error } = await supabase
            .from('properties')
            .select('id, title, images, city, price')
            .limit(3);

        if (error) {
            console.error('Error fetching properties:', error);
            return;
        }

        console.log('Properties found:', JSON.stringify(data, null, 2));

        // Check if any properties have images
        const propertiesWithImages = data.filter(prop => prop.images && prop.images.length > 0);
        console.log(`Properties with images: ${propertiesWithImages.length}`);

        if (propertiesWithImages.length > 0) {
            console.log('First property with images:', JSON.stringify(propertiesWithImages[0], null, 2));
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

async function checkPropertyImages() {
    try {
        console.log('Fetching property images...');
        const { data, error } = await supabase
            .from('property_images')
            .select('*')
            .limit(5);

        if (error) {
            console.error('Error fetching property images:', error);
            return;
        }

        console.log('Property images found:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error:', err);
    }
}

async function runChecks() {
    await checkProperties();
    await checkPropertyImages();
}

runChecks();