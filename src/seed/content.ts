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
      'What to look for — and what to ask for — when the only view you have of a specimen is a photograph or a short clip.',
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
      'Cycling, water parameters, quarantine and tank mates — the checks worth completing before a dispatch date is set.',
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
        'Yes. We plan custom aquariums around the specimen rather than only the room — tank dimensions, filtration, stands and cabinets, lighting, equipment and installation coordination. Share the species, its expected adult size, the space you have and your city to begin.',
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
      h('h2', 'Information we collect'),
      p(
        'This section will describe the categories of information collected through the sourcing enquiry form and other contact channels, including contact details, requirement details and any reference images you choose to upload.',
      ),
      h('h2', 'How we use your information'),
      p(
        'This section will describe the purposes for which information is used, such as reviewing a requirement, searching our network, sharing options and coordinating delivery.',
      ),
      h('h2', 'Sharing with third parties'),
      p(
        'This section will describe when information is shared with the aquarium stores, breeders, importers, wholesalers, collectors and transport providers involved in a search, and what is not shared.',
      ),
      h('h2', 'Data retention'),
      p('This section will state how long enquiry records and uploaded references are kept.'),
      h('h2', 'Your rights'),
      p(
        'This section will describe how to request access to, correction of, or deletion of the information Finquiry holds about you.',
      ),
      h('h2', 'Contact'),
      p('This section will confirm how to reach Finquiry about a privacy question.'),
    ),
  },
  {
    title: 'Terms and Conditions',
    slug: 'terms-and-conditions',
    intro: 'The basis on which Finquiry provides its sourcing and aquarium services.',
    content: doc(
      h('h2', 'About these terms'),
      p('This section will set out who these terms apply to and when they take effect.'),
      h('h2', 'Nature of the service'),
      p(
        'This section will confirm that Finquiry is an enquiry-led sourcing service, that submitting a requirement does not create an order, and that availability is never guaranteed before verification.',
      ),
      h('h2', 'Enquiries and approval'),
      p(
        'This section will describe how a requirement becomes an approved specimen, and the role of written approval.',
      ),
      h('h2', 'Pricing and payment'),
      p('This section will describe how individual pricing is presented and when payment applies.'),
      h('h2', 'Cancellation and changes'),
      p('This section requires legal review before any commitment is stated.'),
      h('h2', 'Limitations'),
      p('This section requires legal review before any limitation of liability is stated.'),
      h('h2', 'Governing law'),
      p('This section will state the governing law and jurisdiction.'),
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
