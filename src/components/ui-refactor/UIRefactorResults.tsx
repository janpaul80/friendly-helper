import { useState } from 'react';
import { ArrowLeft, Download, Copy, Check, FileText, Code, Layout, Palette, Layers, Sparkles, ExternalLink } from 'lucide-react';
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
  const [selectedConcept, setSelectedConcept] = useState<number>(0);

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
    { id: 'concepts', label: 'Generated Concepts', icon: <Sparkles size={14} /> },
    { id: 'prompt', label: 'Design Brief', icon: <FileText size={14} /> },
    { id: 'implementation', label: 'Implementation', icon: <Code size={14} /> },
  ];

  const implTabs: Array<{ id: ImplTab; label: string; icon: React.ReactNode }> = [
    { id: 'layout', label: 'Layout Structure', icon: <Layout size={14} /> },
    { id: 'tailwind', label: 'Tailwind Tokens', icon: <Palette size={14} /> },
    { id: 'components', label: 'Component Tree', icon: <Layers size={14} /> },
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

  const currentConcept = results.concepts[selectedConcept];

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
      <div className="flex gap-1 p-1 bg-black/40 rounded-xl border border-orange-500/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all
              ${activeTab === tab.id
                ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-900/30'
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
      <div className="bg-gradient-to-br from-[#08080c] to-[#0c0c14] border border-orange-500/10 rounded-2xl overflow-hidden">
        {/* UI Concepts Tab - Premium Gallery Layout */}
        {activeTab === 'concepts' && (
          <div className="p-6 space-y-6">
            {/* Main Featured Concept Display */}
            {currentConcept && (
              <div className="relative group">
                {/* Premium Frame */}
                <div className="relative rounded-2xl overflow-hidden border border-orange-500/20 bg-gradient-to-br from-[#0a0a10] to-[#0e0e16] shadow-2xl shadow-black/50">
                  {/* Window Chrome Bar */}
                  <div className="flex items-center justify-between px-4 py-3 bg-[#0c0c14] border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      </div>
                      <div className="ml-4 px-3 py-1 bg-black/30 rounded-md">
                        <span className="text-xs text-gray-500 font-mono">concept-{selectedConcept + 1}.preview</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 rounded text-[10px] font-bold uppercase tracking-wider text-orange-400">
                        Concept {selectedConcept + 1}
                      </span>
                      <button
                        onClick={() => handleDownload(currentConcept.imageUrl, `ui-concept-${selectedConcept + 1}.png`)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-lg text-xs font-medium text-orange-400 hover:text-orange-300 transition-all"
                      >
                        <Download size={12} />
                        Export
                      </button>
                    </div>
                  </div>
                  
                  {/* Main Image Area */}
                  <div className="relative aspect-video bg-[#050508]">
                    <img
                      src={currentConcept.imageUrl}
                      alt={currentConcept.title}
                      className="w-full h-full object-contain"
                    />
                    {/* Subtle vignette overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
                  </div>
                  
                  {/* Concept Info Bar */}
                  <div className="px-5 py-4 bg-gradient-to-r from-[#0a0a12] to-[#0c0c16] border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white">{currentConcept.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">AI-generated UI concept • Click thumbnails to switch</p>
                      </div>
                      <a
                        href={currentConcept.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-orange-400 transition-colors"
                      >
                        <ExternalLink size={12} />
                        Full Size
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Thumbnail Selector + Original Reference */}
            <div className="grid grid-cols-4 gap-3">
              {/* Original Image - Smaller Reference */}
              {uploadedImage && (
                <div 
                  className="relative rounded-xl overflow-hidden border-2 border-dashed border-gray-700 bg-black/30 group cursor-default"
                >
                  <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-black/80 backdrop-blur-sm rounded text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Original
                  </div>
                  <div className="aspect-video">
                    <img
                      src={uploadedImage}
                      alt="Original"
                      className="w-full h-full object-cover opacity-60"
                    />
                  </div>
                </div>
              )}
              
              {/* Concept Thumbnails */}
              {results.concepts.map((concept, index) => (
                <button
                  key={concept.id}
                  onClick={() => setSelectedConcept(index)}
                  className={`
                    relative rounded-xl overflow-hidden transition-all duration-200
                    ${selectedConcept === index
                      ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-black scale-[1.02]'
                      : 'border border-white/10 hover:border-orange-500/30 opacity-70 hover:opacity-100'
                    }
                  `}
                >
                  <div className="absolute top-2 left-2 z-10 w-5 h-5 flex items-center justify-center bg-orange-500 rounded text-[10px] font-bold text-white">
                    {index + 1}
                  </div>
                  <div className="aspect-video bg-[#0a0a10]">
                    <img
                      src={concept.imageUrl}
                      alt={concept.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                    <p className="text-[10px] font-medium text-white truncate">{concept.title}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Empty State */}
            {results.concepts.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[400px] rounded-xl border border-dashed border-orange-500/20 bg-black/30">
                <Sparkles className="w-10 h-10 text-orange-500/30 mb-3" />
                <p className="text-gray-500 text-sm">No concepts generated</p>
              </div>
            )}
          </div>
        )}

        {/* Design Brief Tab */}
        {activeTab === 'prompt' && (
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Design Brief</h3>
                  <p className="text-xs text-gray-500 mt-1">Optimized for AI design tools and team handoff</p>
                </div>
                <button
                  onClick={() => handleCopy(results.designPrompt, 'prompt')}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-lg text-sm font-medium text-orange-400 hover:text-orange-300 transition-all"
                >
                  {copiedField === 'prompt' ? <Check size={14} /> : <Copy size={14} />}
                  {copiedField === 'prompt' ? 'Copied!' : 'Copy Brief'}
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
            {/* Sub-tabs */}
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

            {/* Content */}
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
