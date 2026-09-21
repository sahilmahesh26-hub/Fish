# Analytics

## What loads, and when

Nothing loads before consent. The consent banner offers Accept and Reject at
identical size and weight, and no analytics request is made until someone
chooses. Refusing is recorded and respected; the decision can be changed at any
time from **Cookie preferences** in the footer.

If no provider ID is configured, nothing loads at all, silently. A missing ID
never produces a broken script tag.

## What is never sent

No event carries a name, WhatsApp number, email address, city, state, PIN code,
budget, uploaded file, requirement text, or any request ID that could be joined
back to a person.

This is enforced by the type system rather than by discipline: `trackEvent`
accepts no free-form payload. The only properties an event may carry are
`step` (a number) and `label` (a CTA identifier already public in the markup).
See `src/lib/analytics.ts`.

The confirmation page is a specific risk, because its URL contains a request ID
and a fish description. It fires a bare page-level event with no label for
exactly that reason, and `/thank-you` is disallowed in `robots.txt`.

## Events

| Event | Fires when | Properties |
| --- | --- | --- |
| `page_view` | A page is viewed, after consent | none |
| `start_search_click` | Any "Start Your Search" CTA is clicked | `label`: which CTA |
| `whatsapp_click` | Any WhatsApp link is clicked | `label`: which link |
| `custom_aquarium_cta_clicked` | The Custom Aquariums CTA is clicked | `label` |
| `enquiry_form_started` | The first field of the enquiry form is touched | none |
| `enquiry_step_completed` | A form step is completed | `step`: the number only |
| `enquiry_submitted` | An enquiry is successfully stored | none |
| `request_confirmation_viewed` | The confirmation page is viewed with a reference | none |
| `article_viewed` | A knowledge article is opened | `label`: the slug |
| `delivery_story_viewed` | A delivery record is opened | `label`: the slug |

### How a click becomes an event

Components mark their CTAs with `data-event`. One delegated listener
(`AnalyticsClicks`) reads only that attribute, never a field value or a query
string, and maps the marker onto one of the names above. A marker that is
already an agreed name is used as it stands; anything else is classified by
what it is (a WhatsApp handover, the aquarium CTA, or a start-the-search CTA).

Markers currently in use: `header_cta`, `mobile_nav_cta`, `hero_primary_cta`,
`hero_secondary_cta`, `process_cta`, `category_cta`, `deliveries_cta`,
`knowledge_cta`, `aquarium_cta`, `split_cta`, `final_cta_primary`,
`final_cta_whatsapp`, `source_whatsapp`, `thankyou_whatsapp`,
`thankyou_start_search`.

## Enabling a provider

Set the provider's site ID in the environment and redeploy. See `.env.example`.
The site supports Plausible, Umami and GA4 through the same interface, and
expects the provider's own script to be added via the documented env variable
rather than pasted into the markup.
