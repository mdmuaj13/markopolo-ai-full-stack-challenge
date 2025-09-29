import SearchBox from '@/components/searchbox';

export default function Home() {
	return (
		<div className="flex justify-center items-center h-screen px-4">
			<div className="flex flex-col gap-4 w-full max-w-6xl">
				<h2 className="text-2xl text-center font-bold">Markopolo</h2>
				<SearchBox />
			</div>
		</div>
	);
}
