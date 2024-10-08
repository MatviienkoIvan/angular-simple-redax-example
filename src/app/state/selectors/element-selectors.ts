import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PeriodicElementsStore } from '@models/store.type';
import { elementsKey } from '@state/consts';

export const selectElements = createFeatureSelector<Readonly<PeriodicElementsStore>>(elementsKey);

export const selectElementsCollection = createSelector(
  selectElements,
  (elementsData) => elementsData.periodicElements
);

export const selectElementsApiData = createSelector(
  selectElements,
  ({searchText, loading, error}) => ({searchText, loading, error})
)