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
import {
  competitionCategoriesQueryOptions,
  ensureCompetitionCategories,
} from "./features/competition-detail/competition-categories-query.js";
import { CompetitionDetailScreen } from "./features/competition-detail/competition-detail-screen.js";
import { mapToCompetitionDetailPageModel } from "./features/competition-detail/competition-detail-view-model.js";
import { CompetitionOperationsScreen } from "./features/competition-operations/competition-operations-screen.js";
import { competitionOverviewQueryOptions } from "./features/competition-operations/competition-overview-query.js";
import { mapCompetitionOverviewToPageModel } from "./features/competition-operations/competition-overview-view-model.js";
import {
  selectAuthIsLoading,
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
  loader: ({ params, context }) =>
    ensureCompetitionCategories(
      context.queryClient,
      context.apiClient,
      params.competitionId,
    ),
  pendingComponent: CompetitionDetailPending,
  pendingMs: 0,
  errorComponent: CompetitionDetailError,
  component: CompetitionDetailRouteScreen,
});

const routeTree = rootRoute.addChildren([
  signInRoute,
  signUpRoute,
  forgetPasswordRoute,
  resetPasswordRoute,
  authenticatedRoute.addChildren([
    competitionOperationsRoute,
    competitionDetailRoute,
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

function CompetitionDetailRouteScreen() {
  const { apiClient, queryClient } = competitionDetailRoute.useRouteContext();
  const { competitionId } = competitionDetailRoute.useParams();
  const { data } = useSuspenseQuery(
    competitionCategoriesQueryOptions(apiClient, competitionId),
  );

  const [error, setError] = useState<string | null>(null);

  const createMutation = useMutation({
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

  const updateMutation = useMutation({
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

  const deleteMutation = useMutation({
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

  return (
    <CompetitionDetailScreen
      model={mapToCompetitionDetailPageModel(competitionId, data)}
      onCreateCategory={async (label) => {
        await createMutation.mutateAsync(label);
      }}
      onUpdateCategory={async (id, label) => {
        await updateMutation.mutateAsync({ id, label });
      }}
      onDeleteCategory={async (id) => {
        await deleteMutation.mutateAsync(id);
      }}
      isCreating={createMutation.isPending}
      isUpdating={updateMutation.isPending}
      isDeleting={deleteMutation.isPending}
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
