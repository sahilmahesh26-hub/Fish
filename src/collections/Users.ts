import type { AccessResult, CollectionConfig } from 'payload'
import { ROLES, hasRole, isAdmin, isSuperAdmin, isSuperAdminFieldLevel } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role', 'active', 'lastLogin'],
    group: 'Administration',
    description: 'Staff accounts for the Finquiry admin.',
  },
  auth: {
    tokenExpiration: 60 * 60 * 8,
    maxLoginAttempts: 8,
    lockTime: 10 * 60 * 1000,
    useAPIKey: false,
  },
  access: {
    // Anyone signed in can read the user list (needed to render "author" fields),
    // but only admins can create, and only super-admins can delete.
    read: ({ req }) => hasRole(req.user, 'super-admin', 'admin', 'editor'),
    create: isAdmin,
    delete: isSuperAdmin,
    update: ({ req }): AccessResult => {
      if (hasRole(req.user, 'super-admin')) return true
      if (hasRole(req.user, 'admin')) {
        // Admins may manage everyone except super-admins.
        return { role: { not_equals: 'super-admin' } }
      }
      // Everyone else may only edit their own record.
      return req.user ? { id: { equals: req.user.id } } : false
    },
    admin: ({ req }) => hasRole(req.user, 'super-admin', 'admin', 'editor'),
  },
  hooks: {
    afterLogin: [
      async ({ req, user }) => {
        // Recorded with `overrideAccess` because the user is mid-login.
        await req.payload.update({
          collection: 'users',
          id: user.id,
          data: { lastLogin: new Date().toISOString() },
          overrideAccess: true,
          context: { skipRevalidate: true },
        })
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: ROLES,
      access: {
        // Only a super-admin can change roles — an admin cannot promote itself.
        create: isSuperAdminFieldLevel,
        update: isSuperAdminFieldLevel,
      },
      admin: {
        description:
          'Super Admin: everything. Admin: content, media and non-super-admin users. Editor: content only.',
      },
    },
    {
      name: 'canPublish',
      type: 'checkbox',
      defaultValue: false,
      label: 'Editor may publish',
      access: {
        create: isSuperAdminFieldLevel,
        update: isSuperAdminFieldLevel,
      },
      admin: {
        condition: (data) => data?.role === 'editor',
        description: 'When off, this editor can save drafts but cannot publish them.',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      access: {
        create: isSuperAdminFieldLevel,
        update: isSuperAdminFieldLevel,
      },
      admin: { description: 'Deactivated accounts keep their history but lose all access.' },
    },
    {
      name: 'lastLogin',
      type: 'date',
      admin: {
        readOnly: true,
        date: { pickerAppearance: 'dayAndTime' },
        position: 'sidebar',
      },
    },
  ],
}
