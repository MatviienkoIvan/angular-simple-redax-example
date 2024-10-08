import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, debounceTime, filter, map, Observable } from 'rxjs';

import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { FieldsData, PeriodicElement, PeriodicElements } from '@models/data.type';
import { PeriodicElementsStore } from '@models/store.type';
import { DialogComponent } from '@components/dialog/dialog.component';
import { Store } from '@ngrx/store';
import { ElementsActions, ElementsApiActions } from '@state/actions/element-actions';
import { selectElementsApiData, selectElementsCollection } from '@state/selectors/element-selectors';

type DataSource = {
  periodicElements: MatTableDataSource<any, any>, 
  loading: boolean, 
  error: boolean, 
  searchField?: string
}

@UntilDestroy()
@Component({
  selector: 'app-periodic-element',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatProgressSpinnerModule, CommonModule, MatFormFieldModule, MatInputModule, MatTableModule, MatIconModule, MatTooltipModule ],
  templateUrl: './periodic-element.component.html',
  styleUrl: './periodic-element.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeriodicElementComponent implements OnInit {
  private _store: Store<PeriodicElementsStore> = inject(Store<PeriodicElementsStore>);

  protected readonly dialog = inject(MatDialog);
  protected search: FormControl = new FormControl('');


  protected displayedColumnsHeaderData: Array<FieldsData> = [
    {name: 'number', title: 'No.'},
    {name: 'name', title: 'Name'},
    {name: 'weight', title: 'Weight'},
    {name: 'symbol', title: 'Symbol'},
  ]
  protected displayedColumns: string[] = ['number', 'name', 'weight', 'symbol', 'actions'];

  protected dataSource$: Observable<DataSource> = combineLatest([
    this._store.select(selectElementsCollection).pipe(map((data: PeriodicElements) => new MatTableDataSource(data))),
    this._store.select(selectElementsApiData)
  ])  
  .pipe(map(([periodicElements, { loading, error, searchText}]) => {
    if (!!searchText) {
      periodicElements.filter = searchText;
    } else periodicElements.filter = '';
    return {periodicElements, loading, error};
  }));

  editRow(data: PeriodicElement, rowIndex: number): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {title: 'Editing window', contextData: data},
      disableClose: true
    });

    dialogRef.afterClosed().pipe(filter(Boolean)).subscribe((periodicElement: PeriodicElement) => {
      this._store.dispatch(ElementsActions.updateElement({periodicElement}));
    });
  }

  removeRow(rowData: PeriodicElement): void {
    this._store.dispatch(ElementsActions.removeElement({number: rowData.number}));
  }

  refresh(): void {
    this._store.dispatch(ElementsApiActions.startLoadElements()); 
  }

  fieldsTrackBy(index: number, field: FieldsData): string {
    return field.name + field.title;
  }

  ngOnInit(): void {
    this.refresh();

    this.search.valueChanges.pipe(debounceTime(800), untilDestroyed(this)).subscribe((searchText: string) => this._store.dispatch(ElementsApiActions.searchText({ searchText })));
  }
}

