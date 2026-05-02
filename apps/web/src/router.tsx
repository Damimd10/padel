import type { PadelApiClient } from "@padel/api-client";
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
import { type QueryClient, useSuspenseQuery } from "@tanstack/react-query";
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
    const isAuthenticated = selectIsAuthenticated(useAuthStore.getState());
    if (!isAuthenticated) {
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

const routeTree = rootRoute.addChildren([
  signInRoute,
  signUpRoute,
  forgetPasswordRoute,
  resetPasswordRoute,
  authenticatedRoute.addChildren([competitionOperationsRoute]),
]);

function RootLayout() {
  return <Outlet />;
}

function AuthenticatedLayout() {
  return <Outlet />;
}

function SignInScreen() {
  const navigate = useNavigate();
  const apiClient = signInRoute.useRouteContext().apiClient;
  const { signIn, error, isLoading, clearError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    clearError();
    try {
      await signIn(apiClient, email, password);
      await navigate({ to: "/competitions/operations" });
    } catch {
      // Error is captured in store
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--secondary)/0.44))] px-6 py-12">
      <Card className="w-full max-w-md bg-white/90">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Enter your email and password to access your account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <InlineAlert variant="blocked">
                <InlineAlertTitle>Authentication failed</InlineAlertTitle>
                <InlineAlertDescription>{error}</InlineAlertDescription>
              </InlineAlert>
            )}
            <Field
              id="sign-in-email"
              label="Email"
              required
              error={
                email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                  ? "Enter a valid email address."
                  : undefined
              }
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </Field>
            <Field id="sign-in-password" label="Password" required>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </Field>
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    clearError();
    try {
      await signUp(apiClient, name, email, password);
      await navigate({ to: "/competitions/operations" });
    } catch {
      // Error is captured in store
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--secondary)/0.44))] px-6 py-12">
      <Card className="w-full max-w-md bg-white/90">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Enter your details to get started.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <InlineAlert variant="blocked">
                <InlineAlertTitle>Registration failed</InlineAlertTitle>
                <InlineAlertDescription>{error}</InlineAlertDescription>
              </InlineAlert>
            )}
            <Field id="sign-up-name" label="Name" required>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </Field>
            <Field
              id="sign-up-email"
              label="Email"
              required
              error={
                email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                  ? "Enter a valid email address."
                  : undefined
              }
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </Field>
            <Field
              id="sign-up-password"
              label="Password"
              required
              description="At least 8 characters."
            >
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </Field>
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
  const navigate = useNavigate();
  const apiClient = forgetPasswordRoute.useRouteContext().apiClient;
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await apiClient.forgetPassword({ email });
      setIsSubmitted(true);
    } catch {
      setError("Unable to send reset link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

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
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <InlineAlert variant="blocked">
                <InlineAlertDescription>{error}</InlineAlertDescription>
              </InlineAlert>
            )}
            <Field id="forget-password-email" label="Email" required>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </Field>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send reset link"}
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
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!token) {
      setError("Invalid reset link.");
      return;
    }
    setIsSubmitting(true);
    try {
      await apiClient.resetPassword({ newPassword, token });
      setIsSubmitted(true);
    } catch {
      setError("Unable to reset password. The link may have expired.");
    } finally {
      setIsSubmitting(false);
    }
  }

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

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--secondary)/0.44))] px-6 py-12">
      <Card className="w-full max-w-md bg-white/90">
        <CardHeader>
          <CardTitle>Set new password</CardTitle>
          <CardDescription>
            Enter a new password for your account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <InlineAlert variant="blocked">
                <InlineAlertDescription>{error}</InlineAlertDescription>
              </InlineAlert>
            )}
            <Field
              id="reset-password-new"
              label="New password"
              required
              description="At least 8 characters."
            >
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </Field>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Resetting..." : "Reset password"}
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
