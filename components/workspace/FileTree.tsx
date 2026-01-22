"use client";

import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileCode, FileJson, FileText, File, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileItem {
    name: string;
    type: 'file' | 'folder';
    path: string;
    isOpen?: boolean;
    children?: FileItem[];
}

interface TreeItemProps {
    item: FileItem;
    depth?: number;
    selectedFile: string;
    onSelectFile: (path: string) => void;
}

const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'tsx':
        case 'jsx':
            return <FileCode className="w-3.5 h-3.5 text-cyan-400" />;
        case 'ts':
        case 'js':
            return <FileCode className="w-3.5 h-3.5 text-blue-400" />;
        case 'json':
            return <FileJson className="w-3.5 h-3.5 text-amber-400" />;
        case 'css':
        case 'scss':
            return <FileText className="w-3.5 h-3.5 text-pink-400" />;
        case 'html':
            return <FileText className="w-3.5 h-3.5 text-orange-400" />;
        default:
            return <File className="w-3.5 h-3.5 text-muted-foreground/50" />;
    }
};

function TreeItem({ item, depth = 0, selectedFile, onSelectFile }: TreeItemProps) {
    const [isOpen, setIsOpen] = useState(item.isOpen || false);
    const isFolder = item.type === 'folder';
    const isSelected = selectedFile === item.path;

    return (
        <div className="relative">
            {isSelected && (
                <div className="absolute inset-y-0 left-0 w-0.5 bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)] z-10" />
            )}
            <button
                onClick={() => {
                    if (isFolder) {
                        setIsOpen(!isOpen);
                    } else {
                        onSelectFile(item.path);
                    }
                }}
                className={cn(
                    "w-full flex items-center gap-2 px-3 py-1.5 text-left text-[11px] transition-all duration-200 rounded-lg group/item",
                    isSelected
                        ? "bg-primary/10 text-primary font-bold"
                        : "text-muted-foreground/70 hover:text-foreground hover:bg-muted/50"
                )}
                style={{ paddingLeft: `${depth * 12 + 12}px` }}
            >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {isFolder ? (
                        <div className="flex items-center gap-2">
                            <div className="shrink-0 w-3 h-3 flex items-center justify-center">
                                {isOpen ? (
                                    <ChevronDown className="w-3 h-3 text-muted-foreground/30 group-hover/item:text-muted-foreground transition-colors" />
                                ) : (
                                    <ChevronRight className="w-3 h-3 text-muted-foreground/30 group-hover/item:text-muted-foreground transition-colors" />
                                )}
                            </div>
                            {isOpen ? (
                                <FolderOpen className="w-4 h-4 text-primary/60" />
                            ) : (
                                <Folder className="w-4 h-4 text-primary/40" />
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="w-3" />
                            {getFileIcon(item.name)}
                        </div>
                    )}
                    <span className="truncate tracking-wide">{item.name}</span>
                </div>

                {isSelected && (
                    <Sparkles className="w-3 h-3 text-primary/50 animate-pulse ml-2 shrink-0" />
                )}
            </button>
            {isFolder && isOpen && item.children && (
                <div className="mt-0.5">
                    {item.children.map((child, i) => (
                        <TreeItem
                            key={child.path || i}
                            item={child}
                            depth={depth + 1}
                            selectedFile={selectedFile}
                            onSelectFile={onSelectFile}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function FileTree({
    files,
    selectedFile,
    onSelectFile
}: {
    files: any[],
    selectedFile: string,
    onSelectFile: (path: string) => void
}) {
    return (
        <div className="py-3 px-2 space-y-0.5">
            {files.map((item, i) => (
                <TreeItem
                    key={item.path || i}
                    item={item}
                    selectedFile={selectedFile}
                    onSelectFile={onSelectFile}
                />
            ))}
        </div>
    );
}
