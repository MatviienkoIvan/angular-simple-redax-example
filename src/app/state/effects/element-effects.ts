import { Injectable } from '@angular/core';
import { PeriodicElementsStore } from '@models/store.type';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { PeriodicElementService } from '@services/periodic-element.service';
import { ElementsActions, ElementsApiActions } from '@state/actions/element-actions';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap, finalize } from 'rxjs/operators';

@Injectable()
export class ElementsEffects {

  protected loadMovies$ = createEffect(() => this._actions$.pipe(
    ofType(ElementsApiActions.startLoadElements),
    tap(() => this._store.dispatch(ElementsApiActions.loadingElementsList({loading: true}))),
    exhaustMap(() => this._elementsService.getPeriodicElements()
      .pipe(
        map(periodicElements => (ElementsActions.successLoadedElements({ periodicElements }))),
        catchError(() => of(ElementsApiActions.errorLoadedElements({error: true}))),
        finalize(() => this._store.dispatch(ElementsApiActions.loadingElementsList({loading: false})))
      ))
    )
  );

  constructor(
    private _actions$: Actions,
    private _store: Store<PeriodicElementsStore>,
    private _elementsService: PeriodicElementService
  ) {}
}