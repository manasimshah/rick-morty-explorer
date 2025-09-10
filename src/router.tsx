import {
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Outlet,
} from "@tanstack/react-router";
import CharactersPage from "./screens/CharactersPage";
import CharacterDetailPage from "./screens/CharacterDetailPage";

const Root = createRootRoute({
  component: () => (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 16 }}>
      <h1>Rick & Morty Explorer</h1>
      <nav style={{ marginBottom: 12 }}>
        <Link to="/characters" search={{ page: 1 }}>Characters</Link>
      </nav>
      <Outlet />
    </div>
  ),
});

const CharactersRoute = createRoute({
  getParentRoute: () => Root,
  path: "/characters",
  // Keep page in the URL; survives refresh & link sharing`
  validateSearch: (search: Record<string, unknown>) => {
    let page = Number(search.page ?? 1);
    if (!Number.isFinite(page) || page < 1) page = 1;
    return { page };
  },
  component: CharactersPage,
});

const CharacterDetailRoute = createRoute({
  getParentRoute: () => Root,
  path: "/character/$id",
  component: CharacterDetailPage,
});

const routeTree = Root.addChildren([CharactersRoute, CharacterDetailRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
