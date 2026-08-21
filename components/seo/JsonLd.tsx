export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "AN Apartment",
    description:
      "Quality rooms and apartments for rent in Da Nang. Safe, comfortable, and affordable.",
    url: "https://listing-psi.vercel.app",
    telephone: "+84389609627",
    email: "info@listing-psi.vercel.app",
    address: {
      "@type": "PostalAddress",
      streetAddress: "75 Luong Huu Khanh",
      addressLocality: "Son Tra",
      addressRegion: "Da Nang",
      addressCountry: "VN",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "21:00",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface RoomJsonLdProps {
  title: string;
  description: string;
  price: number;
  area: number;
  type: string;
  slug: string;
  imageUrl?: string;
}

export function RoomJsonLd({
  title,
  description,
  price,
  area,
  type,
  slug,
  imageUrl,
}: RoomJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: title,
    description,
    url: `https://listing-psi.vercel.app/rooms/${slug}`,
    ...(imageUrl && { image: imageUrl }),
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "VND",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price,
        priceCurrency: "VND",
        referenceQuantity: {
          "@type": "QuantitativeValue",
          value: 1,
          unitCode: "MON",
        },
      },
    },
    floorSize: {
      "@type": "QuantitativeValue",
      value: area,
      unitCode: "MTK",
    },
    accommodationCategory: type === "apartment" ? "Apartment" : "Room",
    address: {
      "@type": "PostalAddress",
      streetAddress: "75 Luong Huu Khanh",
      addressLocality: "Son Tra",
      addressRegion: "Da Nang",
      addressCountry: "VN",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
