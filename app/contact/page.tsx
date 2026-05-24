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
      <div className="bg-white border-b border-gray-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <p className="text-[#FF385C] text-sm font-semibold mb-2">Liên hệ</p>
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">
          Liên hệ với chúng tôi
        </h1>
        <p className="text-gray-500 mt-2 max-w-xl text-sm">
          Có câu hỏi hoặc muốn xem phòng? Hãy để lại thông tin — chúng tôi sẽ
          phản hồi trong 24 giờ.
        </p>
      </div>

      {/* Content */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Left — Contact info */}
            <div className="lg:col-span-2 space-y-8">
              <ul className="space-y-5">
                {contactInfo.map(({ Icon, label, value, href }) => (
                  <li key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-[#FF385C]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">
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
                          className="text-gray-900 text-sm font-medium hover:text-[#FF385C] transition-colors"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-gray-900 text-sm font-medium">
                          {value}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {/* Map */}
              <div className="rounded-2xl overflow-hidden border border-gray-100 h-52">
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

            {/* Right — Form */}
            <div className="lg:col-span-3">
              <div className="border border-gray-200 rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-1.5">
                  Gửi tin nhắn
                </h2>
                <p className="text-gray-500 text-sm mb-7">
                  Điền thông tin bên dưới, chúng tôi sẽ phản hồi trong vòng 24 giờ.
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
