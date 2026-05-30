"use client";

import { useCallback, useRef, useState } from "react";
import {
  insert,
  setIfMissing,
  PatchEvent,
  useClient,
  type ArrayOfObjectsInputProps,
} from "sanity";

export function MultiImageInput(props: ArrayOfObjectsInputProps) {
  const client = useClient({ apiVersion: "2024-01-01" });
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");

  const handleFiles = useCallback(
    async (files: File[]) => {
      if (!files.length) return;
      setUploading(true);
      try {
        for (let i = 0; i < files.length; i++) {
          setProgress(`Uploading ${i + 1} / ${files.length}…`);
          const asset = await client.assets.upload("image", files[i], {
            filename: files[i].name,
          });
          const newItem = {
            _type: "image",
            _key: Math.random().toString(36).slice(2, 9),
            asset: { _type: "reference", _ref: asset._id },
          };
          props.onChange(
            PatchEvent.from([
              setIfMissing([]),
              insert([newItem], "after", [-1]),
            ])
          );
        }
      } finally {
        setUploading(false);
        setProgress("");
      }
    },
    [client, props]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      e.target.value = "";
      handleFiles(files);
    },
    [handleFiles]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleChange}
      />
      {uploading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 12px",
            fontSize: "13px",
            color: "#666",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            style={{ animation: "spin 1s linear infinite" }}
          >
            <circle
              cx="8"
              cy="8"
              r="6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="28"
              strokeDashoffset="10"
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </svg>
          {progress}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 14px",
            border: "1px solid #2276fc",
            borderRadius: "4px",
            background: "transparent",
            color: "#2276fc",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            width: "fit-content",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 20 20"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 2a1 1 0 0 1 .707.293l4 4a1 1 0 0 1-1.414 1.414L11 5.414V13a1 1 0 1 1-2 0V5.414L6.707 7.707A1 1 0 0 1 5.293 6.293l4-4A1 1 0 0 1 10 2ZM3 15a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Z" />
          </svg>
          Upload multiple images
        </button>
      )}
      {props.renderDefault(props)}
    </div>
  );
}
