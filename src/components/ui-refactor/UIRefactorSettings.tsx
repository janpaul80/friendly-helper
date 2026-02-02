import { Settings, Zap, Loader2, Check } from 'lucide-react';
import type { RefactorSettings, RefactorPreset, RefactorIntensity } from '../../pages/UIRefactor';

interface UIRefactorSettingsProps {
  settings: RefactorSettings;
  onSettingsChange: (settings: Partial<RefactorSettings>) => void;
  onRunRefactor: () => void;
  isProcessing: boolean;
  processingStatus: string;
  progress: number;
  creditEstimate: number;
  hasImage: boolean;
}

const PRESETS: Array<{ id: RefactorPreset; label: string; description: string }> = [
  { id: 'minimal-saas', label: 'Minimal SaaS', description: 'Clean, Linear-style design' },
  { id: 'startup-ui', label: 'Startup / Sharp', description: 'Bold, modern aesthetic' },
  { id: 'brutalist', label: 'Brutalist', description: 'Raw, high-contrast edges' },
  { id: 'dark-dashboard', label: 'Dark Dashboard', description: 'Rich, data-focused UI' },
  { id: 'founder-friendly', label: 'Founder Friendly', description: 'Conversion-focused' },
];

const INTENSITIES: Array<{ id: RefactorIntensity; label: string; description: string }> = [
  { id: 'low', label: 'Polish', description: 'Refine details' },
  { id: 'balanced', label: 'Modernize', description: 'Reimagine layout' },
  { id: 'high', label: 'Transform', description: 'Bold redesign' },
];

export function UIRefactorSettings({
  settings,
  onSettingsChange,
  onRunRefactor,
  isProcessing,
  processingStatus,
  progress,
  creditEstimate,
  hasImage,
}: UIRefactorSettingsProps) {
  return (
    <div className="bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-orange-500/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-orange-500/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Settings size={16} className="text-orange-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Refactor Settings</h3>
            <p className="text-xs text-gray-500">Configure your refactor preferences</p>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="p-6 space-y-6">
        {/* Preset Selection */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Design Style
          </label>
          <div className="space-y-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onSettingsChange({ preset: preset.id })}
                disabled={isProcessing}
                className={`
                  w-full px-4 py-3 rounded-xl text-left transition-all
                  ${settings.preset === preset.id
                    ? 'bg-orange-500/20 border border-orange-500/50 ring-1 ring-orange-500/30'
                    : 'bg-black/30 border border-white/5 hover:border-orange-500/30 hover:bg-orange-500/5'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <span className={`text-sm font-bold ${settings.preset === preset.id ? 'text-orange-400' : 'text-white'}`}>
                  {preset.label}
                </span>
                <p className="text-[10px] text-gray-500 mt-0.5">{preset.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Intensity Selection */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Refactor Intensity
          </label>
          <div className="grid grid-cols-3 gap-2">
            {INTENSITIES.map((intensity) => (
              <button
                key={intensity.id}
                onClick={() => onSettingsChange({ intensity: intensity.id })}
                disabled={isProcessing}
                className={`
                  px-3 py-3 rounded-xl text-center transition-all
                  ${settings.intensity === intensity.id
                    ? 'bg-orange-500/20 border border-orange-500/50 ring-1 ring-orange-500/30'
                    : 'bg-black/30 border border-white/5 hover:border-orange-500/30 hover:bg-orange-500/5'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <span className={`text-xs font-bold ${settings.intensity === intensity.id ? 'text-orange-400' : 'text-white'}`}>
                  {intensity.label}
                </span>
                <p className="text-[9px] text-gray-500 mt-0.5">{intensity.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Toggle Options */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
            Options
          </label>
          
          <ToggleOption
            label="Preserve brand colors"
            description="Keep detected brand colors in output"
            checked={settings.preserveBrandColors}
            onChange={(checked) => onSettingsChange({ preserveBrandColors: checked })}
            disabled={isProcessing}
          />
          
          <ToggleOption
            label="Generate UI previews"
            description="Create visual mockups of refactored concepts"
            checked={settings.generatePreviews}
            onChange={(checked) => onSettingsChange({ generatePreviews: checked })}
            disabled={isProcessing}
          />
          
          <ToggleOption
            label="Generate prompt & code"
            description="Include design prompt and implementation outline"
            checked={settings.generatePromptAndCode}
            onChange={(checked) => onSettingsChange({ generatePromptAndCode: checked })}
            disabled={isProcessing}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-orange-500/10" />

        {/* Credit Estimate */}
        <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-orange-500/10">
          <span className="text-xs text-gray-400">Estimated credit usage</span>
          <span className="text-sm font-bold text-orange-400">{creditEstimate} credits</span>
        </div>

        {/* Progress Bar (when processing) */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{processingStatus}</span>
              <span className="text-xs font-mono text-orange-400">{progress}%</span>
            </div>
            <div className="h-1.5 bg-black/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-600 to-orange-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onRunRefactor}
          disabled={isProcessing || !hasImage}
          className={`
            w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest
            flex items-center justify-center gap-3 transition-all
            ${isProcessing || !hasImage
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white shadow-lg shadow-orange-900/30'
            }
          `}
        >
          {isProcessing ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Zap size={18} />
              <span>Run UI Refactor</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

interface ToggleOptionProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled: boolean;
}

function ToggleOption({ label, description, checked, onChange, disabled }: ToggleOptionProps) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`
        w-full flex items-start gap-3 p-3 rounded-lg transition-all text-left
        ${checked ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-black/20 border border-transparent'}
        hover:bg-orange-500/10 disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      <div className={`
        w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-all
        ${checked ? 'bg-orange-500' : 'bg-gray-700 border border-gray-600'}
      `}>
        {checked && <Check size={12} className="text-white" />}
      </div>
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </button>
  );
}
