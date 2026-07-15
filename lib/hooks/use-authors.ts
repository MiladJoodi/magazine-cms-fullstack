"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAuthor,
  deleteAuthor,
  getAuthors,
  updateAuthor,
} from "@/lib/services/authors.service";
import type {
  createAuthorInput,
  UpdateAuthorInput,
} from "@/lib/types/author";

export function useAuthors() {
  return useQuery({
    queryKey: ["authors"],
    queryFn: getAuthors,
  });
}

export function useCreateAuthor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: createAuthorInput) => createAuthor(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
    },
  });
}

export function useDeleteAuthor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => deleteAuthor(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
    },
  });
}

export function useUpdateAuthor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      slug,
      input,
    }: {
      slug: string;
      input: UpdateAuthorInput;
    }) => updateAuthor(slug, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
    },
  });
}
