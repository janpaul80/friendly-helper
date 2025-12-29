import { X, Grid, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface BackendUsageModalProps {
    onClose: () => void;
    onUpgrade: () => void;
}

export function BackendUsageModal({ onClose, onUpgrade }: BackendUsageModalProps) {
    const [isInfoOpen, setIsInfoOpen] = useState(true);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 font-sans text-black">
            <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Backend usage</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto">
                    {/* Usage Card */}
                    <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between mb-8 border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded border border-gray-200 shadow-sm">
                                <Grid size={20} className="text-gray-700" />
                            </div>
                            <span className="font-bold text-gray-800">0/1 Backend Project</span>
                        </div>
                        <button
                            onClick={onUpgrade}
                            className="bg-[#416935] hover:bg-[#34542a] text-white px-5 py-2 rounded-full text-sm font-bold transition-colors shadow-sm"
                        >
                            Upgrade
                        </button>
                    </div>

                    {/* Active Projects Table */}
                    <div className="mb-8">
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                                    <tr>
                                        <th className="p-4 font-normal">Project name</th>
                                        <th className="p-4 font-normal">Expired</th>
                                        <th className="p-4 font-normal flex items-center gap-1">
                                            Status <HelpCircle size={14} className="text-gray-400" />
                                        </th>
                                        <th className="p-4 font-normal">Service</th>
                                        <th className="p-4 font-normal">Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="p-4 text-gray-400 italic" colSpan={5}>• No project available</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Paused Projects Section */}
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900 text-lg">Paused projects</h3>
                            <HelpCircle size={16} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-sm mb-4">Backend services will be permanently deleted after deadline (including data).</p>

                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                                    <tr>
                                        <th className="p-4 font-normal">Project name</th>
                                        <th className="p-4 font-normal">Deadline</th>
                                        <th className="p-4 font-normal">Status</th>
                                        <th className="p-4 font-normal">Service</th>
                                        <th className="p-4 font-normal">Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="p-4 text-gray-400 italic" colSpan={5}>• No project available</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="border-t border-gray-100 pt-6 mt-6">
                        <button
                            onClick={() => setIsInfoOpen(!isInfoOpen)}
                            className="flex items-center justify-between w-full text-left mb-4 group"
                        >
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700">What's HeftCoder Backend?</h3>
                            {isInfoOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                        </button>

                        {isInfoOpen && (
                            <div className="text-gray-600 text-sm leading-relaxed space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <p>
                                    Make your websites come alive! Instead of just showing static pages, your visitors can now
                                    interact, vote, comment, and see real-time updates. It's like turning a poster into a living,
                                    breathing app.
                                </p>

                                <div>
                                    <h4 className="font-bold text-gray-900 mb-2">What it gives you:</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-2">
                                            <span className="text-gray-400">•</span>
                                            <span>
                                                <strong className="text-gray-900">Database</strong> - Remember votes, comments, scores - nothing gets lost when people refresh the page
                                                <div className="pl-4 text-xs text-gray-500 mt-1">• Examples: Store poll votes, save game scores, keep user comments</div>
                                            </span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-gray-400">•</span>
                                            <span>
                                                <strong className="text-gray-900">Edge Functions</strong> - Your site can automatically count votes, update rankings, send notifications
                                                <div className="pl-4 text-xs text-gray-500 mt-1">• Examples: Auto-calculate poll results, update leaderboards, trigger alerts</div>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
