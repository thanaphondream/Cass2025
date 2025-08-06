// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "My App",
  description: "Next.js App with Protected Route",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
