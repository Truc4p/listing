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

interface BreadcrumbListJsonLdProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbListJsonLd({ items }: BreadcrumbListJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface RoomImageObject {
  url: string;
  width?: number;
  height?: number;
  caption?: string;
}

interface RoomJsonLdProps {
  title: string;
  description: string;
  price: number;
  area: number;
  type: string;
  slug: string;
  imageUrl?: string;
  images?: RoomImageObject[];
}

export function RoomJsonLd({
  title,
  description,
  price,
  area,
  type,
  slug,
  imageUrl,
  images,
}: RoomJsonLdProps) {
  // Build ImageObject array from `images` prop; fall back to bare `imageUrl`
  const imageObjects: object[] | undefined = (() => {
    if (images && images.length > 0) {
      return images.map((img) => ({
        "@type": "ImageObject",
        url: img.url,
        ...(img.width && { width: img.width }),
        ...(img.height && { height: img.height }),
        contentUrl: img.url,
        caption: img.caption ?? title,
        name: img.caption ?? title,
      }));
    }
    if (imageUrl) {
      return [
        {
          "@type": "ImageObject",
          url: imageUrl,
          contentUrl: imageUrl,
          caption: title,
          name: title,
        },
      ];
    }
    return undefined;
  })();

  const data = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: title,
    description,
    url: `https://listing-psi.vercel.app/rooms/${slug}`,
    ...(imageObjects && {
      image: imageObjects.length === 1 ? imageObjects[0] : imageObjects,
    }),
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
