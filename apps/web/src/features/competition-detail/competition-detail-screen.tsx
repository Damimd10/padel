import {
  createCategoryRequestSchema,
  createDivisionRequestSchema,
  createRegistrationRequestSchema,
  reviewRegistrationRequestSchema,
  updateCategoryRequestSchema,
  updateDivisionRequestSchema,
} from "@padel/schemas";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateEyebrow,
  EmptyStateTitle,
  Field,
  InlineAlert,
  InlineAlertDescription,
  InlineAlertTitle,
  Input,
  Select,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableEmptyState,
  TableHead,
  TableHeader,
  TableRow,
} from "@padel/ui";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import type { CompetitionDetailPageViewModel } from "./competition-detail-view-model.js";

interface CompetitionDetailScreenProps {
  model: CompetitionDetailPageViewModel;
  onCreateCategory: (label: string) => Promise<void>;
  onUpdateCategory: (id: string, label: string) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onCreateDivision: (name: string) => Promise<void>;
  onUpdateDivision: (id: string, name: string) => Promise<void>;
  onDeleteDivision: (id: string) => Promise<void>;
  onCreateRegistration: (
    categoryId: string,
    divisionId: string,
  ) => Promise<void>;
  onApproveRegistration: (
    registrationId: string,
    categoryId?: string,
    divisionId?: string,
  ) => Promise<void>;
  onRejectRegistration: (registrationId: string) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isRegistering: boolean;
  isReviewing: boolean;
  error: string | null;
  clearError: () => void;
}

export function CompetitionDetailScreen({
  model,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  onCreateDivision,
  onUpdateDivision,
  onDeleteDivision,
  onCreateRegistration,
  onApproveRegistration,
  onRejectRegistration,
  isCreating,
  isUpdating,
  isDeleting,
  isRegistering,
  isReviewing,
  error,
  clearError,
}: CompetitionDetailScreenProps) {
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);
  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const [deleteCategoryOpen, setDeleteCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<{
    id: string;
    label: string;
  } | null>(null);

  const [createDivisionOpen, setCreateDivisionOpen] = useState(false);
  const [editDivisionOpen, setEditDivisionOpen] = useState(false);
  const [deleteDivisionOpen, setDeleteDivisionOpen] = useState(false);
  const [editingDivision, setEditingDivision] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deletingDivision, setDeletingDivision] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [registerOpen, setRegisterOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [approvingRegistration, setApprovingRegistration] = useState<{
    id: string;
    categoryId: string;
    divisionId: string;
  } | null>(null);
  const [rejectingRegistration, setRejectingRegistration] = useState<{
    id: string;
  } | null>(null);

  const createCategoryForm = useForm({
    defaultValues: { label: "" },
    validators: {
      onChange: createCategoryRequestSchema,
      onBlur: createCategoryRequestSchema,
      onSubmit: createCategoryRequestSchema,
    },
    onSubmit: async ({ value }) => {
      await onCreateCategory(value.label.trim());
      setCreateCategoryOpen(false);
    },
  });

  const editCategoryForm = useForm({
    defaultValues: { label: "" },
    validators: {
      onChange: updateCategoryRequestSchema,
      onBlur: updateCategoryRequestSchema,
      onSubmit: updateCategoryRequestSchema,
    },
    onSubmit: async ({ value }) => {
      if (!editingCategory) return;
      await onUpdateCategory(editingCategory.id, value.label.trim());
      setEditCategoryOpen(false);
    },
  });

  const createDivisionForm = useForm({
    defaultValues: { name: "" },
    validators: {
      onChange: createDivisionRequestSchema,
      onBlur: createDivisionRequestSchema,
      onSubmit: createDivisionRequestSchema,
    },
    onSubmit: async ({ value }) => {
      await onCreateDivision(value.name.trim());
      setCreateDivisionOpen(false);
    },
  });

  const editDivisionForm = useForm({
    defaultValues: { name: "" },
    validators: {
      onChange: updateDivisionRequestSchema,
      onBlur: updateDivisionRequestSchema,
      onSubmit: updateDivisionRequestSchema,
    },
    onSubmit: async ({ value }) => {
      if (!editingDivision) return;
      await onUpdateDivision(editingDivision.id, value.name.trim());
      setEditDivisionOpen(false);
    },
  });

  const registrationForm = useForm({
    defaultValues: { categoryId: "", divisionId: "" },
    validators: {
      onChange: createRegistrationRequestSchema,
      onBlur: createRegistrationRequestSchema,
      onSubmit: createRegistrationRequestSchema,
    },
    onSubmit: async ({ value }) => {
      await onCreateRegistration(value.categoryId, value.divisionId);
      setRegisterOpen(false);
    },
  });

  const approveForm = useForm({
    defaultValues: { categoryId: "", divisionId: "" },
    onSubmit: async ({ value }) => {
      if (!approvingRegistration) return;
      await onApproveRegistration(
        approvingRegistration.id,
        value.categoryId || undefined,
        value.divisionId || undefined,
      );
      setApproveOpen(false);
    },
  });

  function handleCreateCategoryOpenChange(open: boolean) {
    setCreateCategoryOpen(open);
    if (open) {
      clearError();
      createCategoryForm.reset();
    }
  }

  function handleEditCategoryOpenChange(open: boolean) {
    setEditCategoryOpen(open);
    if (!open) {
      setEditingCategory(null);
      editCategoryForm.reset();
    }
  }

  function openEditCategory(category: { id: string; label: string }) {
    setEditingCategory(category);
    editCategoryForm.reset();
    editCategoryForm.setFieldValue("label", category.label);
    setEditCategoryOpen(true);
    clearError();
  }

  function openDeleteCategory(category: { id: string; label: string }) {
    setDeletingCategory(category);
    setDeleteCategoryOpen(true);
    clearError();
  }

  function handleDeleteCategoryConfirm() {
    if (!deletingCategory) return;
    onDeleteCategory(deletingCategory.id).then(() => {
      setDeletingCategory(null);
      setDeleteCategoryOpen(false);
    });
  }

  function handleDeleteCategoryOpenChange(open: boolean) {
    setDeleteCategoryOpen(open);
    if (!open) {
      setDeletingCategory(null);
    }
  }

  function handleCreateDivisionOpenChange(open: boolean) {
    setCreateDivisionOpen(open);
    if (open) {
      clearError();
      createDivisionForm.reset();
    }
  }

  function handleEditDivisionOpenChange(open: boolean) {
    setEditDivisionOpen(open);
    if (!open) {
      setEditingDivision(null);
      editDivisionForm.reset();
    }
  }

  function openEditDivision(division: { id: string; name: string }) {
    setEditingDivision(division);
    editDivisionForm.reset();
    editDivisionForm.setFieldValue("name", division.name);
    setEditDivisionOpen(true);
    clearError();
  }

  function openDeleteDivision(division: { id: string; name: string }) {
    setDeletingDivision(division);
    setDeleteDivisionOpen(true);
    clearError();
  }

  function handleDeleteDivisionConfirm() {
    if (!deletingDivision) return;
    onDeleteDivision(deletingDivision.id).then(() => {
      setDeletingDivision(null);
      setDeleteDivisionOpen(false);
    });
  }

  function handleDeleteDivisionOpenChange(open: boolean) {
    setDeleteDivisionOpen(open);
    if (!open) {
      setDeletingDivision(null);
    }
  }

  function handleRegisterOpenChange(open: boolean) {
    setRegisterOpen(open);
    if (open) {
      clearError();
      registrationForm.reset();
    }
  }

  function openApprove(registration: {
    id: string;
    categoryId: string;
    divisionId: string;
  }) {
    setApprovingRegistration(registration);
    approveForm.reset();
    approveForm.setFieldValue("categoryId", registration.categoryId);
    approveForm.setFieldValue("divisionId", registration.divisionId);
    setApproveOpen(true);
    clearError();
  }

  function openReject(registration: { id: string }) {
    setRejectingRegistration(registration);
    setRejectOpen(true);
    clearError();
  }

  function handleRejectConfirm() {
    if (!rejectingRegistration) return;
    onRejectRegistration(rejectingRegistration.id).then(() => {
      setRejectingRegistration(null);
      setRejectOpen(false);
    });
  }

  function handleRejectOpenChange(open: boolean) {
    setRejectOpen(open);
    if (!open) {
      setRejectingRegistration(null);
    }
  }

  function getStatusBadge(status: string) {
    const variantMap: Record<string, "default" | "secondary" | "outline"> = {
      pending_review: "default",
      approved: "default",
      rejected: "secondary",
      withdrawn: "outline",
      registered: "outline",
    };
    const labelMap: Record<string, string> = {
      pending_review: "Pending Review",
      approved: "Approved",
      rejected: "Rejected",
      withdrawn: "Withdrawn",
      registered: "Registered",
    };
    return (
      <Badge variant={variantMap[status] ?? "default"}>
        {labelMap[status] ?? status}
      </Badge>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_hsla(var(--accent)/0.75),_transparent_38%),linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--secondary)/0.52))] px-4 py-8 text-foreground sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-[linear-gradient(135deg,_rgba(255,255,255,0.9),_rgba(231,242,236,0.95))] p-6 shadow-[0_20px_80px_rgba(33,72,53,0.08)] sm:p-8">
          <div className="space-y-4">
            <p className="font-mono text-xs uppercase tracking-[0.34em] text-muted-foreground">
              Competition detail
            </p>
            <h1 className="max-w-3xl font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
              Manage competition structure
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Configure categories and divisions, manage registrations, and
              review participant submissions.
            </p>
          </div>
        </section>

        {error && (
          <InlineAlert variant="blocked">
            <InlineAlertTitle variant="blocked">
              Operation failed
            </InlineAlertTitle>
            <InlineAlertDescription>{error}</InlineAlertDescription>
          </InlineAlert>
        )}

        {/* Registration Section */}
        <Card className="bg-white/90">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle>Register for Competition</CardTitle>
              <CardDescription>
                Submit your registration to participate in this competition.
              </CardDescription>
            </div>
            <Dialog open={registerOpen} onOpenChange={handleRegisterOpenChange}>
              <DialogTrigger asChild>
                <Button size="sm">Register</Button>
              </DialogTrigger>
              <DialogContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    registrationForm.handleSubmit();
                  }}
                >
                  <DialogHeader>
                    <DialogTitle>Register for competition</DialogTitle>
                    <DialogDescription>
                      Select your category and division to register.
                    </DialogDescription>
                  </DialogHeader>
                  <CardContent className="space-y-4 pt-4">
                    <registrationForm.Field name="categoryId">
                      {(field) => (
                        <Field
                          id="registration-category"
                          label="Category"
                          required
                          error={getFieldError(field.state.meta.errors)}
                        >
                          <Select
                            value={field.state.value}
                            onValueChange={(value) =>
                              field.handleChange(value ?? "")
                            }
                          >
                            <option value="">Select a category</option>
                            {model.categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.label}
                              </option>
                            ))}
                          </Select>
                        </Field>
                      )}
                    </registrationForm.Field>
                    <registrationForm.Field name="divisionId">
                      {(field) => (
                        <Field
                          id="registration-division"
                          label="Division"
                          required
                          error={getFieldError(field.state.meta.errors)}
                        >
                          <Select
                            value={field.state.value}
                            onValueChange={(value) =>
                              field.handleChange(value ?? "")
                            }
                          >
                            <option value="">Select a division</option>
                            {model.divisions.map((div) => (
                              <option key={div.id} value={div.id}>
                                {div.name}
                              </option>
                            ))}
                          </Select>
                        </Field>
                      )}
                    </registrationForm.Field>
                  </CardContent>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isRegistering}>
                      {isRegistering ? "Registering..." : "Register"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
        </Card>

        {/* Pending Registrations Review */}
        {model.hasPendingRegistrations && (
          <Card className="bg-white/90">
            <CardHeader>
              <CardTitle>Pending Registrations</CardTitle>
              <CardDescription>
                Review and approve or reject pending registrations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHeader>
                    <tr>
                      <TableHead scope="col">Participant</TableHead>
                      <TableHead scope="col">Category</TableHead>
                      <TableHead scope="col">Division</TableHead>
                      <TableHead scope="col">Status</TableHead>
                      <TableHead scope="col" className="w-48">
                        Actions
                      </TableHead>
                    </tr>
                  </TableHeader>
                  <TableBody>
                    {model.pendingRegistrations.map((reg) => (
                      <TableRow key={reg.id} state={reg.rowState}>
                        <TableCell>
                          <p className="font-medium">
                            {reg.participantId.slice(0, 8)}...
                          </p>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {model.categories.find((c) => c.id === reg.categoryId)
                            ?.label ?? "Unknown"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {model.divisions.find((d) => d.id === reg.divisionId)
                            ?.name ?? "Unknown"}
                        </TableCell>
                        <TableCell>{getStatusBadge(reg.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                openApprove({
                                  id: reg.id,
                                  categoryId: reg.categoryId,
                                  divisionId: reg.divisionId,
                                })
                              }
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openReject({ id: reg.id })}
                            >
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* Categories Section */}
        <Card className="bg-white/90">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle>Categories</CardTitle>
              <CardDescription>
                Define the skill or format categories for this competition.
              </CardDescription>
            </div>
            <Dialog
              open={createCategoryOpen}
              onOpenChange={handleCreateCategoryOpenChange}
            >
              <DialogTrigger asChild>
                <Button size="sm">Add category</Button>
              </DialogTrigger>
              <DialogContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    createCategoryForm.handleSubmit();
                  }}
                >
                  <DialogHeader>
                    <DialogTitle>Create category</DialogTitle>
                    <DialogDescription>
                      Add a new category for participants to register under.
                    </DialogDescription>
                  </DialogHeader>
                  <CardContent className="pt-4">
                    <createCategoryForm.Field name="label">
                      {(field) => (
                        <Field
                          id="new-category-label"
                          label="Label"
                          required
                          error={getFieldError(field.state.meta.errors)}
                        >
                          <Input
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="e.g. Advanced, Intermediate, Beginner"
                            autoFocus
                          />
                        </Field>
                      )}
                    </createCategoryForm.Field>
                  </CardContent>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isCreating}>
                      {isCreating ? "Creating..." : "Create"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {!model.hasCategories ? (
              <EmptyState variant="info">
                <EmptyStateEyebrow>Categories</EmptyStateEyebrow>
                <EmptyStateTitle>No categories yet</EmptyStateTitle>
                <EmptyStateDescription>
                  Add your first category to start structuring the competition.
                </EmptyStateDescription>
                <EmptyStateActions>
                  <Dialog
                    open={createCategoryOpen}
                    onOpenChange={handleCreateCategoryOpenChange}
                  >
                    <DialogTrigger asChild>
                      <Button>Add category</Button>
                    </DialogTrigger>
                  </Dialog>
                </EmptyStateActions>
              </EmptyState>
            ) : (
              <TableContainer>
                <Table>
                  <TableHeader>
                    <tr>
                      <TableHead scope="col">Label</TableHead>
                      <TableHead scope="col">Created</TableHead>
                      <TableHead scope="col">Updated</TableHead>
                      <TableHead scope="col" className="w-40">
                        Actions
                      </TableHead>
                    </tr>
                  </TableHeader>
                  <TableBody>
                    {model.categories.map((category) => (
                      <TableRow key={category.id} state={category.rowState}>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{category.label}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(category.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(category.updatedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                openEditCategory({
                                  id: category.id,
                                  label: category.label,
                                })
                              }
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                openDeleteCategory({
                                  id: category.id,
                                  label: category.label,
                                })
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableCaption>
                    Categories define the participant grouping for this
                    competition.
                  </TableCaption>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Divisions Section */}
        <Card className="bg-white/90">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle>Divisions</CardTitle>
              <CardDescription>
                Define the divisions (e.g., Men, Women, Mixed) for this
                competition.
              </CardDescription>
            </div>
            <Dialog
              open={createDivisionOpen}
              onOpenChange={handleCreateDivisionOpenChange}
            >
              <DialogTrigger asChild>
                <Button size="sm">Add division</Button>
              </DialogTrigger>
              <DialogContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    createDivisionForm.handleSubmit();
                  }}
                >
                  <DialogHeader>
                    <DialogTitle>Create division</DialogTitle>
                    <DialogDescription>
                      Add a new division for participants to register under.
                    </DialogDescription>
                  </DialogHeader>
                  <CardContent className="pt-4">
                    <createDivisionForm.Field name="name">
                      {(field) => (
                        <Field
                          id="new-division-name"
                          label="Name"
                          required
                          error={getFieldError(field.state.meta.errors)}
                        >
                          <Input
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="e.g. Men, Women, Mixed"
                            autoFocus
                          />
                        </Field>
                      )}
                    </createDivisionForm.Field>
                  </CardContent>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isCreating}>
                      {isCreating ? "Creating..." : "Create"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {!model.hasDivisions ? (
              <EmptyState variant="info">
                <EmptyStateEyebrow>Divisions</EmptyStateEyebrow>
                <EmptyStateTitle>No divisions yet</EmptyStateTitle>
                <EmptyStateDescription>
                  Add your first division to start structuring the competition.
                </EmptyStateDescription>
                <EmptyStateActions>
                  <Dialog
                    open={createDivisionOpen}
                    onOpenChange={handleCreateDivisionOpenChange}
                  >
                    <DialogTrigger asChild>
                      <Button>Add division</Button>
                    </DialogTrigger>
                  </Dialog>
                </EmptyStateActions>
              </EmptyState>
            ) : (
              <TableContainer>
                <Table>
                  <TableHeader>
                    <tr>
                      <TableHead scope="col">Name</TableHead>
                      <TableHead scope="col">Created</TableHead>
                      <TableHead scope="col">Updated</TableHead>
                      <TableHead scope="col" className="w-40">
                        Actions
                      </TableHead>
                    </tr>
                  </TableHeader>
                  <TableBody>
                    {model.divisions.map((division) => (
                      <TableRow key={division.id} state={division.rowState}>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{division.name}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(division.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(division.updatedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                openEditDivision({
                                  id: division.id,
                                  name: division.name,
                                })
                              }
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                openDeleteDivision({
                                  id: division.id,
                                  name: division.name,
                                })
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableCaption>
                    Divisions define the participant segmentation for this
                    competition.
                  </TableCaption>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Edit Category Dialog */}
        <Dialog
          open={editCategoryOpen}
          onOpenChange={handleEditCategoryOpenChange}
        >
          <DialogContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                editCategoryForm.handleSubmit();
              }}
            >
              <DialogHeader>
                <DialogTitle>Edit category</DialogTitle>
                <DialogDescription>
                  Update the label for this category.
                </DialogDescription>
              </DialogHeader>
              <CardContent className="pt-4">
                <editCategoryForm.Field name="label">
                  {(field) => (
                    <Field
                      id="edit-category-label"
                      label="Label"
                      required
                      error={getFieldError(field.state.meta.errors)}
                    >
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Category label"
                        autoFocus
                      />
                    </Field>
                  )}
                </editCategoryForm.Field>
              </CardContent>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Category Dialog */}
        <Dialog
          open={deleteCategoryOpen}
          onOpenChange={handleDeleteCategoryOpenChange}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete category</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &quot;
                {deletingCategory?.label}&quot;? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="outline"
                disabled={isDeleting}
                onClick={handleDeleteCategoryConfirm}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Division Dialog */}
        <Dialog
          open={editDivisionOpen}
          onOpenChange={handleEditDivisionOpenChange}
        >
          <DialogContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                editDivisionForm.handleSubmit();
              }}
            >
              <DialogHeader>
                <DialogTitle>Edit division</DialogTitle>
                <DialogDescription>
                  Update the name for this division.
                </DialogDescription>
              </DialogHeader>
              <CardContent className="pt-4">
                <editDivisionForm.Field name="name">
                  {(field) => (
                    <Field
                      id="edit-division-name"
                      label="Name"
                      required
                      error={getFieldError(field.state.meta.errors)}
                    >
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Division name"
                        autoFocus
                      />
                    </Field>
                  )}
                </editDivisionForm.Field>
              </CardContent>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Division Dialog */}
        <Dialog
          open={deleteDivisionOpen}
          onOpenChange={handleDeleteDivisionOpenChange}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete division</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &quot;
                {deletingDivision?.name}&quot;? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="outline"
                disabled={isDeleting}
                onClick={handleDeleteDivisionConfirm}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Approve Registration Dialog */}
        <Dialog
          open={approveOpen}
          onOpenChange={(open) => {
            setApproveOpen(open);
            if (!open) setApprovingRegistration(null);
          }}
        >
          <DialogContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                approveForm.handleSubmit();
              }}
            >
              <DialogHeader>
                <DialogTitle>Approve registration</DialogTitle>
                <DialogDescription>
                  Optionally adjust the category or division before approving.
                </DialogDescription>
              </DialogHeader>
              <CardContent className="space-y-4 pt-4">
                <approveForm.Field name="categoryId">
                  {(field) => (
                    <Field
                      id="approve-category"
                      label="Category (optional)"
                      error={getFieldError(field.state.meta.errors)}
                    >
                      <Select
                        value={field.state.value}
                        onValueChange={(value) =>
                          field.handleChange(value ?? "")
                        }
                      >
                        <option value="">Keep current</option>
                        {model.categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.label}
                          </option>
                        ))}
                      </Select>
                    </Field>
                  )}
                </approveForm.Field>
                <approveForm.Field name="divisionId">
                  {(field) => (
                    <Field
                      id="approve-division"
                      label="Division (optional)"
                      error={getFieldError(field.state.meta.errors)}
                    >
                      <Select
                        value={field.state.value}
                        onValueChange={(value) =>
                          field.handleChange(value ?? "")
                        }
                      >
                        <option value="">Keep current</option>
                        {model.divisions.map((div) => (
                          <option key={div.id} value={div.id}>
                            {div.name}
                          </option>
                        ))}
                      </Select>
                    </Field>
                  )}
                </approveForm.Field>
              </CardContent>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isReviewing}>
                  {isReviewing ? "Approving..." : "Approve"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Reject Registration Dialog */}
        <Dialog open={rejectOpen} onOpenChange={handleRejectOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject registration</DialogTitle>
              <DialogDescription>
                Are you sure you want to reject this registration? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="outline"
                disabled={isReviewing}
                onClick={handleRejectConfirm}
              >
                {isReviewing ? "Rejecting..." : "Reject"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
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
