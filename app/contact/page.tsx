import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Thanh Ha Apartments for a free consultation on rooms and apartments for rent in Da Nang.",
  alternates: {
    canonical: "https://ha-apartment.com/contact",
  },
};

const contactInfo = [
  {
    Icon: Phone,
    label: "Phone",
    value: "0389 609 627",
    href: "tel:+84909000000",
  },
  {
    Icon: MessageCircle,
    label: "Zalo",
    value: "0389 609 627",
    href: "https://zalo.me/0909000000",
  },
  {
    Icon: Mail,
    label: "Email",
    value: "info@ha-apartment.com",
    href: "mailto:info@ha-apartment.com",
  },
  {
    Icon: MapPin,
    label: "Address",
    value: "75 Luong Huu Khanh, Son Tra, Da Nang",
    href: null,
  },
  {
    Icon: Clock,
    label: "Working hours",
    value: "Mon – Sun · 8:00 – 21:00",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <div className="bg-white border-b border-gray-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <p className="text-[#378451] text-sm font-semibold mb-2">Contact</p>
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">
          Get in touch
        </h1>
        <p className="text-gray-500 mt-2 max-w-xl text-sm">
          Have a question or want to view a room? Leave your details — we&apos;ll
          respond within 24 hours.
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
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-[#378451]" />
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
                          className="text-gray-900 text-sm font-medium hover:text-[#378451] transition-colors"
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
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7859.803493117402!2d108.25824876604854!3d16.108646450291435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314217dfaec2242f%3A0x9567dc61d1470e4c!2zNzUgTMawxqFuZyBI4buvdSBLaMOhbmgsIFPGoW4gVHLDoCwgxJDDoCBO4bq1bmcsIFZpZXRuYW0!5e0!3m2!1sen!2s!4v1779701364657!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Thanh Ha Apartments Location"
                />
              </div>
            </div>

            {/* Right — Form */}
            <div className="lg:col-span-3">
              <div className="border border-gray-200 rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-1.5">
                  Send a message
                </h2>
                <p className="text-gray-500 text-sm mb-7">
                  Fill in the form below and we&apos;ll get back to you within 24 hours.
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
