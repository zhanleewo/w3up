import { CarWriter } from '@ipld/car'
import { collect } from './utils.js'

/**
 * @param {Iterable<import('@ipld/unixfs').Block>|AsyncIterable<import('@ipld/unixfs').Block>} blocks 
 * @param {import('multiformats').Link<unknown, number, number, import('multiformats').Version>} [root]
 * @returns {Promise<import('./types').CARFile>}
 */
export async function encode (blocks, root) {
  // @ts-expect-error
  const { writer, out } = CarWriter.create(root)
  /** @type {Error?} */
  let error
  void (async () => {
    try {
      for await (const block of blocks) {
        // @ts-expect-error
        await writer.put(block)
      }
    } catch (/** @type {any} */err) {
      error = err
    } finally {
      await writer.close()
    }
  })()
  const chunks = await collect(out)
  // @ts-expect-error
  if (error != null) throw error
  const roots = root != null ? [root] : []
  return Object.assign(new Blob(chunks), { version: 1, roots })
}