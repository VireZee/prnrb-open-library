import { fileURLToPath } from 'url'
import { dirname } from 'path'
import crypto from 'crypto'
globalThis.nodeCrypto = crypto
globalThis.dirname = dirname(fileURLToPath(import.meta.url))
export {}