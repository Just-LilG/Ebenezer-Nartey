import './globals.css';
export const metadata = {
  title: 'In Loving Memory of Ebenezer Nartey',
  description: 'Funeral arrangements, tributes and memories for Ebenezer Nartey (1981 - 2026).',
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Nunito+Sans:wght@400;600;700&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
