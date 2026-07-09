import { makeGenericAPIRouteHandler } from '@keystatic/core/api/generic';
import { parseString } from 'set-cookie-parser';
import { config as config$1, collection, singleton, fields } from '@keystatic/core';

function makeHandler(_config) {
  return async function keystaticAPIRoute(context) {
    var _context$locals, _ref, _config$clientId, _ref2, _config$clientSecret, _ref3, _config$secret;
    const envVarsForCf = (_context$locals = context.locals) === null || _context$locals === void 0 || (_context$locals = _context$locals.runtime) === null || _context$locals === void 0 ? void 0 : _context$locals.env;
    const handler = makeGenericAPIRouteHandler({
      ..._config,
      clientId: (_ref = (_config$clientId = _config.clientId) !== null && _config$clientId !== void 0 ? _config$clientId : envVarsForCf === null || envVarsForCf === void 0 ? void 0 : envVarsForCf.KEYSTATIC_GITHUB_CLIENT_ID) !== null && _ref !== void 0 ? _ref : tryOrUndefined(() => {
        return "Iv23lih6qDkqDOIAu6D1";
      }),
      clientSecret: (_ref2 = (_config$clientSecret = _config.clientSecret) !== null && _config$clientSecret !== void 0 ? _config$clientSecret : envVarsForCf === null || envVarsForCf === void 0 ? void 0 : envVarsForCf.KEYSTATIC_GITHUB_CLIENT_SECRET) !== null && _ref2 !== void 0 ? _ref2 : tryOrUndefined(() => {
        return "c0a6e0349cfd315d21fa40dac5bdda9304e25124";
      }),
      secret: (_ref3 = (_config$secret = _config.secret) !== null && _config$secret !== void 0 ? _config$secret : envVarsForCf === null || envVarsForCf === void 0 ? void 0 : envVarsForCf.KEYSTATIC_SECRET) !== null && _ref3 !== void 0 ? _ref3 : tryOrUndefined(() => {
        return "274fff6b3b798b98228094ce8c30d9f8277f31f5e74589413d276d0be4f4f83c";
      })
    }, {
      slugEnvName: "PUBLIC_KEYSTATIC_GITHUB_APP_SLUG"
    });
    const {
      body,
      headers,
      status
    } = await handler(context.request);
    let headersInADifferentStructure = /* @__PURE__ */ new Map();
    if (headers) {
      if (Array.isArray(headers)) {
        for (const [key, value] of headers) {
          if (!headersInADifferentStructure.has(key.toLowerCase())) {
            headersInADifferentStructure.set(key.toLowerCase(), []);
          }
          headersInADifferentStructure.get(key.toLowerCase()).push(value);
        }
      } else if (typeof headers.entries === "function") {
        for (const [key, value] of headers.entries()) {
          headersInADifferentStructure.set(key.toLowerCase(), [value]);
        }
        if ("getSetCookie" in headers && typeof headers.getSetCookie === "function") {
          const setCookieHeaders2 = headers.getSetCookie();
          if (setCookieHeaders2 !== null && setCookieHeaders2 !== void 0 && setCookieHeaders2.length) {
            headersInADifferentStructure.set("set-cookie", setCookieHeaders2);
          }
        }
      } else {
        for (const [key, value] of Object.entries(headers)) {
          headersInADifferentStructure.set(key.toLowerCase(), [value]);
        }
      }
    }
    const setCookieHeaders = headersInADifferentStructure.get("set-cookie");
    headersInADifferentStructure.delete("set-cookie");
    if (setCookieHeaders) {
      for (const setCookieValue of setCookieHeaders) {
        var _options$sameSite;
        const {
          name,
          value,
          ...options
        } = parseString(setCookieValue);
        const sameSite = (_options$sameSite = options.sameSite) === null || _options$sameSite === void 0 ? void 0 : _options$sameSite.toLowerCase();
        context.cookies.set(name, value, {
          domain: options.domain,
          expires: options.expires,
          httpOnly: options.httpOnly,
          maxAge: options.maxAge,
          path: options.path,
          sameSite: sameSite === "lax" || sameSite === "strict" || sameSite === "none" ? sameSite : void 0
        });
      }
    }
    return new Response(body, {
      status,
      headers: [...headersInADifferentStructure.entries()].flatMap(([key, val]) => val.map((x) => [key, x]))
    });
  };
}
function tryOrUndefined(fn) {
  try {
    return fn();
  } catch {
    return void 0;
  }
}

const contentImage = (label) => fields.image({
  label,
  directory: "public/images",
  publicPath: "/images/"
});
const logoImage = (label) => fields.image({
  label,
  directory: "public/logo",
  publicPath: "/logo/"
});
const backgroundField = () => fields.select({
  label: "Background",
  options: [
    { label: "Primary Dark", value: "primary-dark" },
    { label: "Primary", value: "primary" },
    { label: "Gray", value: "gray" },
    { label: "White", value: "white" }
  ],
  defaultValue: "white"
});
const heroFields = () => ({
  title: fields.text({ label: "Title" }),
  subtitle: fields.text({ label: "Subtitle", multiline: true }),
  badge: fields.text({ label: "Badge" }),
  image: contentImage("Image"),
  imageAlt: fields.text({ label: "Image Alt Text" }),
  buttonText: fields.text({ label: "Button Text" }),
  buttonHref: fields.text({ label: "Button Link" })
});
const heroHomeCardFields = () => ({
  title: fields.text({ label: "Title" }),
  description: fields.text({ label: "Description", multiline: true }),
  image: contentImage("Image"),
  href: fields.text({ label: "Link" })
});
const heroHomeFields = () => ({
  title: fields.text({ label: "Title" }),
  subtitle: fields.text({ label: "Subtitle", multiline: true }),
  badge: fields.text({ label: "Badge" }),
  // Only "cards" is ever observed and SectionRenderer never switches on it.
  variant: fields.text({ label: "Variant" }),
  cards: fields.array(fields.object(heroHomeCardFields()), {
    label: "Cards",
    itemLabel: (props) => props.fields.title.value || "Card"
  })
});
const contentFeatureFields = () => ({
  icon: fields.text({ label: "Icon" }),
  text: fields.text({ label: "Text", multiline: true })
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
      { label: "Simple", value: "simple" }
    ],
    defaultValue: "two-column"
  }),
  background: backgroundField(),
  image: contentImage("Image"),
  imageAlt: fields.text({ label: "Image Alt Text" }),
  // Genuinely branched: ContentWithImage.astro flips layout order on this.
  imagePosition: fields.select({
    label: "Image Position",
    options: [
      { label: "Left", value: "left" },
      { label: "Right", value: "right" }
    ],
    defaultValue: "left"
  }),
  buttonText: fields.text({ label: "Button Text" }),
  buttonHref: fields.text({ label: "Button Link" }),
  features: fields.array(fields.object(contentFeatureFields()), {
    label: "Features",
    itemLabel: (props) => props.fields.text.value || "Feature"
  })
});
const faqItemFields = () => ({
  question: fields.text({ label: "Question" }),
  answer: fields.text({ label: "Answer", multiline: true })
});
const faqFields = () => ({
  title: fields.text({ label: "Title" }),
  description: fields.text({ label: "Description", multiline: true }),
  badge: fields.text({ label: "Badge" }),
  // Only "accordion" is ever observed and it's never switched on.
  variant: fields.text({ label: "Variant" }),
  faqs: fields.array(fields.object(faqItemFields()), {
    label: "FAQs",
    itemLabel: (props) => props.fields.question.value || "FAQ"
  })
});
const featureItemFields = () => ({
  title: fields.text({ label: "Title" }),
  description: fields.text({ label: "Description", multiline: true }),
  icon: fields.text({ label: "Icon" })
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
    itemLabel: (props) => props.fields.title.value || "Feature"
  })
});
const featuresWithButtonItemFields = () => ({
  title: fields.text({ label: "Title" }),
  description: fields.text({ label: "Description", multiline: true }),
  icon: fields.text({ label: "Icon" }),
  href: fields.text({ label: "Link" })
});
const featuresWithButtonFields = () => ({
  title: fields.text({ label: "Title" }),
  description: fields.text({ label: "Description", multiline: true }),
  buttonText: fields.text({ label: "Button Text" }),
  buttonHref: fields.text({ label: "Button Link" }),
  features: fields.array(fields.object(featuresWithButtonItemFields()), {
    label: "Features",
    itemLabel: (props) => props.fields.title.value || "Feature"
  })
});
const locationItemFields = () => ({
  name: fields.text({ label: "Name" }),
  description: fields.text({ label: "Description", multiline: true }),
  href: fields.text({ label: "Link" })
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
      { label: "Overlay", value: "overlay" }
    ],
    defaultValue: "overlay"
  }),
  locations: fields.array(fields.object(locationItemFields()), {
    label: "Locations",
    itemLabel: (props) => props.fields.name.value || "Location"
  })
});
const brandFields = () => ({
  name: fields.text({ label: "Name" }),
  logo: contentImage("Logo")
});
const networkItemFields = () => ({
  title: fields.text({ label: "Title" }),
  itemsPerView: fields.integer({ label: "Items Per View" }),
  brands: fields.array(fields.object(brandFields()), {
    label: "Brands",
    itemLabel: (props) => props.fields.name.value || "Brand"
  })
});
const networkFields = () => ({
  title: fields.text({ label: "Title" }),
  description: fields.text({ label: "Description", multiline: true }),
  networks: fields.array(fields.object(networkItemFields()), {
    label: "Networks",
    itemLabel: (props) => props.fields.title.value || "Network"
  })
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
      { label: "Contain", value: "contain" }
    ],
    defaultValue: "cover"
  })
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
      { label: "Overlay", value: "overlay" }
    ],
    defaultValue: "cards"
  }),
  cards: fields.array(fields.object(valueCardFields()), {
    label: "Cards",
    itemLabel: (props) => props.fields.title.value || "Card"
  })
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
      { label: "Textarea", value: "textarea" }
    ],
    defaultValue: "text"
  }),
  placeholder: fields.text({ label: "Placeholder" }),
  required: fields.checkbox({ label: "Required" }),
  rows: fields.integer({ label: "Rows" }),
  // Only "full" is ever observed and FormSection only ever checks
  // `=== "full"` vs anything else, not a real enumerated set.
  width: fields.text({ label: "Width" })
});
const contactInfoFields = () => ({
  email: fields.text({ label: "Email" }),
  phone: fields.text({ label: "Phone" }),
  phoneFormatted: fields.text({ label: "Phone (Formatted)" }),
  location: fields.text({ label: "Location" })
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
    itemLabel: (props) => props.fields.label.value || "Field"
  })
});
const SECTION_TYPE_LABELS = {
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
  network: "Network"
};
const sectionsField = () => fields.array(
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
        { label: "Network", value: "network" }
      ],
      defaultValue: "hero"
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
            { label: "Banner", value: "banner" }
          ],
          defaultValue: "bold"
        })
      }),
      contact: fields.object(contactFields()),
      network: fields.object(networkFields())
    }
  ),
  {
    label: "Sections",
    // Short, human-readable Title Case label per section type (e.g.
    // "Hero Section", "Features Block", "FAQ") - not a concatenation of
    // the raw camelCase discriminant with the entry's own long title.
    itemLabel: (props) => SECTION_TYPE_LABELS[props.discriminant] || props.discriminant
  }
);
const legalSectionsField = () => fields.array(
  fields.object({
    title: fields.text({ label: "Title" }),
    content: fields.text({ label: "Content", multiline: true })
  }),
  {
    label: "Legal Sections",
    itemLabel: (props) => props.fields.title.value || "Section"
  }
);
const metadataField = () => fields.object(
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
          url: fields.text({ label: "Image URL" })
        }),
        { label: "Images", itemLabel: () => "Image" }
      )
    })
  },
  { label: "Metadata" }
);
const navSubItemFields = () => ({
  title: fields.text({ label: "Title" }),
  description: fields.text({ label: "Description", multiline: true }),
  href: fields.text({ label: "Link" }),
  icon: fields.text({ label: "Icon" })
});
const navFeaturedItemFields = () => ({
  title: fields.text({ label: "Title" }),
  description: fields.text({ label: "Description", multiline: true }),
  href: fields.text({ label: "Link" }),
  thumbnail: contentImage("Thumbnail")
});
const navSectionFields = () => ({
  label: fields.text({ label: "Label" }),
  items: fields.array(fields.object(navSubItemFields()), {
    label: "Items",
    itemLabel: (props) => props.fields.title.value || "Item"
  })
});
const navItemFields = () => ({
  type: fields.select({
    label: "Type",
    options: [
      { label: "Link", value: "link" },
      { label: "Dropdown", value: "dropdown" },
      { label: "Megamenu", value: "megamenu" }
    ],
    defaultValue: "link"
  }),
  title: fields.text({ label: "Title" }),
  href: fields.text({ label: "Link" }),
  items: fields.array(fields.object(navSubItemFields()), {
    label: "Dropdown Items",
    itemLabel: (props) => props.fields.title.value || "Item"
  }),
  sections: fields.array(fields.object(navSectionFields()), {
    label: "Megamenu Sections",
    itemLabel: (props) => props.fields.label.value || "Section"
  }),
  featured: fields.array(fields.object(navFeaturedItemFields()), {
    label: "Megamenu Featured",
    itemLabel: (props) => props.fields.title.value || "Featured"
  })
});
const footerLinkFields = () => ({
  label: fields.text({ label: "Label" }),
  href: fields.text({ label: "Link" })
});
const footerAccordionSectionFields = () => ({
  label: fields.text({ label: "Label" }),
  items: fields.array(fields.object(footerLinkFields()), {
    label: "Items",
    itemLabel: (props) => props.fields.label.value || "Item"
  })
});
const footerColumnFields = () => ({
  type: fields.select({
    label: "Type",
    options: [
      { label: "Accordion", value: "accordion" },
      { label: "Links", value: "links" },
      { label: "Contact", value: "contact" }
    ],
    defaultValue: "links"
  }),
  title: fields.text({ label: "Title" }),
  href: fields.text({ label: "Link" }),
  sections: fields.array(fields.object(footerAccordionSectionFields()), {
    label: "Accordion Sections",
    itemLabel: (props) => props.fields.label.value || "Section"
  }),
  links: fields.array(fields.object(footerLinkFields()), {
    label: "Links",
    itemLabel: (props) => props.fields.label.value || "Link"
  })
});
const pageSchema = () => ({
  title: fields.slug({ name: { label: "Title" } }),
  description: fields.text({ label: "Description", multiline: true }),
  keywords: fields.text({ label: "Keywords" }),
  sections: sectionsField(),
  legalSections: legalSectionsField(),
  metadata: metadataField()
});
const config = config$1({
  storage: { kind: "local" },
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
          description: fields.text({ label: "Description", multiline: true })
        }),
        location: fields.object({
          city: fields.text({ label: "City" }),
          state: fields.text({ label: "State" }),
          stateFull: fields.text({ label: "State (Full)" }),
          address: fields.text({ label: "Address" }),
          fullAddress: fields.text({ label: "Full Address" })
        }),
        contact: fields.object({
          email: fields.text({ label: "Email" }),
          phone: fields.text({ label: "Phone" }),
          phoneFormatted: fields.text({ label: "Phone (Formatted)" })
        }),
        colors: fields.object({
          primary: fields.text({ label: "Primary" }),
          secondary: fields.text({ label: "Secondary" }),
          tertiary: fields.text({ label: "Tertiary" }),
          quaternary: fields.text({ label: "Quaternary" })
        }),
        logo: fields.object({
          src: logoImage("Logo"),
          whiteSrc: logoImage("Logo (White)"),
          alt: fields.text({ label: "Alt Text" })
        }),
        social: fields.object({
          facebook: fields.text({ label: "Facebook" }),
          instagram: fields.text({ label: "Instagram" }),
          linkedin: fields.text({ label: "LinkedIn" }),
          youtube: fields.text({ label: "YouTube" }),
          twitter: fields.text({ label: "Twitter" })
        }),
        seo: fields.object({
          siteName: fields.text({ label: "Site Name" }),
          defaultTitle: fields.text({ label: "Default Title" }),
          defaultDescription: fields.text({ label: "Default Description", multiline: true }),
          keywords: fields.text({ label: "Keywords" }),
          siteUrl: fields.text({ label: "Site URL" }),
          ogImage: logoImage("OG Image"),
          twitterHandle: fields.text({ label: "Twitter Handle" })
        }),
        analytics: fields.object({
          googleAnalyticsId: fields.text({ label: "Google Analytics ID" })
        })
      }
    }),
    navbar: singleton({
      label: "Navigation",
      path: "src/content/settings/navbar",
      format: "json",
      schema: {
        navItems: fields.array(fields.object(navItemFields()), {
          label: "Nav Items",
          itemLabel: (props) => props.fields.title.value || "Item"
        }),
        ctaButton: fields.object({
          text: fields.text({ label: "Text" }),
          href: fields.text({ label: "Link" })
        })
      }
    }),
    footer: singleton({
      label: "Footer",
      path: "src/content/settings/footer",
      format: "json",
      schema: {
        description: fields.text({ label: "Description", multiline: true }),
        columns: fields.array(fields.object(footerColumnFields()), {
          label: "Columns",
          itemLabel: (props) => props.fields.title.value || "Column"
        }),
        bottomLinks: fields.array(fields.object(footerLinkFields()), {
          label: "Bottom Links",
          itemLabel: (props) => props.fields.label.value || "Link"
        })
      }
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
        delay: fields.integer({ label: "Delay (seconds)" })
      }
    })
  },
  collections: {
    mainPages: collection({
      label: "Main Pages",
      path: "src/data/pages/main/*",
      format: "json",
      slugField: "title",
      schema: pageSchema()
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
      schema: pageSchema()
    }),
    indoorBillboards: collection({
      label: "Indoor Billboards",
      path: "src/data/pages/indoor-billboards/*",
      format: "json",
      slugField: "title",
      schema: pageSchema()
    }),
    legal: collection({
      label: "Legal",
      path: "src/data/pages/legal/*",
      format: "json",
      slugField: "title",
      schema: pageSchema()
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
        metadata: metadataField()
      }
    })
  },
  ui: {
    navigation: {
      "Global Elements": ["site", "navbar", "footer", "popup"],
      // "Collections" exactly matches Keystatic's own default fallback
      // grouping label (confirmed in @keystatic/core's compiled bundle),
      // so this reproduces the native "COLLECTIONS" sidebar header while
      // still letting Global Elements sit above it.
      Collections: ["mainPages", "solutions", "indoorBillboards", "legal", "locations"]
    }
  }
});

const all = makeHandler({ config });
const ALL = all;

const prerender = false;

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ALL,
  all,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
