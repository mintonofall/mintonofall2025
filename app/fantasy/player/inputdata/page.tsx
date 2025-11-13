import { createFantasyPlayer } from "@/lib/fantasy";
import { GameEvent } from "@prisma/client";

export default function AddFantasyPlayerPage() {
    const gameEvents = Object.values(GameEvent);

    return (
        <div className="container mx-auto p-4 max-w-lg">
            <h1 className="text-2xl font-bold mb-6">판타지 선수 추가</h1>
            <form action={createFantasyPlayer} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        이름
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                        사진 URL
                    </label>
                    <input
                        type="url"
                        id="photo"
                        name="photo"
                        placeholder="https://example.com/photo.jpg"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                        국적
                    </label>
                    <input
                        type="url"
                        id="country"
                        name="country"
                        placeholder="국기 이미지 URL (예: https://.../flag.png)"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                        연도
                    </label>
                    <input
                        type="number"
                        id="year"
                        name="year"
                        required
                        defaultValue={new Date().getFullYear() - 1}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="ranking" className="block text-sm font-medium text-gray-700">
                        랭킹
                    </label>
                    <input
                        type="number"
                        id="ranking"
                        name="ranking"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="event" className="block text-sm font-medium text-gray-700">
                        종목
                    </label>
                    <select
                        id="event"
                        name="event"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        {gameEvents.map((event) => (
                            <option key={event} value={event}>
                                {event}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        선수 추가
                    </button>
                </div>
            </form>
        </div>
    );
}
