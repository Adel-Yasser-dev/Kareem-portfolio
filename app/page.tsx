import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/hero/hero-section";
import { AboutSection } from "@/components/about/about-section";
import TimelineDemo from "@/components/ui/timeline-demo";
import { PortfolioGallery } from "@/components/ui/portfolio-gallery";
import { ToolsSection } from "@/components/tech-stack/tech-stack-section";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import ContactWithGlobe from "@/components/ui/contact-with-globe";
import { Footer } from "@/components/layout/footer";
import { client } from "@/sanity/client";
import { PORTFOLIO_PAGE_QUERY, type PortfolioData } from "@/sanity/queries";
import { cacheLife } from "next/cache";

async function getPortfolioData(): Promise<PortfolioData> {
  "use cache";
  cacheLife("minutes");

  try {
    const data = await client.fetch<PortfolioData>(PORTFOLIO_PAGE_QUERY);
    return {
      settings: data?.settings ?? null,
      projects: data?.projects ?? [],
      journeyItems: data?.journeyItems ?? [],
      tools: data?.tools ?? [],
      testimonials: data?.testimonials ?? [],
    };
  } catch (error) {
    console.error("Failed to fetch Sanity portfolio data:", error);
    return {
      settings: null,
      projects: [],
      journeyItems: [],
      tools: [],
      testimonials: [],
    };
  }
}

export default async function Home() {
  const { settings, projects, journeyItems, tools, testimonials } =
    await getPortfolioData();

  return (
    <main className="relative min-h-screen w-full bg-[#F3F5FB] text-[#15172B] overflow-x-clip">
      <Navbar settings={settings} />
      <HeroSection settings={settings} />
      <AboutSection settings={settings} />
      <TimelineDemo settings={settings} journeyItems={journeyItems} />
      <PortfolioGallery settings={settings} sanityProjects={projects} />
      <ToolsSection settings={settings} tools={tools} />
      <AnimatedTestimonials
        settings={settings}
        sanityTestimonials={testimonials}
      />
      <ContactWithGlobe settings={settings} />
      <Footer settings={settings} />
    </main>
  );
}
