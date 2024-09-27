import { PeriodicElements } from "./data.type"

export type PeriodicElementsStore = {
  periodicElements: PeriodicElements,
  loading: boolean,
  error: boolean,
  searchField: string,
  editForm: boolean
}