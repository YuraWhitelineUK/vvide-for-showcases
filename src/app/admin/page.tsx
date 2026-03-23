"use client";

import { useState, useEffect, useCallback } from "react";
import TreeView from "@/components/admin/TreeView";
import NodeForm from "@/components/admin/NodeForm";

interface FlatNode {
  id: string;
  title: string;
  videoUrl: string;
  level: number;
  parentId: string | null;
  branch: "yes" | "no" | null;
  yesChild: string | null;
  noChild: string | null;
}

interface FormState {
  parentId: string | null;
  branch: "yes" | "no" | null;
  level: number;
  editNode: { id: string; title: string; videoUrl: string } | null;
}

export default function AdminPage() {
  const [nodes, setNodes] = useState<FlatNode[]>([]);
  const [form, setForm] = useState<FormState | null>(null);

  const loadNodes = useCallback(async () => {
    const res = await fetch("/api/nodes");
    const data = await res.json();
    setNodes(data.nodes);
  }, []);

  useEffect(() => {
    loadNodes();
  }, [loadNodes]);

  function handleAddRoot() {
    setForm({ parentId: null, branch: null, level: 1, editNode: null });
  }

  function handleAddChild(parentId: string, branch: "yes" | "no") {
    const parent = nodes.find((n) => n.id === parentId);
    if (!parent) return;
    setForm({ parentId, branch, level: parent.level + 1, editNode: null });
  }

  function handleEdit(id: string) {
    const node = nodes.find((n) => n.id === id);
    if (!node) return;
    setForm({
      parentId: node.parentId,
      branch: node.branch,
      level: node.level,
      editNode: { id: node.id, title: node.title, videoUrl: node.videoUrl },
    });
  }

  async function handleDelete(id: string) {
    const node = nodes.find((n) => n.id === id);
    if (!node) return;

    const descendants = countDescendants(id, nodes);
    const msg = descendants > 0
      ? `Delete "${node.title}" and ${descendants} child video${descendants > 1 ? "s" : ""}?`
      : `Delete "${node.title}"?`;

    if (!confirm(msg)) return;

    await fetch(`/api/nodes/${id}`, { method: "DELETE" });
    loadNodes();
  }

  function handleSaved() {
    setForm(null);
    loadNodes();
  }

  return (
    <div className="min-h-screen bg-syngenta-light">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-syngenta-magenta rounded-full" />
            <div>
              <h1 className="text-lg font-semibold text-syngenta-dark">Video Decision Tree</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
          <a
            href="/"
            className="text-sm text-syngenta-magenta hover:underline"
          >
            Preview &rarr;
          </a>
        </div>
      </header>

      {/* Tree */}
      <main className="max-w-7xl mx-auto py-8">
        <TreeView
          nodes={nodes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddChild={handleAddChild}
          onAddRoot={handleAddRoot}
        />
      </main>

      {/* Form modal */}
      {form && (
        <NodeForm
          parentId={form.parentId}
          branch={form.branch}
          level={form.level}
          editNode={form.editNode}
          onClose={() => setForm(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

function countDescendants(id: string, nodes: FlatNode[]): number {
  const node = nodes.find((n) => n.id === id);
  if (!node) return 0;
  let count = 0;
  if (node.yesChild) {
    count += 1 + countDescendants(node.yesChild, nodes);
  }
  if (node.noChild) {
    count += 1 + countDescendants(node.noChild, nodes);
  }
  return count;
}
