'use client';
import { Button } from '@/components/ui/button';
import { X, Download, RefreshCw } from 'lucide-react';

interface SidePanelProps {
  isOpen: boolean;
  onToggle: () => void;
  data?: Array<Record<string, unknown>>;
}

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onToggle, data = [] }) => {
  const handleExport = () => {
    // Export logic here
    console.log('Exporting data...');
  };

  const handleRefresh = () => {
    // Refresh logic here
    console.log('Refreshing data...');
  };

  return (
    <div className={`absolute right-0 top-0 bottom-0 w-96 bg-background border-l border-border flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="text-lg font-semibold">Data Results</h2>
        <Button onClick={onToggle} variant="ghost" size="sm">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 border-b border-border flex gap-2">
        <Button onClick={handleRefresh} variant="outline" size="sm" className="flex-1">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
        <Button onClick={handleExport} variant="outline" size="sm" className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {data.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  {Object.keys(data[0]).map((key) => (
                    <th key={key} className="px-3 py-2 text-left font-medium">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className="border-t hover:bg-muted/50">
                    {Object.values(row).map((value, cellIdx) => (
                      <td key={cellIdx} className="px-3 py-2">
                        {String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidePanel;