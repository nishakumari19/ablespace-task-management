import './globals.css';
import React from 'react';
import { ClientProviders } from '@/components/providers/ClientProviders';

export const metadata = {
  title: 'Task Management System',
  description: 'Full Stack Task Management System - Next.js & NestJS Monorepo',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme') || 'light';
                  var savedAccent = localStorage.getItem('accent') || 'black';
                  document.documentElement.setAttribute('data-theme', savedTheme);
                  document.documentElement.setAttribute('data-accent', savedAccent);
                  if (savedTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
