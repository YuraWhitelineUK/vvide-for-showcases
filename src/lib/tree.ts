import fs from "fs";
import path from "path";
import type { TreeNode } from "./types";

const TREE_PATH = path.join(process.cwd(), "data", "tree.json");

export function getTree(): TreeNode | null {
  if (!fs.existsSync(TREE_PATH)) return null;
  const raw = fs.readFileSync(TREE_PATH, "utf-8");
  return JSON.parse(raw) as TreeNode;
}
