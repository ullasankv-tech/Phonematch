/**
 * Where the app looks for a newer phone catalogue.
 *
 * Injected at build time by CI, so it points at this repo's own raw file:
 *   NEXT_PUBLIC_CATALOG_URL=https://raw.githubusercontent.com/<owner>/<repo>/main/public/catalog.json
 *
 * Leave it unset locally and the "Check for updates" button will explain that
 * this build has no catalogue server, while the app keeps using the phones
 * bundled inside it.
 */
export const CATALOG_URL = process.env.NEXT_PUBLIC_CATALOG_URL ?? "";

export const APP_NAME = "PhoneMatch";
