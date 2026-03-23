"use client";

import NodeCard from "./NodeCard";

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

interface TreeViewProps {
  nodes: FlatNode[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string, branch: "yes" | "no") => void;
  onAddRoot: () => void;
}

function EmptySlot({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-44 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-2
                 hover:border-syngenta-magenta hover:bg-syngenta-magenta/5 transition-colors cursor-pointer min-h-[120px]"
    >
      <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      <span className="text-xs text-gray-500 font-medium">{label}</span>
    </button>
  );
}

function NodeWithChildren({
  node,
  allNodes,
  onEdit,
  onDelete,
  onAddChild,
}: {
  node: FlatNode;
  allNodes: FlatNode[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string, branch: "yes" | "no") => void;
}) {
  const yesChild = node.yesChild ? allNodes.find((n) => n.id === node.yesChild) : null;
  const noChild = node.noChild ? allNodes.find((n) => n.id === node.noChild) : null;
  const canHaveChildren = node.level < 5;

  return (
    <div className="flex flex-col items-center">
      <NodeCard
        id={node.id}
        title={node.title}
        videoUrl={node.videoUrl}
        level={node.level}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      {canHaveChildren && (
        <>
          {/* Connector line */}
          <div className="w-px h-6 bg-gray-300" />

          <div className="flex gap-6">
            {/* Yes branch */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-semibold text-syngenta-magenta mb-1">YES</span>
              <div className="w-px h-3 bg-syngenta-magenta/40" />
              {yesChild ? (
                <NodeWithChildren
                  node={yesChild}
                  allNodes={allNodes}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onAddChild={onAddChild}
                />
              ) : (
                <EmptySlot label="Add Yes" onClick={() => onAddChild(node.id, "yes")} />
              )}
            </div>

            {/* No branch */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-semibold text-gray-500 mb-1">NO</span>
              <div className="w-px h-3 bg-gray-300" />
              {noChild ? (
                <NodeWithChildren
                  node={noChild}
                  allNodes={allNodes}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onAddChild={onAddChild}
                />
              ) : (
                <EmptySlot label="Add No" onClick={() => onAddChild(node.id, "no")} />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function TreeView({ nodes, onEdit, onDelete, onAddChild, onAddRoot }: TreeViewProps) {
  const root = nodes.find((n) => n.parentId === null && n.branch === null);

  if (!root) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500 mb-4">No videos yet. Start by adding your root video.</p>
        <button
          onClick={onAddRoot}
          className="px-6 py-3 bg-syngenta-magenta text-white rounded-lg font-medium hover:bg-syngenta-magenta-hover transition-colors"
        >
          Create Root Video
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-auto p-8">
      <div className="inline-flex justify-center min-w-full">
        <NodeWithChildren
          node={root}
          allNodes={nodes}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddChild={onAddChild}
        />
      </div>
    </div>
  );
}
