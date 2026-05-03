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
import { useState } from "react";
import type { CompetitionDetailPageViewModel } from "./competition-detail-view-model.js";

interface CompetitionDetailScreenProps {
  model: CompetitionDetailPageViewModel;
  onCreateCategory: (label: string) => Promise<void>;
  onUpdateCategory: (id: string, label: string) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  clearError: () => void;
}

export function CompetitionDetailScreen({
  model,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  isCreating,
  isUpdating,
  isDeleting,
  error,
  clearError,
}: CompetitionDetailScreenProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [editLabel, setEditLabel] = useState("");
  const [editingCategory, setEditingCategory] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  function handleCreateSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFieldError(null);
    if (newLabel.trim().length === 0) {
      setFieldError("Label is required.");
      return;
    }
    onCreateCategory(newLabel.trim()).then(() => {
      setNewLabel("");
      setCreateOpen(false);
    });
  }

  function handleEditSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFieldError(null);
    if (!editingCategory || editLabel.trim().length === 0) {
      setFieldError("Label is required.");
      return;
    }
    onUpdateCategory(editingCategory.id, editLabel.trim()).then(() => {
      setEditingCategory(null);
      setEditLabel("");
      setEditOpen(false);
    });
  }

  function handleDeleteConfirm() {
    if (!deletingCategory) return;
    onDeleteCategory(deletingCategory.id).then(() => {
      setDeletingCategory(null);
      setDeleteOpen(false);
    });
  }

  function openEdit(category: { id: string; label: string }) {
    setEditingCategory(category);
    setEditLabel(category.label);
    setEditOpen(true);
    clearError();
    setFieldError(null);
  }

  function openDelete(category: { id: string; label: string }) {
    setDeletingCategory(category);
    setDeleteOpen(true);
    clearError();
    setFieldError(null);
  }

  function handleCreateOpenChange(open: boolean) {
    setCreateOpen(open);
    if (open) {
      clearError();
      setFieldError(null);
      setNewLabel("");
    }
  }

  function handleEditOpenChange(open: boolean) {
    setEditOpen(open);
    if (!open) {
      setEditingCategory(null);
      setEditLabel("");
      setFieldError(null);
    }
  }

  function handleDeleteOpenChange(open: boolean) {
    setDeleteOpen(open);
    if (!open) {
      setDeletingCategory(null);
      setFieldError(null);
    }
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
              Configure categories that participants will register under.
              Categories are required before opening registrations.
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

        <Card className="bg-white/90">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle>Categories</CardTitle>
              <CardDescription>
                Define the skill or format categories for this competition.
              </CardDescription>
            </div>
            <Dialog open={createOpen} onOpenChange={handleCreateOpenChange}>
              <DialogTrigger asChild>
                <Button size="sm">Add category</Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleCreateSubmit}>
                  <DialogHeader>
                    <DialogTitle>Create category</DialogTitle>
                    <DialogDescription>
                      Add a new category for participants to register under.
                    </DialogDescription>
                  </DialogHeader>
                  <CardContent className="pt-4">
                    <Field
                      id="new-category-label"
                      label="Label"
                      required
                      error={fieldError}
                    >
                      <Input
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        placeholder="e.g. Advanced, Intermediate, Beginner"
                        autoFocus
                      />
                    </Field>
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
                    open={createOpen}
                    onOpenChange={handleCreateOpenChange}
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
                                openEdit({
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
                                openDelete({
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

        <Dialog open={editOpen} onOpenChange={handleEditOpenChange}>
          <DialogContent>
            <form onSubmit={handleEditSubmit}>
              <DialogHeader>
                <DialogTitle>Edit category</DialogTitle>
                <DialogDescription>
                  Update the label for this category.
                </DialogDescription>
              </DialogHeader>
              <CardContent className="pt-4">
                <Field
                  id="edit-category-label"
                  label="Label"
                  required
                  error={fieldError}
                >
                  <Input
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    placeholder="Category label"
                    autoFocus
                  />
                </Field>
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

        <Dialog open={deleteOpen} onOpenChange={handleDeleteOpenChange}>
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
                onClick={handleDeleteConfirm}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
