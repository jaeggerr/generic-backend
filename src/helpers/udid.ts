export const UDID_LENGTH = 10
const UDID_CHARACTERS = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

/**
 * Returns a random UDID
 */
export function generateUDID (): string {
  let udid = ''
  for (let i = 0; i < UDID_LENGTH; i++) {
    udid += randomCharacter(UDID_CHARACTERS)
  }
  return udid
}

/**
 * Returns a random character from a string
 * @param s The possible characters
 */
function randomCharacter (s: string): string {
  return s.charAt(Math.floor(Math.random() * s.length))
}
