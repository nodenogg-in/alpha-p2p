import { Doc, encodeStateAsUpdate, transact, applyUpdate } from 'yjs'
import * as idb from 'lib0/indexeddb'
import * as promise from 'lib0/promise'
import { ObservableV2 as Observable } from 'lib0/observable'

const customStoreName = 'custom'
const updatesStoreName = 'updates'

export const PREFERRED_TRIM_SIZE = 500

type Timeout = ReturnType<typeof setTimeout>

type UpdatesCallback = (store: IDBObjectStore) => void

export const fetchUpdates = async (
  idbPersistence: IndexedDBPersistence,
  beforeApplyUpdatesCallback: UpdatesCallback = () => {},
  afterApplyUpdatesCallback: UpdatesCallback = () => {}
) => {
  const [updatesStore] = idb.transact(/** @type {IDBDatabase} */ idbPersistence.db, [
    updatesStoreName
  ]) // , 'readonly')
  const updates = await idb.getAll(
    updatesStore,
    idb.createIDBKeyRangeLowerBound(idbPersistence._dbref, false)
  )
  if (!idbPersistence._destroyed) {
    beforeApplyUpdatesCallback(updatesStore)
    transact(
      idbPersistence.doc,
      () => {
        for (const val of updates) {
          applyUpdate(idbPersistence.doc, val)
        }
      },
      idbPersistence,
      false
    )
    afterApplyUpdatesCallback(updatesStore)
  }
  const lastKey = await idb.getLastKey(updatesStore)
  idbPersistence._dbref = lastKey + 1
  const cnt = await idb.count(updatesStore)
  idbPersistence._dbsize = cnt
  return updatesStore
}

/**
 * @param {IndexedDBPersistence} idbPersistence
 * @param {boolean} forceStore
 */
export const storeState = (idbPersistence: IndexedDBPersistence, forceStore: boolean = true) =>
  fetchUpdates(idbPersistence).then((updatesStore) => {
    if (forceStore || idbPersistence._dbsize >= PREFERRED_TRIM_SIZE) {
      idb
        .addAutoKey(updatesStore, encodeStateAsUpdate(idbPersistence.doc))
        .then(() =>
          idb.del(updatesStore, idb.createIDBKeyRangeUpperBound(idbPersistence._dbref, true))
        )
        .then(() =>
          idb.count(updatesStore).then((cnt) => {
            idbPersistence._dbsize = cnt
          })
        )
    }
  })

/**
 * @param {string} name
 */
export const clearDocument = (name: string) => idb.deleteDB(name)

/**
 * @extends Observable<string>
 */
export class IndexedDBPersistence extends Observable<any> {
  _dbref: number = 0
  _dbsize: number = 0
  _destroyed = false
  db!: IDBDatabase
  _db: Promise<IDBDatabase>
  synced: boolean = false
  whenSynced: Promise<unknown>
  _storeTimeoutId: Timeout | null
  _storeTimeout: number = 1000

  constructor(
    public name: string,
    public doc: Doc
  ) {
    super()
    this._destroyed = false
    /**
     * @type {IDBDatabase|null}
     */
    this._db = idb.openDB(name, (db) =>
      idb.createStores(db, [['updates', { autoIncrement: true }], ['custom']])
    )
    /**
     * @type {Promise<IndexedDBPersistence>}
     */
    this.whenSynced = promise.create((resolve) => this.on('synced', () => resolve(this)))

    this._db.then((db) => {
      this.db = db
      /**
       * @param {IDBObjectStore} updatesStore
       */
      const beforeApplyUpdatesCallback = (updatesStore: IDBObjectStore) =>
        idb.addAutoKey(updatesStore, encodeStateAsUpdate(doc))
      const afterApplyUpdatesCallback = () => {
        if (this._destroyed) return this
        this.synced = true
        this.emit('synced', [this])
      }
      fetchUpdates(this, beforeApplyUpdatesCallback, afterApplyUpdatesCallback)
    })
    this._storeTimeoutId = null
    /**
     * @param {Uint8Array} update
     * @param {any} origin
     */
    doc.on('update', this._storeUpdate)
    this.destroy = this.destroy.bind(this)
    doc.on('destroy', this.destroy)
  }

  _storeUpdate = (update: string | number | ArrayBuffer | Date, origin?: IndexedDBPersistence) => {
    if (this.db && origin !== this) {
      const [updatesStore] = idb.transact(/** @type {IDBDatabase} */ this.db, [updatesStoreName])
      idb.addAutoKey(updatesStore, update)
      if (++this._dbsize >= PREFERRED_TRIM_SIZE) {
        // debounce store call
        if (this._storeTimeoutId !== null) {
          clearTimeout(this._storeTimeoutId)
        }
        this._storeTimeoutId = setTimeout(() => {
          storeState(this, false)
          this._storeTimeoutId = null
        }, this._storeTimeout)
      }
    }
  }

  destroy = () => {
    if (this._storeTimeoutId) {
      clearTimeout(this._storeTimeoutId)
    }
    this.doc.off('update', this._storeUpdate)
    this.doc.off('destroy', this.destroy)
    this._destroyed = true
    return this._db.then((db) => {
      db.close()
    })
  }

  /**
   * Destroys this instance and removes all data from indexeddb.
   *
   * @return {Promise<void>}
   */
  clearData = (): Promise<void> => {
    return this.destroy().then(() => {
      idb.deleteDB(this.name)
    })
  }

  /**
   * @param {String | number | ArrayBuffer | Date} key
   * @return {Promise<String | number | ArrayBuffer | Date | any>}
   */
  get = (key: string): Promise<string | number | ArrayBuffer | Date | any> => {
    return this._db.then((db) => {
      const [custom] = idb.transact(db, [customStoreName], 'readonly')
      return idb.get(custom, key)
    })
  }

  /**
   * @param {String | number | ArrayBuffer | Date} key
   * @param {String | number | ArrayBuffer | Date} value
   * @return {Promise<String | number | ArrayBuffer | Date>}
   */
  set = <T extends string | number | ArrayBuffer | Date | boolean>(
    key: string,
    value: T
  ): Promise<T> => {
    return this._db.then((db) => {
      const [custom] = idb.transact(db, [customStoreName])
      return idb.put(custom, value, key)
    })
  }

  /**
   * @param {String | number | ArrayBuffer | Date} key
   * @return {Promise<undefined>}
   */
  del = (key: string) => {
    return this._db.then((db) => {
      const [custom] = idb.transact(db, [customStoreName])
      return idb.del(custom, key)
    })
  }
}
