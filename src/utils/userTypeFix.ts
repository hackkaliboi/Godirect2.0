/**
 * Utility functions to fix user type issues
 */

import { supabase } from "@/integrations/supabase/client";

/**
 * Update a user's type in the database
 * @param userId - The UUID of the user
 * @param userType - The new user type ('admin' or 'user')
 * @returns Promise<void>
 */
export const updateUserType = async (userId: string, userType: "admin" | "user"): Promise<void> => {
    try {
        const { error } = await supabase
            .from('profiles')
            .update({ user_type: userType })
            .eq('id', userId);

        if (error) {
            throw new Error(`Failed to update user type: ${error.message}`);
        }

        console.log(`Successfully updated user ${userId} to type ${userType}`);
    } catch (error) {
        console.error("Error updating user type:", error);
        throw error;
    }
};

/**
 * Get a user's current type from the database
 * @param userId - The UUID of the user
 * @returns Promise<string> - The user's current type
 */
export const getUserType = async (userId: string): Promise<string> => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', userId)
            .single();

        if (error) {
            throw new Error(`Failed to fetch user type: ${error.message}`);
        }

        return data?.user_type || 'user';
    } catch (error) {
        console.error("Error fetching user type:", error);
        throw error;
    }
};

/**
 * List all users with their types (admin only)
 * @returns Promise<Array<{id: string, email: string, user_type: string}>>
 */
export const listAllUsers = async (): Promise<Array<{ id: string, email: string, user_type: string }>> => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, email, user_type')
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(`Failed to fetch users: ${error.message}`);
        }

        return data || [];
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};