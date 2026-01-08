import Navbar from "./components/Navbar";
import "./globals.css";

export const metadata = {
  title: "PunoX - Portfolio CMS",
  description:
    "A portfolio with content management system for posting blogs, docs, projects",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
