import "./globals.css";

export const metadata = {
  title: "Users CRUD Demo",
  description: "A simple Next.js CRUD demo for beginners",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Override default Next.js favicon with empty data URI */}
        <link
          rel="icon"
          href="data:," 
        />
      </head>
      <body>{children}</body>
    </html>
  );
}