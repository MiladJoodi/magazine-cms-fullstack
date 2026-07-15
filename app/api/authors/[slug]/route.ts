import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { updateAuthorSchema } from "@/lib/validations/author";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  const author = await prisma.author.findUnique({ where: { slug } });

  if (!author) {
    return NextResponse.json({ error: "Author not found." }, { status: 404 });
  }

  // وقتی Post model داشتی، اینجا چک کن postCount > 0

  await prisma.author.delete({ where: { slug } });

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const body = await request.json();

  const parsed = updateAuthorSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { name, bio } = parsed.data;

  const author = await prisma.author.findUnique({ where: { slug } });

  if (!author) {
    return NextResponse.json({ error: "Author not found." }, { status: 404 });
  }

  const nameTaken = await prisma.author.findFirst({
    where: { name, NOT: { slug } },
  });

  if (nameTaken) {
    return NextResponse.json(
      { error: "Another author already uses this name." },
      { status: 409 }
    );
  }

  const updated = await prisma.author.update({
    where: { slug },
    data: {
      name,
      bio: bio?.trim() || null,
    },
  });

  return NextResponse.json(updated);
}
