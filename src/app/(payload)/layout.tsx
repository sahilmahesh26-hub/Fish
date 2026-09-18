/* THIS FILE WAS GENERATED FROM PAYLOAD'S OWN TEMPLATE.
 * It wires the Payload admin into this Next.js app. Avoid editing by hand. */
import type { ServerFunctionClient } from 'payload'
import type { ReactNode } from 'react'
import config from '@payload-config'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import { importMap } from './admin/importMap.js'
import './custom.css'

type Args = { children: ReactNode }

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
