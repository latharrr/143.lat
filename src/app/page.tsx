import { Hero } from '@/components/home/Hero';
import { Manifesto } from '@/components/home/Manifesto';
import { ServicesShowcase, CurtainCoda } from '@/components/home/ServicesShowcase';
import { ServiceList } from '@/components/home/ServiceList';
import { WorkCarousel } from '@/components/home/WorkCarousel';
import { Process, Pricing, Proof, Faq, faqJsonLd } from '@/components/home/Blocks';
import { FAQ } from '@/content/site';

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <ServicesShowcase />
      <CurtainCoda />
      {/* Light section: slides up over the coda (curtain transition). */}
      <div className="paper">
        <ServiceList />
        <WorkCarousel />
        <Process />
        <Pricing />
        <Proof />
        <Faq />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQ)) }} />
    </>
  );
}
