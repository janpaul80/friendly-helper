import { useState } from 'react';
import { ArrowLeft, Download, Copy, Check, Image as ImageIcon, FileText, Code } from 'lucide-react';
import type { RefactorResult } from '../../pages/UIRefactor';
import { toast } from 'sonner';

interface UIRefactorResultsProps {
  results: RefactorResult;
  onReset: () => void;
  uploadedImage: string | null;
}

type ResultTab = 'concepts' | 'prompt' | 'implementation';

export function UIRefactorResults({ results, onReset, uploadedImage }: UIRefactorResultsProps) {
  const [activeTab, setActiveTab] = useState<ResultTab>('concepts');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownload = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download started');
  };

  const tabs: Array<{ id: ResultTab; label: string; icon: React.ReactNode }> = [
    { id: 'concepts', label: 'UI Concepts', icon: <ImageIcon size={14} /> },
    { id: 'prompt', label: 'Design Prompt', icon: <FileText size={14} /> },
    { id: 'implementation', label: 'Implementation', icon: <Code size={14} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onReset}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium">New Refactor</span>
          </button>
          <div className="h-6 w-px bg-orange-500/20" />
          <h2 className="text-lg font-bold text-white">Refactor Results</h2>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-black/30 rounded-xl border border-orange-500/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
              ${activeTab === tab.id
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }
            `}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-orange-500/10 rounded-2xl overflow-hidden">
        {activeTab === 'concepts' && (
          <div className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Original Image */}
              {uploadedImage && (
                <div className="relative group rounded-xl overflow-hidden border border-orange-500/20 bg-black/50">
                  <div className="absolute top-3 left-3 z-10 px-2 py-1 bg-black/70 rounded text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Original
                  </div>
                  <img
                    src={uploadedImage}
                    alt="Original"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              
              {/* Generated Concepts */}
              {results.concepts.map((concept, index) => (
                <div
                  key={concept.id}
                  className="relative group rounded-xl overflow-hidden border border-orange-500/20 bg-black/50"
                >
                  <div className="absolute top-3 left-3 z-10 px-2 py-1 bg-orange-500/80 rounded text-[10px] font-bold uppercase tracking-wider text-white">
                    Concept {index + 1}
                  </div>
                  <img
                    src={concept.imageUrl}
                    alt={concept.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-sm font-medium text-white mb-2">{concept.title}</p>
                      <button
                        onClick={() => handleDownload(concept.imageUrl, `concept-${index + 1}.png`)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 rounded-lg text-xs font-medium text-orange-400 transition-colors"
                      >
                        <Download size={12} />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'prompt' && (
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Design Prompt</h3>
                <button
                  onClick={() => handleCopy(results.designPrompt, 'prompt')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 rounded-lg text-xs font-medium text-orange-400 transition-colors"
                >
                  {copiedField === 'prompt' ? <Check size={12} /> : <Copy size={12} />}
                  {copiedField === 'prompt' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="p-4 bg-black/50 rounded-xl border border-orange-500/10 font-mono text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                {results.designPrompt}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'implementation' && (
          <div className="p-6 space-y-6">
            {/* Layout Structure */}
            <CodeSection
              title="Layout Structure"
              code={results.implementation.layout}
              field="layout"
              copiedField={copiedField}
              onCopy={handleCopy}
            />

            {/* Tailwind Tokens */}
            <CodeSection
              title="Tailwind Tokens"
              code={results.implementation.tailwindTokens}
              field="tailwind"
              copiedField={copiedField}
              onCopy={handleCopy}
            />

            {/* Component Outline */}
            <CodeSection
              title="React Component Outline"
              code={results.implementation.componentOutline}
              field="component"
              copiedField={copiedField}
              onCopy={handleCopy}
            />
          </div>
        )}
      </div>
    </div>
  );
}

interface CodeSectionProps {
  title: string;
  code: string;
  field: string;
  copiedField: string | null;
  onCopy: (text: string, field: string) => void;
}

function CodeSection({ title, code, field, copiedField, onCopy }: CodeSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">{title}</h3>
        <button
          onClick={() => onCopy(code, field)}
          className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 rounded-lg text-xs font-medium text-orange-400 transition-colors"
        >
          {copiedField === field ? <Check size={12} /> : <Copy size={12} />}
          {copiedField === field ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="p-4 bg-black/50 rounded-xl border border-orange-500/10 font-mono text-xs text-gray-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
        {code}
      </div>
    </div>
  );
}
