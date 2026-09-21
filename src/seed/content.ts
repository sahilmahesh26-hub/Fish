import { doc, p, h, list } from './lexical'

/**
 * Approved seed content.
 *
 * Everything here is copy Finquiry has signed off, or a deliberately neutral
 * placeholder. Nothing in this file invents a testimonial, a customer name, a
 * delivery, a statistic, a vendor claim or a price.
 */

export const SOURCING_CATEGORIES = [
  {
    name: 'Arowanas',
    shortDescription: 'Specific varieties, colour development and preferred size bands.',
    order: 10,
  },
  {
    name: 'Stingrays',
    shortDescription: 'Selected varieties matched to tank footprint and collector requirements.',
    order: 20,
  },
  {
    name: 'Monster fish',
    shortDescription: 'Large-growing species for suitable, established systems.',
    order: 30,
  },
  {
    name: 'Exotic freshwater fish',
    shortDescription: 'Uncommon varieties that may not be available locally.',
    order: 40,
  },
  {
    name: 'Predatory fish',
    shortDescription: 'Collector-led searches with compatibility and system context.',
    order: 50,
  },
  {
    name: 'Specific-size specimens',
    shortDescription: 'When the size range matters as much as the species.',
    order: 60,
  },
  {
    name: 'Special collector requests',
    shortDescription: 'Share a reference image or describe what you have been unable to find.',
    order: 70,
  },
]

export const KNOWLEDGE_CATEGORIES = [
  { name: 'Sourcing', order: 10 },
  { name: 'Specimen Evaluation', order: 20 },
  { name: 'Aquarium Planning', order: 30 },
  { name: 'Transport and Arrival', order: 40 },
  { name: 'Collector Guides', order: 50 },
]

export const STARTER_POSTS = [
  {
    title: 'How to evaluate a fish through photos and video',
    category: 'specimen-evaluation',
    excerpt:
      'What to look for, and what to ask for, when the only view you have of a specimen is a photograph or a short clip.',
  },
  {
    title: 'Why size ranges matter when sourcing a specimen',
    category: 'sourcing',
    excerpt:
      'A stated size is a snapshot, not a guarantee. Here is how to describe the range you will actually accept.',
  },
  {
    title: 'Preparing your aquarium before a new fish arrives',
    category: 'aquarium-planning',
    excerpt:
      'Cycling, water parameters, quarantine and tank mates, the checks worth completing before a dispatch date is set.',
  },
  {
    title: 'What affects the price of a collector fish',
    category: 'collector-guides',
    excerpt:
      'Variety, size, colour development, origin and transport all move the number. Individual pricing explained.',
  },
  {
    title: 'Common acclimatisation mistakes after transport',
    category: 'transport-and-arrival',
    excerpt: 'The first few hours after arrival matter more than most of the following month.',
  },
  {
    title: 'Questions to ask before approving an interstate delivery',
    category: 'transport-and-arrival',
    excerpt:
      'Packing, transit time, temperature, documentation and what happens if something changes en route.',
  },
]

export const FAQS = [
  {
    question: 'Do you hold stock of the fish shown on the website?',
    category: 'sourcing',
    order: 10,
    answer: doc(
      p(
        'No. Finquiry is a sourcing service, not a shop with a live inventory. The categories on this site describe the kinds of search we support. Every search begins with your requirement, and we only present a specimen once we have checked it is genuinely available.',
      ),
    ),
  },
  {
    question: 'How long does a search usually take?',
    category: 'sourcing',
    order: 20,
    answer: doc(
      p(
        'It depends entirely on the species, variety and size band you are looking for. Some requirements are matched within a few days; a specific variety at a specific size can take considerably longer. We will tell you honestly what we expect once we have reviewed your requirement.',
      ),
    ),
  },
  {
    question: 'Will I see the actual fish before I pay?',
    category: 'sourcing',
    order: 30,
    answer: doc(
      p(
        'Yes. We share current photographs, video where available, approximate size, origin and any other details we can confirm for that individual specimen. Payment and preparation only begin after you approve a specific fish in writing.',
      ),
    ),
  },
  {
    question: 'Can a different fish be substituted if my choice becomes unavailable?',
    category: 'sourcing',
    order: 40,
    answer: doc(
      p(
        'Never without your approval. If a specimen becomes unavailable or its condition changes, we tell you and restart the search or present alternatives for you to review. Nothing is substituted, prepared or dispatched on your behalf.',
      ),
    ),
  },
  {
    question: 'How is pricing decided?',
    category: 'pricing',
    order: 50,
    answer: doc(
      p(
        'Pricing is individual to the specimen. Variety, size, colour development, origin, current availability and the transport route all affect it, so we do not publish a single price for a species. You receive a specific price for a specific fish, together with the delivery terms that apply.',
      ),
    ),
  },
  {
    question: 'Do you deliver to other cities and states?',
    category: 'delivery',
    order: 60,
    answer: doc(
      p(
        'Yes. We coordinate documentation, preparation, packing, transport and arrival communication for interstate deliveries within India. Routes, timings and any limitations are confirmed with you before you approve a specimen.',
      ),
    ),
  },
  {
    question: 'Can you help design an aquarium for a particular fish?',
    category: 'aquariums',
    order: 70,
    answer: doc(
      p(
        'Yes. We plan custom aquariums around the specimen rather than only the room, tank dimensions, filtration, stands and cabinets, lighting, equipment and installation coordination. Share the species, its expected adult size, the space you have and your city to begin.',
      ),
    ),
  },
  {
    question: 'What happens if I want a species that is restricted?',
    category: 'general',
    order: 80,
    answer: doc(
      p(
        'We decline it. Finquiry does not accept restricted or questionable sourcing requests, and we will say so plainly rather than take a request we cannot fulfil lawfully.',
      ),
    ),
  },
]

/**
 * Policy pages.
 *
 * Section headings plus neutral explanatory placeholders only. No definitive
 * liability, refund, mortality, transport or legal-species promise is made
 * here — each page is flagged for legal review before publication.
 */
export const POLICY_PAGES = [
  {
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    intro:
      'How Finquiry collects, uses and protects the information you share when you submit a sourcing requirement or contact our team.',
    content: doc(
      h('h2', 'Who operates this website'),
      p(
        'This section will name the business operating Finquiry, its registered address and its contact details. Those values are supplied by the business owner before publication.',
      ),
      h('h2', 'Information you submit through the sourcing form'),
      p(
        'The sourcing form collects your name, WhatsApp number, optional email address, city, state and PIN code, together with the details of the fish you are looking for, your aquarium, your budget range, your timeline and your delivery destination.',
      ),
      p(
        'We ask for this because a sourcing request cannot be answered without it: the species and size drive the search, and the destination drives what delivery is possible.',
      ),
      h('h2', 'Reference images and uploads'),
      p(
        'If you upload a reference image, it is stored privately and is visible only to the Finquiry sourcing team. It is never published on this website, never added to the public media library, and never shared with an analytics provider.',
      ),
      h('h2', 'Technical and analytics data'),
      p(
        'If you agree to analytics cookies, we collect anonymous usage measurement, which pages are read, which buttons are used. This never includes your name, number, email, PIN code, budget or requirement text. See the Cookie Policy for the detail.',
      ),
      h('h2', 'How we use your information'),
      list([
        'To review your requirement and ask any follow-up questions.',
        'To search our network of aquarium stores, breeders, importers, wholesalers and collectors.',
        'To share suitable specimens with you, including photographs, video and individual pricing.',
        'To coordinate documentation, preparation, packing, transport and arrival once you approve a specimen.',
      ]),
      h('h2', 'WhatsApp and other communication'),
      p(
        'Most conversation happens on WhatsApp, because that is where collectors want it. WhatsApp is operated by a third party under its own privacy terms, which we do not control. The link from this website opens WhatsApp with a short prefilled message containing your Request ID and the fish you asked about, never your name, number, budget or full requirement.',
      ),
      h('h2', 'Service providers'),
      p(
        'This section will list the categories of third party that may process information on our behalf, website hosting, database hosting, file storage and email delivery, once those providers are confirmed.',
      ),
      h('h2', 'Retention'),
      p(
        'This section will state how long enquiry records and uploaded reference images are kept. Requires review before publication.',
      ),
      h('h2', 'Security'),
      p(
        'Enquiry records are private and are not readable through any public interface. Reference images are stored outside the public website and are served only to an authenticated member of the Finquiry team. No security measure is perfect, and we do not claim otherwise.',
      ),
      h('h2', 'Cookies'),
      p('See the Cookie Policy for what is stored on your device and how to change it.'),
      h('h2', 'Your choices and requests'),
      p(
        'This section will describe how to ask for a copy of the information we hold about you, ask for it to be corrected, or ask for it to be deleted, and how long we take to respond.',
      ),
      h('h2', "Children's privacy"),
      p(
        'This website is intended for adults. We do not knowingly collect information from children.',
      ),
      h('h2', 'Changes to this policy'),
      p(
        'This section will describe how changes are published and how you will be told about material ones.',
      ),
      h('h2', 'Contact'),
      p(
        'This section will confirm the email address for privacy questions, once the business contact details are supplied.',
      ),
    ),
  },
  {
    title: 'Terms and Conditions',
    slug: 'terms-and-conditions',
    intro: 'The basis on which Finquiry provides its sourcing and aquarium services.',
    content: doc(
      h('h2', 'About these terms'),
      p(
        'This section will set out who these terms apply to, when they take effect, and the business entity behind them. The legal name and registered address are supplied by the owner before publication.',
      ),
      h('h2', 'Nature of the sourcing service'),
      p(
        'Finquiry is a sourcing service, not a shop. We do not hold stock and we do not present fish as permanently available products. We take your requirement, search a network of aquarium stores, breeders, importers, wholesalers and collectors, and share the options we can actually confirm.',
      ),
      h('h2', 'An enquiry is not a confirmed order'),
      p(
        'Submitting the sourcing form starts a search. It does not create an order, reserve a specimen or oblige either side to proceed.',
      ),
      h('h2', 'Availability is not guaranteed'),
      p(
        'We never promise a fish before we have checked. Availability and condition can change between a specimen being offered and being dispatched, and we reconfirm before payment and before dispatch.',
      ),
      h('h2', 'Specimen-specific approval'),
      p(
        'You approve a specific individual fish, in writing. Nothing is substituted, prepared or dispatched without that approval.',
      ),
      h('h2', 'Individual pricing'),
      p(
        'Pricing is quoted for a specific specimen. Variety, size, colour development, origin, current availability and the transport route all affect it, which is why no single published price applies to a species.',
      ),
      h('h2', 'Payments'),
      p(
        'This section will describe accepted payment methods and when payment falls due. Requires legal review before any commitment is stated.',
      ),
      h('h2', 'Delivery and transport'),
      p(
        'This section will describe how delivery is coordinated, what documentation is provided, and the limits of what can be guaranteed in transit. Requires legal review.',
      ),
      h('h2', 'Information you provide'),
      p(
        'Our search is only as good as the requirement you give us. Aquarium dimensions, existing inhabitants and readiness matter to whether a specimen suits your system, and we rely on what you tell us being accurate.',
      ),
      h('h2', 'Aquarium readiness and your responsibilities'),
      p(
        'This section will set out what needs to be ready before a fish is dispatched, and what falls to you once it arrives. Requires legal review.',
      ),
      h('h2', 'Cancellation, refunds and claims'),
      p(
        'PLACEHOLDER, requires legal review. No refund, mortality, replacement or claims commitment is stated here until it has been reviewed and approved.',
      ),
      h('h2', 'Restricted or unlawful requests'),
      p(
        'We decline requests for species that may not lawfully be kept, traded or transported, and requests where the legality or origin of a specimen cannot be established. See the Restricted-Species Policy.',
      ),
      h('h2', 'Media and testimonials'),
      p(
        'Photographs, video and customer quotes are published only with the customer\u2019s written permission. A delivery story is never published without it.',
      ),
      h('h2', 'Intellectual property'),
      p(
        'This section will describe ownership of the website content, photography and marks. Requires review.',
      ),
      h('h2', 'Service availability'),
      p('We aim to keep this website available but do not guarantee uninterrupted access.'),
      h('h2', 'Limitation of liability and disputes'),
      p(
        'PLACEHOLDER, requires legal review. No limitation of liability, governing law or dispute-resolution provision is stated here until it has been reviewed and approved.',
      ),
      h('h2', 'Contact'),
      p('This section will confirm the contact address for questions about these terms.'),
    ),
  },
  {
    title: 'Cookie Policy',
    slug: 'cookie-policy',
    intro: 'What this website stores on your device, why, and how to change your mind at any time.',
    content: doc(
      p(
        'This site uses very few cookies. Nothing optional is set until you agree to it, and you can change that decision at any time using the **Cookie preferences** link in the footer.',
      ),
      h('h2', 'Necessary cookies'),
      p(
        'These are needed for the site to work and cannot be switched off. They store your cookie choice so you are not asked on every page, keep your place in the sourcing form if you reload, and help protect the form from automated abuse.',
      ),
      list([
        'finquiry_consent, records your cookie choice. Expires after one year.',
        'Short-lived form protection values, cleared when you close the browser.',
      ]),
      h('h2', 'Analytics cookies'),
      p(
        'Off by default. If you agree, we measure which pages are read and which buttons are used, so we can improve the site. This is anonymous measurement: it never includes your name, phone number, email address, PIN code, budget, the details of your requirement, or any image you upload.',
      ),
      p(
        'The specific cookie names depend on the analytics provider configured for this site. This section will name them once the provider is confirmed.',
      ),
      h('h2', 'What we do not use'),
      list([
        'No advertising or re-targeting cookies.',
        'No cross-site tracking pixels.',
        'No social media tracking widgets.',
        'No fingerprinting.',
      ]),
      h('h2', 'Changing your mind'),
      p(
        'Use the **Cookie preferences** link in the footer of any page. Withdrawing consent stops further optional tracking immediately and clears the analytics cookies we are able to reach from this site.',
      ),
      p(
        'You can also clear or block cookies in your browser settings. Blocking necessary cookies may stop parts of the sourcing form working correctly.',
      ),
      h('h2', 'Embedded content'),
      p(
        'Some pages may embed video from YouTube or Vimeo. Where they appear, those services may set their own cookies once you play a video. We use the privacy-preserving embed option where the provider offers one.',
      ),
      h('h2', 'Contact'),
      p('This section will confirm how to reach Finquiry about a cookie or privacy question.'),
    ),
  },
  {
    title: 'Sourcing and Delivery Policy',
    slug: 'sourcing-and-delivery-policy',
    intro:
      'How a sourcing request moves from requirement to arrival, and what is confirmed at each stage.',
    content: doc(
      h('h2', 'How a search begins'),
      p(
        'This section will describe requirement review and the information needed before a search starts.',
      ),
      h('h2', 'Verification of options'),
      p(
        'This section will describe the media and details collected for each specimen, and what can and cannot be confirmed.',
      ),
      h('h2', 'Approval'),
      p(
        'This section will confirm that no preparation or dispatch occurs without written approval of a specific specimen.',
      ),
      h('h2', 'Packing and transport'),
      p('This section will describe packing and dispatch documentation. Requires legal review.'),
      h('h2', 'Arrival'),
      p('This section will describe arrival guidance and follow-up. Requires legal review.'),
      h('h2', 'If something changes'),
      p(
        'This section will describe how changes in availability or condition are communicated. Requires legal review before any refund, replacement or mortality term is stated.',
      ),
    ),
  },
  {
    title: 'Restricted-Species Policy',
    slug: 'restricted-species-policy',
    intro: 'Requests Finquiry does not accept, and why.',
    content: doc(
      h('h2', 'Our position'),
      p(
        'Finquiry does not accept sourcing requests for species that may not lawfully be kept, traded or transported, and does not assist with requests where the legality or origin of a specimen cannot be established.',
      ),
      h('h2', 'Requests we decline'),
      p(
        'This section will list the categories of request that are declined. The specific species list requires legal and regulatory review before publication.',
      ),
      h('h2', 'Documentation'),
      p(
        'This section will describe the documentation expected for species that are lawful but regulated. Requires legal review.',
      ),
      h('h2', 'If you are unsure'),
      p(
        'Ask us before submitting a requirement. We would rather tell you early that we cannot help than take a request we cannot fulfil.',
      ),
    ),
  },
]

export const ABOUT_CONTENT = doc(
  p(
    'Finding a particular fish often means contacting multiple stores, breeders, importers, collectors and WhatsApp groups. Even then, the information may be incomplete or the specimen shown may not be the one eventually delivered.',
  ),
  p(
    'Finquiry was created to make that search more structured. Collectors share one clear requirement. We check the relevant network, present suitable specimens and keep approval connected to the individual fish.',
  ),
  p(
    'Our value is not the number of fish displayed on a website. It is the quality of the sourcing network, the clarity of the communication and the discipline of the process.',
  ),
  h('h2', 'How we work'),
  list([
    'Never promise availability before verification.',
    'Never substitute a specimen without approval.',
    'Never publish a generic price as if it applies to every fish.',
    'Never hide relevant delivery limitations.',
    'Never accept restricted or questionable sourcing requests.',
    'Always document approval and communicate changes honestly.',
  ]),
)

export const HOW_IT_WORKS_PHASES = [
  {
    title: 'Requirement review',
    copy: 'We confirm species, variety, size, colour, budget, aquarium context, location and timeline.',
  },
  {
    title: 'Network search',
    copy: 'We approach the sources most relevant to the requirement.',
  },
  {
    title: 'Option verification',
    copy: 'We collect current media and confirm the details available to us.',
  },
  {
    title: 'Specimen presentation',
    copy: 'We share each suitable option with individual pricing and delivery information.',
  },
  {
    title: 'Written approval',
    copy: 'You approve a specific specimen and the applicable terms.',
  },
  {
    title: 'Payment and preparation',
    copy: 'Payment and preparation begin only after approval.',
  },
  {
    title: 'Packing and dispatch',
    copy: 'Packing, dispatch and transport information are documented.',
  },
  {
    title: 'Arrival and follow-up',
    copy: 'We share arrival guidance and follow up after delivery.',
  },
]

export const PROCESS_STEPS = [
  {
    title: 'Share your requirement',
    copy: 'Tell us the species, variety, colour, pattern, preferred size, budget and destination.',
  },
  {
    title: 'We search our network',
    copy: 'We check relevant aquarium stores, breeders, importers, wholesalers and collectors.',
  },
  {
    title: 'Review actual options',
    copy: 'Receive current photos, videos, available details and individual pricing for suitable specimens.',
  },
  {
    title: 'Approve your selection',
    copy: 'You confirm the specific specimen and the applicable delivery terms in writing.',
  },
  {
    title: 'We coordinate delivery',
    copy: 'We organise documentation, preparation, packing, transport and arrival communication.',
  },
]

export const AQUARIUM_SERVICES = [
  'Aquarium sizing and layout',
  'Stands and cabinets',
  'Filtration planning',
  'Lighting and equipment',
  'Fish-specific system guidance',
  'Installation coordination',
]

/**
 * Starting meta titles and descriptions.
 *
 * Seeded once into each page's Payload SEO fields and never rewritten: they are
 * an editable starting point, not managed copy. Titles put the search intent
 * first and the brand last, so a shared link still reads as a sentence. Every
 * description stays under ~160 characters and describes what the page actually
 * does, none of them promises stock, prices or delivery outcomes.
 */
export const PAGE_SEO: Record<string, { title: string; description: string }> = {
  home: {
    title: 'Finquiry | Collector Fish Sourcing Across India',
    description:
      'Tell Finquiry the species, variety, colour and size you are searching for. Review actual specimen photos, videos and individual pricing before approval.',
  },
  'source-a-fish': {
    title: 'Source a Specific Fish in India | Finquiry',
    description:
      'Submit your fish requirement, preferred size, variety, budget and destination. Finquiry will search its sourcing network and contact you on WhatsApp.',
  },
  'how-it-works': {
    title: 'How Collector Fish Sourcing Works | Finquiry',
    description:
      "See how Finquiry turns a collector's requirement into a verified specimen option, written approval and coordinated delivery across India.",
  },
  deliveries: {
    title: 'Successful Fish Deliveries Across India | Finquiry',
    description:
      'Explore documented fish-sourcing journeys, including the requirement, specimen, route, packing and customer-approved outcome.',
  },
  'custom-aquariums': {
    title: 'Custom Aquarium Design and Setup | Finquiry',
    description:
      'Plan a custom aquarium around the fish, including tank dimensions, filtration, stands, cabinets, lighting and equipment.',
  },
  knowledge: {
    title: 'Collector Fish and Aquarium Guides | Finquiry',
    description:
      'Read practical guides on evaluating fish, preparing aquariums, transport, acclimatisation and making informed collector decisions.',
  },
  about: {
    title: 'About Finquiry | Fish Sourcing for Collectors',
    description:
      'Learn why Finquiry was built and how its collector-focused sourcing process connects specific fish requirements with a wider network.',
  },
  contact: {
    title: 'Contact Finquiry | Start a Fish Sourcing Request',
    description:
      'Contact the Finquiry sourcing team or submit a structured requirement for a particular fish, size, variety or custom aquarium.',
  },
  'privacy-policy': {
    title: 'Privacy Policy | Finquiry',
    description:
      'How Finquiry collects, uses, stores and shares the information in a sourcing enquiry, and the choices you have over it.',
  },
  'terms-and-conditions': {
    title: 'Terms and Conditions | Finquiry',
    description:
      'The terms that apply when you submit a sourcing requirement to Finquiry, approve a specimen or arrange a delivery.',
  },
  'sourcing-and-delivery-policy': {
    title: 'Sourcing and Delivery Policy | Finquiry',
    description:
      'What Finquiry does and does not guarantee when searching for a specimen, confirming an option and coordinating transport.',
  },
  'restricted-species-policy': {
    title: 'Restricted Species Policy | Finquiry',
    description:
      'Finquiry does not source species restricted under Indian law. How requests are screened, and what happens if one is declined.',
  },
  'cookie-policy': {
    title: 'Cookie Policy | Finquiry',
    description:
      'Every cookie this site sets, what each one is for, how long it lasts and how to change your choice at any time.',
  },
}
