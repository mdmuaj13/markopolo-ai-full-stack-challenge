'use client';
import { Button } from '@/components/ui/button';
import { X, Mail, MessageSquare, Send } from 'lucide-react';

interface CampaignData {
  channel: 'Email' | 'SMS' | 'WhatsApp';
  time: string;
  message: string;
  audience: string[];
}

interface SidePanelProps {
  isOpen: boolean;
  onToggle: () => void;
  campaignData?: CampaignData;
}

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onToggle, campaignData }) => {
  const handleActivateCampaign = () => {
    if (campaignData) {
      console.log(`Activating ${campaignData.channel} campaign...`);
      // Campaign activation logic here
    }
  };

  const getChannelIcon = () => {
    if (!campaignData) return null;

    switch (campaignData.channel) {
      case 'Email':
        return <Mail className="w-5 h-5" />;
      case 'SMS':
        return <MessageSquare className="w-5 h-5" />;
      case 'WhatsApp':
        return <Send className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getChannelColor = () => {
    if (!campaignData) return 'bg-primary';

    switch (campaignData.channel) {
      case 'Email':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'SMS':
        return 'bg-purple-600 hover:bg-purple-700';
      case 'WhatsApp':
        return 'bg-green-600 hover:bg-green-700';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className={`absolute right-0 top-0 bottom-0 w-96 bg-background border-l border-border flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="text-lg font-semibold">Campaign Review</h2>
        <Button onClick={onToggle} variant="ghost" size="sm">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {campaignData ? (
          <div className="space-y-6">
            {/* Channel Header */}
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              {getChannelIcon()}
              <div>
                <h3 className="font-semibold text-lg">{campaignData.channel} Campaign</h3>
                <p className="text-sm text-muted-foreground">Review and activate</p>
              </div>
            </div>

            {/* Campaign Details */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-muted-foreground">Scheduled Time</label>
                <p className="mt-1 text-foreground">{campaignData.time}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground">Message</label>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  <p className="text-sm text-foreground whitespace-pre-wrap">{campaignData.message}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground">Audience</label>
                <p className="mt-1 text-foreground">
                  {campaignData.audience?.length || 0} recipient{(campaignData.audience?.length || 0) > 1 ? 's' : ''}
                </p>
                {campaignData.audience && campaignData.audience.length > 0 && (
                  <div className="mt-2 max-h-40 overflow-y-auto">
                    <div className="space-y-1">
                      {campaignData.audience.map((recipient: any, idx: number) => (
                        <div key={idx} className="text-sm p-2 bg-muted/50 rounded">
                          {typeof recipient === 'string' ? recipient : `${recipient.name} (${recipient.email})`}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleActivateCampaign}
              className={`w-full text-white ${getChannelColor()}`}
            >
              <Send className="w-4 h-4 mr-2" />
              Activate {campaignData.channel} Campaign
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No campaign selected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidePanel;