import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { periodicElementsState } from './state/reducers/reducer';
import { elementsKey } from '@state/consts';
import { provideEffects } from '@ngrx/effects';
import { ElementsEffects } from '@state/effects/element-effects';
import { PeriodicElementService } from '@services/periodic-element.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideAnimationsAsync(),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic'
      }
    },
    // to import as Module

    // importProvidersFrom(
      // StoreModule.forRoot({
      //   periodicElements: periodicElementsState,
      // }),
      // StoreDevtoolsModule.instrument(),
    // ),
    PeriodicElementService,
    provideStore(),
    provideState({ name: elementsKey, reducer: periodicElementsState }),
    provideStoreDevtools(),
    provideEffects(ElementsEffects),
  ]
};
