
import { supabase } from './supabaseClient';
import { Project } from '../types';

export const projectService = {
    async fetchProjects(): Promise<Project[]> {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async createProject(name: string): Promise<Project> {
        const { data, error } = await supabase
            .from('projects')
            .insert([{ name }])
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
