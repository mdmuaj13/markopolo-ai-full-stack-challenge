'use client';
import { useEffect, useRef, useState } from 'react';
import { Bot } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import ChatHeader from '@/components/ChatHeader';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import SidePanel from '@/components/SidePanel';

const ChatContainer = () => {
	const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
	const [selectedCampaignData, setSelectedCampaignData] = useState<any>(null);
	const [initialPayload, setInitialPayload] = useState<any>(null);

	useEffect(() => {
		const payload = sessionStorage.getItem('chatPayload');
		if (payload) {
			setInitialPayload(JSON.parse(payload));
			sessionStorage.removeItem('chatPayload');
		}
	}, []);

	const {
		messages,
		setMessages,
		input,
		setInput,
		isLoading,
		handleSubmit,
		handleKeyDown,
		launchingCampaigns,
		handleLaunchCampaign,
		textareaRef,
	} = useChat(initialPayload?.query, { initialPayload });

	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const toggleSidePanel = (campaignData?: any) => {
		if (campaignData) {
			setSelectedCampaignData(campaignData);
			setIsSidePanelOpen(true);
		} else {
			setIsSidePanelOpen(!isSidePanelOpen);
		}
	};

	return (
		<div className="flex flex-col h-screen bg-background">
			<ChatHeader onTogglePanel={toggleSidePanel} isPanelOpen={isSidePanelOpen} />

			{/* Main Content Area */}
			<div className="flex-1 overflow-hidden flex relative">
				{/* Chat Area */}
				<div className="flex-1 overflow-y-auto">
					<div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
						{messages.map((message) => (
							<ChatMessage
								key={message.id}
								message={message}
								onLaunchCampaign={handleLaunchCampaign}
								isLaunching={launchingCampaigns.has(message.id)}
								onToggleSidePanel={toggleSidePanel}
							/>
						))}

						{isLoading && (
							<div className="flex gap-4 justify-start">
								<div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
									<Bot className="w-4 h-4 text-primary-foreground" />
								</div>
								<div className="bg-muted rounded-lg px-4 py-3">
									<div className="flex gap-1">
										<div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
										<div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100"></div>
										<div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200"></div>
									</div>
								</div>
							</div>
						)}

						<div ref={messagesEndRef} />
					</div>
				</div>

				{/* Side Panel */}
				<SidePanel
					isOpen={isSidePanelOpen}
					onToggle={() => toggleSidePanel()}
					campaignData={selectedCampaignData}
				/>
			</div>

			<ChatInput
				input={input}
				setInput={setInput}
				isLoading={isLoading}
				handleSubmit={handleSubmit}
				handleKeyDown={handleKeyDown}
				textareaRef={textareaRef}
			/>
		</div>
	);
};

export default ChatContainer;
