'use client';
import { ToastProvider } from './Toast';
import Navbar from './Navbar';
import Footer from './Footer';

type AppShellProps = {
  children: React.ReactNode;
  paddingTop?: string;
  minHeight?: string;
  showFooter?: boolean;
};

export default function AppShell({
  children,
  paddingTop = '80px',
  minHeight = '80vh',
  showFooter = true,
}: AppShellProps) {
  return (
    <ToastProvider>
      <Navbar />
      <div style={{ paddingTop, minHeight }}>{children}</div>
      {showFooter && <Footer />}
    </ToastProvider>
  );
}
