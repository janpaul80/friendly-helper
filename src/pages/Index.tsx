import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  const handleCreateProject = () => {
    // Generate a temporary ID for new workspace
    const tempId = `temp-${Date.now()}`;
    navigate(`/workspace/${tempId}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-2xl">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img 
            src="/assets/hc-icon.png" 
            alt="HeftCoder" 
            className="w-16 h-16"
          />
          <h1 className="text-4xl font-bold text-foreground">HeftCoder</h1>
        </div>
        
        <p className="text-xl text-muted-foreground">
          AI-powered code generation workspace. Build full-stack applications with natural language.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Button 
            size="lg" 
            onClick={handleCreateProject}
            className="gap-2"
          >
            <Plus className="w-5 h-5" />
            New Project
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            className="gap-2"
          >
            <Sparkles className="w-5 h-5" />
            View Templates
          </Button>
        </div>
      </div>
    </div>
  );
}
