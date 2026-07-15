"use client";

import { Fragment, useState } from "react";
import { Pencil } from "lucide-react";

import { AuthorEditForm } from "@/components/admin/author-edit-form";
import { CmsDeleteButton } from "@/components/admin/cms-delete-button";
import { CmsTableSkeleton } from "@/components/admin/cms-table-skeleton";
import { Button } from "@/components/ui/button";
import { useAuthors, useDeleteAuthor } from "@/lib/hooks/use-authors";

export function AuthorsTable() {
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  const { data: authors = [], isLoading, error } = useAuthors();
  const deleteAuthor = useDeleteAuthor();

  async function handleDelete(slug: string) {
    try {
      await deleteAuthor.mutateAsync(slug);
      return { ok: true as const };
    } catch (err) {
      return {
        ok: false as const,
        error: err instanceof Error ? err.message : "Failed to delete.",
      };
    }
  }

  if (isLoading) {
    return <CmsTableSkeleton label="Loading authors..." columns={4} />;
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

  if (authors.length === 0) {
    return (
      <p className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
        No authors yet. Add one with the form.
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
            <th className="px-4 py-3 font-medium">Posts</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <Fragment key={author.slug}>
              <tr className="border-b">
                <td className="px-4 py-3">
                  <p className="font-medium">{author.name}</p>
                  {author.bio ? (
                    <p className="text-xs text-muted-foreground">{author.bio}</p>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {author.slug}
                </td>
                <td className="px-4 py-3 text-muted-foreground">—</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setEditingSlug((current) =>
                          current === author.slug ? null : author.slug
                        )
                      }
                    >
                      <Pencil className="size-3.5" aria-hidden />
                      {editingSlug === author.slug ? "Close" : "Edit"}
                    </Button>
                    <CmsDeleteButton
                      itemLabel={author.name}
                      disabled={deleteAuthor.isPending}
                      onDelete={() => handleDelete(author.slug)}
                    />
                  </div>
                </td>
              </tr>
              {editingSlug === author.slug ? (
                <tr className="border-b last:border-0">
                  <td colSpan={4} className="px-4 py-3">
                    <AuthorEditForm
                      author={author}
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
