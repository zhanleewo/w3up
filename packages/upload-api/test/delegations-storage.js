import * as Types from '../src/types'

/**
 * @implements {Types.DelegationsStorage}
 */
export class DelegationsStorage {
  async putMany() {
    return {}
  }

  async count() {
    return BigInt(0)
  }

  async *[Symbol.asyncIterator]() {
  }
  
  async *find() {
  }
}