import { config, fields, collection, singleton } from "@keystatic/core";
import { CMS_REPO } from "./src/lib/cms";

// -----------------------------------------------------------------------
// Image field helpers.
//
// This project stores page/location content inside real Keystatic
// collections, and every collection entry has a slug (its file path
// relative to the collection's base directory - e.g. "foundational/design-services").
// Keystatic's fields.image() unconditionally threads that slug into both
// the stored value AND the Admin UI's edit-form preview lookup for every
// image field nested anywhere inside the entry (verified by reading
// deserializeProps$1 in @keystatic/core's compiled bundle). To keep real,
// working image previews everywhere (per requirement 8) while still using
// real fields.image() (no fields.text fallback), every image path actually
// stored in collection-entry content has been rewritten to
// /images/{slug}/{filename} (or /logo/{slug}/{filename}) and the
// corresponding file duplicated into that per-slug subfolder. Singleton
// content (site/navbar/footer/popup) never has a slug, so those keep their
// original flat /images/{filename} paths untouched.
const contentImage = (label: string) =>
  fields.image({
    label,
    directory: "public/images",
    publicPath: "/images/",
  });

const logoImage = (label: string) =>
  fields.image({
    label,
    directory: "public/logo",
    publicPath: "/logo/",
  });

// -----------------------------------------------------------------------
// Shared enums. Every one of these is a real closed set observed across
// all content files AND confirmed to actually drive a branch in the
// rendering component (grepped SectionRenderer.astro / the section
// component itself) - see the field-by-field comments below. Anything
// that only ever takes one literal value, or isn't switched on by any
// component, is left as free text per requirement 4.

const backgroundField = () =>
  fields.select({
    label: "Background",
    options: [
      { label: "Primary Dark", value: "primary-dark" },
      { label: "Primary", value: "primary" },
      { label: "Gray", value: "gray" },
      { label: "White", value: "white" },
    ],
    defaultValue: "white",
  });

// -----------------------------------------------------------------------
// Leaf field builders for each of the 11 real section discriminants
// (hero, heroHome, content, features, featuresWithButton, valueCards,
// locations, faq, cta, contact, network - confirmed via grep across every
// page/location JSON file's "discriminant" values).

const heroFields = () => ({
  title: fields.text({ label: "Title" }),
  subtitle: fields.text({ label: "Subtitle", multiline: true }),
  badge: fields.text({ label: "Badge" }),
  image: contentImage("Image"),
  imageAlt: fields.text({ label: "Image Alt Text" }),
  buttonText: fields.text({ label: "Button Text" }),
  buttonHref: fields.text({ label: "Button Link" }),
});

// Shared "Smart Hybrid" fields for any promo card linking to a real page:
// link, image, AND title are all synchronized - pulled live from the
// linked Solutions/Indoor Billboards entry via fields.relationship (see
// src/lib/relatedLinks.ts for the render-side resolution: link ->
// /solutions/{slug} or /indoor-billboards/{slug}; image -> that entry's
// own hero-section image; title -> that entry's own top-level title).
// Only `description` stays independent, curated marketing copy - the one
// thing this round's instructions want decoupled from the target.
// fields.relationship only targets a single fixed collection, and these
// cards link into either "solutions" or "indoorBillboards", so both are
// offered as optional fields. `href` remains as a manual fallback for
// anything outside those two collections.
const relatedLinkFields = () => ({
  solutionsLink: fields.relationship({
    label: "Links to Solution (optional)",
    collection: "solutions",
    validation: { isRequired: false },
  }),
  indoorBillboardLink: fields.relationship({
    label: "Links to Indoor Billboards Page (optional)",
    collection: "indoorBillboards",
    validation: { isRequired: false },
  }),
});

const heroHomeCardFields = () => ({
  description: fields.text({ label: "Description", multiline: true }),
  href: fields.text({ label: "Link (fallback if no relationship below is set)" }),
  ...relatedLinkFields(),
});

const heroHomeFields = () => ({
  title: fields.text({ label: "Title" }),
  subtitle: fields.text({ label: "Subtitle", multiline: true }),
  badge: fields.text({ label: "Badge" }),
  // Only "cards" is ever observed and SectionRenderer never switches on it.
  variant: fields.text({ label: "Variant" }),
  cards: fields.array(fields.object(heroHomeCardFields()), {
    label: "Cards",
    // Title is no longer stored on the card itself (synced from the
    // linked page instead), so label by whichever relationship is set.
    itemLabel: (props) =>
      props.fields.solutionsLink.value ||
      props.fields.indoorBillboardLink.value ||
      "Card",
  }),
});

const contentFeatureFields = () => ({
  icon: fields.text({ label: "Icon" }),
  text: fields.text({ label: "Text", multiline: true }),
});

const contentFields = () => ({
  title: fields.text({ label: "Title" }),
  badge: fields.text({ label: "Badge" }),
  description: fields.text({ label: "Description", multiline: true }),
  // Genuinely branched: variant === "simple" routes to a different component
  // (BoostVisibility) in SectionRenderer.astro; all 3 real values kept.
  variant: fields.select({
    label: "Variant",
    options: [
      { label: "Two Column", value: "two-column" },
      { label: "Image Card", value: "image-card" },
      { label: "Simple", value: "simple" },
    ],
    defaultValue: "two-column",
  }),
  background: backgroundField(),
  image: contentImage("Image"),
  imageAlt: fields.text({ label: "Image Alt Text" }),
  // Genuinely branched: ContentWithImage.astro flips layout order on this.
  imagePosition: fields.select({
    label: "Image Position",
    options: [
      { label: "Left", value: "left" },
      { label: "Right", value: "right" },
    ],
    defaultValue: "left",
  }),
  buttonText: fields.text({ label: "Button Text" }),
  buttonHref: fields.text({ label: "Button Link" }),
  features: fields.array(fields.object(contentFeatureFields()), {
    label: "Features",
    itemLabel: (props) => props.fields.text.value || "Feature",
  }),
});

const faqItemFields = () => ({
  question: fields.text({ label: "Question" }),
  answer: fields.text({ label: "Answer", multiline: true }),
});

const faqFields = () => ({
  title: fields.text({ label: "Title" }),
  description: fields.text({ label: "Description", multiline: true }),
  badge: fields.text({ label: "Badge" }),
  // Only "accordion" is ever observed and it's never switched on.
  variant: fields.text({ label: "Variant" }),
  faqs: fields.array(fields.object(faqItemFields()), {
    label: "FAQs",
    itemLabel: (props) => props.fields.question.value || "FAQ",
  }),
});

const featureItemFields = () => ({
  title: fields.text({ label: "Title" }),
  description: fields.text({ label: "Description", multiline: true }),
  icon: fields.text({ label: "Icon" }),
});

const featuresFields = () => ({
  title: fields.text({ label: "Title" }),
  description: fields.text({ label: "Description", multiline: true }),
  badge: fields.text({ label: "Badge" }),
  // Only "default" is ever observed and it's never switched on.
  variant: fields.text({ label: "Variant" }),
  columns: fields.integer({ label: "Columns" }),
  features: fields.array(fields.object(featureItemFields()), {
    label: "Features",
    itemLabel: (props) => props.fields.title.value || "Feature",
  }),
});

const featuresWithButtonItemFields = () => ({
  title: fields.text({ label: "Title" }),
  description: fields.text({ label: "Description", multiline: true }),
  icon: fields.text({ label: "Icon" }),
  href: fields.text({ label: "Link" }),
});

const featuresWithButtonFields = () => ({
  title: fields.text({ label: "Title" }),
  description: fields.text({ label: "Description", multiline: true }),
  buttonText: fields.text({ label: "Button Text" }),
  buttonHref: fields.text({ label: "Button Link" }),
  features: fields.array(fields.object(featuresWithButtonItemFields()), {
    label: "Features",
    itemLabel: (props) => props.fields.title.value || "Feature",
  }),
});

const locationItemFields = () => ({
  name: fields.text({ label: "Name" }),
  description: fields.text({ label: "Description", multiline: true }),
  href: fields.text({ label: "Link" }),
});

const locationsSectionFields = () => ({
  title: fields.text({ label: "Title" }),
  description: fields.text({ label: "Description", multiline: true }),
  badge: fields.text({ label: "Badge" }),
  background: backgroundField(),
  mapUrl: fields.text({ label: "Map URL" }),
  // Genuinely branched: variant === "full" forces viewMode = "full" in
  // SectionRenderer.astro.
  variant: fields.select({
    label: "Variant",
    options: [
      { label: "Full", value: "full" },
      { label: "Overlay", value: "overlay" },
    ],
    defaultValue: "overlay",
  }),
  locations: fields.array(fields.object(locationItemFields()), {
    label: "Locations",
    itemLabel: (props) => props.fields.name.value || "Location",
  }),
});

const brandFields = () => ({
  name: fields.text({ label: "Name" }),
  logo: contentImage("Logo"),
});

const networkItemFields = () => ({
  title: fields.text({ label: "Title" }),
  itemsPerView: fields.integer({ label: "Items Per View" }),
  brands: fields.array(fields.object(brandFields()), {
    label: "Brands",
    itemLabel: (props) => props.fields.name.value || "Brand",
  }),
});

const networkFields = () => ({
  title: fields.text({ label: "Title" }),
  description: fields.text({ label: "Description", multiline: true }),
  networks: fields.array(fields.object(networkItemFields()), {
    label: "Networks",
    itemLabel: (props) => props.fields.title.value || "Network",
  }),
});

const valueCardFields = () => ({
  title: fields.text({ label: "Title" }),
  description: fields.text({ label: "Description", multiline: true }),
  icon: fields.text({ label: "Icon" }),
  image: contentImage("Image"),
  // Genuinely branched: FeaturesWithImage.astro switches object-fit on this.
  imageFit: fields.select({
    label: "Image Fit",
    options: [
      { label: "Cover", value: "cover" },
      { label: "Contain", value: "contain" },
    ],
    defaultValue: "cover",
  }),
});

const valueCardsFields = () => ({
  title: fields.text({ label: "Title" }),
  description: fields.text({ label: "Description", multiline: true }),
  badge: fields.text({ label: "Badge" }),
  // Genuinely branched: variant === "overlay" drives the isCarousel prop.
  variant: fields.select({
    label: "Variant",
    options: [
      { label: "Cards", value: "cards" },
      { label: "Overlay", value: "overlay" },
    ],
    defaultValue: "cards",
  }),
  cards: fields.array(fields.object(valueCardFields()), {
    label: "Cards",
    itemLabel: (props) => props.fields.title.value || "Card",
  }),
});

const formFieldFields = () => ({
  id: fields.text({ label: "ID" }),
  name: fields.text({ label: "Name" }),
  label: fields.text({ label: "Label" }),
  // Genuinely branched: FormSection.astro switches the rendered input on this.
  type: fields.select({
    label: "Field Type",
    options: [
      { label: "Text", value: "text" },
      { label: "Email", value: "email" },
      { label: "Tel", value: "tel" },
      { label: "Textarea", value: "textarea" },
    ],
    defaultValue: "text",
  }),
  placeholder: fields.text({ label: "Placeholder" }),
  required: fields.checkbox({ label: "Required" }),
  rows: fields.integer({ label: "Rows" }),
  // Only "full" is ever observed and FormSection only ever checks
  // `=== "full"` vs anything else, not a real enumerated set.
  width: fields.text({ label: "Width" }),
});

const contactInfoFields = () => ({
  email: fields.text({ label: "Email" }),
  phone: fields.text({ label: "Phone" }),
  phoneFormatted: fields.text({ label: "Phone (Formatted)" }),
  location: fields.text({ label: "Location" }),
});

const contactFields = () => ({
  title: fields.text({ label: "Title" }),
  description: fields.text({ label: "Description", multiline: true }),
  secondaryDescription: fields.text({ label: "Secondary Description", multiline: true }),
  // Only "split" is ever observed and it's never switched on.
  variant: fields.text({ label: "Variant" }),
  submitText: fields.text({ label: "Submit Button Text" }),
  submitAction: fields.text({ label: "Submit Action" }),
  contactInfo: fields.object(contactInfoFields(), { label: "Contact Info" }),
  formFields: fields.array(fields.object(formFieldFields()), {
    label: "Form Fields",
    itemLabel: (props) => props.fields.label.value || "Field",
  }),
});

// -----------------------------------------------------------------------
// Clean, beginner-friendly Title Case labels for each section discriminant
// (requirement 9) - shown as the array-item label for entries in
// sections[], instead of raw camelCase technical type strings.
const SECTION_TYPE_LABELS: Record<string, string> = {
  hero: "Hero",
  heroHome: "Hero Section",
  content: "Content Block",
  features: "Features",
  featuresWithButton: "Features Block",
  valueCards: "Value Cards",
  locations: "Locations Map",
  faq: "FAQ",
  cta: "Call To Action",
  contact: "Contact Form",
  network: "Network",
};

// -----------------------------------------------------------------------
// sections[]: fields.conditional serializes/parses to exactly
// { discriminant, value }, which is precisely the real shape used by
// every page/location JSON file's sections array (confirmed by reading
// @keystatic/core's conditional field implementation, which validates
// keys are only "discriminant"/"value").
const sectionsField = () =>
  fields.array(
    fields.conditional(
      fields.select({
        label: "Section Type",
        options: [
          { label: "Hero", value: "hero" },
          { label: "Home Hero", value: "heroHome" },
          { label: "Content", value: "content" },
          { label: "Features", value: "features" },
          { label: "Features With Button", value: "featuresWithButton" },
          { label: "Value Cards", value: "valueCards" },
          { label: "Locations", value: "locations" },
          { label: "FAQ", value: "faq" },
          { label: "CTA", value: "cta" },
          { label: "Contact", value: "contact" },
          { label: "Network", value: "network" },
        ],
        defaultValue: "hero",
      }),
      {
        hero: fields.object(heroFields()),
        heroHome: fields.object(heroHomeFields()),
        content: fields.object(contentFields()),
        features: fields.object(featuresFields()),
        featuresWithButton: fields.object(featuresWithButtonFields()),
        valueCards: fields.object(valueCardsFields()),
        locations: fields.object(locationsSectionFields()),
        faq: fields.object(faqFields()),
        cta: fields.object({
          title: fields.text({ label: "Title" }),
          description: fields.text({ label: "Description", multiline: true }),
          image: contentImage("Image"),
          imageAlt: fields.text({ label: "Image Alt Text" }),
          buttonText: fields.text({ label: "Button Text" }),
          buttonHref: fields.text({ label: "Button Link" }),
          // Genuinely branched: variant === "card" routes to CTALight
          // instead of CallToAction in SectionRenderer.astro.
          variant: fields.select({
            label: "Variant",
            options: [
              { label: "Card", value: "card" },
              { label: "Bold", value: "bold" },
              { label: "Banner", value: "banner" },
            ],
            defaultValue: "bold",
          }),
        }),
        contact: fields.object(contactFields()),
        network: fields.object(networkFields()),
      }
    ),
    {
      label: "Sections",
      // Short, human-readable Title Case label per section type (e.g.
      // "Hero Section", "Features Block", "FAQ") - not a concatenation of
      // the raw camelCase discriminant with the entry's own long title.
      itemLabel: (props) => SECTION_TYPE_LABELS[props.discriminant] || props.discriminant,
    }
  );

// -----------------------------------------------------------------------
// legalSections[] - only privacy.json and terms.json use this.
const legalSectionsField = () =>
  fields.array(
    fields.object({
      title: fields.text({ label: "Title" }),
      content: fields.text({ label: "Content", multiline: true }),
    }),
    {
      label: "Legal Sections",
      itemLabel: (props) => props.fields.title.value || "Section",
    }
  );

// -----------------------------------------------------------------------
// metadata - present on every page/location entry. noindex and openGraph
// are rare (1/22 and 2/22 entries respectively) but functionally required
// where present (confirmed via buildPageMeta/PageLayout consuming them),
// per requirement 6.
const metadataField = () =>
  fields.object(
    {
      title: fields.text({ label: "Title" }),
      description: fields.text({ label: "Description", multiline: true }),
      keywords: fields.text({ label: "Keywords" }),
      noindex: fields.checkbox({ label: "No Index" }),
      openGraph: fields.object({
        type: fields.text({ label: "Type" }),
        images: fields.array(
          fields.object({
            // Remote absolute URL (external asset), not a locally-managed
            // file - fields.image()'s directory/publicPath model doesn't
            // apply here, so this stays free text per requirement 4.
            url: fields.text({ label: "Image URL" }),
          }),
          { label: "Images", itemLabel: () => "Image" }
        ),
      }),
    },
    { label: "Metadata" }
  );

// -----------------------------------------------------------------------
// Global Elements (singletons). navbar/footer items are modeled as flat
// fields.object with a plain (non-conditional) `type` select, because
// their real shape mixes `type` with other flat sibling keys
// ({ type, title, href, items, sections, featured } etc) - NOT the
// { discriminant, value } shape fields.conditional requires (confirmed:
// attempting fields.conditional here fails the reader with
// "Must only contain keys \"discriminant\" and \"value\", not \"type\"").

const navSubItemFields = () => ({
  title: fields.text({ label: "Title" }),
  description: fields.text({ label: "Description", multiline: true }),
  href: fields.text({ label: "Link" }),
  icon: fields.text({ label: "Icon" }),
});

const navFeaturedItemFields = () => ({
  description: fields.text({ label: "Description", multiline: true }),
  href: fields.text({ label: "Link (fallback if no relationship below is set)" }),
  ...relatedLinkFields(),
});

const navSectionFields = () => ({
  label: fields.text({ label: "Label" }),
  items: fields.array(fields.object(navSubItemFields()), {
    label: "Items",
    itemLabel: (props) => props.fields.title.value || "Item",
  }),
});

const navItemFields = () => ({
  type: fields.select({
    label: "Type",
    options: [
      { label: "Link", value: "link" },
      { label: "Dropdown", value: "dropdown" },
      { label: "Megamenu", value: "megamenu" },
    ],
    defaultValue: "link",
  }),
  title: fields.text({ label: "Title" }),
  href: fields.text({ label: "Link" }),
  items: fields.array(fields.object(navSubItemFields()), {
    label: "Dropdown Items",
    itemLabel: (props) => props.fields.title.value || "Item",
  }),
  sections: fields.array(fields.object(navSectionFields()), {
    label: "Megamenu Sections",
    itemLabel: (props) => props.fields.label.value || "Section",
  }),
  featured: fields.array(fields.object(navFeaturedItemFields()), {
    label: "Megamenu Featured",
    // Title is no longer stored on the card itself (synced from the
    // linked page instead), so label by whichever relationship is set.
    itemLabel: (props) =>
      props.fields.solutionsLink.value ||
      props.fields.indoorBillboardLink.value ||
      "Featured",
  }),
});

const footerLinkFields = () => ({
  label: fields.text({ label: "Label" }),
  href: fields.text({ label: "Link" }),
});

const footerAccordionSectionFields = () => ({
  label: fields.text({ label: "Label" }),
  items: fields.array(fields.object(footerLinkFields()), {
    label: "Items",
    itemLabel: (props) => props.fields.label.value || "Item",
  }),
});

const footerColumnFields = () => ({
  type: fields.select({
    label: "Type",
    options: [
      { label: "Accordion", value: "accordion" },
      { label: "Links", value: "links" },
      { label: "Contact", value: "contact" },
    ],
    defaultValue: "links",
  }),
  title: fields.text({ label: "Title" }),
  href: fields.text({ label: "Link" }),
  sections: fields.array(fields.object(footerAccordionSectionFields()), {
    label: "Accordion Sections",
    itemLabel: (props) => props.fields.label.value || "Section",
  }),
  links: fields.array(fields.object(footerLinkFields()), {
    label: "Links",
    itemLabel: (props) => props.fields.label.value || "Link",
  }),
});

// -----------------------------------------------------------------------
// Page schema shared by every page collection. title is a slug field
// since every page is now a real collection entry requiring one.
const pageSchema = () => ({
  title: fields.slug({ name: { label: "Title" } }),
  description: fields.text({ label: "Description", multiline: true }),
  keywords: fields.text({ label: "Keywords" }),
  sections: sectionsField(),
  legalSections: legalSectionsField(),
  metadata: metadataField(),
});

// keystatic.config.ts is loaded directly by Node (outside the Vite/Astro
// SSR pipeline that powers page/middleware code), so process.env.NODE_ENV
// is the correct read here - unlike application code, which must use
// import.meta.env for anything other than NODE_ENV (see src/middleware.ts,
// src/pages/admin/login.astro, src/pages/api/admin-login.ts).
const storage =
  process.env.NODE_ENV === "production"
    ? ({ kind: "github", repo: CMS_REPO } as const)
    : ({ kind: "local" } as const);

export default config({
  storage,

  singletons: {
    site: singleton({
      label: "Site Settings",
      path: "src/content/settings/site",
      format: "json",
      schema: {
        business: fields.object({
          name: fields.text({ label: "Name" }),
          fullName: fields.text({ label: "Full Name" }),
          tagline: fields.text({ label: "Tagline" }),
          description: fields.text({ label: "Description", multiline: true }),
        }),
        location: fields.object({
          city: fields.text({ label: "City" }),
          state: fields.text({ label: "State" }),
          stateFull: fields.text({ label: "State (Full)" }),
          address: fields.text({ label: "Address" }),
          fullAddress: fields.text({ label: "Full Address" }),
        }),
        contact: fields.object({
          email: fields.text({ label: "Email" }),
          phone: fields.text({ label: "Phone" }),
          phoneFormatted: fields.text({ label: "Phone (Formatted)" }),
        }),
        colors: fields.object({
          primary: fields.text({ label: "Primary" }),
          secondary: fields.text({ label: "Secondary" }),
          tertiary: fields.text({ label: "Tertiary" }),
          quaternary: fields.text({ label: "Quaternary" }),
        }),
        logo: fields.object({
          src: logoImage("Logo"),
          whiteSrc: logoImage("Logo (White)"),
          alt: fields.text({ label: "Alt Text" }),
        }),
        social: fields.object({
          facebook: fields.text({ label: "Facebook" }),
          instagram: fields.text({ label: "Instagram" }),
          linkedin: fields.text({ label: "LinkedIn" }),
          youtube: fields.text({ label: "YouTube" }),
          twitter: fields.text({ label: "Twitter" }),
        }),
        seo: fields.object({
          siteName: fields.text({ label: "Site Name" }),
          defaultTitle: fields.text({ label: "Default Title" }),
          defaultDescription: fields.text({ label: "Default Description", multiline: true }),
          keywords: fields.text({ label: "Keywords" }),
          siteUrl: fields.text({ label: "Site URL" }),
          ogImage: logoImage("OG Image"),
          twitterHandle: fields.text({ label: "Twitter Handle" }),
        }),
        analytics: fields.object({
          googleAnalyticsId: fields.text({ label: "Google Analytics ID" }),
        }),
      },
    }),

    navbar: singleton({
      label: "Navigation",
      path: "src/content/settings/navbar",
      format: "json",
      schema: {
        navItems: fields.array(fields.object(navItemFields()), {
          label: "Nav Items",
          itemLabel: (props) => props.fields.title.value || "Item",
        }),
        ctaButton: fields.object({
          text: fields.text({ label: "Text" }),
          href: fields.text({ label: "Link" }),
        }),
      },
    }),

    footer: singleton({
      label: "Footer",
      path: "src/content/settings/footer",
      format: "json",
      schema: {
        description: fields.text({ label: "Description", multiline: true }),
        columns: fields.array(fields.object(footerColumnFields()), {
          label: "Columns",
          itemLabel: (props) => props.fields.title.value || "Column",
        }),
        bottomLinks: fields.array(fields.object(footerLinkFields()), {
          label: "Bottom Links",
          itemLabel: (props) => props.fields.label.value || "Link",
        }),
      },
    }),

    popup: singleton({
      label: "Popup",
      path: "src/content/settings/popup",
      format: "json",
      schema: {
        enabled: fields.checkbox({ label: "Enabled" }),
        title: fields.text({ label: "Title" }),
        description: fields.text({ label: "Description", multiline: true }),
        buttonText: fields.text({ label: "Button Text" }),
        buttonHref: fields.text({ label: "Button Link" }),
        image: contentImage("Image"),
        delay: fields.integer({ label: "Delay (seconds)" }),
      },
    }),
  },

  collections: {
    mainPages: collection({
      label: "Main Pages",
      path: "src/data/pages/main/*",
      format: "json",
      slugField: "title",
      schema: pageSchema(),
    }),
    solutions: collection({
      label: "Solutions",
      // Recursive glob: real files live in 3 subfolders
      // (foundational/, lead-gen/, branding-awareness/) - confirmed the
      // reader discovers all 9 nested entries with slugs like
      // "foundational/design-services".
      path: "src/data/pages/solutions/**",
      format: "json",
      slugField: "title",
      schema: pageSchema(),
    }),
    indoorBillboards: collection({
      label: "Indoor Billboards",
      path: "src/data/pages/indoor-billboards/*",
      format: "json",
      slugField: "title",
      schema: pageSchema(),
    }),
    legal: collection({
      label: "Legal",
      path: "src/data/pages/legal/*",
      format: "json",
      slugField: "title",
      schema: pageSchema(),
    }),
    locations: collection({
      label: "Location Pages",
      path: "src/data/locations/*",
      format: "json",
      slugField: "title",
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        city: fields.text({ label: "City" }),
        description: fields.text({ label: "Description", multiline: true }),
        keywords: fields.text({ label: "Keywords" }),
        sections: sectionsField(),
        metadata: metadataField(),
      },
    }),
  },

  ui: {
    navigation: {
      "Global Elements": ["site", "navbar", "footer", "popup"],
      // "Collections" exactly matches Keystatic's own default fallback
      // grouping label (confirmed in @keystatic/core's compiled bundle),
      // so this reproduces the native "COLLECTIONS" sidebar header while
      // still letting Global Elements sit above it.
      Collections: ["mainPages", "solutions", "indoorBillboards", "legal", "locations"],
    },
  },
});
