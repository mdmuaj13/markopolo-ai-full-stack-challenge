import { Button } from '@/components/ui/button';
import { Send, User, Bot } from 'lucide-react';
import { ActionableData, Message as MessageType } from '@/hooks/useChat';

interface ChatMessageProps {
  message: MessageType;
  onLaunchCampaign?: (messageId: string, actionableData: ActionableData) => void;
  isLaunching?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  onLaunchCampaign,
  isLaunching = false
}) => {
  const handleLaunchCampaign = () => {
    if (message.actionableData && onLaunchCampaign) {
      onLaunchCampaign(message.id, message.actionableData);
    }
  };

  return (
    <div
      className={`flex gap-4 ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {message.role === 'assistant' && (
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-primary-foreground" />
        </div>
      )}

      <div
        className={`max-w-[70%] rounded-lg px-4 py-3 ${
          message.role === 'user'
            ? 'bg-primary text-primary-foreground ml-12'
            : 'bg-muted text-foreground'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>

        {/* Launch Campaign Button */}
        {message.role === 'assistant' &&
         message.actionableData &&
         !message.isStreaming &&
         message.content.includes('🚀 **Launch') && (
          <div className="mt-3">
            <Button
              onClick={handleLaunchCampaign}
              disabled={isLaunching}
              size="sm"
              className="bg-green-600 hover:bg-green-600 text-white"
            >
              {isLaunching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Launching...
                </>
              ) : (
                `🚀 Launch ${message.actionableData.channel} Campaign`
              )}
            </Button>
          </div>
        )}

        <div className="text-xs mt-2 opacity-70">
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>

      {message.role === 'user' && (
        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;