import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldsData, PeriodicElement, PeriodicElements } from '@models/data.type';
import { PeriodicElementsStore } from '@models/store.type';
import { rxState } from '@rx-angular/state';
import { RxIf } from '@rx-angular/template/if';
import { PeriodicElementService } from '@services/periodic-element.service';
import { BehaviorSubject, catchError, combineLatest, debounceTime, endWith, filter, map, Observable, of, skip, startWith, tap } from 'rxjs';

import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatFormFieldModule} from '@angular/material/form-field';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@components/dialog/dialog.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-periodic-element',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatProgressSpinnerModule, RxIf, CommonModule, MatFormFieldModule, MatInputModule, MatTableModule, MatIconModule, MatTooltipModule ],
  templateUrl: './periodic-element.component.html',
  styleUrl: './periodic-element.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    PeriodicElementService
  ]
})
export class PeriodicElementComponent {
  private _elementService = inject(PeriodicElementService);  
  private _periodicElements$: BehaviorSubject<PeriodicElements> = new BehaviorSubject([] as PeriodicElements);

  protected readonly dialog = inject(MatDialog);
  protected search: FormControl = new FormControl('');
  private state = rxState<PeriodicElementsStore>(({ set, connect }) => {
    set({ periodicElements: [], loading: false, error: false, searchField: '' });
    connect(
      this._elementService.getPeriodicElements().pipe(
        tap((periodicElements: PeriodicElements) => this._periodicElements$.next(periodicElements)),
        map((periodicElements: PeriodicElements) => ({ periodicElements })),
        catchError(() => of({ error: true })),
        startWith({ loading: true }),
        endWith({ loading: false }),
      ),
    );
    connect('searchField', this.search.valueChanges.pipe(debounceTime(2000)));
    connect('periodicElements', this._periodicElements$.asObservable());
  });

  protected loading$ = this.state.select('loading');
  protected error$ = this.state.select('error');
  protected searchField$ = this.state.select('searchField');

  protected displayedColumnsHeaderData: Array<FieldsData> = [
    {name: 'number', title: 'No.'},
    {name: 'name', title: 'Name'},
    {name: 'weight', title: 'Weight'},
    {name: 'symbol', title: 'Symbol'},
  ]
  protected displayedColumns: string[] = ['number', 'name', 'weight', 'symbol', 'actions'];
  private elements$ = this.state.select('periodicElements');
  private elementsDataSource$: Observable<MatTableDataSource<any, any>> = this.elements$.pipe(map((data: PeriodicElements) => new MatTableDataSource(data)));

  // these observers are combined into one pipe to avoid multible using of | async in the template
  protected dataSource$ = combineLatest([
    this.elementsDataSource$,
    this.loading$,
    this.error$,
    this.searchField$
  ]).pipe(map(([elementsData, loading, error, searchField]) => {
    if (!!searchField) {
      elementsData.filter = searchField;
    } else elementsData.filter = '';
    return {elementsData, loading, error};
  }))

  editRow(data: PeriodicElement, rowIndex: number): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {title: 'Editing window', contextData: data},
      disableClose: true
    });

    dialogRef.afterClosed().pipe(filter(Boolean)).subscribe((result: PeriodicElement) => {
      const newData: PeriodicElements = this._periodicElements$.value.map((rowData: PeriodicElement, index: number) => {
        if (rowIndex !== index) {
          return rowData;
        }
        
        return result;
      });
      this._periodicElements$.next(newData);
    });
  }

  removeRow(rowData: PeriodicElement): void {
    const newData: PeriodicElements = this._periodicElements$.value.filter((row: PeriodicElement) => row.number !== rowData.number);
    this._periodicElements$.next(newData);
  }
  refresh(): void {
    window.location.reload();
  }

  fieldsTrackBy(index: number, field: FieldsData): string {
    return field.name + field.title;
  }
}
