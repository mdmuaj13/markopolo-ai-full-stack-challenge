'use client';
import { useState, useRef } from 'react';
import {
	Search,
	Globe,
	Tags,
	Paperclip,
	Facebook,
	ArrowRight,
	Cpu,
	Send,
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
	const [query, setQuery] = useState('');
	const [searchMode, setSearchMode] = useState('search');

	// Track which modes are submitted/active
	const [activeModes, setActiveModes] = useState({
		search: false,
		research: false,
		gtm: false,
	});

	// Dropdown open states
	const [dropdownStates, setDropdownStates] = useState({
		search: false,
		research: false,
		gtm: false,
	});

	// State for dropdown switches and inputs
	const [searchModeEnabled, setSearchModeEnabled] = useState(false);
	const [webSearchEnabled, setWebSearchEnabled] = useState(false);
	const [tagsEnabled, setTagsEnabled] = useState(false);
	const [attachFileEnabled, setAttachFileEnabled] = useState(false);
	const [settingsEnabled, setSettingsEnabled] = useState(false);

	// State for input values
	const [searchModeInput, setSearchModeInput] = useState('');
	const [webSearchInput, setWebSearchInput] = useState('');
	const [tagsInput, setTagsInput] = useState('');
	const [attachFileInput, setAttachFileInput] = useState('');
	const [settingsInput, setSettingsInput] = useState('');

	// State for individual mode dropdown inputs
	const [facebookInput, setFacebookInput] = useState('');
	const [globeInput, setGlobeInput] = useState('');
	const [tagsInputValue, setTagsInputValue] = useState('');

	// Submit handlers
	const handleSubmitSearch = () => {
		if (facebookInput.trim()) {
			setActiveModes((prev) => ({ ...prev, search: true }));
			setSearchMode('search');
			setDropdownStates((prev) => ({ ...prev, search: false }));
		}
	};

	const handleSubmitResearch = () => {
		if (globeInput.trim()) {
			setActiveModes((prev) => ({ ...prev, research: true }));
			setSearchMode('research');
			setDropdownStates((prev) => ({ ...prev, research: false }));
		}
	};

	const handleSubmitTags = () => {
		if (tagsInputValue.trim()) {
			setActiveModes((prev) => ({ ...prev, gtm: true }));
			setSearchMode('gtm');
			setDropdownStates((prev) => ({ ...prev, gtm: false }));
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

							{/* Left Side - Search Mode Toggle */}
							<div className="flex col-start-1 row-start-2 gap-1">
								<div className="flex items-center gap-1">
									<div className="group relative isolate flex h-fit focus:outline-none bg-secondary/20 rounded-lg">
										<div className="p-0.5 flex shrink-0 items-center ">
											<DropdownMenu
												open={dropdownStates.search}
												onOpenChange={(open) =>
													setDropdownStates((prev) => ({
														...prev,
														search: open,
													}))
												}>
												<DropdownMenuTrigger asChild>
													<Button
														variant={activeModes.search ? 'secondary' : 'ghost'}
														size="sm"
														className="h-8 min-w-9 px-2.5 text-xs">
														<Facebook className="w-4 h-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align="start"
													className="w-64 bg-secondary/20">
													<div className="px-3 py-2">
														<div className="flex items-center gap-2">
															<Input
																placeholder="Enter search parameters..."
																value={facebookInput}
																onChange={(e) =>
																	setFacebookInput(e.target.value)
																}
																className="text-sm"
																onKeyDown={(e) => {
																	if (e.key === 'Enter') {
																		handleSubmitSearch();
																	}
																}}
															/>
															<Button
																size="sm"
																variant="ghost"
																className="h-8 w-8 p-0"
																onClick={handleSubmitSearch}>
																<Send className="w-4 h-4" />
															</Button>
														</div>
													</div>
												</DropdownMenuContent>
											</DropdownMenu>
											<DropdownMenu
												open={dropdownStates.research}
												onOpenChange={(open) =>
													setDropdownStates((prev) => ({
														...prev,
														research: open,
													}))
												}>
												<DropdownMenuTrigger asChild>
													<Button
														variant={
															activeModes.research ? 'secondary' : 'ghost'
														}
														size="sm"
														className="h-8 min-w-9 px-2.5 text-xs">
														<Globe className="w-4 h-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align="start"
													className="w-64 bg-secondary/20">
													<div className="px-3 py-2">
														<div className="flex items-center gap-2">
															<Input
																placeholder="Enter research topic..."
																value={globeInput}
																onChange={(e) => setGlobeInput(e.target.value)}
																className="text-sm"
																onKeyDown={(e) => {
																	if (e.key === 'Enter') {
																		handleSubmitResearch();
																	}
																}}
															/>
															<Button
																size="sm"
																variant="ghost"
																className="h-8 w-8 p-0"
																onClick={handleSubmitResearch}>
																<Send className="w-4 h-4" />
															</Button>
														</div>
													</div>
												</DropdownMenuContent>
											</DropdownMenu>
											<DropdownMenu
												open={dropdownStates.gtm}
												onOpenChange={(open) =>
													setDropdownStates((prev) => ({ ...prev, gtm: open }))
												}>
												<DropdownMenuTrigger asChild>
													<Button
														variant={activeModes.gtm ? 'secondary' : 'ghost'}
														size="sm"
														className="h-8 min-w-9 px-2.5 text-xs">
														<Tags className="w-4 h-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align="start"
													className="w-64 bg-secondary/20">
													<div className="px-3 py-2">
														<div className="flex items-center gap-2">
															<Input
																placeholder="Enter tags..."
																value={tagsInputValue}
																onChange={(e) =>
																	setTagsInputValue(e.target.value)
																}
																className="text-sm"
																onKeyDown={(e) => {
																	if (e.key === 'Enter') {
																		handleSubmitTags();
																	}
																}}
															/>
															<Button
																size="sm"
																variant="ghost"
																className="h-8 w-8 p-0"
																onClick={handleSubmitTags}>
																<Send className="w-4 h-4" />
															</Button>
														</div>
													</div>
												</DropdownMenuContent>
											</DropdownMenu>
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
										className="h-8 aspect-square p-0">
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
