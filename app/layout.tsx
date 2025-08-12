// --- File: app/layout.tsx (Tidak berubah)
import "./globals.css";

export const metadata = {
  title: "Admin Dashboard",
  description: "Aplikasi dashboard admin untuk reservasi taman kota",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
