import { getPersistenceName } from '../../app'
import { Canvas, EditableCanvas } from '../../spatial'
import { values } from '../../utils'
import type { EditableMicrocosmAPI, MicrocosmAPI } from './api'

export class ReadonlyMicrocosm<M extends MicrocosmAPI = MicrocosmAPI> {
  public api: M
  public microcosm_uri: string
  protected persist!: string[]
  protected views = {
    spatial: new Map<string, Canvas<ReadonlyMicrocosm>>()
  }

  constructor(api: M, ...persist: string[]) {
    this.api = api
    this.persist = persist || []
    this.microcosm_uri = api.microcosm_uri
  }

  public createSpatialView = (id: string) => {
    const view = new Canvas(this, getPersistenceName(['view', 'spatial', id]))
    this.views.spatial.set(id, view)
    return view
  }

  /**
   * Retrieves nodes that intersect with a given point and box
   */
  public dispose = () => {
    for (const viewType of values(this.views)) {
      for (const canvas of viewType.values()) {
        canvas.dispose()
      }
    }
  }
}

export class EditableMicrocosm<M extends EditableMicrocosmAPI = EditableMicrocosmAPI> {
  public api: M
  public microcosm_uri: string
  protected persist!: string[]
  protected views = {
    spatial: new Map<string, EditableCanvas>()
  }

  constructor(api: M) {
    this.api = api
    this.microcosm_uri = api.microcosm_uri
  }

  public createSpatialView = (id: string) => {
    const view = new EditableCanvas(this, getPersistenceName(['view', 'spatial', id]))
    this.views.spatial.set(id, view)
    return view
  }
  /**
   * Retrieves nodes that intersect with a given point and box
   */
  public dispose = () => {
    for (const viewType of values(this.views)) {
      for (const canvas of viewType.values()) {
        canvas.dispose()
      }
    }
  }
}

export type Microcosm = ReadonlyMicrocosm | EditableMicrocosm

export const isEditableMicrocosm = (m: Microcosm): m is EditableMicrocosm => 'leave' in m.api
