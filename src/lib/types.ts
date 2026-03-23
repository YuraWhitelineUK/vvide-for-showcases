export interface TreeNode {
  id: string;
  title: string;
  videoUrl: string;
  level: number;
  parentId: string | null;
  branch: "yes" | "no" | null;
  yesChild: string | null;
  noChild: string | null;
  createdAt: string;
}

export interface TreeNodeNested {
  id: string;
  title: string;
  videoUrl: string;
  level: number;
  yesChild: TreeNodeNested | null;
  noChild: TreeNodeNested | null;
}

export interface DbRow {
  id: string;
  title: string;
  video_url: string;
  level: number;
  parent_id: string | null;
  branch: string | null;
  yes_child: string | null;
  no_child: string | null;
  created_at: string;
}
