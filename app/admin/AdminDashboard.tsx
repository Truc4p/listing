"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, LogOut, X, Check, ExternalLink, Upload } from "lucide-react";
import { getBlobImageSrc } from "@/lib/blob-url";
import type { Room, RoomImage } from "@/types";

const AMENITY_OPTIONS = [
  { value: "ac", label: "Air conditioning" },
  { value: "water_heater", label: "Water heater" },
  { value: "balcony", label: "Balcony" },
  { value: "mezzanine", label: "Mezzanine" },
  { value: "fridge", label: "Refrigerator" },
  { value: "washer", label: "Washing machine" },
  { value: "kitchen", label: "Kitchen" },
  { value: "wifi", label: "Free WiFi" },
  { value: "parking", label: "Parking" },
  { value: "security", label: "24/7 security" },
  { value: "window", label: "Ventilated windows" },
  { value: "furnished", label: "Fully furnished" },
];

const EMPTY_FORM = {
  title: "",
  slug: "",
  type: "room" as "room" | "apartment",
  price: "",
  area: "",
  floor: "",
  description: "",
  amenities: [] as string[],
  images: [] as RoomImage[],
  available: true,
  featured: false,
};

type FormState = typeof EMPTY_FORM;

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function roomToForm(room: Room): FormState {
  return {
    title: room.title,
    slug: room.slug,
    type: room.type,
    price: String(room.price),
    area: String(room.area),
    floor: room.floor ? String(room.floor) : "",
    description: room.description ?? "",
    amenities: room.amenities ?? [],
    images: room.images ?? [],
    available: room.available,
    featured: room.featured,
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/rooms");
    if (res.status === 401) { router.push("/admin/login"); return; }
    const data = await res.json();
    setRooms(data);
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  function openNew() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setNewImageUrl("");
    setNewImageAlt("");
    setShowForm(true);
  }

  function openEdit(room: Room) {
    setEditingId(room._id);
    setForm(roomToForm(room));
    setNewImageUrl("");
    setNewImageAlt("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
  }

  function handleTitleChange(title: string) {
    setForm((f) => ({
      ...f,
      title,
      // Auto-generate slug only when creating new
      ...(editingId === null ? { slug: slugify(title) } : {}),
    }));
  }

  function toggleAmenity(value: string) {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(value)
        ? f.amenities.filter((a) => a !== value)
        : [...f.amenities, value],
    }));
  }

  function addImage() {
    if (!newImageUrl.trim()) return;
    setForm((f) => ({
      ...f,
      images: [...f.images, { url: newImageUrl.trim(), alt: newImageAlt.trim() || undefined }],
    }));
    setNewImageUrl("");
    setNewImageAlt("");
  }

  function removeImage(index: number) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  }

  async function handleFileUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      if (res.ok) {
        const { url } = await res.json();
        setForm((f) => ({ ...f, images: [...f.images, { url }] }));
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSave() {
    setSaving(true);
    const payload = {
      title: form.title,
      slug: form.slug,
      type: form.type,
      price: Number(form.price),
      area: Number(form.area),
      floor: form.floor ? Number(form.floor) : undefined,
      description: form.description || undefined,
      amenities: form.amenities,
      images: form.images,
      available: form.available,
      featured: form.featured,
    };
    const url = editingId ? `/api/admin/rooms/${editingId}` : "/api/admin/rooms";
    const method = editingId ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    closeForm();
    fetchRooms();
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/rooms/${id}`, { method: "DELETE" });
    fetchRooms();
  }

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Admin — Rooms</h1>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View site
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">{rooms.length} listings</p>
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-[#378451] hover:bg-[#2D6B42] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            New room
          </button>
        </div>

        {/* Room list */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-white rounded-xl border border-gray-200 animate-pulse" />
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-300 rounded-2xl">
            <p className="text-gray-400 text-sm mb-4">No rooms yet.</p>
            <button onClick={openNew} className="text-[#378451] text-sm font-medium underline">
              Add your first room
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center gap-4"
              >
                {/* Thumb */}
                {room.images?.[0]?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getBlobImageSrc(room.images[0].url) ?? room.images[0].url}
                    alt={room.title}
                    className="w-14 h-14 rounded-lg object-cover shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-gray-100 shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{room.title}</p>
                  <p className="text-sm text-gray-500">
                    {room.type === "apartment" ? "Apartment" : "Room"} ·{" "}
                    {room.price.toLocaleString("en-US")}₫/mo ·{" "}
                    {room.area}m²
                    {room.floor ? ` · Floor ${room.floor}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      room.available
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {room.available ? "Available" : "Rented"}
                  </span>
                  {room.featured && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                      Featured
                    </span>
                  )}
                  <a
                    href={`/rooms/${room.slug}`}
                    target="_blank"
                    className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
                    title="View listing"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => openEdit(room)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(room._id, room.title)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">
                {editingId ? "Edit room" : "New room"}
              </h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Room 101"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#378451]"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug (URL) *</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="room-101"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#378451]"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Type *</label>
                <div className="flex gap-3">
                  {(["room", "apartment"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, type: t }))}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                        form.type === t
                          ? "border-[#378451] bg-emerald-50 text-[#378451]"
                          : "border-gray-300 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {t === "room" ? "Room" : "Apartment"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price / Area / Floor */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Price ₫/month *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    placeholder="3500000"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#378451]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Area m² *</label>
                  <input
                    type="number"
                    value={form.area}
                    onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
                    placeholder="25"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#378451]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Floor</label>
                  <input
                    type="number"
                    value={form.floor}
                    onChange={(e) => setForm((f) => ({ ...f, floor: e.target.value }))}
                    placeholder="2"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#378451]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={4}
                  placeholder="Describe the room…"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#378451] resize-none"
                />
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITY_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleAmenity(value)}
                      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                        form.amenities.includes(value)
                          ? "border-[#378451] bg-emerald-50 text-[#378451]"
                          : "border-gray-200 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {form.amenities.includes(value) && <Check className="w-3 h-3" />}
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                <div className="space-y-2 mb-3">
                  {form.images.map((img, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getBlobImageSrc(img.url) ?? img.url}
                        alt={img.alt ?? ""}
                        className="w-10 h-10 rounded object-cover shrink-0"
                      />
                      <span className="flex-1 text-xs text-gray-600 truncate">{img.url}</span>
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Upload from device */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:border-[#378451] hover:text-[#378451] transition-colors disabled:opacity-60 mb-3"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? "Uploading…" : "Upload from your computer"}
                </button>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400">or paste a URL</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <div className="flex gap-2">
                  <input
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                    placeholder="https://… image URL"
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#378451]"
                  />
                  <input
                    value={newImageAlt}
                    onChange={(e) => setNewImageAlt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                    placeholder="Alt text"
                    className="w-32 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#378451]"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-6">
                {([
                  { key: "available", label: "Available to rent" },
                  { key: "featured", label: "Featured on homepage" },
                ] as const).map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2.5 cursor-pointer">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={form[key]}
                      onClick={() => setForm((f) => ({ ...f, [key]: !f[key] }))}
                      className={`relative w-10 h-6 rounded-full transition-colors ${
                        form[key] ? "bg-[#378451]" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          form[key] ? "translate-x-4" : ""
                        }`}
                      />
                    </button>
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-5 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={closeForm}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.title || !form.slug || !form.price || !form.area}
                className="px-5 py-2.5 bg-[#378451] hover:bg-[#2D6B42] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
              >
                {saving ? "Saving…" : editingId ? "Save changes" : "Create room"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
