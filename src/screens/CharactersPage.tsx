import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { fetchCharacters } from "../api";
import CharacterTable from "../components/CharacterTable";

export default function CharactersPage() {
    const { page } = useSearch({ from: "/characters" }); // page from URL
    const navigate = useNavigate({ from: "/characters" });
    const queryClient = useQueryClient();

    const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
        queryKey: ["characters", page],
        queryFn: () => fetchCharacters(page),
        placeholderData: (prev) => prev,
    });

    // Prefetch next page for snappier UX
    React.useEffect(() => {
        if (data?.info?.next) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const nextPage = Math.min((data.info as any).pages, page + 1);
            queryClient.prefetchQuery({ queryKey: ["characters", nextPage], queryFn: () => fetchCharacters(nextPage) });
        }
    }, [page, data, queryClient]);

    const totalPages = data?.info?.pages ?? 1;

    const goToPage = (p: number) =>
        navigate({ to: "/characters", search: { page: Math.max(1, Math.min(totalPages, p)) } });

    return (
        <section>
            <header className="flex items-center gap-4 mb-4">
                <h2 className="text-xl font-semibold">Characters</h2>
                <button
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="ml-auto px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md shadow disabled:opacity-50"
                >
                    {isFetching ? "Refreshing..." : "Refresh"}
                </button>
            </header>

            {isLoading ? (
                <p className="text-gray-500">Loading page {page}…</p>
            ) : isError ? (
                <p className="text-red-600">{(error as Error).message}</p>
            ) : (
                <>
                    <CharacterTable data={data!.results} />
                    <footer className="flex items-center gap-3 mt-4">
                        <button
                            onClick={() => goToPage(page - 1)}
                            disabled={page <= 1}
                            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                        >
                            ◀ Prev
                        </button>
                        <span>Page</span>
                        <input
                            type="number"
                            min={1}
                            max={totalPages}
                            value={page}
                            onChange={(e) => goToPage(Number(e.target.value || 1))}
                            className="border rounded px-2 py-1 w-16 text-center"
                        />
                        <span>of {totalPages}</span>
                        <button
                            onClick={() => goToPage(page + 1)}
                            disabled={page >= totalPages}
                            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                        >
                            Next ▶
                        </button>
                    </footer>
                </>
            )}
        </section>
    );
}
