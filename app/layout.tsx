import { ThemeProvider } from 'next-themes';
import './globals.css'; // Make sure this matches the path to your global CSS

export const metadata = {
  title: 'Gate Guard Access',
  description: 'Secure Visitor Registration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning is REQUIRED here so Next.js doesn't complain 
    // when the theme switches between server-side and client-side rendering
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
