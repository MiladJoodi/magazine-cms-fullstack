"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateAuthor } from "@/lib/hooks/use-authors";
import type { Author } from "@/lib/types/author";
import { updateAuthorSchema } from "@/lib/validations/author";
import { cn } from "@/lib/utils";

type AuthorEditFormProps = {
  author: Author;
  onCancel: () => void;
  onSaved: () => void;
};

export function AuthorEditForm({
  author,
  onCancel,
  onSaved,
}: AuthorEditFormProps) {
  const [name, setName] = useState(author.name);
  const [bio, setBio] = useState(author.bio ?? "");
  const [localError, setLocalError] = useState("");

  const update = useUpdateAuthor();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError("");

    const parsed = updateAuthorSchema.safeParse({ name, bio });
    if (!parsed.success) {
      setLocalError(parsed.error.issues[0].message);
      return;
    }

    update.mutate(
      {
        slug: author.slug,
        input: {
          name: parsed.data.name,
          bio: parsed.data.bio,
        },
      },
      { onSuccess: () => onSaved() }
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-lg border bg-muted/30 p-4"
    >
      <p className="text-xs text-muted-foreground">
        Editing <span className="font-medium">{author.slug}</span> (slug cannot
        change)
      </p>

      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        disabled={update.isPending}
      />

      <textarea
        rows={2}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        disabled={update.isPending}
        placeholder="Bio (optional)"
        className={cn(
          "w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        )}
      />

      {localError ? (
        <p className="text-sm text-destructive" role="alert">
          {localError}
        </p>
      ) : null}

      {update.error ? (
        <p className="text-sm text-destructive">{update.error.message}</p>
      ) : null}

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={update.isPending}>
          {update.isPending ? (
            <>
              <Loader2 className="animate-spin" aria-hidden />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
