'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
	Search,
	Globe,
	Tags,
	Mail,
	MessageSquare,
	Phone,
	Bell,
	ArrowRight,
	Database,
	Check,
	X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const SearchBox = () => {
	const router = useRouter();
	const [query, setQuery] = useState('');
	const [toolCount, setToolCount] = useState(0);
	// Track which communication channels are active
	const [activeModes, setActiveModes] = useState({
		email: false,
		sms: false,
		whatsapp: false,
		push: false,
	});

	// State for search types and their configurations
	const [searchTypes, setSearchTypes] = useState({
		website: {
			enabled: false,
			url: 'https://'
		},
		facebook_page: {
			enabled: false,
			pageUrl: 'https://'
		},
		crms: {
			enabled: false
		}
	});

	// URL validation helper
	const isValidUrl = (urlString: string): boolean => {
		try {
			const url = new URL(urlString);
			return url.protocol === 'http:' || url.protocol === 'https:';
		} catch {
			return false;
		}
	};

	// Facebook URL validation helper
	const isValidFacebookUrl = (urlString: string): boolean => {
		if (!isValidUrl(urlString)) return false;
		try {
			const url = new URL(urlString);
			return url.hostname.includes('facebook.com') || url.hostname.includes('fb.com');
		} catch {
			return false;
		}
	};

	// Check if website URL is valid
	const isWebsiteValid = searchTypes.website.enabled && searchTypes.website.url.trim() && isValidUrl(searchTypes.website.url);

	// Check if Facebook page URL is valid
	const isFacebookValid = searchTypes.facebook_page.enabled && searchTypes.facebook_page.pageUrl.trim() && isValidFacebookUrl(searchTypes.facebook_page.pageUrl);

	// Count active and valid data sources
	const activeDataSourcesCount = [isWebsiteValid, isFacebookValid, searchTypes.crms.enabled].filter(Boolean).length;


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
		if (!query.trim()) return;

		// Validate search types if enabled
		if (searchTypes.website.enabled && !isWebsiteValid) {
			toast.error('Please enter a valid website URL', {
				description: 'Example: https://example.com'
			});
			return;
		}

		if (searchTypes.facebook_page.enabled && !isFacebookValid) {
			toast.error('Please enter a valid Facebook page URL', {
				description: 'Example: https://facebook.com/yourpage'
			});
			return;
		}

		const payload = {
			query: query.trim(),
			activeModes,
			searchTypes: {
				website: searchTypes.website.enabled ? searchTypes.website.url : null,
				facebook_page: searchTypes.facebook_page.enabled ? searchTypes.facebook_page.pageUrl : null,
				crms: searchTypes.crms.enabled
			},
		};

		sessionStorage.setItem('chatPayload', JSON.stringify(payload));
		router.push('/chat');
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
								{/* Active Data Source Icons with Confirmation */}
								{activeDataSourcesCount > 0 && (
									<div className="flex items-center gap-0.5 mr-1 bg-secondary/20 rounded-lg p-0.5">
										{isWebsiteValid && (
											<div className="h-7 px-2 flex items-center gap-1 bg-secondary rounded">
												<Globe className="w-3.5 h-3.5 text-foreground" />
												<Check className="w-3 h-3 text-green-500" />
											</div>
										)}
										{isFacebookValid && (
											<div className="h-7 px-2 flex items-center gap-1 bg-secondary rounded">
												<Search className="w-3.5 h-3.5 text-foreground" />
												<Check className="w-3 h-3 text-green-500" />
											</div>
										)}
										{searchTypes.crms.enabled && (
											<div className="h-7 px-2 flex items-center gap-1 bg-secondary rounded">
												<Database className="w-3.5 h-3.5 text-foreground" />
												<Check className="w-3 h-3 text-green-500" />
											</div>
										)}
									</div>
								)}

								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant={activeDataSourcesCount > 0 ? "secondary" : "ghost"}
											size="sm"
											className="h-8 px-2.5 hover:bg-muted relative">
											<Database className="w-4 h-4" />
											{activeDataSourcesCount > 0 && (
												<span className="ml-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
													{activeDataSourcesCount}
												</span>
											)}
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="end"
										className="w-72 bg-secondary/10">
										{/* <DropdownMenuLabel>Data Source</DropdownMenuLabel> */}
										{/* <DropdownMenuSeparator /> */}

										{/* Website Search */}
										<DropdownMenuItem
											className="flex items-center justify-between px-3 py-2"
											onClick={(e) => e.preventDefault()}>
											<div className="flex items-center">
												<Globe className="mr-2 h-4 w-4" />
												<span>Website</span>
											</div>
											<Switch
												checked={searchTypes.website.enabled}
												onCheckedChange={(checked) => 
													setSearchTypes(prev => ({
														...prev,
														website: { ...prev.website, enabled: checked }
													}))
												}
											/>
										</DropdownMenuItem>
										{searchTypes.website.enabled && (
											<div className="px-3 pb-2">
												<div className="relative">
													<Input
														placeholder="Enter website URL..."
														value={searchTypes.website.url}
														onChange={(e) =>
															setSearchTypes(prev => ({
																...prev,
																website: { ...prev.website, url: e.target.value }
															}))
														}
														onKeyDown={(e) => e.stopPropagation()}
														className="text-sm pr-8"
													/>
													{searchTypes.website.url.trim() && (
														<div className="absolute right-2 top-1/2 -translate-y-1/2">
															{isWebsiteValid ? (
																<Check className="w-4 h-4 text-green-500" />
															) : (
																<X className="w-4 h-4 text-red-500" />
															)}
														</div>
													)}
												</div>
											</div>
										)}

										{/* Facebook Page */}
										<DropdownMenuItem
											className="flex items-center justify-between px-3 py-2"
											onClick={(e) => e.preventDefault()}>
											<div className="flex items-center">
												<Search className="mr-2 h-4 w-4" />
												<span>Facebook Page</span>
											</div>
											<Switch
												checked={searchTypes.facebook_page.enabled}
												onCheckedChange={(checked) => 
													setSearchTypes(prev => ({
														...prev,
														facebook_page: { ...prev.facebook_page, enabled: checked }
													}))
												}
											/>
										</DropdownMenuItem>
										{searchTypes.facebook_page.enabled && (
											<div className="px-3 pb-2">
												<div className="relative">
													<Input
														placeholder="Enter Facebook page URL..."
														value={searchTypes.facebook_page.pageUrl}
														onChange={(e) =>
															setSearchTypes(prev => ({
																...prev,
																facebook_page: { ...prev.facebook_page, pageUrl: e.target.value }
															}))
														}
														onKeyDown={(e) => e.stopPropagation()}
														className="text-sm pr-8"
													/>
													{searchTypes.facebook_page.pageUrl.trim() && (
														<div className="absolute right-2 top-1/2 -translate-y-1/2">
															{isFacebookValid ? (
																<Check className="w-4 h-4 text-green-500" />
															) : (
																<X className="w-4 h-4 text-red-500" />
															)}
														</div>
													)}
												</div>
											</div>
										)}

										{/* CRMs */}
										<DropdownMenuItem
											className="flex items-center justify-between px-3 py-2"
											onClick={(e) => e.preventDefault()}>
											<div className="flex items-center">
												<Database className="mr-2 h-4 w-4" />
												<span>CRMs</span>
											</div>
											<Switch
												checked={searchTypes.crms.enabled}
												onCheckedChange={(checked) =>
													setSearchTypes(prev => ({
														...prev,
														crms: { enabled: checked }
													}))
												}
											/>
										</DropdownMenuItem>

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
