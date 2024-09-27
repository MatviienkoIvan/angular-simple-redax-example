import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodicElementComponent } from './periodic-element.component';

describe('PeriodicElementComponent', () => {
  let component: PeriodicElementComponent;
  let fixture: ComponentFixture<PeriodicElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeriodicElementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeriodicElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
