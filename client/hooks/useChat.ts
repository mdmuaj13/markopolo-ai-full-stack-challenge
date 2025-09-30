import { useState, useRef, useEffect } from 'react';

interface Audience {
  email: string;
  name: string;
}

export interface ActionableData {
  time: string;
  message: string;
  channel: string;
  audience: Audience[];
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isStreaming?: boolean;
  progress?: number;
  actionableData?: ActionableData;
  hasActionableCampaign?: boolean;
}

interface ChatData {
  message: string;
  data_source: Array<{
    name: string;
    data: {
      timestamp: string;
      user_input: string;
    };
  }>;
  channel: string[];
}

interface UseChatOptions {
  initialMessages?: Message[];
  apiUrl?: string;
  initialPayload?: any;
}

export const useChat = (initialQuery?: string, { initialMessages = [], apiUrl = 'http://localhost:8000/stream/chat', initialPayload }: UseChatOptions = {}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [launchingCampaigns, setLaunchingCampaigns] = useState<Set<string>>(new Set());
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initialQueryProcessedRef = useRef(false);

  // Process initial query from search page
  useEffect(() => {
    if (initialQuery && !initialQueryProcessedRef.current) {
      initialQueryProcessedRef.current = true;
      sendMessage(initialQuery, initialPayload);
    }
  }, [initialQuery]);

  const handleLaunchCampaign = async (messageId: string, actionableData: ActionableData) => {
    setLaunchingCampaigns(prev => new Set([...prev, messageId]));

    try {
      // Simulate campaign launch API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update the message to show campaign launched
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            ? {
                ...msg,
                content: msg.content.replace(
                  /🚀 \*\*Launch .+ campaign\?\*\*[\s\S]*$/,
                  `✅ **${actionableData.channel} campaign launched successfully!**\n📧 Sent to ${actionableData.audience.length} recipient${actionableData.audience.length > 1 ? 's' : ''}\n📅 ${new Date().toLocaleString()}`
                )
              }
            : msg
        )
      );
    } catch (error) {
      console.error('Failed to launch campaign:', error);

      // Update message to show error
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            ? {
                ...msg,
                content: msg.content.replace(
                  /🚀 \*\*Launch .+ campaign\?\*\*[\s\S]*$/,
                  `❌ **Failed to launch ${actionableData.channel} campaign**\nPlease try again later.`
                )
              }
            : msg
        )
      );
    } finally {
      setLaunchingCampaigns(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }
  };

  const sendMessage = async (userInput: string, payload?: any) => {
    if (!userInput.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: userInput.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Create assistant message placeholder
    const assistantMessageId = (Date.now() + 1).toString();
    const initialAssistantMessage: Message = {
      id: assistantMessageId,
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isStreaming: true,
      progress: 0,
    };

    setMessages(prev => [...prev, initialAssistantMessage]);

    try {
      // Build data sources array
      const dataSources = [
        {
          name: "chat_interface",
          data: {
            timestamp: new Date().toISOString(),
            user_input: userInput
          }
        }
      ];

      // Add data sources from searchTypes
      if (payload?.searchTypes) {
        // Add website data source if provided
        if (payload.searchTypes.website) {
          dataSources.push({
            name: "website",
            data: {
              url: payload.searchTypes.website,
              timestamp: new Date().toISOString()
            }
          });
        }

        // Add facebook_page data source if provided
        if (payload.searchTypes.facebook_page) {
          dataSources.push({
            name: "facebook_page",
            data: {
              url: payload.searchTypes.facebook_page,
              timestamp: new Date().toISOString()
            }
          });
        }

        // Add crms data source if enabled
        if (payload.searchTypes.crms) {
          dataSources.push({
            name: "crms",
            data: {
              enabled: true,
              timestamp: new Date().toISOString()
            }
          });
        }
      }

      // Build channels array from activeModes
      const channels: string[] = [];
      if (payload?.activeModes) {
        if (payload.activeModes.email) channels.push("email");
        if (payload.activeModes.sms) channels.push("sms");
        if (payload.activeModes.whatsapp) channels.push("whatsapp");
        if (payload.activeModes.push) channels.push("push");
      }
      // Default to web if no channels selected
      if (channels.length === 0) {
        channels.push("web");
      }

      // Prepare chat data for the API
      const chatData: ChatData = {
        message: userInput,
        data_source: dataSources,
        channel: channels
      };

      // Connect to SSE stream with POST data
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify(chatData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let buffer = '';
        let streamedContent = '';

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const eventData = JSON.parse(line.slice(6));

                if (eventData.type === 'start') {
                  // Stream started - show initial loading state
                  console.log('Stream started:', eventData.message);

                  // Check if there's actionable data
                  const hasActionableData = !!eventData.actionable_data;

                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === assistantMessageId
                        ? {
                            ...msg,
                            content: '⏳ Starting response...',
                            actionableData: eventData.actionable_data,
                            hasActionableCampaign: hasActionableData
                          }
                        : msg
                    )
                  );
                } else if (eventData.type === 'chunk') {
                  // Update the assistant message with new content
                  streamedContent += eventData.content + ' ';
                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === assistantMessageId
                        ? {
                            ...msg,
                            content: streamedContent.trim(),
                            progress: eventData.progress || 0,
                            isStreaming: true
                          }
                        : msg
                    )
                  );
                } else if (eventData.type === 'complete') {
                  // Stream completed
                  console.log('Stream completed:', eventData.message);
                  setIsLoading(false);

                  // Check if there's actionable data and modify content accordingly
                  setMessages(prev =>
                    prev.map(msg => {
                      if (msg.id === assistantMessageId) {
                        let finalContent = streamedContent.trim() || 'Response completed.';

                        // If there's actionable data, just add a marker (details will be shown in ChatMessage component)
                        if (msg.actionableData) {
                          finalContent += `\n\n🚀 **Launch ${msg.actionableData.channel} campaign?**`;
                        }

                        return {
                          ...msg,
                          content: finalContent,
                          progress: 100,
                          isStreaming: false
                        };
                      }
                      return msg;
                    })
                  );
                }
              } catch (parseError) {
                console.error('Error parsing SSE data:', parseError);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error with SSE stream:', error);

      // Fallback to simulated response on error
      const fallbackMessage = `Sorry, I encountered an error connecting to the server. Here's a fallback response to your message: "${userInput}"`;

      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessageId
            ? { ...msg, content: fallbackMessage }
            : msg
        )
      );
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(input.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return {
    messages,
    setMessages,
    input,
    setInput,
    isLoading,
    sendMessage,
    handleSubmit,
    handleKeyDown,
    launchingCampaigns,
    handleLaunchCampaign,
    textareaRef,
  };
};