# Storage Bucket Guide

## Overview
The GoDirect Realty platform includes a comprehensive storage system with three dedicated buckets for different types of media and documents:

1. **avatars** - For user profile pictures
2. **property-images** - For property photos and galleries
3. **documents** - For KYC documents, contracts, and other private files

## Storage Buckets Configuration

### 1. Avatars Bucket
- **ID**: `avatars`
- **Name**: `avatars`
- **Visibility**: Public
- **Size Limit**: 5MB
- **Allowed File Types**: JPEG, PNG, WebP, GIF
- **Purpose**: User profile pictures

### 2. Property Images Bucket
- **ID**: `property-images`
- **Name**: `property-images`
- **Visibility**: Public
- **Size Limit**: 10MB
- **Allowed File Types**: JPEG, PNG, WebP
- **Purpose**: Property photos, galleries, and images

### 3. Documents Bucket
- **ID**: `documents`
- **Name**: `documents`
- **Visibility**: Private
- **Size Limit**: 20MB
- **Allowed File Types**: PDF, JPEG, PNG, DOC, DOCX
- **Purpose**: KYC documents, contracts, disclosures, and other sensitive files

## How to Use Storage Buckets

### 1. Uploading Profile Pictures (Avatars)
```javascript
import { supabase } from "@/integrations/supabase/client";

// Upload user avatar
const uploadAvatar = async (file, userId) => {
  const fileName = `${userId}/avatar.${file.type.split('/')[1]}`;
  
  const { data, error } = await supabase
    .storage
    .from('avatars')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    });
    
  if (error) {
    console.error('Error uploading avatar:', error);
    return null;
  }
  
  // Get public URL for the uploaded avatar
  const { data: { publicUrl } } = supabase
    .storage
    .from('avatars')
    .getPublicUrl(fileName);
    
  return publicUrl;
};
```

### 2. Uploading Property Images
```javascript
import { supabase } from "@/integrations/supabase/client";

// Upload property images (agents and admins only)
const uploadPropertyImage = async (file, propertyId) => {
  const fileName = `${propertyId}/${Date.now()}.${file.type.split('/')[1]}`;
  
  const { data, error } = await supabase
    .storage
    .from('property-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });
    
  if (error) {
    console.error('Error uploading property image:', error);
    return null;
  }
  
  // Get public URL for the uploaded image
  const { data: { publicUrl } } = supabase
    .storage
    .from('property-images')
    .getPublicUrl(fileName);
    
  return publicUrl;
};
```

### 3. Uploading Documents
```javascript
import { supabase } from "@/integrations/supabase/client";

// Upload documents (private)
const uploadDocument = async (file, userId, documentType) => {
  const fileName = `${userId}/${documentType}/${Date.now()}.${file.type.split('/')[1]}`;
  
  const { data, error } = await supabase
    .storage
    .from('documents')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });
    
  if (error) {
    console.error('Error uploading document:', error);
    return null;
  }
  
  // For private documents, we store the file path and generate signed URLs when needed
  return fileName; // Store this in the database
};

// Get signed URL for private documents
const getDocumentUrl = async (filePath) => {
  const { data, error } = await supabase
    .storage
    .from('documents')
    .createSignedUrl(filePath, 60); // URL valid for 60 seconds
    
  if (error) {
    console.error('Error getting document URL:', error);
    return null;
  }
  
  return data.signedUrl;
};
```

## Storage Policies

### Avatars Bucket Policies
- Users can upload their own avatars
- Users can update their own avatars
- Users can delete their own avatars
- Public read access to avatars

### Property Images Bucket Policies
- Only agents and admins can upload property images
- Public read access to property images

### Documents Bucket Policies
- Users can upload their own documents
- Only the owner and service role can view documents
- Private storage for sensitive documents

## Best Practices

### 1. File Naming Convention
- Use descriptive names with IDs: `{userId}/avatar.jpg`
- Include timestamps for unique file names: `{propertyId}/{timestamp}.jpg`

### 2. File Size Optimization
- Compress images before upload
- Use appropriate file formats (WebP for images when possible)
- Respect size limits to ensure successful uploads

### 3. Error Handling
- Always check for upload errors
- Provide user feedback on upload status
- Implement retry mechanisms for failed uploads

### 4. Security
- Never expose private document URLs directly
- Use signed URLs for time-limited access to private files
- Validate file types on the client side before upload

## Integration with Database

### Profile Pictures
```sql
-- Update user profile with avatar URL
UPDATE profiles 
SET avatar_url = 'https://your-supabase-url.supabase.co/storage/v1/object/public/avatars/user-id/avatar.jpg'
WHERE id = 'user-id';
```

### Property Images
```sql
-- Store property images as array in properties table
UPDATE properties 
SET images = ARRAY[
  'https://your-supabase-url.supabase.co/storage/v1/object/public/property-images/property-id/1234567890.jpg',
  'https://your-supabase-url.supabase.co/storage/v1/object/public/property-images/property-id/1234567891.jpg'
]
WHERE id = 'property-id';
```

### Documents
```sql
-- Store document paths in kyc_documents table
INSERT INTO kyc_documents (user_id, document_type, document_url, document_number)
VALUES (
  'user-id',
  'passport',
  'documents/user-id/passport/1234567890.jpg',
  'P12345678'
);
```

## Troubleshooting

### Common Issues

1. **Upload Permission Denied**
   - Ensure the user has the correct role (agent/admin for property images)
   - Check that the file size is within limits
   - Verify the file type is allowed

2. **File Not Found**
   - Check the file path is correct
   - Ensure the file was successfully uploaded
   - Verify the bucket name is correct

3. **URL Access Issues**
   - For private documents, use signed URLs instead of public URLs
   - Check that the file exists in storage
   - Verify RLS policies allow access

### Monitoring Storage Usage
```sql
-- Check storage usage (requires Supabase admin access)
SELECT 
  name as bucket_name,
  sum(metadata->>'size') as total_size_bytes
FROM storage.objects 
GROUP BY name;
```

## Maintenance

### Regular Tasks
1. Clean up unused files periodically
2. Monitor storage usage and upgrade plan if needed
3. Check for broken file references in the database
4. Review and update storage policies as needed

The storage system is designed to handle all your image and document needs efficiently and securely. Follow the best practices outlined above to ensure optimal performance and security.