"use client";

interface NodeCardProps {
  id: string;
  title: string;
  videoUrl: string;
  level: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NodeCard({ id, title, videoUrl, level, onEdit, onDelete }: NodeCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden w-44">
      <div className="relative aspect-[9/10] bg-gray-900">
        <video
          src={videoUrl}
          className="w-full h-full object-cover"
          muted
          preload="metadata"
        />
        <span className="absolute top-2 right-2 text-[10px] font-semibold bg-syngenta-magenta text-white px-2 py-0.5 rounded-full">
          L{level}
        </span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-syngenta-dark truncate">{title}</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onEdit(id)}
            className="text-xs text-syngenta-magenta hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(id)}
            className="text-xs text-red-500 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
