import Link from "next/link";
import {
  ArrowRight,
  Shield,
  MapPin,
  Zap,
  HeadphonesIcon,
  Phone,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import RoomCard from "@/components/listings/RoomCard";
import { getFeaturedRooms } from "@/lib/sanity";
import type { Room } from "@/types";

const highlights = [
  {
    Icon: Shield,
    title: "An toàn & Bảo mật",
    desc: "Camera 24/7, khóa từ cao cấp, đội ngũ bảo vệ chuyên nghiệp",
  },
  {
    Icon: MapPin,
    title: "Vị trí đắc địa",
    desc: "Trung tâm Quận 1, gần chợ, trường học, bệnh viện, tiện di chuyển",
  },
  {
    Icon: Zap,
    title: "Tiện nghi đầy đủ",
    desc: "Điều hòa, máy nước nóng, WiFi tốc độ cao, nội thất hiện đại",
  },
  {
    Icon: HeadphonesIcon,
    title: "Hỗ trợ 24/7",
    desc: "Đội ngũ quản lý nhiệt tình, xử lý sự cố nhanh chóng, chu đáo",
  },
];

const stats = [
  { value: "50+", label: "Phòng & căn hộ" },
  { value: "5+", label: "Năm kinh nghiệm" },
  { value: "200+", label: "Khách hài lòng" },
  { value: "100%", label: "An toàn" },
];

export default async function HomePage() {
  const featuredRooms: Room[] = await getFeaturedRooms();

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#faf7f2]">
        {/* Subtle dot-grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #c9a84c 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        {/* Soft gold glow top-right */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9a84c] opacity-5 blur-3xl rounded-full" />
        {/* Warm left strip */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-linear-to-b from-transparent via-[#c9a84c] to-transparent opacity-40" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-3 mb-10">
            <span className="h-px w-10 bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-[11px] font-medium uppercase tracking-[5px]">
              Căn Hộ Thanh Hà · Quận 1 · TP.HCM
            </span>
            <span className="h-px w-10 bg-[#c9a84c]" />
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-[#1a1a1a] leading-[1.1] mb-6 tracking-tight">
            Không Gian Sống
            <br />
            <span className="font-semibold italic text-[#c9a84c]">
              Đẳng Cấp
            </span>
          </h1>

          {/* Gold rule */}
          <div className="w-14 h-0.5 bg-[#c9a84c] mx-auto mb-7" />

          <p className="text-[#6b6b6b] text-lg max-w-xl mx-auto mb-12 leading-relaxed font-light">
            Phòng trọ và căn hộ cho thuê chất lượng cao tại trung tâm Sài
            Gòn. Không gian thoáng, sạch sẽ, an toàn và đầy đủ tiện nghi.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link
              href="/rooms"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-[#c9a84c] hover:bg-[#b8963e] text-white border-0 px-10 h-12 text-sm font-medium tracking-wide rounded-sm shadow-lg shadow-[#c9a84c]/20"
              )}
            >
              Xem phòng trống
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white px-10 h-12 text-sm font-medium tracking-wide rounded-sm"
              )}
            >
              <Phone className="mr-2 w-4 h-4" />
              Liên hệ ngay
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-semibold text-[#1a1a1a] mb-1">
                  {value}
                </div>
                <div className="w-6 h-px bg-[#c9a84c] mx-auto mb-1.5" />
                <div className="text-xs text-[#9a8a7a] uppercase tracking-widest">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#c9a84c] opacity-60 animate-bounce">
          <ChevronDown className="w-5 h-5" />
        </div>
      </section>

      {/* ── Featured Rooms ────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="h-px w-8 bg-[#c9a84c]" />
                <span className="text-[#c9a84c] text-[10px] font-medium uppercase tracking-[4px]">
                  Nổi bật
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-light text-[#1a1a1a] tracking-tight">
                Phòng & Căn Hộ{" "}
                <span className="font-semibold">Được Chọn Lọc</span>
              </h2>
            </div>
            <Link
              href="/rooms"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-white rounded-sm shrink-0 text-sm tracking-wide"
              )}
            >
              Xem tất cả
              <ArrowRight className="ml-2 w-3.5 h-3.5" />
            </Link>
          </div>

          {featuredRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {featuredRooms.map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-[#e8ddd0] rounded-sm">
              <p className="text-[#9a8a7a] mb-4">
                Chưa có phòng nổi bật. Vui lòng quay lại sau.
              </p>
              <Link
                href="/rooms"
                className={cn(
                  buttonVariants(),
                  "bg-[#c9a84c] hover:bg-[#b8963e] text-white border-0 rounded-sm"
                )}
              >
                Xem tất cả phòng
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Why Choose Us ─────────────────────────────────────── */}
      <section className="py-24 bg-[#faf7f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="h-px w-8 bg-[#c9a84c]" />
              <span className="text-[#c9a84c] text-[10px] font-medium uppercase tracking-[4px]">
                Cam kết của chúng tôi
              </span>
              <span className="h-px w-8 bg-[#c9a84c]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-light text-[#1a1a1a] tracking-tight mb-4">
              Tại Sao Chọn{" "}
              <span className="font-semibold">Thanh Hà?</span>
            </h2>
            <p className="text-[#9a8a7a] max-w-xl mx-auto font-light">
              Chúng tôi không chỉ cho thuê phòng — chúng tôi tạo ra một ngôi
              nhà thực sự cho bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map(({ Icon, title, desc }, i) => (
              <div
                key={title}
                className="group bg-white p-8 border border-[#e8ddd0] hover:border-[#c9a84c] transition-all duration-300 hover:shadow-lg hover:shadow-[#c9a84c]/5"
              >
                <div className="w-10 h-10 border border-[#e8ddd0] group-hover:border-[#c9a84c] flex items-center justify-center mb-5 transition-colors">
                  <Icon className="w-4.5 h-4.5 text-[#c9a84c]" />
                </div>
                <div className="text-[#c9a84c] text-[10px] font-medium uppercase tracking-widest mb-2">
                  0{i + 1}
                </div>
                <h3 className="font-semibold text-[#1a1a1a] mb-2 text-[15px]">
                  {title}
                </h3>
                <p className="text-sm text-[#9a8a7a] leading-relaxed font-light">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Map ───────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="h-px w-8 bg-[#c9a84c]" />
              <span className="text-[#c9a84c] text-[10px] font-medium uppercase tracking-[4px]">
                Vị trí
              </span>
              <span className="h-px w-8 bg-[#c9a84c]" />
            </div>
            <h2 className="text-3xl font-light text-[#1a1a1a] tracking-tight">
              Chúng Tôi Ở <span className="font-semibold">Đây</span>
            </h2>
            <p className="mt-3 text-[#9a8a7a] font-light">
              123 Đường Thanh Hà, Phường 1, Quận 1, TP. Hồ Chí Minh
            </p>
          </div>
          <div className="border border-[#e8ddd0] overflow-hidden aspect-video max-h-112.5">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241674197607!2d106.69585107480527!3d10.777620989376826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4b3330bcc7%3A0x4db964d76bf7e042!2zUXXhuq1uIDEsIEjhu5MgQ2jDrSBNaW5oLCBWaWV0bmFt!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Vị trí Căn Hộ Thanh Hà"
            />
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section className="py-24 bg-[#141414] relative overflow-hidden">
        {/* Gold accent lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#c9a84c] to-transparent opacity-40" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#c9a84c] to-transparent opacity-40" />
        <div className="absolute left-0 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-[#c9a84c] to-transparent opacity-20" />
        <div className="absolute right-0 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-[#c9a84c] to-transparent opacity-20" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-[10px] font-medium uppercase tracking-[4px]">
              Liên hệ
            </span>
            <span className="h-px w-8 bg-[#c9a84c]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight mb-4">
            Sẵn sàng tìm{" "}
            <span className="font-semibold text-[#c9a84c]">
              phòng lý tưởng?
            </span>
          </h2>
          <p className="text-[#7a6a5a] font-light mb-12">
            Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí và
            xem phòng trực tiếp.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-[#c9a84c] hover:bg-[#b8963e] text-white border-0 px-10 h-12 text-sm font-medium tracking-wide rounded-sm"
              )}
            >
              <MessageCircle className="mr-2 w-4 h-4" />
              Gửi tin nhắn
            </Link>
            <a
              href="tel:+84909000000"
              className="flex items-center gap-2 text-white border border-[#3a3a3a] hover:border-[#c9a84c] hover:text-[#c9a84c] px-10 h-12 rounded-sm text-sm font-medium tracking-wide transition-colors"
            >
              <Phone className="w-4 h-4" />
              Gọi 0909 000 000
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
