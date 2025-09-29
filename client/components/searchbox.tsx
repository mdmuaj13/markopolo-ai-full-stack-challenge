'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
	Search,
	Globe,
	Tags,
	Mail,
	MessageSquare,
	Phone,
	Bell,
	ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const SearchBox = () => {
	const router = useRouter();
	const [query, setQuery] = useState('');
	// Track which communication channels are active
	const [activeModes, setActiveModes] = useState({
		email: false,
		sms: false,
		whatsapp: false,
		push: false,
	});

	// State for dropdown switches and inputs (for right side)
	const [webSearchEnabled, setWebSearchEnabled] = useState(false);
	const [searchModeEnabled, setSearchModeEnabled] = useState(false);
	const [tagsEnabled, setTagsEnabled] = useState(false);

	// State for input values (for right side)
	const [webSearchInput, setWebSearchInput] = useState('');
	const [searchModeInput, setSearchModeInput] = useState('');
	const [tagsInput, setTagsInput] = useState('');

	// Toggle handlers for communication channel buttons
	const handleToggleEmail = () => {
		setActiveModes((prev) => ({ ...prev, email: !prev.email }));
	};

	const handleToggleSms = () => {
		setActiveModes((prev) => ({ ...prev, sms: !prev.sms }));
	};

	const handleToggleWhatsapp = () => {
		setActiveModes((prev) => ({ ...prev, whatsapp: !prev.whatsapp }));
	};

	const handleTogglePush = () => {
		setActiveModes((prev) => ({ ...prev, push: !prev.push }));
	};

	const handleSubmit = () => {
		if (query.trim()) {
			const payload = {
				query: query.trim(),
				activeModes,
				webSearch: webSearchEnabled ? webSearchInput : null,
				searchMode: searchModeEnabled ? searchModeInput : null,
				tags: tagsEnabled ? tagsInput : null,
			};

			sessionStorage.setItem('chatPayload', JSON.stringify(payload));
			router.push('/chat');
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && (e.shiftKey || e.ctrlKey)) {
			return;
		}
		if (e.key === 'Enter') {
			e.preventDefault();
			handleSubmit();
		}
	};

	return (
		<div className="w-full max-w-3xl px-2 mx-auto">
			<div className="relative">
				<div className="bg-transparent/10 border border-border/50 rounded-xl">
					<div className="px-0 py-3 grid items-center">
						<div className="px-3.5 grid grid-cols-3 grid-rows-[1fr_auto]">
							{/* Text Input Row - spans all 3 columns */}
							<div className="overflow-hidden relative flex h-full w-full col-start-1 col-end-4 pb-3">
								<div className="w-full" style={{ minHeight: '3em' }}>
									<textarea
										value={query}
										onChange={(e) => setQuery(e.target.value)}
										onKeyDown={handleKeyDown}
										placeholder="Ask anything or @mention a Space"
										className="w-full max-h-[45vh] lg:max-h-[40vh] sm:max-h-[25vh] outline-none font-sans resize-none text-foreground bg-transparent placeholder:text-muted-foreground overflow-auto border-none p-0"
										style={{
											userSelect: 'text',
											whiteSpace: 'pre-wrap',
											wordBreak: 'break-word',
											minHeight: '3em',
										}}
									/>
								</div>
							</div>

							{/* Left Side - Communication Channels */}
							<div className="flex col-start-1 row-start-2 gap-1">
								<div className="flex items-center gap-1">
									<div className="group relative isolate flex h-fit focus:outline-none bg-secondary/20 rounded-lg">
										<div className="p-0.5 flex shrink-0 items-center gap-0.5">
											{/* Email Button */}
											<Button
												variant={activeModes.email ? 'secondary' : 'ghost'}
												size="sm"
												className="h-8 min-w-9 px-2.5 text-xs"
												onClick={handleToggleEmail}>
												<Mail className="w-4 h-4" />
											</Button>

											{/* SMS Button */}
											<Button
												variant={activeModes.sms ? 'secondary' : 'ghost'}
												size="sm"
												className="h-8 min-w-9 px-2.5 text-xs"
												onClick={handleToggleSms}>
												<MessageSquare className="w-4 h-4" />
											</Button>

											{/* WhatsApp Button */}
											<Button
												variant={activeModes.whatsapp ? 'secondary' : 'ghost'}
												size="sm"
												className="h-8 min-w-9 px-2.5 text-xs"
												onClick={handleToggleWhatsapp}>
												<Phone className="w-4 h-4" />
											</Button>

											{/* Push Button */}
											<Button
												variant={activeModes.push ? 'secondary' : 'ghost'}
												size="sm"
												className="h-8 min-w-9 px-2.5 text-xs"
												onClick={handleTogglePush}>
												<Bell className="w-4 h-4" />
											</Button>
										</div>
									</div>
								</div>
							</div>

							{/* Right Side - Action Buttons */}
							<div className="flex items-center justify-self-end col-start-3 row-start-2 gap-1">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											size="sm"
											className="h-8 aspect-square p-0 hover:bg-muted">
											<Globe className="w-4 h-4 text-muted-foreground" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="end"
										className="w-72 bg-secondary/10">
										{/* <DropdownMenuLabel>Data Source</DropdownMenuLabel> */}
										{/* <DropdownMenuSeparator /> */}

										{/* Web Search */}
										<DropdownMenuItem
											className="flex items-center justify-between px-3 py-2"
											onClick={(e) => e.preventDefault()}>
											<div className="flex items-center">
												<Globe className="mr-2 h-4 w-4" />
												<span>Website</span>
											</div>
											<Switch
												checked={webSearchEnabled}
												onCheckedChange={setWebSearchEnabled}
											/>
										</DropdownMenuItem>
										{webSearchEnabled && (
											<div className="px-3 pb-2">
												<Input
													placeholder="Enter website url..."
													value={webSearchInput}
													onChange={(e) => setWebSearchInput(e.target.value)}
													className="text-sm"
												/>
											</div>
										)}

										{/* Search Mode */}
										<DropdownMenuItem
											className="flex items-center justify-between px-3 py-2"
											onClick={(e) => e.preventDefault()}>
											<div className="flex items-center">
												<Search className="mr-2 h-4 w-4" />
												<span>Search Mode</span>
											</div>
											<Switch
												checked={searchModeEnabled}
												onCheckedChange={setSearchModeEnabled}
											/>
										</DropdownMenuItem>
										{searchModeEnabled && (
											<div className="px-3 pb-2">
												<Input
													placeholder="Enter search mode settings..."
													value={searchModeInput}
													onChange={(e) => setSearchModeInput(e.target.value)}
													className="text-sm"
												/>
											</div>
										)}

										{/* Tags */}
										<DropdownMenuItem
											className="flex items-center justify-between px-3 py-2"
											onClick={(e) => e.preventDefault()}>
											<div className="flex items-center">
												<Tags className="mr-2 h-4 w-4" />
												<span>Google Tag Manager</span>
											</div>
											<Switch
												checked={tagsEnabled}
												onCheckedChange={setTagsEnabled}
											/>
										</DropdownMenuItem>
										{tagsEnabled && (
											<div className="px-3 pb-2">
												<Input
													placeholder="Enter gtm id..."
													value={tagsInput}
													onChange={(e) => setTagsInput(e.target.value)}
													className="text-sm"
												/>
											</div>
										)}
									</DropdownMenuContent>
								</DropdownMenu>
								<div className="ml-1">
									<Button
										variant="secondary"
										size="sm"
										className="h-8 aspect-square p-0"
										onClick={handleSubmit}>
										<ArrowRight className="w-4 h-4" />
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SearchBox;
