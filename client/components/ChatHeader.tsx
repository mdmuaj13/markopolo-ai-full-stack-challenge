import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PanelRight } from 'lucide-react';

interface ChatHeaderProps {
	onTogglePanel?: () => void;
	isPanelOpen?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onTogglePanel, isPanelOpen }) => {
	return (
		<div className="border-b border-border px-6 py-4 flex justify-between items-center">
			<Link href="/">
				<h1 className="text-xl font-semibold">Markopolo</h1>
			</Link>
			{onTogglePanel && !isPanelOpen && (
				<Button onClick={onTogglePanel} variant="outline" size="sm">
					<PanelRight className="w-4 h-4 mr-2" />
					Open Panel
				</Button>
			)}
		</div>
	);
};

export default ChatHeader;
