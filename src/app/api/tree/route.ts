import { NextResponse } from "next/server";
import { getTreeFromRoot } from "@/lib/db";

export async function GET() {
  const root = getTreeFromRoot();
  return NextResponse.json({ root });
}
