import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import DemoWidget from '@/components/marketing/DemoWidget';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <DemoWidget />
    </>
  );
}
