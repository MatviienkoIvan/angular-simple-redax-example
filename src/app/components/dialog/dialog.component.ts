import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DialogData } from '@models/dialog.type';
import { FieldsData } from '@models/data.type';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<DialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  editForm!: FormGroup;
  protected fieldsData: Array<FieldsData> = [
    {name: 'number', title: 'No.'},
    {name: 'name', title: 'Name'},
    {name: 'weight', title: 'Weight'},
    {name: 'symbol', title: 'Symbol'},
  ]
  private readonly _fb: FormBuilder = inject(FormBuilder);

  // get correct control title to display error message
  get invalidControlNames(): string {
    let invalidControlsNames = '';
    const controls = this.editForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalidControlsNames += ` ${name},`;
      }
    }
    this.fieldsData.forEach(fieldData => {
      if (!invalidControlsNames.includes(fieldData.name)) {
        return;
      }

      invalidControlsNames = invalidControlsNames.replace(fieldData.name, fieldData.title);
    })

    return invalidControlsNames.slice(0, invalidControlsNames.length - 1);
  }

  ngOnInit(): void {
    this.editForm = this._fb.group({
      number: [{ value: this.data.contextData.number, disabled: true }, Validators.required],
      name: [this.data.contextData.name, Validators.required],
      weight: [this.data.contextData.weight, Validators.required],
      symbol: [this.data.contextData.symbol, Validators.required],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close(this.editForm.getRawValue());
  }

  fieldsTrackBy(index: number, field: FieldsData): string {
    return field.name + field.title;
  }
}
