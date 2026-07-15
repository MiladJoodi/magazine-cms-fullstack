import type {
  Author,
  createAuthorInput,
  UpdateAuthorInput,
} from "@/lib/types/author";

const BASE = "/api/authors";

export async function getAuthors(): Promise<Author[]> {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error("Failed to load authors");
    return res.json();
}

export async function createAuthor(input: createAuthorInput): Promise<Author> {
    const res = await fetch(BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
    });

    const data = await res.json();
    
    if (!res.ok){
        throw new Error(data.error ?? "Failed to create author");
    }

    return data as Author;
}

export async function deleteAuthor(slug: string): Promise<void> {
  const res = await fetch(`${BASE}/${slug}`, { method: "DELETE" });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? "Failed to delete author");
  }
}

export async function updateAuthor(
  slug: string,
  input: UpdateAuthorInput
): Promise<Author> {
  const res = await fetch(`${BASE}/${slug}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Failed to update author");
  }
  return data as Author;
}
