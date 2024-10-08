import { PeriodicElements } from "./data.type"

export type PeriodicElementsStore = {
  periodicElements: PeriodicElements,
  loading: boolean,
  error: boolean,
  searchText: string,
}