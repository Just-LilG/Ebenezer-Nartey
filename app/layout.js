import './globals.css';

const SITE = 'https://ebenezer-memorial.vercel.app';
const TITLE = 'In Loving Memory of Ebenezer Nartey';
const DESC = 'Funeral arrangements, tributes and memories for Ebenezer Nartey (1981 - 2026).';

export const metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESC,
  openGraph: { title: TITLE, description: DESC, url: SITE, siteName: TITLE, type: 'website', locale: 'en_GB' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
};
export const viewport = { themeColor: '#0A0A0A', colorScheme: 'light' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Pinyon+Script&family=Nunito+Sans:wght@400;600;700&display=swap" />
      </head>
      <body id="top">{children}</body>
    </html>
  );
}
