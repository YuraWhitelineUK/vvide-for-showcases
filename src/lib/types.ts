export interface TreeNode {
  id: string;
  title: string;
  videoUrl: string;
  level: number;
  yesLabel?: string;
  noLabel?: string;
  yesChild?: TreeNode | null;
  noChild?: TreeNode | null;
}

export interface PathEntry {
  choice: "yes" | "no";
  label: string;
}
