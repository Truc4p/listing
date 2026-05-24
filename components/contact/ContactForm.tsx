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
        throw new Error(data.error || "Gửi thất bại");
      }

      toast.success("Gửi tin nhắn thành công!", {
        description: "Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.",
      });
      setForm({ name: "", email: "", phone: "", roomInterest: "", message: "" });
    } catch (err) {
      toast.error("Gửi thất bại", {
        description:
          err instanceof Error ? err.message : "Vui lòng thử lại sau.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Họ và tên *</Label>
          <Input
            id="name"
            name="name"
            placeholder="Nguyễn Văn A"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Số điện thoại *</Label>
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
        <Label htmlFor="roomInterest">Quan tâm đến phòng (tuỳ chọn)</Label>
        <Input
          id="roomInterest"
          name="roomInterest"
          placeholder="Tên phòng hoặc căn hộ bạn quan tâm"
          value={form.roomInterest}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Nội dung tin nhắn *</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Xin chào, tôi muốn hỏi thêm thông tin về..."
          rows={5}
          value={form.message}
          onChange={handleChange}
          required
        />
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="w-full bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold rounded-xl border-0"
      >
        {pending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Đang gửi...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Gửi tin nhắn
          </>
        )}
      </Button>
    </form>
  );
}
