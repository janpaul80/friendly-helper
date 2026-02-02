import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Components
import { UIRefactorUpload } from '../components/ui-refactor/UIRefactorUpload';
import { UIRefactorSettings } from '../components/ui-refactor/UIRefactorSettings';
import { UIRefactorResults } from '../components/ui-refactor/UIRefactorResults';

export type RefactorPreset = 'minimal-saas' | 'startup-ui' | 'brutalist' | 'dark-dashboard' | 'founder-friendly';
export type RefactorIntensity = 'low' | 'balanced' | 'high';

export interface RefactorSettings {
  preset: RefactorPreset;
  intensity: RefactorIntensity;
  preserveBrandColors: boolean;
  generatePreviews: boolean;
  generatePromptAndCode: boolean;
}

export interface RefactorResult {
  concepts: Array<{
    id: string;
    imageUrl: string;
    title: string;
  }>;
  designPrompt: string;
  implementation: {
    layout: string;
    tailwindTokens: string;
    componentOutline: string;
  };
}

const DEFAULT_SETTINGS: RefactorSettings = {
  preset: 'minimal-saas',
  intensity: 'balanced',
  preserveBrandColors: true,
  generatePreviews: true,
  generatePromptAndCode: true,
};

export default function UIRefactor() {
  const navigate = useNavigate();
  
  // Feature state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [settings, setSettings] = useState<RefactorSettings>(DEFAULT_SETTINGS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<RefactorResult | null>(null);


  const handleImageUpload = useCallback((imageDataUrl: string, fileName: string) => {
    setUploadedImage(imageDataUrl);
    setUploadedFileName(fileName);
    setResults(null);
  }, []);

  const handleRemoveImage = useCallback(() => {
    setUploadedImage(null);
    setUploadedFileName('');
    setResults(null);
  }, []);

  const handleSettingsChange = useCallback((newSettings: Partial<RefactorSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const estimateCreditUsage = (): number => {
    let base = 50;
    if (settings.generatePreviews) base += 100;
    if (settings.generatePromptAndCode) base += 25;
    if (settings.intensity === 'high') base += 50;
    return base;
  };

  const handleRunRefactor = async () => {
    if (!uploadedImage) {
      toast.error('Please upload a screenshot first');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setProcessingStatus('Analyzing UI structure...');

    try {
      // Progress stages for UI feedback
      const progressStages = [
        { progress: 15, status: 'Analyzing UI structure...' },
        { progress: 30, status: 'Identifying components...' },
        { progress: 45, status: 'Generating refactored concepts...' },
        { progress: 65, status: 'Creating design variants...' },
        { progress: 80, status: 'Generating implementation outline...' },
        { progress: 95, status: 'Finalizing results...' },
      ];

      // Use hardcoded URL as fallback (matches pattern in Dashboard.tsx)
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ythuhewbaulqirjrkgly.supabase.co';
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aHVoZXdiYXVscWlyanJrZ2x5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzOTkwMDgsImV4cCI6MjA4NDk3NTAwOH0.lbkprUMf_qkyzQOBqSOboipowjA0K8HZ2yaPglwe8MI';

      // Start progress animation
      let currentStage = 0;
      const progressInterval = setInterval(() => {
        if (currentStage < progressStages.length) {
          setProgress(progressStages[currentStage].progress);
          setProcessingStatus(progressStages[currentStage].status);
          currentStage++;
        }
      }, 2000);

      // Call the edge function
      const response = await fetch(`${supabaseUrl}/functions/v1/ui-refactor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          image: uploadedImage,
          settings,
        }),
      });

      clearInterval(progressInterval);

      // Check response content type to handle errors gracefully
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an invalid response. Please try again.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process UI refactor');
      }
      
      setProgress(100);
      setProcessingStatus('Complete');
      setResults(data.results);
      toast.success('UI Refactor complete');
    } catch (error) {
      console.error('Refactor error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process UI refactor');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setProgress(0);
    setProcessingStatus('');
  };


  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-500/30">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-[120px]" />
      </div>
      
      {/* Grid Background */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(rgba(251,146,60,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(251,146,60,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-orange-500/10 bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-sm font-medium">Dashboard</span>
              </button>
              <div className="h-6 w-px bg-orange-500/20" />
              <div>
                <h1 className="text-lg font-black text-white tracking-tight">UI Refactor</h1>
                <p className="text-xs text-gray-500 font-medium">Analyze and refactor UI designs using HeftCoder's AI agents</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
              <span className="px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded text-orange-400 font-mono">
                Beta
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8">
        {results ? (
          <UIRefactorResults
            results={results}
            onReset={handleReset}
            uploadedImage={uploadedImage}
          />
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Panel - Upload */}
            <div className="lg:col-span-2">
              <UIRefactorUpload
                uploadedImage={uploadedImage}
                uploadedFileName={uploadedFileName}
                onImageUpload={handleImageUpload}
                onRemoveImage={handleRemoveImage}
                isProcessing={isProcessing}
              />
            </div>

            {/* Right Panel - Settings */}
            <div className="lg:col-span-1">
              <UIRefactorSettings
                settings={settings}
                onSettingsChange={handleSettingsChange}
                onRunRefactor={handleRunRefactor}
                isProcessing={isProcessing}
                processingStatus={processingStatus}
                progress={progress}
                creditEstimate={estimateCreditUsage()}
                hasImage={!!uploadedImage}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
