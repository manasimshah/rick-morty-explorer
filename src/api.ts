export type RMCharacter = {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
  origin: { name: string };
  location: { name: string };
};

export type PagedCharacters = {
  info: { count: number; pages: number; next: string | null; prev: string | null };
  results: RMCharacter[];
};

const BASE = "https://rickandmortyapi.com/api";

export async function fetchCharacters(page: number): Promise<PagedCharacters> {
  const res = await fetch(`${BASE}/character?page=${page}`);
  if (!res.ok) throw new Error(`Failed to fetch characters (page ${page})`);
  return res.json();
}

export async function fetchCharacter(id: string): Promise<RMCharacter> {
  const res = await fetch(`${BASE}/character/${id}`);
  if (!res.ok) throw new Error(`Character ${id} not found`);
  return res.json();
}
