import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, User, Save, Camera, Upload, Palette } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ThemeSettings from "@/components/settings/ThemeSettings";

interface AdminProfileData {
    id: string;
    email: string;
    full_name: string;
    phone: string;
    avatar_url: string;
    bio: string;
    // Removed admin-specific fields that don't exist in the database schema
}

export default function AdminProfile() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [profile, setProfile] = useState<AdminProfileData>({
        id: '',
        email: '',
        full_name: '',
        phone: '',
        avatar_url: '',
        bio: ''
        // Removed admin-specific fields that don't exist in the database schema
    });
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    const fetchProfile = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);

            // Fetch admin profile from profiles table
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            // Check if error is "no rows returned" which is expected for new users
            if (profileError && profileError.message !== 'No rows returned') {
                throw profileError;
            }

            setProfile({
                id: profileData?.id || user.id,
                email: profileData?.email || user.email || '',
                full_name: profileData?.full_name || '',
                phone: profileData?.phone || '',
                avatar_url: profileData?.avatar_url || '',
                bio: profileData?.bio || ''
                // Removed admin-specific fields that don't exist in the database schema
            });

        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user, fetchProfile]);

    useEffect(() => {
        // Cleanup preview URL when component unmounts or file changes
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleInputChange = (field: keyof AdminProfileData, value: string) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        setProfileImage(file);

        // Create preview URL
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    const uploadProfileImage = async (file: File): Promise<string | null> => {
        if (!user) return null;

        try {
            setUploading(true);

            // Create unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/profile.${fileExt}`;

            console.log('Uploading file:', { fileName, fileSize: file.size, fileType: file.type });

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (uploadError) {
                console.error('Upload error:', uploadError);
                throw uploadError;
            }

            console.log('Upload successful:', uploadData);

            // Get public URL - using the correct method
            const { data } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            console.log('Public URL data:', data);

            return data.publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error(`Failed to upload image: ${error.message || error}`);
            return null;
        } finally {
            setUploading(false);
        }
    };

    const saveProfile = async () => {
        if (!user) return;

        try {
            setSaving(true);

            let avatarUrl = profile.avatar_url;

            // Upload new image if selected
            if (profileImage) {
                console.log('Uploading new profile image...');
                const uploadedUrl = await uploadProfileImage(profileImage);
                if (uploadedUrl) {
                    avatarUrl = uploadedUrl;
                    console.log('Image uploaded successfully:', uploadedUrl);
                } else {
                    console.log('Image upload failed');
                    // Don't save profile if image upload failed
                    return;
                }
            }

            // First, try to update the existing profile
            const { data: updateData, error: updateError } = await supabase
                .from('profiles')
                .update({
                    email: profile.email,
                    full_name: profile.full_name,
                    phone: profile.phone,
                    avatar_url: avatarUrl,
                    bio: profile.bio,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id)
                .select();

            // If no rows were updated, it means the profile doesn't exist, so insert it
            if (updateError || (updateData && Array.isArray(updateData) && updateData.length === 0)) {
                console.log('Profile does not exist, creating new profile...');

                const { error: insertError } = await supabase
                    .from('profiles')
                    .insert({
                        id: user.id,
                        email: profile.email,
                        full_name: profile.full_name,
                        phone: profile.phone,
                        avatar_url: avatarUrl,
                        bio: profile.bio,
                        user_type: 'admin', // Set user type for new profiles
                        status: 'active',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    });

                if (insertError) {
                    console.error('Profile insert error:', insertError);
                    throw insertError;
                }

                console.log('Profile created successfully');
            } else if (updateError) {
                console.error('Profile update error:', updateError);
                throw updateError;
            } else {
                console.log('Profile updated successfully');
            }

            // Update local state with new avatar URL
            setProfile(prev => ({ ...prev, avatar_url: avatarUrl }));
            setProfileImage(null);
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl('');
            }

            toast.success('Profile updated successfully!');

        } catch (error) {
            console.error('Error saving profile:', error);
            toast.error(`Failed to save profile: ${error.message || error}`);
        } finally {
            setSaving(false);
        }
    };

    const splitFullName = (fullName: string) => {
        const parts = fullName.trim().split(' ');
        return {
            firstName: parts[0] || '',
            lastName: parts.slice(1).join(' ') || ''
        };
    };

    const handleNameChange = (type: 'first' | 'last', value: string) => {
        const { firstName, lastName } = splitFullName(profile.full_name);
        const newFullName = type === 'first'
            ? `${value} ${lastName}`.trim()
            : `${firstName} ${value}`.trim();
        handleInputChange('full_name', newFullName);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Loading profile...</div>
            </div>
        );
    }

    const { firstName, lastName } = splitFullName(profile.full_name);
    const displayImage = previewUrl || profile.avatar_url;

    return (
        <div>
            <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <h1 className="text-2xl sm:text-3xl font-bold flex flex-wrap items-center gap-2">
                            <Settings className="h-6 w-6 sm:h-8 sm:w-88 text-primary flex-shrink-0" />
                            <span className="break-words">Admin Profile</span>
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground mt-1">
                            Manage your administrator profile and preferences
                        </p>
                    </div>
                </div>

                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="profile" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Profile
                        </TabsTrigger>
                        <TabsTrigger value="theme" className="flex items-center gap-2">
                            <Palette className="h-4 w-4" />
                            Theme
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="space-y-6 mt-6">
                        <div className="flex justify-end">
                            <Button
                                onClick={saveProfile}
                                disabled={saving || uploading}
                                className="bg-gradient-to-r from-primary to-primary-glow whitespace-nowrap"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>

                        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle>Personal Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input
                                                id="firstName"
                                                placeholder="Enter your first name"
                                                value={firstName}
                                                onChange={(e) => handleNameChange('first', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input
                                                id="lastName"
                                                placeholder="Enter your last name"
                                                value={lastName}
                                                onChange={(e) => handleNameChange('last', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="your.email@example.com"
                                            value={profile.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            disabled // Email usually shouldn't be editable
                                            className="bg-muted"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            placeholder="(555) 123-4567"
                                            value={profile.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Textarea
                                            id="bio"
                                            placeholder="Tell us about yourself..."
                                            className="min-h-[80px] resize-none"
                                            value={profile.bio}
                                            onChange={(e) => handleInputChange('bio', e.target.value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile Photo</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                                            {displayImage ? (
                                                <img
                                                    src={displayImage}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <User className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground" />
                                            )}
                                        </div>

                                        <div className="w-full space-y-2">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageSelect}
                                                className="hidden"
                                                id="profile-image-upload"
                                            />
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                onClick={() => document.getElementById('profile-image-upload')?.click()}
                                                disabled={uploading}
                                            >
                                                <Camera className="mr-2 h-4 w-4" />
                                                {uploading ? 'Uploading...' : 'Upload Photo'}
                                            </Button>

                                            {profileImage && (
                                                <p className="text-xs text-center text-muted-foreground">
                                                    New image selected: {profileImage.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="theme" className="space-y-6 mt-6">
                        <ThemeSettings />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}