// Regenerates the phone catalogue from src/data/phones.json.
//
// Run automatically before every `npm run build` (see the "prebuild" script).
// Writes two identical files:
//   src/data/catalog.json  - bundled into the app at build time
//   public/catalog.json    - served/committed so installed apps can pull it
//
// The version is derived from the phone list itself, so it only changes when
// the data actually changes. That means installed apps see "up to date" until
// you genuinely add or edit a phone - not just because a build ran.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const phonesPath = path.join(root, "src", "data", "phones.json");

const phones = JSON.parse(fs.readFileSync(phonesPath, "utf8"));

if (!Array.isArray(phones) || phones.length === 0) {
  console.error("build-catalog: src/data/phones.json must be a non-empty array");
  process.exit(1);
}

const ids = new Set();
for (const phone of phones) {
  for (const field of ["id", "brand", "model", "price_start", "scores"]) {
    if (phone[field] === undefined) {
      console.error(`build-catalog: phone ${JSON.stringify(phone.id)} is missing "${field}"`);
      process.exit(1);
    }
  }
  if (ids.has(phone.id)) {
    console.error(`build-catalog: duplicate phone id "${phone.id}"`);
    process.exit(1);
  }
  ids.add(phone.id);
}

const hash = crypto
  .createHash("sha1")
  .update(JSON.stringify(phones))
  .digest("hex")
  .slice(0, 8);

const catalog = {
  version: `${phones.length}-${hash}`,
  updated_at: new Date().toISOString().slice(0, 10),
  base_currency: "USD",
  phones,
};

const serialised = `${JSON.stringify(catalog, null, 2)}\n`;

fs.writeFileSync(path.join(root, "src", "data", "catalog.json"), serialised);
fs.mkdirSync(path.join(root, "public"), { recursive: true });
fs.writeFileSync(path.join(root, "public", "catalog.json"), serialised);

console.log(
  `build-catalog: ${phones.length} phones, version ${catalog.version}, updated ${catalog.updated_at}`
);
