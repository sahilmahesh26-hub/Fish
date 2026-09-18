import type { Access, FieldAccess } from 'payload'
import type { User } from '@/payload-types'

export type Role = 'super-admin' | 'admin' | 'editor'

/** Roles ordered from most to least privileged. */
export const ROLES: { label: string; value: Role }[] = [
  { label: 'Super Admin', value: 'super-admin' },
  { label: 'Admin', value: 'admin' },
  { label: 'Editor', value: 'editor' },
]

const asUser = (user: unknown): User | null => (user ?? null) as User | null

export const hasRole = (user: unknown, ...roles: Role[]): boolean => {
  const u = asUser(user)
  if (!u) return false
  // An account that has been deactivated keeps its row but loses all rights.
  if (u.active === false) return false
  return roles.includes(u.role as Role)
}

export const isSuperAdmin: Access = ({ req }) => hasRole(req.user, 'super-admin')

export const isAdmin: Access = ({ req }) => hasRole(req.user, 'super-admin', 'admin')

/** Any active, authenticated staff member. */
export const isStaff: Access = ({ req }) => hasRole(req.user, 'super-admin', 'admin', 'editor')

export const isAdminFieldLevel: FieldAccess = ({ req }) => hasRole(req.user, 'super-admin', 'admin')

export const isSuperAdminFieldLevel: FieldAccess = ({ req }) => hasRole(req.user, 'super-admin')

/**
 * Editors may create and edit content but only publish when explicitly
 * permitted via their `canPublish` flag. Payload models publishing as writing
 * `_status: 'published'`, so the check lives in a field-level access rule on
 * the status field (see `publishAccess`).
 */
export const canPublish: FieldAccess = ({ req }) => {
  const user = asUser(req.user)
  if (!user || user.active === false) return false
  if (user.role === 'super-admin' || user.role === 'admin') return true
  return user.role === 'editor' && user.canPublish === true
}

/**
 * Public read for published documents; staff see drafts too.
 *
 * Returning a `where` clause rather than `true` means the restriction is
 * enforced by the database query, not by hiding fields in the admin UI.
 */
export const publishedOrStaff: Access = ({ req }) => {
  if (hasRole(req.user, 'super-admin', 'admin', 'editor')) return true
  return {
    _status: { equals: 'published' },
  }
}

/** Collections without drafts that still carry an explicit `published` toggle. */
export const publishedToggleOrStaff: Access = ({ req }) => {
  if (hasRole(req.user, 'super-admin', 'admin', 'editor')) return true
  return {
    published: { equals: true },
  }
}

/** Collections gated by an `active` toggle (e.g. sourcing categories). */
export const activeOrStaff: Access = ({ req }) => {
  if (hasRole(req.user, 'super-admin', 'admin', 'editor')) return true
  return {
    active: { equals: true },
  }
}

/** Anyone may read; used for genuinely public reference data. */
export const anyone: Access = () => true

/** Nobody may perform the operation through the API. */
export const nobody: Access = () => false
