"use client";

import { useEffect, useState } from 'react';

interface ThinkingIndicatorProps {
    visible: boolean;
    action?: 'thinking' | 'writing' | 'building';
}

export function ThinkingIndicator({ visible, action = 'thinking' }: ThinkingIndicatorProps) {
    const [dots, setDots] = useState('');

    useEffect(() => {
        if (visible) {
            const interval = setInterval(() => {
                setDots(prev => prev.length >= 3 ? '' : prev + '.');
            }, 500);
            return () => clearInterval(interval);
        }
    }, [visible]);

    if (!visible) return null;

    const getIcon = () => {
        switch (action) {
            case 'writing':
                return (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );
            case 'building':
                return (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <path d="M14.5 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7.5L14.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );
            default:
                return (
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                );
        }
    };

    const getText = () => {
        switch (action) {
            case 'writing':
                return `Writing${dots}`;
            case 'building':
                return `Building${dots}`;
            default:
                return `thinking${dots}`;
        }
    };

    return (
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <div className="text-gray-400">
                {getIcon()}
            </div>
            <span className="text-sm text-gray-400 font-medium">
                {getText()}
            </span>
        </div>
    );
}

/**
 * Compact version for inline use
 */
export function ThinkingDots() {
    return (
        <div className="flex items-center gap-1 px-2 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            <span className="text-xs text-gray-500 ml-1">thinking</span>
        </div>
    );
}
