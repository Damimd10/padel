import type { PadelApiClient } from "@padel/api-client";
import {
  forgetPasswordRequestSchema,
  resetPasswordRequestSchema,
  signInWithEmailRequestSchema,
  signUpWithEmailRequestSchema,
} from "@padel/schemas";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  EmptyState,
  EmptyStateDescription,
  EmptyStateEyebrow,
  EmptyStateTitle,
  Field,
  InlineAlert,
  InlineAlertDescription,
  InlineAlertTitle,
  Input,
  Skeleton,
} from "@padel/ui";
import { useForm } from "@tanstack/react-form";
import {
  type QueryClient,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  type AnyRouter,
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
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useState } from "react";
import { AdminDashboardScreen } from "./features/admin/admin-dashboard-screen.js";
import { AdminLayout } from "./features/admin/admin-layout.js";
import { mapToAdminPageViewModel } from "./features/admin/admin-view-model.js";
import {
  competitionMatchesQueryOptions,
  ensureCompetitionMatches,
} from "./features/admin/competition/competition-matches-query.js";
import { MatchManagementScreen } from "./features/admin/competition/match-management-screen.js";
import { mapToMatchManagementViewModel } from "./features/admin/competition/match-view-model.js";
import {
  competitionCategoriesQueryOptions,
  ensureCompetitionCategories,
} from "./features/competition-detail/competition-categories-query.js";
import { CompetitionDetailScreen } from "./features/competition-detail/competition-detail-screen.js";
import { mapToCompetitionDetailPageModel } from "./features/competition-detail/competition-detail-view-model.js";
import {
  competitionDivisionsQueryOptions,
  ensureCompetitionDivisions,
} from "./features/competition-detail/competition-divisions-query.js";
import {
  competitionRegistrationsQueryOptions,
  ensureCompetitionRegistrations,
} from "./features/competition-detail/competition-registrations-query.js";
import { CompetitionOperationsScreen } from "./features/competition-operations/competition-operations-screen.js";
import { competitionOverviewQueryOptions } from "./features/competition-operations/competition-overview-query.js";
import { mapCompetitionOverviewToPageModel } from "./features/competition-operations/competition-overview-view-model.js";
import {
  selectAuthIsLoading,
  selectAuthUser,
  selectIsAuthenticated,
  useAuthStore,
} from "./stores/auth-store.js";

export interface WebRouterContext {
  apiClient: PadelApiClient;
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

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-up",
  component: SignUpScreen,
});

const forgetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forget-password",
  component: ForgetPasswordScreen,
});

const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reset-password",
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) ?? "",
  }),
  component: ResetPasswordScreen,
});

const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "authenticated",
  beforeLoad: ({ context }) => {
    const state = useAuthStore.getState();
    if (!selectAuthIsLoading(state) && !selectIsAuthenticated(state)) {
      throw redirect({
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

const competitionDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/competitions/$competitionId",
  loader: async ({ params, context }) => {
    const [overview, categories, divisions, registrations] = await Promise.all([
      context.queryClient.ensureQueryData(
        competitionOverviewQueryOptions(context.apiClient),
      ),
      ensureCompetitionCategories(
        context.queryClient,
        context.apiClient,
        params.competitionId,
      ),
      ensureCompetitionDivisions(
        context.queryClient,
        context.apiClient,
        params.competitionId,
      ),
      ensureCompetitionRegistrations(
        context.queryClient,
        context.apiClient,
        params.competitionId,
      ),
    ]);
    const competition = overview.find((c) => c.id === params.competitionId);
    return {
      categories,
      divisions,
      registrations,
      status: competition?.status ?? "draft",
    };
  },
  pendingComponent: CompetitionDetailPending,
  pendingMs: 0,
  errorComponent: CompetitionDetailError,
  component: CompetitionDetailRouteScreen,
});

const adminRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  id: "admin",
  component: AdminRouteScreen,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/admin",
  component: AdminDashboardRouteScreen,
});

const adminCompetitionsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/admin/competitions",
  component: AdminCompetitionsPlaceholderScreen,
});

const adminCreateCompetitionRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/admin/competitions/create",
  component: AdminCreateCompetitionPlaceholderScreen,
});

const adminCategoriesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/admin/categories",
  component: AdminCategoriesPlaceholderScreen,
});

const adminParticipantsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/admin/participants",
  component: AdminParticipantsPlaceholderScreen,
});

const adminMatchesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/admin/matches",
  component: AdminMatchesPlaceholderScreen,
});

const adminCompetitionMatchRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/admin/competitions/$competitionId/matches",
  loader: async ({ params, context }) => {
    const matches = await ensureCompetitionMatches(
      context.queryClient,
      context.apiClient,
      params.competitionId,
    );
    return { matches };
  },
  pendingComponent: AdminCompetitionMatchPending,
  pendingMs: 0,
  errorComponent: AdminCompetitionMatchError,
  component: AdminCompetitionMatchRouteScreen,
});

const routeTree = rootRoute.addChildren([
  signInRoute,
  signUpRoute,
  forgetPasswordRoute,
  resetPasswordRoute,
  authenticatedRoute.addChildren([
    competitionOperationsRoute,
    competitionDetailRoute,
    adminRoute.addChildren([
      adminDashboardRoute,
      adminCompetitionsRoute,
      adminCreateCompetitionRoute,
      adminCategoriesRoute,
      adminParticipantsRoute,
      adminMatchesRoute,
      adminCompetitionMatchRoute,
    ]),
  ]),
]);

function RootLayout() {
  return <Outlet />;
}

function AuthenticatedLayout() {
  const isLoading = useAuthStore(selectAuthIsLoading);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Outlet />;
}

function getFieldError(errors: unknown[]): string {
  return errors
    .map((err) => {
      if (typeof err === "string") return err;
      if (err && typeof err === "object" && "message" in err) {
        return String((err as { message: unknown }).message);
      }
      return "";
    })
    .filter(Boolean)
    .join(", ");
}

function SignInScreen() {
  const navigate = useNavigate();
  const apiClient = signInRoute.useRouteContext().apiClient;
  const { signIn, error, isLoading, clearError } = useAuthStore();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: signInWithEmailRequestSchema,
      onBlur: signInWithEmailRequestSchema,
      onSubmit: signInWithEmailRequestSchema,
    },
    onSubmit: async ({ value }) => {
      clearError();
      try {
        await signIn(apiClient, value.email, value.password);
        await navigate({ to: "/competitions/operations" });
      } catch {
        // Error is captured in store
      }
    },
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--secondary)/0.44))] px-6 py-12">
      <Card className="w-full max-w-md bg-white/90">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Enter your email and password to access your account.
          </CardDescription>
        </CardHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <CardContent className="space-y-4">
            {error && (
              <InlineAlert variant="blocked">
                <InlineAlertTitle>Authentication failed</InlineAlertTitle>
                <InlineAlertDescription>{error}</InlineAlertDescription>
              </InlineAlert>
            )}
            <form.Field name="email">
              {(field) => (
                <Field
                  id="sign-in-email"
                  label="Email"
                  required
                  error={getFieldError(field.state.meta.errors)}
                >
                  <Input
                    type="email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    autoComplete="email"
                  />
                </Field>
              )}
            </form.Field>
            <form.Field name="password">
              {(field) => (
                <Field
                  id="sign-in-password"
                  label="Password"
                  required
                  error={getFieldError(field.state.meta.errors)}
                >
                  <Input
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    autoComplete="current-password"
                  />
                </Field>
              )}
            </form.Field>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-3">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            <div className="flex w-full items-center justify-between text-sm">
              <Link
                to="/sign-up"
                className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Create an account
              </Link>
              <Link
                to="/forget-password"
                className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}

function SignUpScreen() {
  const navigate = useNavigate();
  const apiClient = signUpRoute.useRouteContext().apiClient;
  const { signUp, error, isLoading, clearError } = useAuthStore();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onChange: signUpWithEmailRequestSchema,
      onBlur: signUpWithEmailRequestSchema,
      onSubmit: signUpWithEmailRequestSchema,
    },
    onSubmit: async ({ value }) => {
      clearError();
      try {
        await signUp(apiClient, value.name, value.email, value.password);
        await navigate({ to: "/competitions/operations" });
      } catch {
        // Error is captured in store
      }
    },
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--secondary)/0.44))] px-6 py-12">
      <Card className="w-full max-w-md bg-white/90">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Enter your details to get started.</CardDescription>
        </CardHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <CardContent className="space-y-4">
            {error && (
              <InlineAlert variant="blocked">
                <InlineAlertTitle>Registration failed</InlineAlertTitle>
                <InlineAlertDescription>{error}</InlineAlertDescription>
              </InlineAlert>
            )}
            <form.Field name="name">
              {(field) => (
                <Field
                  id="sign-up-name"
                  label="Name"
                  required
                  error={getFieldError(field.state.meta.errors)}
                >
                  <Input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    autoComplete="name"
                  />
                </Field>
              )}
            </form.Field>
            <form.Field name="email">
              {(field) => (
                <Field
                  id="sign-up-email"
                  label="Email"
                  required
                  error={getFieldError(field.state.meta.errors)}
                >
                  <Input
                    type="email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    autoComplete="email"
                  />
                </Field>
              )}
            </form.Field>
            <form.Field name="password">
              {(field) => (
                <Field
                  id="sign-up-password"
                  label="Password"
                  required
                  description="At least 8 characters."
                  error={getFieldError(field.state.meta.errors)}
                >
                  <Input
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    autoComplete="new-password"
                  />
                </Field>
              )}
            </form.Field>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-3">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
            <Link
              to="/sign-in"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Already have an account? Sign in
            </Link>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}

function ForgetPasswordScreen() {
  const apiClient = forgetPasswordRoute.useRouteContext().apiClient;
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onChange: forgetPasswordRequestSchema,
      onBlur: forgetPasswordRequestSchema,
      onSubmit: forgetPasswordRequestSchema,
    },
    onSubmit: async ({ value }) => {
      await apiClient.forgetPassword({ email: value.email });
      setIsSubmitted(true);
    },
  });

  if (isSubmitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--secondary)/0.44))] px-6 py-12">
        <Card className="w-full max-w-md bg-white/90">
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              If an account exists with that email, a reset link has been sent.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link to="/sign-in">Return to sign in</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--secondary)/0.44))] px-6 py-12">
      <Card className="w-full max-w-md bg-white/90">
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
          <CardDescription>
            Enter your email to receive a password reset link.
          </CardDescription>
        </CardHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <CardContent className="space-y-4">
            <form.Field name="email">
              {(field) => (
                <Field
                  id="forget-password-email"
                  label="Email"
                  required
                  error={getFieldError(field.state.meta.errors)}
                >
                  <Input
                    type="email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    autoComplete="email"
                  />
                </Field>
              )}
            </form.Field>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-3">
            <Button type="submit" disabled={form.state.isSubmitting}>
              {form.state.isSubmitting ? "Sending..." : "Send reset link"}
            </Button>
            <Link
              to="/sign-in"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Back to sign in
            </Link>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}

function ResetPasswordScreen() {
  const navigate = useNavigate();
  const apiClient = resetPasswordRoute.useRouteContext().apiClient;
  const { token } = useSearch({ from: "/reset-password" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm({
    defaultValues: {
      newPassword: "",
    },
    validators: {
      onChange: resetPasswordRequestSchema,
      onBlur: resetPasswordRequestSchema,
      onSubmit: resetPasswordRequestSchema,
    },
    onSubmit: async ({ value }) => {
      if (!token) return;
      await apiClient.resetPassword({ newPassword: value.newPassword, token });
      setIsSubmitted(true);
    },
  });

  if (isSubmitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--secondary)/0.44))] px-6 py-12">
        <Card className="w-full max-w-md bg-white/90">
          <CardHeader>
            <CardTitle>Password reset</CardTitle>
            <CardDescription>
              Your password has been reset successfully.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link to="/sign-in">Sign in</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--secondary)/0.44))] px-6 py-12">
        <Card className="w-full max-w-md bg-white/90">
          <CardHeader>
            <CardTitle>Invalid link</CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link to="/sign-in">Return to sign in</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--secondary)/0.44))] px-6 py-12">
      <Card className="w-full max-w-md bg-white/90">
        <CardHeader>
          <CardTitle>Set new password</CardTitle>
          <CardDescription>
            Enter a new password for your account.
          </CardDescription>
        </CardHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <CardContent className="space-y-4">
            <form.Field name="newPassword">
              {(field) => (
                <Field
                  id="reset-password-new"
                  label="New password"
                  required
                  description="At least 8 characters."
                  error={getFieldError(field.state.meta.errors)}
                >
                  <Input
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    autoComplete="new-password"
                  />
                </Field>
              )}
            </form.Field>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-3">
            <Button type="submit" disabled={form.state.isSubmitting}>
              {form.state.isSubmitting ? "Resetting..." : "Reset password"}
            </Button>
            <Link
              to="/sign-in"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Back to sign in
            </Link>
          </CardFooter>
        </form>
      </Card>
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

function AdminRouteScreen() {
  const { apiClient } = adminRoute.useRouteContext();
  const { signOut } = useAuthStore();
  const user = useAuthStore(selectAuthUser);
  const model = mapToAdminPageViewModel(user);

  return (
    <AdminLayout
      model={model}
      onSignOut={async () => {
        await signOut(apiClient);
        window.location.href = "/sign-in";
      }}
    >
      <Outlet />
    </AdminLayout>
  );
}

function AdminDashboardRouteScreen() {
  return <AdminDashboardScreen />;
}

function AdminCompetitionsPlaceholderScreen() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Competitions</h1>
        <p className="text-muted-foreground">Manage your competitions.</p>
      </div>
      <EmptyState variant="info">
        <EmptyStateEyebrow>Competitions</EmptyStateEyebrow>
        <EmptyStateTitle>Coming soon</EmptyStateTitle>
        <EmptyStateDescription>
          Competition management UI is under development.
        </EmptyStateDescription>
      </EmptyState>
    </div>
  );
}

function AdminCreateCompetitionPlaceholderScreen() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Create Competition
        </h1>
        <p className="text-muted-foreground">Set up a new competition.</p>
      </div>
      <EmptyState variant="info">
        <EmptyStateEyebrow>Create</EmptyStateEyebrow>
        <EmptyStateTitle>Coming soon</EmptyStateTitle>
        <EmptyStateDescription>
          Competition creation UI is under development.
        </EmptyStateDescription>
      </EmptyState>
    </div>
  );
}

function AdminCategoriesPlaceholderScreen() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
        <p className="text-muted-foreground">Manage competition categories.</p>
      </div>
      <EmptyState variant="info">
        <EmptyStateEyebrow>Categories</EmptyStateEyebrow>
        <EmptyStateTitle>Coming soon</EmptyStateTitle>
        <EmptyStateDescription>
          Category management UI is under development.
        </EmptyStateDescription>
      </EmptyState>
    </div>
  );
}

function AdminParticipantsPlaceholderScreen() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Participants</h1>
        <p className="text-muted-foreground">
          Manage competition participants.
        </p>
      </div>
      <EmptyState variant="info">
        <EmptyStateEyebrow>Participants</EmptyStateEyebrow>
        <EmptyStateTitle>Coming soon</EmptyStateTitle>
        <EmptyStateDescription>
          Participant management UI is under development.
        </EmptyStateDescription>
      </EmptyState>
    </div>
  );
}

function AdminMatchesPlaceholderScreen() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Matches</h1>
        <p className="text-muted-foreground">Manage competition matches.</p>
      </div>
      <EmptyState variant="info">
        <EmptyStateEyebrow>Matches</EmptyStateEyebrow>
        <EmptyStateTitle>Coming soon</EmptyStateTitle>
        <EmptyStateDescription>
          Match management UI is under development.
        </EmptyStateDescription>
      </EmptyState>
    </div>
  );
}

function CompetitionDetailRouteScreen() {
  const { apiClient, queryClient } = competitionDetailRoute.useRouteContext();
  const { competitionId } = competitionDetailRoute.useParams();
  const loaderData = competitionDetailRoute.useLoaderData();
  const { data: categories } = useSuspenseQuery(
    competitionCategoriesQueryOptions(apiClient, competitionId),
  );
  const { data: divisions } = useSuspenseQuery(
    competitionDivisionsQueryOptions(apiClient, competitionId),
  );
  const { data: registrations } = useSuspenseQuery(
    competitionRegistrationsQueryOptions(apiClient, competitionId),
  );

  const [error, setError] = useState<string | null>(null);

  const createCategoryMutation = useMutation({
    mutationFn: (label: string) =>
      apiClient.createCategory(competitionId, { label }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["competitions", competitionId, "categories"],
      });
    },
    onError: () => {
      setError("Failed to create category. Please try again.");
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, label }: { id: string; label: string }) =>
      apiClient.updateCategory(competitionId, id, { label }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["competitions", competitionId, "categories"],
      });
    },
    onError: () => {
      setError("Failed to update category. Please try again.");
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteCategory(competitionId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["competitions", competitionId, "categories"],
      });
    },
    onError: () => {
      setError(
        "Failed to delete category. It may be referenced by registrations.",
      );
    },
  });

  const createDivisionMutation = useMutation({
    mutationFn: (name: string) =>
      apiClient.createDivision(competitionId, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["competitions", competitionId, "divisions"],
      });
    },
    onError: () => {
      setError("Failed to create division. Please try again.");
    },
  });

  const updateDivisionMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      apiClient.updateDivision(competitionId, id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["competitions", competitionId, "divisions"],
      });
    },
    onError: () => {
      setError("Failed to update division. Please try again.");
    },
  });

  const deleteDivisionMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteDivision(competitionId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["competitions", competitionId, "divisions"],
      });
    },
    onError: () => {
      setError(
        "Failed to delete division. It may be referenced by registrations.",
      );
    },
  });

  const createRegistrationMutation = useMutation({
    mutationFn: ({
      categoryId,
      divisionId,
    }: {
      categoryId: string;
      divisionId: string;
    }) =>
      apiClient.createRegistration(competitionId, { categoryId, divisionId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["competitions", competitionId, "registrations"],
      });
    },
    onError: () => {
      setError("Failed to register. Please try again.");
    },
  });

  const approveRegistrationMutation = useMutation({
    mutationFn: ({
      registrationId,
      categoryId,
      divisionId,
    }: {
      registrationId: string;
      categoryId?: string;
      divisionId?: string;
    }) =>
      apiClient.approveRegistration(competitionId, registrationId, {
        categoryId,
        divisionId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["competitions", competitionId, "registrations"],
      });
    },
    onError: () => {
      setError("Failed to approve registration. Please try again.");
    },
  });

  const rejectRegistrationMutation = useMutation({
    mutationFn: (registrationId: string) =>
      apiClient.rejectRegistration(competitionId, registrationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["competitions", competitionId, "registrations"],
      });
    },
    onError: () => {
      setError("Failed to reject registration. Please try again.");
    },
  });

  const openCompetitionMutation = useMutation({
    mutationFn: () => apiClient.openCompetition(competitionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["competitions"],
      });
    },
    onError: () => {
      setError("Failed to open competition. Please try again.");
    },
  });

  const closeCompetitionMutation = useMutation({
    mutationFn: () => apiClient.closeCompetition(competitionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["competitions"],
      });
    },
    onError: () => {
      setError("Failed to close competition. Please try again.");
    },
  });

  const cancelCompetitionMutation = useMutation({
    mutationFn: () => apiClient.cancelCompetition(competitionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["competitions"],
      });
    },
    onError: () => {
      setError("Failed to cancel competition. Please try again.");
    },
  });

  return (
    <CompetitionDetailScreen
      model={mapToCompetitionDetailPageModel(
        competitionId,
        loaderData.status,
        categories,
        divisions,
        registrations,
      )}
      onCreateCategory={async (label) => {
        await createCategoryMutation.mutateAsync(label);
      }}
      onUpdateCategory={async (id, label) => {
        await updateCategoryMutation.mutateAsync({ id, label });
      }}
      onDeleteCategory={async (id) => {
        await deleteCategoryMutation.mutateAsync(id);
      }}
      onCreateDivision={async (name) => {
        await createDivisionMutation.mutateAsync(name);
      }}
      onUpdateDivision={async (id, name) => {
        await updateDivisionMutation.mutateAsync({ id, name });
      }}
      onDeleteDivision={async (id) => {
        await deleteDivisionMutation.mutateAsync(id);
      }}
      onCreateRegistration={async (categoryId, divisionId) => {
        await createRegistrationMutation.mutateAsync({
          categoryId,
          divisionId,
        });
      }}
      onApproveRegistration={async (registrationId, categoryId, divisionId) => {
        await approveRegistrationMutation.mutateAsync({
          registrationId,
          categoryId,
          divisionId,
        });
      }}
      onRejectRegistration={async (registrationId) => {
        await rejectRegistrationMutation.mutateAsync(registrationId);
      }}
      onOpenCompetition={async () => {
        await openCompetitionMutation.mutateAsync();
      }}
      onCloseCompetition={async () => {
        await closeCompetitionMutation.mutateAsync();
      }}
      onCancelCompetition={async () => {
        await cancelCompetitionMutation.mutateAsync();
      }}
      isCreating={
        createCategoryMutation.isPending || createDivisionMutation.isPending
      }
      isUpdating={
        updateCategoryMutation.isPending || updateDivisionMutation.isPending
      }
      isDeleting={
        deleteCategoryMutation.isPending || deleteDivisionMutation.isPending
      }
      isRegistering={createRegistrationMutation.isPending}
      isReviewing={
        approveRegistrationMutation.isPending ||
        rejectRegistrationMutation.isPending
      }
      isTransitioningStatus={
        openCompetitionMutation.isPending ||
        closeCompetitionMutation.isPending ||
        cancelCompetitionMutation.isPending
      }
      error={error}
      clearError={() => setError(null)}
    />
  );
}

function CompetitionDetailPending() {
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

function CompetitionDetailError({ error }: ErrorComponentProps) {
  const message =
    error instanceof Error
      ? error.message
      : "Unable to load competition detail.";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--secondary)/0.52))] px-6 py-12">
      <InlineAlert className="max-w-2xl bg-white/90" variant="blocked">
        <InlineAlertTitle variant="blocked">
          Competition detail could not be loaded
        </InlineAlertTitle>
        <InlineAlertDescription>{message}</InlineAlertDescription>
      </InlineAlert>
    </main>
  );
}

function AdminCompetitionMatchRouteScreen() {
  const { apiClient, queryClient } =
    adminCompetitionMatchRoute.useRouteContext();
  const { competitionId } = adminCompetitionMatchRoute.useParams();
  const { data: matches } = useSuspenseQuery(
    competitionMatchesQueryOptions(apiClient, competitionId),
  );

  const [error, setError] = useState<string | null>(null);

  const generateMatchesMutation = useMutation({
    mutationFn: () => apiClient.generateMatches(competitionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["competitions", competitionId, "matches"],
      });
    },
    onError: () => {
      setError("Failed to generate matches. Please try again.");
    },
  });

  const scheduleMatchMutation = useMutation({
    mutationFn: ({
      matchId,
      scheduledAt,
    }: { matchId: string; scheduledAt: string }) =>
      apiClient.scheduleMatch(competitionId, matchId, { scheduledAt }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["competitions", competitionId, "matches"],
      });
    },
    onError: () => {
      setError("Failed to schedule match. Please try again.");
    },
  });

  const startMatchMutation = useMutation({
    mutationFn: (matchId: string) =>
      apiClient.startMatch(competitionId, matchId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["competitions", competitionId, "matches"],
      });
    },
    onError: () => {
      setError("Failed to start match. Please try again.");
    },
  });

  const completeMatchMutation = useMutation({
    mutationFn: ({
      matchId,
      scoreA,
      scoreB,
    }: { matchId: string; scoreA: number; scoreB: number }) =>
      apiClient.completeMatch(competitionId, matchId, { scoreA, scoreB }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["competitions", competitionId, "matches"],
      });
    },
    onError: () => {
      setError("Failed to complete match. Please try again.");
    },
  });

  const cancelMatchMutation = useMutation({
    mutationFn: (matchId: string) =>
      apiClient.cancelMatch(competitionId, matchId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["competitions", competitionId, "matches"],
      });
    },
    onError: () => {
      setError("Failed to cancel match. Please try again.");
    },
  });

  return (
    <MatchManagementScreen
      model={mapToMatchManagementViewModel(competitionId, matches)}
      onGenerateMatches={async () => {
        await generateMatchesMutation.mutateAsync();
      }}
      onScheduleMatch={async (matchId, scheduledAt) => {
        await scheduleMatchMutation.mutateAsync({ matchId, scheduledAt });
      }}
      onStartMatch={async (matchId) => {
        await startMatchMutation.mutateAsync(matchId);
      }}
      onCompleteMatch={async (matchId, scoreA, scoreB) => {
        await completeMatchMutation.mutateAsync({ matchId, scoreA, scoreB });
      }}
      onCancelMatch={async (matchId) => {
        await cancelMatchMutation.mutateAsync(matchId);
      }}
      isGenerating={generateMatchesMutation.isPending}
      isScheduling={scheduleMatchMutation.isPending}
      isStarting={startMatchMutation.isPending}
      isCompleting={completeMatchMutation.isPending}
      isCancelling={cancelMatchMutation.isPending}
      error={error}
      clearError={() => setError(null)}
    />
  );
}

function AdminCompetitionMatchPending() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-96" />
      <Skeleton className="h-80 w-full rounded-[1.5rem]" />
    </div>
  );
}

function AdminCompetitionMatchError({ error }: ErrorComponentProps) {
  const message =
    error instanceof Error ? error.message : "Unable to load matches.";

  return (
    <InlineAlert className="max-w-2xl bg-white/90" variant="blocked">
      <InlineAlertTitle variant="blocked">
        Matches could not be loaded
      </InlineAlertTitle>
      <InlineAlertDescription>{message}</InlineAlertDescription>
    </InlineAlert>
  );
}

export function createWebRouter({
  apiClient,
  history = createBrowserHistory(),
  queryClient,
}: WebRouterContext & {
  history?: RouterHistory;
}) {
  return createRouter({
    context: {
      apiClient,
      queryClient,
    },
    history,
    routeTree,
    scrollRestoration: true,
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: AnyRouter;
  }
}
