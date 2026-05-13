import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phòng & Căn hộ cho thuê",
  description:
    "Danh sách phòng trọ và căn hộ cho thuê tại Căn Hộ Thanh Hà, Quận 1, TP. Hồ Chí Minh. Đầy đủ tiện nghi, giá hợp lý.",
  alternates: {
    canonical: "https://canhothanhha.vn/rooms",
  },
};

export default function RoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
