import { useState } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as workspaceApi from '../lib/workspaceApi';
import { supabase } from '../lib/supabase';

interface CreateProjectModalProps {
    onClose: () => void;
    onCreated: () => void;
}

export function CreateProjectModal({ onClose, onCreated }: CreateProjectModalProps) {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Step 1: Create workspace via production API
            const workspaceId = await workspaceApi.createWorkspace();

            // Step 2: Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('Not authenticated');
            }

            // Step 3: Store project in Supabase
            const { error: dbError } = await supabase
                .from('projects')
                .insert({
                    id: workspaceId,  // Use workspaceId as project ID
                    user_id: user.id,
                    name: name,
                    workspace_id: workspaceId,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                });

            if (dbError) {
                console.error('Failed to store project:', dbError);
                // Continue anyway - workspace was created successfully
            }

            // Step 4: Close modal and notify parent
            onClose();
            onCreated();

            // Step 5: Redirect to workspace page
            navigate(`/workspace/${workspaceId}`);
        } catch (err: any) {
            console.error('Project creation error:', err);
            setError(err.message || 'Failed to create project. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 font-sans">
            <div className="bg-[#0F1117] border border-gray-800 rounded-xl w-full max-w-md shadow-2xl relative overflow-hidden">
                {/* Header */}
                <div className="p-5 flex justify-between items-center bg-[#0F1117]">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <div className="h-6 w-6 bg-orange-500 rounded-md flex items-center justify-center text-black">
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
                <form onSubmit={handleSubmit} className="p-5 pt-2 space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-xs font-semibold text-gray-400">
                            Project Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., My Awesome App"
                            className="w-full bg-[#16181D] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-all font-medium"
                            required
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-900/20 text-sm"
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
                    </div>
                </form>
            </div>
        </div>
    );
}
