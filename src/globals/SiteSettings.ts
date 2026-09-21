import type { GlobalConfig } from 'payload'
import { anyone, isAdmin, isSuperAdminFieldLevel } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Configuration',
    description: 'Brand, contact details and defaults used across every page.',
  },
  access: {
    read: anyone,
    // Editors can see settings but only admins can change them.
    update: isAdmin,
  },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Brand',
          fields: [
            { name: 'brandName', type: 'text', required: true, defaultValue: 'Finquiry' },
            {
              name: 'tagline',
              type: 'text',
              defaultValue: 'Every Collector Is Searching for Something.',
            },
            { name: 'shortDescription', type: 'textarea', maxLength: 300 },
            { name: 'logo', type: 'upload', relationTo: 'media' },
            {
              name: 'logoOnDark',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo (for dark backgrounds)',
            },
            { name: 'favicon', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'contactEmail', type: 'email' },
            {
              name: 'whatsappNumber',
              type: 'text',
              admin: {
                description:
                  'International format, digits only, no "+" or spaces. Example: 919876543210',
              },
              validate: (value: unknown) => {
                if (!value) return true
                return /^\d{8,15}$/.test(String(value))
                  ? true
                  : 'Digits only, 8-15 characters, no "+" or spaces.'
              },
            },
            {
              name: 'whatsappDefaultMessage',
              type: 'textarea',
              defaultValue:
                'Hello Finquiry, I would like help sourcing a fish. Here is what I am looking for:',
              admin: { description: 'Prefilled into WhatsApp when someone taps a WhatsApp link.' },
            },
            { name: 'phone', type: 'text' },
            {
              name: 'address',
              type: 'group',
              label: 'Business address',
              fields: [
                { name: 'line1', type: 'text' },
                { name: 'line2', type: 'text' },
                { name: 'city', type: 'text' },
                { name: 'state', type: 'text' },
                { name: 'postalCode', type: 'text' },
                { name: 'country', type: 'text', defaultValue: 'India' },
              ],
            },
            {
              name: 'socialLinks',
              type: 'array',
              labels: { singular: 'Social link', plural: 'Social links' },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'X / Twitter', value: 'x' },
                    { label: 'WhatsApp channel', value: 'whatsapp' },
                  ],
                },
                { name: 'url', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'SEO defaults',
          fields: [
            {
              name: 'defaultSeo',
              type: 'group',
              label: 'Default SEO',
              admin: {
                description:
                  'The last fallback. A page uses its own SEO override first, then its title and excerpt, then these values.',
              },
              fields: [
                { name: 'titleTemplate', type: 'text', defaultValue: '%s, Finquiry' },
                { name: 'defaultTitle', type: 'text' },
                { name: 'description', type: 'textarea', maxLength: 200 },
                { name: 'image', type: 'upload', relationTo: 'media' },
              ],
            },
            {
              name: 'organisation',
              type: 'group',
              label: 'Organisation schema',
              admin: { description: 'Used to build the Organisation structured data.' },
              fields: [
                { name: 'legalName', type: 'text' },
                { name: 'foundingYear', type: 'number', min: 1900, max: 2100 },
                {
                  name: 'areaServed',
                  type: 'text',
                  defaultValue: 'India',
                },
                {
                  name: 'sameAs',
                  type: 'text',
                  hasMany: true,
                  admin: { description: 'Profile URLs used to confirm identity.' },
                },
              ],
            },
          ],
        },
        {
          label: 'Analytics & consent',
          fields: [
            {
              name: 'analytics',
              type: 'group',
              access: { update: isSuperAdminFieldLevel },
              admin: {
                description:
                  'Provider-agnostic. Environment variables take precedence when both are set.',
              },
              fields: [
                {
                  name: 'provider',
                  type: 'select',
                  defaultValue: 'none',
                  options: [
                    { label: 'None', value: 'none' },
                    { label: 'Plausible', value: 'plausible' },
                    { label: 'Umami', value: 'umami' },
                    { label: 'Google Analytics 4', value: 'ga4' },
                  ],
                },
                { name: 'measurementId', type: 'text' },
                { name: 'scriptUrl', type: 'text' },
              ],
            },
            {
              name: 'consent',
              type: 'group',
              label: 'Cookie / consent banner',
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: false },
                {
                  name: 'message',
                  type: 'textarea',
                  defaultValue:
                    'We use a small amount of anonymous analytics to understand how the site is used.',
                },
                { name: 'policyLink', type: 'text', defaultValue: '/privacy-policy' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
