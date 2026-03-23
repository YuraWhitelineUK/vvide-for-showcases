"use client";

import { useState, useRef } from "react";

interface NodeFormProps {
  parentId: string | null;
  branch: "yes" | "no" | null;
  level: number;
  editNode?: { id: string; title: string; videoUrl: string } | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function NodeForm({ parentId, branch, level, editNode, onClose, onSaved }: NodeFormProps) {
  const [title, setTitle] = useState(editNode?.title || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [videoUrl, setVideoUrl] = useState(editNode?.videoUrl || "");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const isEdit = !!editNode;

  async function handleFile(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append("video", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setVideoUrl(data.url);
      }
    } catch {
      alert("Upload failed");
    }
    setUploading(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !videoUrl) return;

    setSaving(true);
    try {
      if (isEdit) {
        await fetch(`/api/nodes/${editNode.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, videoUrl }),
        });
      } else {
        await fetch("/api/nodes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, videoUrl, parentId, branch }),
        });
      }
      onSaved();
    } catch {
      alert("Save failed");
    }
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md h-full shadow-xl p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-syngenta-dark">
            {isEdit ? "Edit Video" : `Add Video — Level ${level}`}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        {!isEdit && branch && (
          <div className="mb-4 text-sm text-gray-500">
            Branch: <span className={`font-medium ${branch === "yes" ? "text-syngenta-magenta" : "text-gray-700"}`}>
              {branch === "yes" ? "Yes" : "No"}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Welcome Video"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-syngenta-magenta/30 focus:border-syngenta-magenta outline-none transition-all"
              required
            />
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Video</label>
            {videoUrl ? (
              <div className="relative rounded-lg overflow-hidden bg-gray-900 aspect-[9/16] max-h-64">
                <video src={videoUrl} className="w-full h-full object-cover" muted preload="metadata" />
                <button
                  type="button"
                  onClick={() => setVideoUrl("")}
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-black/70"
                >
                  &times;
                </button>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  dragOver
                    ? "border-syngenta-magenta bg-syngenta-magenta/5"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-syngenta-magenta border-t-transparent rounded-full animate-spin-slow" />
                    <span className="text-sm text-gray-500">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <p className="text-sm text-gray-500">
                      Drop video here or <span className="text-syngenta-magenta font-medium">browse</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">MP4, WebM, MOV up to 100MB</p>
                  </>
                )}
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!title.trim() || !videoUrl || saving}
            className="w-full py-3 rounded-lg bg-syngenta-magenta text-white font-medium
                       hover:bg-syngenta-magenta-hover disabled:opacity-40 disabled:cursor-not-allowed
                       transition-all"
          >
            {saving ? "Saving..." : isEdit ? "Update" : "Add Video"}
          </button>
        </form>
      </div>
    </div>
  );
}
