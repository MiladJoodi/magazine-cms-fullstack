import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";

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
