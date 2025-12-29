"use client";
import { useState } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createProjectInSupabase } from '@/lib/actions/projects';

interface CreateProjectModalProps {
    onClose: () => void;
    onCreated?: () => void;
    userData: any;
}

export function CreateProjectModal({ onClose, onCreated, userData }: CreateProjectModalProps) {
    const router = useRouter();
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsLoading(true);
        setError('');
        console.log('Attempting to create project in Supabase:', name);

        try {
            const project = await createProjectInSupabase(name);
            console.log('Project created successfully:', project.id);

            if (onCreated) onCreated();
            onClose();

            // Redirect to workspace
            router.push(`/workspace/${project.id}`);
        } catch (err: any) {
            console.error('Project creation error details:', err);
            setError(err.message || 'Failed to create project. Please ensure you have enough credits.');
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 font-sans">
            <div className="bg-[#0F1117] border border-white/10 rounded-xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="p-5 flex justify-between items-center bg-[#0F1117] border-b border-white/5">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <div className="h-6 w-6 bg-orange-600 rounded-md flex items-center justify-center text-white">
                            <Plus size={14} className="font-bold" />
                        </div>
                        Create New Project
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-5 pt-6 space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Project Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., My Awesome App"
                            className="w-full bg-[#16181D] border border-white/5 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-all font-medium"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="pb-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-900/20 text-sm active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus size={16} />
                                    Create Project
                                </>
                            )}
                        </button>
                        <p className="text-[10px] text-gray-500 text-center mt-3 uppercase tracking-[0.1em]">
                            Costs 100 HeftCredits
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
