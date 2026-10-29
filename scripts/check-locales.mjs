/**
  File: check-locales.mjs | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Verify matching locale files, JSON structure, and interpolation placeholders.

  Usage:
  - Run with npm run check:locales or as part of the production build.

  Notes:
  - Arrays must have matching lengths and corresponding item structures.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const localesRoot = join(projectRoot, 'src', 'locales')
const englishRoot = join(localesRoot, 'en')
const frenchRoot = join(localesRoot, 'fr')
const errors = []

function listJsonFiles(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const path = join(directory, entry.name)

      if (entry.isDirectory()) {
        return listJsonFiles(path)
      }

      return entry.isFile() && entry.name.endsWith('.json') ? [path] : []
    })
    .sort()
}

function getJsonType(value) {
  if (Array.isArray(value)) {
    return 'array'
  }

  return value === null ? 'null' : typeof value
}

function getPlaceholders(value) {
  return [...value.matchAll(/{{\s*([^{}]+?)\s*}}/g)]
    .map((match) => match[1].replace(/^-/, '').trim())
    .sort()
}

function compareValues(english, french, file, keyPath = '$') {
  const englishType = getJsonType(english)
  const frenchType = getJsonType(french)

  if (englishType !== frenchType) {
    errors.push(
      `${file} ${keyPath}: expected ${englishType}, found ${frenchType}`,
    )
    return
  }

  if (englishType === 'array') {
    if (english.length !== french.length) {
      errors.push(
        `${file} ${keyPath}: expected ${english.length} array items, found ${french.length}`,
      )
    }

    const sharedLength = Math.min(english.length, french.length)

    for (let index = 0; index < sharedLength; index += 1) {
      compareValues(english[index], french[index], file, `${keyPath}[${index}]`)
    }

    return
  }

  if (englishType === 'object') {
    const englishKeys = Object.keys(english).sort()
    const frenchKeys = Object.keys(french).sort()

    for (const key of englishKeys) {
      if (!Object.hasOwn(french, key)) {
        errors.push(`${file} ${keyPath}: missing French key "${key}"`)
      } else {
        compareValues(english[key], french[key], file, `${keyPath}.${key}`)
      }
    }

    for (const key of frenchKeys) {
      if (!Object.hasOwn(english, key)) {
        errors.push(`${file} ${keyPath}: unexpected French key "${key}"`)
      }
    }

    return
  }

  if (
    englishType === 'string' &&
    JSON.stringify(getPlaceholders(english)) !==
      JSON.stringify(getPlaceholders(french))
  ) {
    errors.push(
      `${file} ${keyPath}: interpolation placeholders differ (English: ${getPlaceholders(english).join(', ') || 'none'}; French: ${getPlaceholders(french).join(', ') || 'none'})`,
    )
  }
}

const englishFiles = listJsonFiles(englishRoot)
const frenchFiles = listJsonFiles(frenchRoot)
const englishFileSet = new Set(
  englishFiles.map((path) => relative(englishRoot, path)),
)
const frenchFileSet = new Set(
  frenchFiles.map((path) => relative(frenchRoot, path)),
)

for (const path of englishFiles) {
  const file = relative(englishRoot, path).split(sep).join('/')

  if (!frenchFileSet.has(relative(englishRoot, path))) {
    errors.push(`${file}: missing French locale file`)
    continue
  }

  const english = JSON.parse(readFileSync(path, 'utf8'))
  const frenchPath = join(frenchRoot, relative(englishRoot, path))
  const french = JSON.parse(readFileSync(frenchPath, 'utf8'))
  compareValues(english, french, file)
}

for (const path of frenchFiles) {
  const file = relative(frenchRoot, path).split(sep).join('/')

  if (!englishFileSet.has(relative(frenchRoot, path))) {
    errors.push(`${file}: missing English locale file`)
  }
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`- ${error}`)
  }

  console.error(`Locale parity check failed with ${errors.length} issue(s).`)
  process.exitCode = 1
} else {
  console.log(
    `Locale parity check passed for ${englishFiles.length} JSON files.`,
  )
}
