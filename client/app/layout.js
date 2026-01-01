import "./globals.css";

export const metadata = {
  title: "PunoX - Portfolio CMS",
  description: "A portfolio with content management system for posting blogs, docs, projects",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
