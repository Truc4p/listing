import Link from "next/link";
import {
  ArrowRight,
  Shield,
  MapPin,
  Zap,
  HeadphonesIcon,
  Phone,
  MessageCircle,
  Search,
} from "lucide-react";
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
      <section className="bg-linear-to-b from-emerald-50 to-white py-24 md:py-36">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Heading */}
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-semibold text-gray-900 leading-[1.08] tracking-tight mb-6">
            Tìm không gian sống
            <br />
            <span className="text-[#378451] italic font-medium">
              lý tưởng của bạn
            </span>
          </h1>

          <p className="text-gray-500 text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Phòng trọ và căn hộ cho thuê tại trung tâm Quận 1, TP.HCM. An
            toàn, tiện nghi, giá hợp lý.
          </p>

          {/* Search pill */}
          <Link
            href="/rooms"
            className="inline-flex items-center bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-shadow pl-6 pr-2 py-2 gap-4 max-w-md w-full mx-auto"
          >
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <div className="flex-1 text-left">
              <p className="font-semibold text-gray-800 text-sm leading-none mb-0.5">
                Tìm phòng ngay
              </p>
              <p className="text-gray-400 text-xs">Quận 1 · Phòng trọ & Căn hộ</p>
            </div>
            <span className="bg-[#378451] text-white text-sm font-semibold px-5 py-2.5 rounded-full shrink-0 hover:bg-[#2D6B42] transition-colors">
              Tìm
            </span>
          </Link>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 mt-14">
            {stats.map(({ value, label }, i) => (
              <div key={label} className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{label}</div>
                </div>
                {i < stats.length - 1 && (
                  <div className="w-px h-8 bg-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Rooms ────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              Phòng nổi bật
            </h2>
            <Link
              href="/rooms"
              className="text-sm font-medium text-gray-700 underline underline-offset-2 hover:text-[#378451] transition-colors flex items-center gap-1"
            >
              Xem tất cả
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {featuredRooms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRooms.map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl">
              <p className="text-gray-400 mb-4 text-sm">
                Chưa có phòng nổi bật. Vui lòng quay lại sau.
              </p>
              <Link
                href="/rooms"
                className="bg-[#378451] hover:bg-[#2D6B42] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors inline-block"
              >
                Xem tất cả phòng
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Why Choose Us ─────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-[#378451] text-sm font-semibold mb-2">
              Cam kết của chúng tôi
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">
              Tại sao chọn Thanh Hà?
            </h2>
            <p className="text-gray-500 mt-3 max-w-md">
              Chúng tôi không chỉ cho thuê phòng — chúng tôi tạo ra một ngôi
              nhà thực sự cho bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-7 border border-gray-100 hover:border-[#378451]/30 hover:shadow-md transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-[#378451]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Map ───────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-[#378451] text-sm font-semibold mb-2">Vị trí</p>
            <h2 className="text-3xl font-semibold text-gray-900">
              Chúng tôi ở đây
            </h2>
            <p className="mt-2 text-gray-500 text-sm">
              123 Đường Thanh Hà, Phường 1, Quận 1, TP. Hồ Chí Minh
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm aspect-video max-h-112.5">
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
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#378451] text-sm font-semibold mb-3">Liên hệ</p>
          <h2 className="text-4xl sm:text-5xl font-semibold text-gray-900 tracking-tight mb-4">
            Sẵn sàng tìm{" "}
            <span className="text-[#378451] italic font-medium">
              phòng lý tưởng?
            </span>
          </h2>
          <p className="text-gray-500 mb-10 leading-relaxed">
            Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí và xem
            phòng trực tiếp.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contact"
              className="bg-[#378451] hover:bg-[#2D6B42] text-white font-semibold px-8 py-3.5 rounded-full transition-colors shadow-sm flex items-center gap-2 text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Gửi tin nhắn
            </Link>
            <a
              href="tel:+84909000000"
              className="flex items-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-100 font-semibold px-8 py-3.5 rounded-full text-sm transition-colors"
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
