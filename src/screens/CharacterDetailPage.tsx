import { useParams, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchCharacter } from "../api";

export default function CharacterDetailPage() {
  const { id } = useParams({ from: "/character/$id" });

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["character", id],
    queryFn: () => fetchCharacter(id),
  });

  if (isLoading) return <p>Loading character…</p>;
  if (isError) return <p style={{ color: "crimson" }}>{(error as Error).message}</p>;

  const c = data!;
  return (
    <article className="bg-white shadow rounded-lg p-6">
      <header className="flex items-center gap-4 mb-4">
        <Link
          to="/characters"
          search={{ page: 1 }}
          className="text-indigo-600 hover:underline"
        >
          ← Back to list
        </Link>
        <h2 className="text-2xl font-bold">{c.name}</h2>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="ml-auto px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md shadow disabled:opacity-50"
        >
          {isFetching ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      <div className="flex gap-6">
        <img
          src={c.image}
          alt={c.name}
          className="w-48 h-48 rounded-lg shadow-md object-cover"
        />
        <ul className="space-y-2 text-gray-700">
          <li><strong>Status:</strong> {c.status}</li>
          <li><strong>Species:</strong> {c.species}</li>
          <li><strong>Gender:</strong> {c.gender}</li>
          <li><strong>Origin:</strong> {c.origin?.name}</li>
          <li><strong>Location:</strong> {c.location?.name}</li>
          <li><strong>ID:</strong> {c.id}</li>
        </ul>
      </div>
    </article>

  );
}
