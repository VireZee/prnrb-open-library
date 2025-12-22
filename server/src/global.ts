import { dirname } from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'
globalThis.nodeCrypto = crypto
globalThis.dirname = dirname(fileURLToPath(import.meta.url))
export {}