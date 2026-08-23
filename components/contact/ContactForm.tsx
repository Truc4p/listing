"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Loader2, Mail } from "lucide-react";

type Channel = "email" | "whatsapp" | "telegram";

const OWNER_PHONE = "84389609627"; // international format without +

const channels: { id: Channel; label: string; icon: React.ReactNode }[] = [
  { id: "email", label: "Email", icon: <Mail className="w-4 h-4" /> },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    id: "telegram",
    label: "Telegram",
    icon: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
];

interface ContactFormProps {
  prefilledRoom?: string;
  prefilledCheckIn?: string;
  prefilledCheckOut?: string;
}

function buildPrefilledMessage(checkIn?: string, checkOut?: string): string {
  if (!checkIn) return "";
  const fmt = (iso: string) =>
    new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  if (checkOut) {
    return `Hi, I'd like to request these dates: ${fmt(checkIn)} – ${fmt(checkOut)}.`;
  }
  return `Hi, I'd like to request a stay starting ${fmt(checkIn)}.`;
}

export default function ContactForm({
  prefilledRoom,
  prefilledCheckIn,
  prefilledCheckOut,
}: ContactFormProps) {
  const [pending, setPending] = useState(false);
  const [channel, setChannel] = useState<Channel>("email");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    roomInterest: prefilledRoom || "",
    message: buildPrefilledMessage(prefilledCheckIn, prefilledCheckOut),
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function buildWhatsAppText() {
    // The prefilled message already starts with "Hi, ...", so when we add the
    // "Hi, my name is X." intro we strip the leading greeting to avoid a
    // doubled "Hi". If there's no name, keep the message untouched.
    const message = form.name
      ? form.message.replace(/^Hi[,\s]*/i, "")
      : form.message;
    const parts = [
      form.name ? `Hi, my name is ${form.name}.` : "",
      form.roomInterest ? `I'm interested in: ${form.roomInterest}.` : "",
      message,
      form.phone ? `My phone: ${form.phone}` : "",
      form.email ? `My email: ${form.email}` : "",
    ].filter(Boolean);
    return parts.join("\n");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (channel === "whatsapp") {
      const text = encodeURIComponent(buildWhatsAppText());
      window.open(`https://wa.me/${OWNER_PHONE}?text=${text}`, "_blank", "noopener,noreferrer");
      return;
    }

    if (channel === "telegram") {
      const text = encodeURIComponent(buildWhatsAppText());
      window.open(`https://t.me/+${OWNER_PHONE}?text=${text}`, "_blank", "noopener,noreferrer");
      return;
    }

    // Email channel
    setPending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send");
      }

      toast.success("Message sent!", {
        description: "We'll get back to you as soon as possible.",
      });
      setForm({ name: "", email: "", phone: "", roomInterest: "", message: "" });
    } catch (err) {
      toast.error("Failed to send", {
        description:
          err instanceof Error ? err.message : "Please try again later.",
      });
    } finally {
      setPending(false);
    }
  }

  const isEmailChannel = channel === "email";
  const selectedChannelLabel = channels.find((c) => c.id === channel)?.label ?? "Send";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Channel selector */}
      <div className="space-y-1.5">
        <Label>Send via</Label>
        <div className="flex gap-2" role="group" aria-label="Send via">
          {channels.map((ch) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => setChannel(ch.id)}
              aria-pressed={channel === ch.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#378451] ${
                channel === ch.id
                  ? "bg-[#378451] text-white border-[#378451]"
                  : "bg-white text-gray-700 border-gray-200 hover:border-[#378451] hover:text-[#378451]"
              }`}
            >
              {ch.icon}
              {ch.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name *</Label>
          <Input
            id="name"
            name="name"
            placeholder="John Smith"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone number {isEmailChannel ? "*" : "(optional)"}</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="0389 609 627"
            value={form.phone}
            onChange={handleChange}
            required={isEmailChannel}
          />
        </div>
      </div>

      {isEmailChannel && (
        <div className="space-y-1.5">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="example@email.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="roomInterest">Room of interest (optional)</Label>
        <Input
          id="roomInterest"
          name="roomInterest"
          placeholder="Room or apartment name you're interested in"
          value={form.roomInterest}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Hello, I'd like to know more about..."
          rows={5}
          value={form.message}
          onChange={handleChange}
          required
        />
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="w-full bg-[#378451] hover:bg-[#2D6B42] text-white font-semibold rounded-xl border-0"
      >
        {pending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            {channel === "email" ? (
              <Send className="w-4 h-4 mr-2" />
            ) : (
              channels.find((c) => c.id === channel)?.icon && (
                <span className="mr-2">{channels.find((c) => c.id === channel)?.icon}</span>
              )
            )}
            Send via {selectedChannelLabel}
          </>
        )}
      </Button>
    </form>
  );
}
