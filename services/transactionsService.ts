
import { supabase } from './supabaseClient';
import { Transaction } from '../types';

export const transactionsService = {
    async fetchTransactions(): Promise<Transaction[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .order('date', { ascending: false });

        if (error) {
            console.error("Supabase Error fetching transactions:", error);
            throw error;
        }

        return (data || []).map(item => ({
            id: item.id,
            date: item.date,
            description: item.description,
            amount: Number(item.amount),
            category: item.category,
            type: item.type
        }));
    },

    async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const dbTransaction = {
            user_id: user.id,
            description: transaction.description,
            amount: transaction.amount,
            category: transaction.category,
            type: transaction.type,
            date: transaction.date
        };

        console.log("Database payload built:", dbTransaction);

        const { data, error } = await supabase
            .from('transactions')
            .insert([dbTransaction])
            .select()
            .single();

        if (error) {
            console.error("Supabase Error creating transaction - Full Object:", error);
            console.error("Message:", error.message);
            console.error("Details:", error.details);
            console.error("Hint:", error.hint);
            throw error;
        }

        return {
            id: data.id,
            date: data.date,
            description: data.description,
            amount: Number(data.amount),
            category: data.category,
            type: data.type
        };
    },

    async updateTransaction(transaction: Transaction): Promise<Transaction> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const dbTransaction = {
            description: transaction.description,
            amount: transaction.amount,
            category: transaction.category,
            type: transaction.type,
            date: transaction.date
        };

        const { data, error } = await supabase
            .from('transactions')
            .update(dbTransaction)
            .eq('id', transaction.id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            console.error("Supabase Error updating transaction:", error);
            throw error;
        }

        return {
            id: data.id,
            date: data.date,
            description: data.description,
            amount: Number(data.amount),
            category: data.category,
            type: data.type
        };
    },

    async deleteTransaction(id: string): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            console.error("Supabase Error deleting transaction:", error);
            throw error;
        }
    }
};
