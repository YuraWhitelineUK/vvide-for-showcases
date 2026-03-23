import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import type { DbRow, TreeNode, TreeNodeNested } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(path.join(DATA_DIR, "tree.db"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS nodes (
    id         TEXT PRIMARY KEY,
    title      TEXT NOT NULL,
    video_url  TEXT NOT NULL,
    level      INTEGER NOT NULL CHECK(level >= 1 AND level <= 5),
    parent_id  TEXT,
    branch     TEXT CHECK(branch IN ('yes', 'no') OR branch IS NULL),
    yes_child  TEXT,
    no_child   TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (parent_id) REFERENCES nodes(id),
    FOREIGN KEY (yes_child) REFERENCES nodes(id),
    FOREIGN KEY (no_child)  REFERENCES nodes(id)
  );
`);

function rowToNode(row: DbRow): TreeNode {
  return {
    id: row.id,
    title: row.title,
    videoUrl: row.video_url,
    level: row.level,
    parentId: row.parent_id,
    branch: row.branch as TreeNode["branch"],
    yesChild: row.yes_child,
    noChild: row.no_child,
    createdAt: row.created_at,
  };
}

export function getAllNodes(): TreeNode[] {
  const rows = db.prepare("SELECT * FROM nodes ORDER BY level, created_at").all() as DbRow[];
  return rows.map(rowToNode);
}

export function getNode(id: string): TreeNode | null {
  const row = db.prepare("SELECT * FROM nodes WHERE id = ?").get(id) as DbRow | undefined;
  return row ? rowToNode(row) : null;
}

export function getRoot(): TreeNode | null {
  const row = db.prepare("SELECT * FROM nodes WHERE parent_id IS NULL AND branch IS NULL").get() as DbRow | undefined;
  return row ? rowToNode(row) : null;
}

export function createNode(data: {
  id: string;
  title: string;
  videoUrl: string;
  level: number;
  parentId: string | null;
  branch: "yes" | "no" | null;
}): TreeNode {
  db.prepare(`
    INSERT INTO nodes (id, title, video_url, level, parent_id, branch)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(data.id, data.title, data.videoUrl, data.level, data.parentId, data.branch);

  if (data.parentId && data.branch) {
    const col = data.branch === "yes" ? "yes_child" : "no_child";
    db.prepare(`UPDATE nodes SET ${col} = ? WHERE id = ?`).run(data.id, data.parentId);
  }

  return getNode(data.id)!;
}

export function updateNode(id: string, data: { title?: string; videoUrl?: string }): TreeNode | null {
  const node = getNode(id);
  if (!node) return null;

  if (data.title !== undefined) {
    db.prepare("UPDATE nodes SET title = ? WHERE id = ?").run(data.title, id);
  }
  if (data.videoUrl !== undefined) {
    db.prepare("UPDATE nodes SET video_url = ? WHERE id = ?").run(data.videoUrl, id);
  }

  return getNode(id);
}

export function getDescendantIds(id: string): string[] {
  const ids: string[] = [];
  const queue = [id];
  while (queue.length > 0) {
    const current = queue.shift()!;
    const node = getNode(current);
    if (!node) continue;
    if (current !== id) ids.push(current);
    if (node.yesChild) queue.push(node.yesChild);
    if (node.noChild) queue.push(node.noChild);
  }
  return ids;
}

export function deleteNodeAndDescendants(id: string): string[] {
  const node = getNode(id);
  if (!node) return [];

  const descendantIds = getDescendantIds(id);
  const allIds = [id, ...descendantIds];

  const allNodes = allIds.map(getNode).filter(Boolean) as TreeNode[];
  const videoUrls = allNodes.map((n) => n.videoUrl);

  // Clear parent's child pointer
  if (node.parentId && node.branch) {
    const col = node.branch === "yes" ? "yes_child" : "no_child";
    db.prepare(`UPDATE nodes SET ${col} = NULL WHERE id = ?`).run(node.parentId);
  }

  // Delete in reverse order (leaves first) to avoid FK issues
  // Temporarily disable FK for batch delete
  db.pragma("foreign_keys = OFF");
  const deleteStmt = db.prepare("DELETE FROM nodes WHERE id = ?");
  for (const nid of allIds.reverse()) {
    deleteStmt.run(nid);
  }
  db.pragma("foreign_keys = ON");

  // Delete video files
  const videosDir = path.join(process.cwd(), "public");
  for (const url of videoUrls) {
    const filePath = path.join(videosDir, url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  return allIds;
}

export function getTreeFromRoot(): TreeNodeNested | null {
  const allNodes = getAllNodes();
  if (allNodes.length === 0) return null;

  const nodeMap = new Map<string, TreeNodeNested>();
  for (const node of allNodes) {
    nodeMap.set(node.id, {
      id: node.id,
      title: node.title,
      videoUrl: node.videoUrl,
      level: node.level,
      yesChild: null,
      noChild: null,
    });
  }

  for (const node of allNodes) {
    const nested = nodeMap.get(node.id)!;
    if (node.yesChild) nested.yesChild = nodeMap.get(node.yesChild) || null;
    if (node.noChild) nested.noChild = nodeMap.get(node.noChild) || null;
  }

  const root = allNodes.find((n) => n.parentId === null && n.branch === null);
  return root ? nodeMap.get(root.id) || null : null;
}
