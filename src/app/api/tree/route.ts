import { NextResponse } from "next/server";
import { getTree } from "@/lib/tree";

export async function GET() {
  const root = getTree();
  return NextResponse.json({ root });
}
