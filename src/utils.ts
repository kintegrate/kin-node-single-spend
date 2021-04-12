import { Environment } from '@kinecosystem/kin-sdk-v2'

export const sleep = (seconds = 1) => new Promise((resolve) => setTimeout(resolve, seconds * 1000))
export const randomId = (size = 5) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')

export function getExplorerUrl(env: Environment, publicKey: string): string {
  const baseUrl = `https://explorer.solana.com/address/${publicKey}`
  const params = env === Environment.Test ? `?cluster=custom&customUrl=https://local.validator.agorainfra.dev` : ''

  return `${baseUrl}/tokens${params}`
}
