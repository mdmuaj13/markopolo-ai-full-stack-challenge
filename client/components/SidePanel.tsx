'use client';
import { Button } from '@/components/ui/button';
import { X, Mail, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';

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
  const [isActivating, setIsActivating] = useState(false);
  const [activationStatus, setActivationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleActivateCampaign = async () => {
    if (!campaignData) return;

    setIsActivating(true);
    setActivationStatus('idle');
    setErrorMessage('');

    try {
      const endpoint = getApiEndpoint(campaignData.channel);
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          time: campaignData.time,
          message: campaignData.message,
          channel: campaignData.channel.toLowerCase(),
          audience: campaignData.audience,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to activate campaign');
      }

      const result = await response.json();
      console.log(`${campaignData.channel} campaign activated:`, result);
      setActivationStatus('success');

      // Close panel after 3 seconds
      setTimeout(() => {
        onToggle();
        setActivationStatus('idle');
      }, 3000);
    } catch (error) {
      console.error(`Error activating ${campaignData.channel} campaign:`, error);
      setActivationStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsActivating(false);
    }
  };

  const getApiEndpoint = (channel: string) => {
    switch (channel) {
      case 'Email':
        return '/email/campaign/create';
      case 'SMS':
        return '/sms/campaign/create';
      case 'WhatsApp':
        return '/whatsapp/campaign/create';
      default:
        return '/email/campaign/create';
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

            {/* Status Messages */}
            {activationStatus === 'success' && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-md flex items-start gap-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                    Campaign Activated Successfully!
                  </p>
                  <p className="text-xs text-green-600/80 dark:text-green-400/80 mt-1">
                    Your {campaignData.channel.toLowerCase()} campaign has been scheduled and will be sent at the specified time.
                  </p>
                </div>
              </div>
            )}

            {activationStatus === 'error' && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-md flex items-start gap-3">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                    Activation Failed
                  </p>
                  <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">
                    {errorMessage}
                  </p>
                </div>
              </div>
            )}

            {/* Action Button */}
            <Button
              onClick={handleActivateCampaign}
              disabled={isActivating}
              className={`w-full text-white ${getChannelColor()}`}
            >
              {isActivating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Activating...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Activate {campaignData.channel} Campaign
                </>
              )}
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