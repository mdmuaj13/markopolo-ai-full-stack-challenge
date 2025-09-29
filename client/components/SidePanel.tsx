'use client';
import { Button } from '@/components/ui/button';
import { PanelRight, X } from 'lucide-react';

interface SidePanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onToggle }) => {
  return (
    <div className={`absolute right-0 top-0 bottom-0 w-80 bg-background border-l border-border flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="text-lg font-semibold">Additional Options</h2>
        <Button onClick={onToggle} variant="ghost" size="sm">
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <div className="p-4 border rounded-md">
            <h3 className="font-medium mb-2">Campaign Analytics</h3>
            <p className="text-sm text-muted-foreground">Track the performance of your campaigns</p>
          </div>
          <div className="p-4 border rounded-md">
            <h3 className="font-medium mb-2">Audience Segments</h3>
            <p className="text-sm text-muted-foreground">Manage your audience lists</p>
          </div>
          <div className="p-4 border rounded-md">
            <h3 className="font-medium mb-2">Recent Activity</h3>
            <p className="text-sm text-muted-foreground">View recent campaign launches</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;