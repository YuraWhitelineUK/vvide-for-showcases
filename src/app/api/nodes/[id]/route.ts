import { NextRequest, NextResponse } from "next/server";
import { getNode, updateNode, deleteNodeAndDescendants } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const node = getNode(id);
  if (!node) {
    return NextResponse.json({ error: "Node not found" }, { status: 404 });
  }
  return NextResponse.json({ node });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { title, videoUrl } = body;

  const node = updateNode(id, { title, videoUrl });
  if (!node) {
    return NextResponse.json({ error: "Node not found" }, { status: 404 });
  }
  return NextResponse.json({ node });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = deleteNodeAndDescendants(id);
  if (deleted.length === 0) {
    return NextResponse.json({ error: "Node not found" }, { status: 404 });
  }
  return NextResponse.json({ deleted });
}
