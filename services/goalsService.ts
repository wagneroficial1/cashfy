
import { supabase } from './supabaseClient';
import { Goal } from '../types';

export const goalsService = {
    async fetchGoals(): Promise<Goal[]> {
        const { data, error } = await supabase
            .from('goals')
            .select('*')
            .order('deadline', { ascending: true });

        if (error) throw error;

        // Map database snake_case to frontend camelCase if necessary, 
        // or rely on types matching if DB columns match typescript interfaces.
        // Based on database_schema.sql: 
        // target_amount, current_amount are snake_case.
        // Goal interface in types.ts: targetAmount, currentAmount (camelCase).
        // We need to map them.

        return (data || []).map(item => ({
            id: item.id,
            name: item.name,
            targetAmount: item.target_amount,
            currentAmount: item.current_amount,
            deadline: item.deadline
        }));
    },

    async createGoal(goal: Omit<Goal, 'id'>): Promise<Goal> {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error("User not authenticated");

        const dbGoal = {
            user_id: user.id,
            name: goal.name,
            target_amount: goal.targetAmount,
            current_amount: goal.currentAmount,
            deadline: goal.deadline
        };

        const { data, error } = await supabase
            .from('goals')
            .insert([dbGoal])
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.id,
            name: data.name,
            targetAmount: data.target_amount,
            currentAmount: data.current_amount,
            deadline: data.deadline
        };
    },

    async deleteGoal(id: string): Promise<void> {
        const { error } = await supabase
            .from('goals')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
