import { NextRequest, NextResponse } from "next/server";
import { getAllNodes, createNode, getRoot } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const nodes = getAllNodes();
  return NextResponse.json({ nodes });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, videoUrl, parentId, branch } = body;

    if (!title || !videoUrl) {
      return NextResponse.json({ error: "title and videoUrl are required" }, { status: 400 });
    }

    // Root node: no parent, no branch
    if (!parentId) {
      const existingRoot = getRoot();
      if (existingRoot) {
        return NextResponse.json({ error: "Root node already exists" }, { status: 400 });
      }

      const node = createNode({
        id: uuidv4(),
        title,
        videoUrl,
        level: 1,
        parentId: null,
        branch: null,
      });
      return NextResponse.json({ node }, { status: 201 });
    }

    // Child node: needs parent + branch
    if (!branch || !["yes", "no"].includes(branch)) {
      return NextResponse.json({ error: "branch must be 'yes' or 'no'" }, { status: 400 });
    }

    const { getNode } = await import("@/lib/db");
    const parent = getNode(parentId);
    if (!parent) {
      return NextResponse.json({ error: "Parent node not found" }, { status: 404 });
    }

    if (parent.level >= 5) {
      return NextResponse.json({ error: "Maximum depth is 5 levels" }, { status: 400 });
    }

    const existingChild = branch === "yes" ? parent.yesChild : parent.noChild;
    if (existingChild) {
      return NextResponse.json(
        { error: `Parent already has a ${branch} child` },
        { status: 400 }
      );
    }

    const node = createNode({
      id: uuidv4(),
      title,
      videoUrl,
      level: parent.level + 1,
      parentId,
      branch: branch as "yes" | "no",
    });

    return NextResponse.json({ node }, { status: 201 });
  } catch (error) {
    console.error("Create node error:", error);
    return NextResponse.json({ error: "Failed to create node" }, { status: 500 });
  }
}
