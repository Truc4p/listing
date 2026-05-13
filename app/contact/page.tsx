import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Liên hệ",
  description:
    "Liên hệ với Căn Hộ Thanh Hà để được tư vấn miễn phí về phòng trọ và căn hộ cho thuê tại TP.HCM.",
  alternates: {
    canonical: "https://canhothanhha.vn/contact",
  },
};

const contactInfo = [
  {
    Icon: Phone,
    label: "Điện thoại",
    value: "0909 000 000",
    href: "tel:+84909000000",
  },
  {
    Icon: MessageCircle,
    label: "Zalo",
    value: "0909 000 000",
    href: "https://zalo.me/0909000000",
  },
  {
    Icon: Mail,
    label: "Email",
    value: "info@canhothanhha.vn",
    href: "mailto:info@canhothanhha.vn",
  },
  {
    Icon: MapPin,
    label: "Địa chỉ",
    value: "123 Đường Thanh Hà, Phường 1, Quận 1, TP.HCM",
    href: null,
  },
  {
    Icon: Clock,
    label: "Giờ làm việc",
    value: "Thứ 2 – Chủ nhật · 8:00 – 21:00",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#faf7f2] py-16 border-b border-[#e8ddd0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-px w-8 bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-[10px] font-medium uppercase tracking-[4px]">
              Liên hệ
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-light text-[#1a1a1a] tracking-tight">
            Liên Hệ{" "}
            <span className="font-heading font-semibold italic">Với Chúng Tôi</span>
          </h1>
          <p className="text-[#9a8a7a] font-light mt-2 max-w-xl">
            Có câu hỏi hoặc muốn xem phòng? Hãy để lại thông tin — chúng tôi
            sẽ liên hệ lại ngay.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Left: Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-xs font-medium uppercase tracking-[4px] text-[#c9a84c] mb-5 flex items-center gap-3">
                  <span className="h-px w-6 bg-[#c9a84c]" />
                  Thông tin liên hệ
                </h2>
                <p className="text-[#9a8a7a] text-sm font-light leading-relaxed">
                  Chúng tôi luôn sẵn sàng hỗ trợ bạn mọi lúc trong giờ làm
                  việc.
                </p>
              </div>

              <ul className="space-y-5">
                {contactInfo.map(({ Icon, label, value, href }) => (
                  <li key={label} className="flex items-start gap-4">
                    <div className="w-9 h-9 border border-[#e8ddd0] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[#c9a84c]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#9a8a7a] uppercase tracking-[3px] mb-0.5">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          target={href.startsWith("http") ? "_blank" : undefined}
                          rel={
                            href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="text-[#1a1a1a] text-sm font-medium hover:text-[#c9a84c] transition-colors"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-[#1a1a1a] text-sm font-medium">
                          {value}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {/* Map mini */}
              <div className="border border-[#e8ddd0] overflow-hidden h-52 relative">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#c9a84c] z-10" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#c9a84c] z-10" />
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

            {/* Right: Form */}
            <div className="lg:col-span-3">
              <div className="border border-[#e8ddd0] bg-white p-8 relative">
                {/* Gold top bar */}
                <div className="h-0.5 bg-[#c9a84c] absolute top-0 left-0 right-0" />
                <h2 className="text-xs font-medium uppercase tracking-[4px] text-[#c9a84c] mb-5 flex items-center gap-3">
                  <span className="h-px w-6 bg-[#c9a84c]" />
                  Gửi tin nhắn
                </h2>
                <p className="text-[#9a8a7a] text-sm font-light mb-7">
                  Điền thông tin bên dưới, chúng tôi sẽ phản hồi trong vòng
                  24 giờ.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
