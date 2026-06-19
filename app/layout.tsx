import type { Metadata } from 'next';
import './globals.css';

// Global Metadata aur SEO settings
export const metadata: Metadata = {
  title: {
    default: 'HireSkys | Remote & Freelance Jobs', // Agar kisi page ka title nahi hai to yeh show hoga
    template: '%s | HireSkys', // Dynamic title ke liye template (e.g., "Admin | HireSkys")
  },
  description: '100% Manually Verified Remote Jobs without the chaos.',
  
  // 🔥 Yeh line poori website ke har page ko Google aur dusre bots se chupa degi
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true, // Images ko bhi index hone se rokega
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}