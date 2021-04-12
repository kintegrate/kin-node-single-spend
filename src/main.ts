import { Environment, PublicKey, quarksToKin } from '@kinecosystem/kin-sdk-v2'
import { Kin } from './kin'
import { getExplorerUrl, sleep } from './utils'

export const airdropAmount = '1000'
export const bobTarget = 'Don8L4DTVrUrRAcVTsFoCRqei5Mokde3CV3K9Ut4nAGZ'

export async function main(): Promise<number> {
  const bob: PublicKey = PublicKey.fromBase58(bobTarget)
  console.log(`🌐   ==> Check Bob on Explorer ${getExplorerUrl(Environment.Test, bob.toBase58())}`)

  // Set up Kin client
  const kin = new Kin(Environment.Test)

  // Prepare tokens for Alice and Bob
  const privateKeyAlice = Kin.generateKey()
  const tokenAccountsAlice = await kin.createAccount(privateKeyAlice)

  console.log(`🔑 Public Key Alice    ${privateKeyAlice.publicKey().toBase58()}`)
  console.log(`🌐   ==> Check on Explorer ${getExplorerUrl(Environment.Test, privateKeyAlice.publicKey().toBase58())}`)
  for (const tokenAccount of tokenAccountsAlice) {
    console.log(`🗝  Token Account Alice ${tokenAccount.toBase58()}`)
    console.log(`🌐   ==> Check on Explorer ${getExplorerUrl(Environment.Test, tokenAccount.toBase58())}`)
  }

  // Helper method to sleep a bit, then print balance of Alice and Bob
  async function sleepAndPrintBalances() {
    console.log('😴 Sleeping for a bit...')
    await sleep(15)
    await kin.getBalance(privateKeyAlice.publicKey()).then((b) => {
      console.log(`👛 Balance for Alice:  ${quarksToKin(b)} Kin`)
    })
    await kin.getBalance(bob).then((b) => {
      console.log(`👛 Balance for Bob:    ${quarksToKin(b)} Kin`)
    })
  }

  await sleepAndPrintBalances()

  console.log('🙏 Request Airdrop for Alice')
  await kin.requestAirdrop(tokenAccountsAlice[0], airdropAmount)

  await sleepAndPrintBalances()

  console.log('💸 Submit P2P Payment from Alice to Bob')
  await kin.submitP2P(privateKeyAlice, bob, airdropAmount, 'Please take my Donation!')

  await sleepAndPrintBalances()

  console.log('✅ Done!')
  return 0
}
