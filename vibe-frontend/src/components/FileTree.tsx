import { Folder, FileText } from 'lucide-react';

export function FileTree({ files, onFileClick }: { files: any[], onFileClick: (path: string) => void }) {
    return (
        <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-2 mb-3 text-gray-400">
                <Folder size={16} />
                <span className="font-medium text-xs tracking-wider">PROJECT FILES</span>
            </div>
            <div className="space-y-1">
                {files.map((file, index) => (
                    <div
                        key={index}
                        onClick={() => onFileClick(file.path)}
                        className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded cursor-pointer transition-colors"
                    >
                        <FileText size={14} className="flex-shrink-0" />
                        <span className="truncate">{file.name || file.path}</span>
                    </div>
                ))}
                {files.length === 0 && (
                    <div className="text-xs text-gray-600 italic px-2">No files yet</div>
                )}
            </div>
        </div>
    );
}
