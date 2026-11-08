import { defineQuery } from "next-sanity";

export interface SanityHighlight {
  _key?: string;
  icon?: "sparkles" | "layers" | "globe" | "check";
  label?: string;
  detail?: string;
}

export interface SanityContactLink {
  _key?: string;
  icon?: "mail" | "mappin" | "clock" | "phone";
  label?: string;
  href?: string;
}

export interface SanitySocialLink {
  _key?: string;
  label?: string;
  href?: string;
}

export interface SanitySiteSettings {
  fullName?: string;
  shortName?: string;
  brandMark?: string;
  roleBadge?: string;
  navbarBio?: string;
  availableForWork?: boolean;
  availabilityText?: string;
  email?: string;
  phone?: string;
  location?: string;
  timezone?: string;
  resumeUrl?: string;

  // Hero
  heroHeadline?: string;
  heroHighlightName?: string;
  heroSubtitle?: string;
  heroPrimaryCtaText?: string;
  heroPrimaryCtaTarget?: string;
  heroSecondaryCtaText?: string;
  heroSecondaryCtaHref?: string;

  // About
  aboutEyebrow?: string;
  aboutHeadline?: string;
  aboutSubheadline?: string;
  aboutParagraphs?: string[];
  profileCard?: {
    name?: string;
    title?: string;
    handle?: string;
    status?: string;
    contactText?: string;
    avatarUrl?: string;
    miniAvatarUrl?: string;
  };
  aboutHighlights?: SanityHighlight[];

  // Section Headers
  journeyEyebrow?: string;
  journeyHeadline?: string;
  journeySubtitle?: string;
  timelineTitle?: string;
  timelineSubtitle?: string;
  timelinePeriodLabel?: string;
  timelineImageUrl?: string;

  projectsEyebrow?: string;
  projectsTitle?: string;
  projectsSubtitle?: string;
  projectsButtonText?: string;
  projectsButtonHref?: string;

  toolsEyebrow?: string;
  toolsTitle?: string;
  toolsSubtitle?: string;
  toolsBracketText?: string;

  testimonialsBadge?: string;
  testimonialsTitle?: string;
  testimonialsSubtitle?: string;
  trustedCompaniesTitle?: string;
  trustedCompanies?: string[];

  // Contact
  contactSubtitle?: string;
  contactTitle?: string;
  contactDescription?: string;
  contactChannelsHeading?: string;
  contactChannelsDescription?: string;
  contactLinks?: SanityContactLink[];

  // Footer
  footerTagline?: string;
  copyrightText?: string;
  socialLinks?: SanitySocialLink[];
}

export interface SanityProject {
  _id: string;
  title?: string;
  slug?: string;
  category?: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  externalImageUrl?: string;
  tags?: string[];
  projectUrl?: string;
  order?: number;
}

export interface SanityJourneyItem {
  _id: string;
  year?: string;
  month?: string;
  content?: string;
  position?: "top" | "bottom";
  order?: number;
}

export interface SanityToolItem {
  _id: string;
  name?: string;
  role?: string;
  specialty?: string;
  pill?: string;
  iconUrl?: string;
  brandColor?: string;
  order?: number;
}

export interface SanityTestimonial {
  _id: string;
  name?: string;
  role?: string;
  company?: string;
  content?: string;
  rating?: number;
  avatarUrl?: string;
  order?: number;
}

export interface PortfolioData {
  settings: SanitySiteSettings | null;
  projects: SanityProject[];
  journeyItems: SanityJourneyItem[];
  tools: SanityToolItem[];
  testimonials: SanityTestimonial[];
}

export const PORTFOLIO_PAGE_QUERY = defineQuery(`{
  "settings": *[_type == "siteSettings"][0]{
    fullName,
    shortName,
    brandMark,
    roleBadge,
    navbarBio,
    availableForWork,
    availabilityText,
    email,
    phone,
    location,
    timezone,
    resumeUrl,
    heroHeadline,
    heroHighlightName,
    heroSubtitle,
    heroPrimaryCtaText,
    heroPrimaryCtaTarget,
    heroSecondaryCtaText,
    heroSecondaryCtaHref,
    aboutEyebrow,
    aboutHeadline,
    aboutSubheadline,
    aboutParagraphs,
    "profileCard": {
      "name": profileCard.name,
      "title": profileCard.title,
      "handle": profileCard.handle,
      "status": profileCard.status,
      "contactText": profileCard.contactText,
      "avatarUrl": profileCard.avatarImage.asset->url,
      "miniAvatarUrl": profileCard.miniAvatarImage.asset->url
    },
    aboutHighlights[]{
      _key,
      icon,
      label,
      detail
    },
    journeyEyebrow,
    journeyHeadline,
    journeySubtitle,
    timelineTitle,
    timelineSubtitle,
    timelinePeriodLabel,
    "timelineImageUrl": timelineImage.asset->url,
    projectsEyebrow,
    projectsTitle,
    projectsSubtitle,
    projectsButtonText,
    projectsButtonHref,
    toolsEyebrow,
    toolsTitle,
    toolsSubtitle,
    toolsBracketText,
    testimonialsBadge,
    testimonialsTitle,
    testimonialsSubtitle,
    trustedCompaniesTitle,
    trustedCompanies,
    contactSubtitle,
    contactTitle,
    contactDescription,
    contactChannelsHeading,
    contactChannelsDescription,
    contactLinks[]{
      _key,
      icon,
      label,
      href
    },
    footerTagline,
    copyrightText,
    socialLinks[]{
      _key,
      label,
      href
    }
  },
  "projects": *[_type == "project"] | order(order asc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    category,
    description,
    "imageUrl": coalesce(image.asset->url, externalImageUrl),
    "imageAlt": coalesce(image.alt, title),
    externalImageUrl,
    tags,
    projectUrl,
    order
  },
  "journeyItems": *[_type == "journeyItem"] | order(order asc, _createdAt asc) {
    _id,
    year,
    month,
    content,
    position,
    order
  },
  "tools": *[_type == "toolItem"] | order(order asc, _createdAt asc) {
    _id,
    name,
    role,
    specialty,
    pill,
    "iconUrl": coalesce(iconImage.asset->url, iconUrl),
    brandColor,
    order
  },
  "testimonials": *[_type == "testimonial"] | order(order asc, _createdAt desc) {
    _id,
    name,
    role,
    company,
    content,
    rating,
    "avatarUrl": coalesce(avatarImage.asset->url, avatarUrl),
    order
  }
}`);

