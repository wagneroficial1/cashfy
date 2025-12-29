
import { supabase } from './supabaseClient';
import { IncomeSource } from '../types';

export const incomeSourcesService = {
    async fetchIncomeSources(): Promise<IncomeSource[]> {
        const { data, error } = await supabase
            .from('income_sources')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.error("Supabase Error fetching income sources:", error);
            throw error;
        }

        return (data || []).map(item => ({
            id: item.id,
            name: item.name,
            expectedAmount: item.amount,
            color: item.color || '#34d399' // Fallback if color is missing in DB
        }));
    },

    async createIncomeSource(source: Omit<IncomeSource, 'id'>): Promise<IncomeSource> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const dbSource = {
            user_id: user.id,
            name: source.name,
            amount: source.expectedAmount,
            color: source.color
        };

        const { data, error } = await supabase
            .from('income_sources')
            .insert([dbSource])
            .select()
            .single();

        if (error) {
            console.error("Supabase Error creating income source:", error);
            console.error("Message:", error.message);
            console.error("Details:", error.details);
            console.error("Hint:", error.hint);
            throw error;
        }

        return {
            id: data.id,
            name: data.name,
            expectedAmount: data.amount,
            color: data.color
        };
    },

    async updateIncomeSource(source: IncomeSource): Promise<IncomeSource> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const dbSource = {
            name: source.name,
            amount: source.expectedAmount,
            color: source.color
        };

        const { data, error } = await supabase
            .from('income_sources')
            .update(dbSource)
            .eq('id', source.id)
            .eq('user_id', user.id) // Security check
            .select()
            .single();

        if (error) {
            console.error("Supabase Error updating income source:", error);
            console.error("Message:", error.message);
            console.error("Details:", error.details);
            console.error("Hint:", error.hint);
            throw error;
        }

        return {
            id: data.id,
            name: data.name,
            expectedAmount: data.amount,
            color: data.color
        };
    },

    async deleteIncomeSource(id: string): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { error } = await supabase
            .from('income_sources')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            console.error("Supabase Error deleting income source:", error);
            throw error;
        }
    }
};
