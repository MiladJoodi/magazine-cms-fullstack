"use client";

import { Fragment, useState } from "react";
import { Pencil } from "lucide-react";

import { CategoryEditForm } from "@/components/admin/category-edit-form";
import { CmsDeleteButton } from "@/components/admin/cms-delete-button";
import { CmsTableSkeleton } from "@/components/admin/cms-table-skeleton";
import { Button } from "@/components/ui/button";
import { useCategories, useDeleteCategory } from "@/lib/hooks/use-categories";

export function CategoriesTable() {
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  const { data: categories = [], isLoading, error } = useCategories();
  const deleteCategory = useDeleteCategory();

  async function handleDelete(slug: string) {
    try {
      await deleteCategory.mutateAsync(slug);
      return { ok: true as const };
    } catch (err) {
      return {
        ok: false as const,
        error: err instanceof Error ? err.message : "Failed to delete.",
      };
    }
  }

  if (isLoading) {
    return <CmsTableSkeleton label="Loading categories..." columns={4} />;
  }

  if (error) {
    return (
      <p
        className="rounded-xl border bg-card p-4 text-sm text-destructive"
        role="alert"
      >
        {error.message}
      </p>
    );
  }

  if (categories.length === 0) {
    return (
      <p className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
        No categories yet. Add one with the form.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-left">
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Slug</th>
            <th className="px-4 py-3 font-medium">Description</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <Fragment key={category.slug}>
              <tr className="border-b">
                <td className="px-4 py-3">
                  <p className="font-medium">{category.name}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {category.slug}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {category.description}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setEditingSlug((current) =>
                          current === category.slug ? null : category.slug
                        )
                      }
                    >
                      <Pencil className="size-3.5" aria-hidden />
                      {editingSlug === category.slug ? "Close" : "Edit"}
                    </Button>
                    <CmsDeleteButton
                      itemLabel={category.name}
                      disabled={deleteCategory.isPending}
                      onDelete={() => handleDelete(category.slug)}
                    />
                  </div>
                </td>
              </tr>
              {editingSlug === category.slug ? (
                <tr className="border-b last:border-0">
                  <td colSpan={4} className="px-4 py-3">
                    <CategoryEditForm
                      category={category}
                      onCancel={() => setEditingSlug(null)}
                      onSaved={() => setEditingSlug(null)}
                    />
                  </td>
                </tr>
              ) : null}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
