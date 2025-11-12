import crypto from 'node:crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12
const AUTH_TAG_LENGTH = 16

const decodeKey = (rawKey: string): Buffer => {
 const key = Buffer.from(rawKey, 'base64')

 if (key.length !== 32) {
 throw new Error('ENCRYPTION_KEY must be a base64 string for a 256-bit key')
 }

 return key
}

export const encryptSecret = (value: string, rawKey: string): string => {
 const key = decodeKey(rawKey)
 const iv = crypto.randomBytes(IV_LENGTH)
 const cipher = crypto.createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH })

 const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
 const authTag = cipher.getAuthTag()

 return Buffer.concat([iv, authTag, encrypted]).toString('base64')
}

export const decryptSecret = (value: string, rawKey: string): string => {
 const key = decodeKey(rawKey)
 const buffer = Buffer.from(value, 'base64')
 const iv = buffer.subarray(0, IV_LENGTH)
 const authTag = buffer.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH)
 const ciphertext = buffer.subarray(IV_LENGTH + AUTH_TAG_LENGTH)

 const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH })
 decipher.setAuthTag(authTag)

 const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()])
 return decrypted.toString('utf8')
}
