"use client";

import Timeline, { type JourneyItem } from "@/components/ui/timeline";
import type { SanityJourneyItem, SanitySiteSettings } from "@/sanity/queries";

const defaultSettings = {
  textColor: "var(--color-foreground, #15172B)",
  mutedTextColor: "var(--color-muted-foreground, #6B7089)",
  activeColor: "#3D5AFE",
  backgroundColor: "var(--color-background, #F3F5FB)",
  duration: 1.4,
};

interface TimelineDemoProps extends Partial<typeof defaultSettings> {
  settings?: SanitySiteSettings | null;
  journeyItems?: SanityJourneyItem[];
}

export default function TimelineDemo({
  settings,
  journeyItems = [],
  ...props
}: TimelineDemoProps) {
  const s = { ...defaultSettings, ...props };

  const eyebrow = settings?.journeyEyebrow || "Career Path & Milestones";
  const headline =
    settings?.journeyHeadline || "From Computer Science to UI/UX Design.";
  const subtitle =
    settings?.journeySubtitle ||
    "The evolution of an engineering foundation into user research, certified design methodologies, and 15+ shipped digital products.";

  const hasSanityJourney = journeyItems.length > 0;
  const topItems: JourneyItem[] = [];
  const bottomItems: JourneyItem[] = [];

  if (hasSanityJourney) {
    journeyItems.forEach((item, index) => {
      const mapped: JourneyItem = {
        id: item._id,
        year: item.year || "",
        month: item.month || "",
        content: item.content || "",
      };
      if (item.position === "bottom") {
        bottomItems.push(mapped);
      } else if (item.position === "top") {
        topItems.push(mapped);
      } else {
        if (index % 2 === 0) topItems.push(mapped);
        else bottomItems.push(mapped);
      }
    });
  }

  return (
    <div className="bg-[#F3F5FB] text-[#15172B] w-full">
      <section
        id="work"
        className="flex flex-col items-center justify-center gap-3 px-6 text-center pt-24 pb-8"
      >
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#3D5AFE] font-semibold">
          {eyebrow}
        </p>
        <h2 className="font-display w-full text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl text-[#15172B]">
          {headline}
        </h2>
        <p className="w-full max-w-3xl text-base sm:text-lg text-[#6B7089] leading-relaxed">
          {subtitle}
        </p>
      </section>

      <Timeline
        id="timeline"
        title={settings?.timelineTitle || "Kareem's Journey."}
        subtitle={
          settings?.timelineSubtitle ||
          "Where childhood gaming curiosity meets engineering logic and human-centered design."
        }
        eyebrow={eyebrow}
        periodLabel={settings?.timelinePeriodLabel || "Childhood — Present"}
        imageUrl={
          settings?.timelineImageUrl ||
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
        }
        topItems={hasSanityJourney ? topItems : undefined}
        bottomItems={hasSanityJourney ? bottomItems : undefined}
        backgroundColor={s.backgroundColor}
        textColor={s.textColor}
        mutedTextColor={s.mutedTextColor}
        activeColor={s.activeColor}
        duration={s.duration}
      />
    </div>
  );
}
