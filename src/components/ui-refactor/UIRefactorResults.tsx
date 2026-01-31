import { useState } from 'react';
import { ArrowLeft, Download, Copy, Check, Image as ImageIcon, FileText, Code, Layout, Palette, Layers } from 'lucide-react';
import type { RefactorResult } from '../../pages/UIRefactor';
import { toast } from 'sonner';

interface UIRefactorResultsProps {
  results: RefactorResult;
  onReset: () => void;
  uploadedImage: string | null;
}

type ResultTab = 'concepts' | 'prompt' | 'implementation';
type ImplTab = 'layout' | 'tailwind' | 'components';

export function UIRefactorResults({ results, onReset, uploadedImage }: UIRefactorResultsProps) {
  const [activeTab, setActiveTab] = useState<ResultTab>('concepts');
  const [implTab, setImplTab] = useState<ImplTab>('layout');
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

  const implTabs: Array<{ id: ImplTab; label: string; icon: React.ReactNode }> = [
    { id: 'layout', label: 'Layout Structure', icon: <Layout size={14} /> },
    { id: 'tailwind', label: 'Tailwind Tokens', icon: <Palette size={14} /> },
    { id: 'components', label: 'Component Outline', icon: <Layers size={14} /> },
  ];

  const getImplContent = () => {
    switch (implTab) {
      case 'layout':
        return results.implementation.layout;
      case 'tailwind':
        return results.implementation.tailwindTokens;
      case 'components':
        return results.implementation.componentOutline;
      default:
        return '';
    }
  };

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

      {/* Main Tab Navigation */}
      <div className="flex gap-2 p-1 bg-black/30 rounded-xl border border-orange-500/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all
              ${activeTab === tab.id
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/30'
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
        {/* UI Concepts Tab */}
        {activeTab === 'concepts' && (
          <div className="p-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Original Image - Full height on left */}
              {uploadedImage && (
                <div className="relative group rounded-xl overflow-hidden border border-orange-500/20 bg-black">
                  <div className="absolute top-3 left-3 z-10 px-3 py-1.5 bg-black/80 backdrop-blur-sm rounded-lg text-xs font-bold uppercase tracking-wider text-orange-400 border border-orange-500/30">
                    Original
                  </div>
                  <img
                    src={uploadedImage}
                    alt="Original"
                    className="w-full h-full min-h-[300px] object-contain bg-black/50"
                  />
                </div>
              )}
              
              {/* Generated Concepts - Stacked on right */}
              <div className="space-y-4">
                {results.concepts.length > 0 ? (
                  results.concepts.map((concept, index) => (
                    <div
                      key={concept.id}
                      className="relative group rounded-xl overflow-hidden border border-orange-500/20 bg-black"
                    >
                      <div className="absolute top-3 left-3 z-10 px-3 py-1.5 bg-orange-500 rounded-lg text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                        Concept {index + 1}
                      </div>
                      <button
                        onClick={() => handleDownload(concept.imageUrl, `ui-refactor-concept-${index + 1}.png`)}
                        className="absolute top-3 right-3 z-10 flex items-center gap-2 px-3 py-1.5 bg-black/80 backdrop-blur-sm hover:bg-orange-500/20 border border-orange-500/30 rounded-lg text-xs font-medium text-orange-400 hover:text-orange-300 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Download size={12} />
                        Download
                      </button>
                      <img
                        src={concept.imageUrl}
                        alt={concept.title}
                        className="w-full h-auto min-h-[200px] object-contain bg-black/50"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                        <p className="text-sm font-bold text-white">{concept.title}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-[300px] rounded-xl border border-dashed border-orange-500/20 bg-black/30">
                    <p className="text-gray-500 text-sm">No concepts generated</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Design Prompt Tab */}
        {activeTab === 'prompt' && (
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Design Prompt</h3>
                  <p className="text-xs text-gray-500 mt-1">Optimized for reuse with AI design tools</p>
                </div>
                <button
                  onClick={() => handleCopy(results.designPrompt, 'prompt')}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-lg text-sm font-medium text-orange-400 hover:text-orange-300 transition-all"
                >
                  {copiedField === 'prompt' ? <Check size={14} /> : <Copy size={14} />}
                  {copiedField === 'prompt' ? 'Copied!' : 'Copy Prompt'}
                </button>
              </div>
              <div className="p-6 bg-black/50 rounded-xl border border-orange-500/10 font-mono text-sm text-gray-300 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
                {results.designPrompt}
              </div>
            </div>
          </div>
        )}

        {/* Implementation Tab */}
        {activeTab === 'implementation' && (
          <div className="p-6 space-y-4">
            {/* Implementation Sub-tabs */}
            <div className="flex gap-2 p-1 bg-black/50 rounded-lg border border-orange-500/10">
              {implTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setImplTab(tab.id)}
                  className={`
                    flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all
                    ${implTab === tab.id
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                    }
                  `}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Implementation Content */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">
                  {implTabs.find(t => t.id === implTab)?.label}
                </h3>
                <button
                  onClick={() => handleCopy(getImplContent(), implTab)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-lg text-sm font-medium text-orange-400 hover:text-orange-300 transition-all"
                >
                  {copiedField === implTab ? <Check size={14} /> : <Copy size={14} />}
                  {copiedField === implTab ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="p-6 bg-black/50 rounded-xl border border-orange-500/10 font-mono text-xs text-gray-300 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
                {getImplContent()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
