// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "ชื่อเว็บไซต์",
  description: "คำอธิบาย",
  icons: {
    icon: "/favicon.ico", 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
      <link rel="icon" href="../../public/cass2025.jpg" sizes="any" />
    </html>
  );
}
