import {
  type SignInEmailRequest,
  type SignUpEmailRequest,
  signInEmailRequestSchema,
  signUpEmailRequestSchema,
} from "@padel/schemas";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  InlineAlert,
  InlineAlertDescription,
  InlineAlertTitle,
  Input,
} from "@padel/ui";
import { useForm } from "@tanstack/react-form";
import { type QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  Link,
  Outlet,
  type RouterHistory,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { startTransition, useState } from "react";

import type { PadelApiClient } from "@padel/api-client";

import {
  authFlashMessageQueryKey,
  buildFieldErrorMap,
  clearFieldError,
  getAuthErrorMessage,
  getSessionQueryOptions,
  refreshSession,
} from "./auth.js";

export interface AppRouterContext {
  apiClient: PadelApiClient;
  queryClient: QueryClient;
}

function AuthFrame({
  children,
  eyebrow,
  title,
  description,
}: {
  children: React.ReactNode;
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.12),_transparent_40%),linear-gradient(180deg,_hsl(var(--background)),_#f8fafc)] px-6 py-12 text-foreground">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="flex flex-col justify-center gap-6">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">
              {eyebrow}
            </p>
            <div className="space-y-4">
              <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                {title}
              </h1>
              <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                {description}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="rounded-full border border-border/80 bg-background/80 px-3 py-1.5">
                TanStack Router entry guards
              </span>
              <span className="rounded-full border border-border/80 bg-background/80 px-3 py-1.5">
                TanStack Form ownership
              </span>
              <span className="rounded-full border border-border/80 bg-background/80 px-3 py-1.5">
                Better Auth session contracts
              </span>
            </div>
          </section>

          <section>{children}</section>
        </div>
      </div>
    </main>
  );
}

function AuthLayout() {
  return <Outlet />;
}

function readRouterContext() {
  const router = useRouter();
  return router.options.context;
}

function LoginPage() {
  const navigate = useNavigate();
  const { apiClient, queryClient } = readRouterContext();
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof SignInEmailRequest, string>>
  >({});
  const [formError, setFormError] = useState<string | null>(null);

  const signInMutation = useMutation({
    mutationFn: (values: SignInEmailRequest) => apiClient.signIn(values),
    onError: (error) => {
      setFormError(
        getAuthErrorMessage(
          error,
          "We could not sign you in. Please try again.",
        ),
      );
    },
    onSuccess: async () => {
      queryClient.setQueryData(
        authFlashMessageQueryKey,
        "Signed in successfully. Your authenticated workspace is ready.",
      );
      await refreshSession(queryClient, apiClient);
      startTransition(() => {
        void navigate({ to: "/dashboard" });
      });
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } satisfies SignInEmailRequest,
    onSubmit: async ({ value }) => {
      const parsed = signInEmailRequestSchema.safeParse(value);

      if (!parsed.success) {
        setFieldErrors(
          buildFieldErrorMap<SignInEmailRequest>(parsed.error.issues),
        );
        setFormError("Please correct the highlighted fields and try again.");
        return;
      }

      setFieldErrors({});
      setFormError(null);

      try {
        await signInMutation.mutateAsync(parsed.data);
      } catch {
        return;
      }
    },
  });

  return (
    <AuthFrame
      description="Sign in with the Better Auth session flow already owned by the backend so admin and operator routes can enforce a real identity boundary."
      eyebrow="Authentication"
      title="Welcome back to your competition workspace."
    >
      <Card className="border-border/80 bg-background/95 shadow-xl shadow-slate-950/5 backdrop-blur">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Use the account you created for competition operations.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {formError ? (
            <InlineAlert variant="blocked">
              <InlineAlertTitle variant="blocked">
                Sign-in could not continue
              </InlineAlertTitle>
              <InlineAlertDescription>{formError}</InlineAlertDescription>
            </InlineAlert>
          ) : null}

          <form
            className="grid gap-5"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <form.Field name="email">
              {(field) => (
                <Field
                  description="Use the email address tied to your organizer account."
                  error={fieldErrors.email}
                  label="Email"
                  required
                >
                  <Input
                    autoComplete="email"
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      setFieldErrors((current) =>
                        clearFieldError(current, "email"),
                      );
                      setFormError(null);
                      field.handleChange(event.target.value);
                    }}
                    placeholder="organizer@example.com"
                    type="email"
                    value={field.state.value}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <Field
                  description="Passwords stay at the backend auth boundary."
                  error={fieldErrors.password}
                  label="Password"
                  required
                >
                  <Input
                    autoComplete="current-password"
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      setFieldErrors((current) =>
                        clearFieldError(current, "password"),
                      );
                      setFormError(null);
                      field.handleChange(event.target.value);
                    }}
                    placeholder="Enter your password"
                    type="password"
                    value={field.state.value}
                  />
                </Field>
              )}
            </form.Field>

            <div className="grid gap-3 pt-1">
              <Button disabled={signInMutation.isPending} type="submit">
                {signInMutation.isPending ? "Signing in..." : "Sign in"}
              </Button>
              <p className="text-sm leading-6 text-muted-foreground">
                Need an account?{" "}
                <Link
                  className="font-medium text-primary underline-offset-4 hover:underline"
                  to="/register"
                >
                  Create one here
                </Link>
                .
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthFrame>
  );
}

function RegisterPage() {
  const navigate = useNavigate();
  const { apiClient, queryClient } = readRouterContext();
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof SignUpEmailRequest, string>>
  >({});
  const [formError, setFormError] = useState<string | null>(null);

  const signUpMutation = useMutation({
    mutationFn: (values: SignUpEmailRequest) => apiClient.signUp(values),
    onError: (error) => {
      setFormError(
        getAuthErrorMessage(
          error,
          "We could not create your account. Please review the details and try again.",
        ),
      );
    },
    onSuccess: async () => {
      queryClient.setQueryData(
        authFlashMessageQueryKey,
        "Account created successfully. Your authenticated dashboard is ready.",
      );
      await refreshSession(queryClient, apiClient);
      startTransition(() => {
        void navigate({ to: "/dashboard" });
      });
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
    } satisfies SignUpEmailRequest,
    onSubmit: async ({ value }) => {
      const parsed = signUpEmailRequestSchema.safeParse(value);

      if (!parsed.success) {
        setFieldErrors(
          buildFieldErrorMap<SignUpEmailRequest>(parsed.error.issues),
        );
        setFormError("Please correct the highlighted fields and try again.");
        return;
      }

      setFieldErrors({});
      setFormError(null);

      try {
        await signUpMutation.mutateAsync(parsed.data);
      } catch {
        return;
      }
    },
  });

  return (
    <AuthFrame
      description="Create the first user-facing auth entry point on top of the backend-owned Better Auth contracts and land new organizers directly into an authenticated shell."
      eyebrow="Self-service access"
      title="Create an organizer account without leaving the product flow."
    >
      <Card className="border-border/80 bg-background/95 shadow-xl shadow-slate-950/5 backdrop-blur">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Start with a simple email and password account for competition
            administration.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {formError ? (
            <InlineAlert variant="blocked">
              <InlineAlertTitle variant="blocked">
                Registration could not continue
              </InlineAlertTitle>
              <InlineAlertDescription>{formError}</InlineAlertDescription>
            </InlineAlert>
          ) : null}

          <form
            className="grid gap-5"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <form.Field name="name">
              {(field) => (
                <Field
                  description="Shown as the owner context on authenticated operational screens."
                  error={fieldErrors.name}
                  label="Full name"
                  required
                >
                  <Input
                    autoComplete="name"
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      setFieldErrors((current) =>
                        clearFieldError(current, "name"),
                      );
                      setFormError(null);
                      field.handleChange(event.target.value);
                    }}
                    placeholder="Padel Organizer"
                    value={field.state.value}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="email">
              {(field) => (
                <Field
                  description="This becomes your sign-in identifier."
                  error={fieldErrors.email}
                  label="Email"
                  required
                >
                  <Input
                    autoComplete="email"
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      setFieldErrors((current) =>
                        clearFieldError(current, "email"),
                      );
                      setFormError(null);
                      field.handleChange(event.target.value);
                    }}
                    placeholder="organizer@example.com"
                    type="email"
                    value={field.state.value}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <Field
                  description="Use at least eight characters for the initial credential flow."
                  error={fieldErrors.password}
                  label="Password"
                  required
                >
                  <Input
                    autoComplete="new-password"
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      setFieldErrors((current) =>
                        clearFieldError(current, "password"),
                      );
                      setFormError(null);
                      field.handleChange(event.target.value);
                    }}
                    placeholder="Create a strong password"
                    type="password"
                    value={field.state.value}
                  />
                </Field>
              )}
            </form.Field>

            <div className="grid gap-3 pt-1">
              <Button disabled={signUpMutation.isPending} type="submit">
                {signUpMutation.isPending
                  ? "Creating account..."
                  : "Create account"}
              </Button>
              <p className="text-sm leading-6 text-muted-foreground">
                Already have an account?{" "}
                <Link
                  className="font-medium text-primary underline-offset-4 hover:underline"
                  to="/login"
                >
                  Sign in instead
                </Link>
                .
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthFrame>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const { apiClient, queryClient } = readRouterContext();
  const sessionQuery = useQuery(getSessionQueryOptions(apiClient));
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const signOutMutation = useMutation({
    mutationFn: () => apiClient.signOut(),
    onError: (error) => {
      setSignOutError(
        getAuthErrorMessage(
          error,
          "We could not end the session right now. Please try again.",
        ),
      );
    },
    onSuccess: async () => {
      setSignOutError(null);
      queryClient.setQueryData(
        getSessionQueryOptions(apiClient).queryKey,
        null,
      );
      queryClient.removeQueries({
        exact: true,
        queryKey: authFlashMessageQueryKey,
      });
      startTransition(() => {
        void navigate({ to: "/login" });
      });
    },
  });

  const flashMessage = queryClient.getQueryData(authFlashMessageQueryKey) as
    | string
    | undefined;
  const currentSession = sessionQuery.data;

  if (!currentSession) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_rgba(14,165,233,0.08),_transparent_18%),linear-gradient(180deg,_#f8fafc,_hsl(var(--background)))] px-6 py-12 text-foreground">
      <div className="mx-auto grid max-w-5xl gap-6">
        {flashMessage ? (
          <InlineAlert variant="success">
            <InlineAlertTitle variant="success">
              Authenticated session established
            </InlineAlertTitle>
            <InlineAlertDescription>{flashMessage}</InlineAlertDescription>
          </InlineAlert>
        ) : null}

        {signOutError ? (
          <InlineAlert variant="blocked">
            <InlineAlertTitle variant="blocked">
              Sign-out could not complete
            </InlineAlertTitle>
            <InlineAlertDescription>{signOutError}</InlineAlertDescription>
          </InlineAlert>
        ) : null}

        <Card className="border-border/80 bg-background/95 shadow-xl shadow-slate-950/5">
          <CardHeader className="gap-3">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              Authenticated workspace
            </p>
            <CardTitle className="text-3xl">
              Welcome, {currentSession.user.name}.
            </CardTitle>
            <CardDescription className="max-w-2xl text-base leading-7">
              You are now inside the first post-login landing surface for the
              product. This route confirms the guest-only entry screens are
              behind you and the Better Auth session is active for future
              protected workflows.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-3 rounded-2xl border border-border/80 bg-slate-50/80 p-5 text-sm">
              <p>
                <span className="font-medium">Signed in as:</span>{" "}
                {currentSession.user.email}
              </p>
              <p>
                <span className="font-medium">Session expires:</span>{" "}
                {new Date(currentSession.session.expiresAt).toLocaleString()}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                disabled={signOutMutation.isPending}
                onClick={() => {
                  void signOutMutation.mutateAsync();
                }}
              >
                {signOutMutation.isPending ? "Signing out..." : "Sign out"}
              </Button>
              <Button asChild variant="outline">
                <Link to="/login">Return to sign-in</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

const rootRoute = createRootRouteWithContext<AppRouterContext>()({
  component: AuthLayout,
});

const indexRoute = createRoute({
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData(
      getSessionQueryOptions(context.apiClient),
    );

    throw redirect({
      to: session ? "/dashboard" : "/login",
    });
  },
  getParentRoute: () => rootRoute,
  path: "/",
});

const loginRoute = createRoute({
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData(
      getSessionQueryOptions(context.apiClient),
    );

    if (session) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
  component: LoginPage,
  getParentRoute: () => rootRoute,
  path: "/login",
});

const registerRoute = createRoute({
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData(
      getSessionQueryOptions(context.apiClient),
    );

    if (session) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
  component: RegisterPage,
  getParentRoute: () => rootRoute,
  path: "/register",
});

const dashboardRoute = createRoute({
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData(
      getSessionQueryOptions(context.apiClient),
    );

    if (!session) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: DashboardPage,
  getParentRoute: () => rootRoute,
  path: "/dashboard",
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  dashboardRoute,
]);

export function createAppRouter(
  context: AppRouterContext,
  options?: {
    history?: RouterHistory;
  },
) {
  return createRouter({
    context,
    defaultPendingMs: 0,
    routeTree,
    ...(options?.history ? { history: options.history } : {}),
  });
}

export type AppRouter = ReturnType<typeof createAppRouter>;
