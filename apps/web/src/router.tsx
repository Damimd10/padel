import type { PadelApiClient } from "@padel/api-client";
import {
  Button,
  EmptyState,
  EmptyStateDescription,
  EmptyStateEyebrow,
  EmptyStateTitle,
  InlineAlert,
  InlineAlertDescription,
  InlineAlertTitle,
  Skeleton,
} from "@padel/ui";
import { type QueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
  type ErrorComponentProps,
  Link,
  Outlet,
  type RouterHistory,
  createBrowserHistory,
  createMemoryHistory,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { CompetitionOperationsScreen } from "./features/competition-operations/competition-operations-screen.js";
import { competitionOverviewQueryOptions } from "./features/competition-operations/competition-overview-query.js";
import { mapCompetitionOverviewToPageModel } from "./features/competition-operations/competition-overview-view-model.js";

export interface WebAuthContext {
  isAuthenticated: boolean;
  roleLabel: string;
  userName: string;
}

export interface WebRouterContext {
  apiClient: PadelApiClient;
  auth: WebAuthContext;
  queryClient: QueryClient;
}

const rootRoute = createRootRouteWithContext<WebRouterContext>()({
  component: RootLayout,
});

const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-in",
  component: SignInScreen,
});

const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "authenticated",
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        search: {
          redirect: location.href,
        },
        to: "/sign-in",
      });
    }
  },
  component: AuthenticatedLayout,
});

const competitionOperationsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/competitions/operations",
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(
      competitionOverviewQueryOptions(context.apiClient),
    ),
  pendingComponent: CompetitionOperationsPending,
  pendingMs: 0,
  errorComponent: CompetitionOperationsError,
  component: CompetitionOperationsRouteScreen,
});

const routeTree = rootRoute.addChildren([
  signInRoute,
  authenticatedRoute.addChildren([competitionOperationsRoute]),
]);

function RootLayout() {
  return <Outlet />;
}

function AuthenticatedLayout() {
  return <Outlet />;
}

function SignInScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--secondary)/0.44))] px-6 py-12">
      <EmptyState className="max-w-2xl bg-white/90" variant="info">
        <EmptyStateEyebrow>Authentication scaffold</EmptyStateEyebrow>
        <EmptyStateTitle>
          Sign-in lives outside the operations route group.
        </EmptyStateTitle>
        <EmptyStateDescription>
          This route exists so the first competition operations screen can sit
          behind an explicit authenticated boundary now, while the real auth UI
          lands in a later ticket.
        </EmptyStateDescription>
        <div className="pt-1">
          <Button asChild>
            <Link to="/competitions/operations">
              Return to scaffolded overview
            </Link>
          </Button>
        </div>
      </EmptyState>
    </main>
  );
}

function CompetitionOperationsRouteScreen() {
  const { apiClient } = competitionOperationsRoute.useRouteContext();
  const { data } = useSuspenseQuery(competitionOverviewQueryOptions(apiClient));

  return (
    <CompetitionOperationsScreen
      model={mapCompetitionOverviewToPageModel(data)}
    />
  );
}

function CompetitionOperationsPending() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--secondary)/0.52))] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="rounded-[2rem] border border-border/70 bg-white/80 p-6 shadow-sm sm:p-8">
          <div className="space-y-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-14 w-full max-w-3xl" />
            <Skeleton className="h-6 w-full max-w-2xl" />
          </div>
        </div>
        <Skeleton className="h-40 w-full rounded-[1.5rem]" />
        <Skeleton className="h-80 w-full rounded-[1.5rem]" />
      </div>
    </main>
  );
}

function CompetitionOperationsError({ error }: ErrorComponentProps) {
  const message =
    error instanceof Error
      ? error.message
      : "Unable to load competition overview.";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--secondary)/0.52))] px-6 py-12">
      <InlineAlert className="max-w-2xl bg-white/90" variant="blocked">
        <InlineAlertTitle variant="blocked">
          Competition overview could not be loaded
        </InlineAlertTitle>
        <InlineAlertDescription>{message}</InlineAlertDescription>
      </InlineAlert>
    </main>
  );
}

export function createWebRouter({
  apiClient,
  auth,
  history = createBrowserHistory(),
  queryClient,
}: WebRouterContext & {
  history?: RouterHistory;
}) {
  return createRouter({
    context: {
      apiClient,
      auth,
      queryClient,
    },
    history,
    routeTree,
    scrollRestoration: true,
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createWebRouter>;
  }
}
