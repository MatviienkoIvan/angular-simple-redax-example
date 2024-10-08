import { PeriodicElement, PeriodicElements } from '@models/data.type';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const ElementsActions = createActionGroup({
  source: 'Elements',
  events: {
    'Success Loaded Elements': props<{ periodicElements: PeriodicElements }>(),
    'Remove Element': props<{ number: number }>(),
    'Update Element': props<{ periodicElement: PeriodicElement }>()
  },
});

export const ElementsApiActions = createActionGroup({
  source: 'Elements API',
  events: {
    'Start Load Elements': emptyProps(),
    'Loading Elements List': props<{ loading: boolean }>(),
    'Error Loaded Elements': props<{ error: boolean }>(),
    'Search Text': props<{ searchText: string }>()
  },
});