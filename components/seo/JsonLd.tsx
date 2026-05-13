export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Căn Hộ Thanh Hà",
    description:
      "Cho thuê phòng trọ và căn hộ chất lượng tại TP. Hồ Chí Minh. An toàn, tiện nghi, giá hợp lý.",
    url: "https://canhothanhha.vn",
    telephone: "+84909000000",
    email: "info@canhothanhha.vn",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Đường Thanh Hà, Phường 1",
      addressLocality: "Quận 1",
      addressRegion: "TP. Hồ Chí Minh",
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
    url: `https://canhothanhha.vn/rooms/${slug}`,
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
      streetAddress: "123 Đường Thanh Hà, Phường 1",
      addressLocality: "Quận 1",
      addressRegion: "TP. Hồ Chí Minh",
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
