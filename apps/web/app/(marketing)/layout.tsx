import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import DemoWidget from '@/components/marketing/DemoWidget';
import HashScroll from '@/components/marketing/HashScroll';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <HashScroll />
      <main>{children}</main>
      <Footer />
      <DemoWidget />
    </>
  );
}
