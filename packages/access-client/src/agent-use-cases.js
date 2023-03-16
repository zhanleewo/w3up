import { Agent as AccessAgent } from './agent.js'
import * as Ucanto from '@ucanto/interface'
import * as Access from '@web3-storage/capabilities/access'
import { bytesToDelegations } from './encoding.js'
import { Provider } from '@web3-storage/capabilities'

/**
 * Request authorization of a session allowing this agent to issue UCANs
 * signed by the passed email address.
 *
 * @param {AccessAgent} access
 * @param {Ucanto.Principal<Ucanto.DID<'mailto'>>} account
 * @param {Iterable<{ can: Ucanto.Ability }>} capabilities
 */
export async function requestAuthorization(access, account, capabilities) {
  const res = await access.invokeAndExecute(Access.authorize, {
    audience: access.connection.id,
    with: access.issuer.did(),
    nb: {
      iss: account.did(),
      att: [...capabilities],
    },
  })
  if (res?.error) {
    throw new Error('failed to authorize session', { cause: res })
  }
}

/**
 * claim delegations delegated to an audience
 *
 * @param {AccessAgent} access
 * @param {Ucanto.DID} [delegee] - audience of claimed delegations. defaults to access.connection.id.did()
 * @param {object} options
 * @param {boolean} [options.addProofs] - whether to addProof to access agent
 * @returns
 */
export async function claimDelegations(
  access,
  delegee = access.connection.id.did(),
  { addProofs = false } = {}
) {
  const res = await access.invokeAndExecute(Access.claim, {
    audience: access.connection.id,
    with: delegee,
  })
  if (res.error) {
    throw new Error('error claiming delegations')
  }
  const delegations = Object.values(res.delegations).flatMap((bytes) =>
    bytesToDelegations(bytes)
  )
  if (addProofs) for (const d of delegations) access.addProof(d)

  // TODO get rid of this - we'd like to move responsibility for storing space metadata out of agent-data soon
  if (addProofs) access._addSpacesFromDelegations(delegations)

  return delegations
}

/**
 * @param {AccessAgent} access
 * @param {Ucanto.DID<'key'>} space
 * @param {Ucanto.Principal<Ucanto.DID<'mailto'>>} account
 * @param {Ucanto.DID<'web'>} provider - e.g. 'did:web:staging.web3.storage'
 */
export async function addProvider(access, space, account, provider) {
  const result = await access.invokeAndExecute(Provider.add, {
    audience: access.connection.id,
    with: account.did(),
    nb: {
      provider,
      consumer: space,
    },
  })
  if (result.error) {
    throw new Error(`error adding provider`, { cause: result })
  }
}
