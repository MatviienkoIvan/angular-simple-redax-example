import { createReducer, on } from '@ngrx/store';
import { ElementsActions, ElementsApiActions } from '../actions/element-actions';
import { PeriodicElementsStore } from '@models/store.type';

export const initialState: PeriodicElementsStore = {
  periodicElements: [],
  loading: false,
  error: false,
  searchText: '',
};

export const periodicElementsState = createReducer(
  initialState,
  on(ElementsActions.successLoadedElements, (state, { periodicElements }) => ({... state, periodicElements})),
  on(ElementsActions.removeElement, (state, { number }) => {
    const elementIndex = state.periodicElements.findIndex((element => element.number === number));
    const newPeriodicElements = [ ...state.periodicElements ];
    newPeriodicElements.splice(elementIndex, 1);
    return { ...state, periodicElements: newPeriodicElements };
  }),
  on(ElementsActions.updateElement, (state, { periodicElement }) => {
    const elementIndex = state.periodicElements.findIndex((element => element.number === periodicElement.number));
    const newPeriodicElements = [ ...state.periodicElements ];
    newPeriodicElements.splice(elementIndex, 1, periodicElement);
    return { ...state, periodicElements: newPeriodicElements };
  }),
  on(ElementsApiActions.loadingElementsList, (state, { loading }) => ({...state, loading})),
  on(ElementsApiActions.searchText, (state, { searchText }) => ({...state, searchText}))
);