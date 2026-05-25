"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Loader2 } from "lucide-react";

interface ContactFormProps {
  prefilledRoom?: string;
}

export default function ContactForm({ prefilledRoom }: ContactFormProps) {
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    roomInterest: prefilledRoom || "",
    message: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
          <Label htmlFor="phone">Phone number *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="0909 000 000"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>
      </div>

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
            <Send className="w-4 h-4 mr-2" />
            Send message
          </>
        )}
      </Button>
    </form>
  );
}
