import { createFantasyLeague } from "./action";

export default function CreateLeaguePage() {
    return (
        <div className="container mx-auto p-4 max-w-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">새 판타지 리그 만들기</h1>
            <form action={createFantasyLeague} className="space-y-6 bg-white p-8 shadow-lg rounded-lg">
                <div>
                    <label htmlFor="leagueName" className="block text-sm font-medium text-gray-700">
                        리그 이름
                    </label>
                    <input
                        type="text"
                        id="leagueName"
                        name="leagueName"
                        required
                        placeholder="예: 2025 모두의민턴 판타지 리그"
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
                        defaultValue={new Date().getFullYear()}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        리그 생성
                    </button>
                </div>
            </form>
        </div>
    );
}
