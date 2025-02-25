import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyExpenseCardComponent } from './monthly-expense-card.component';

describe('MonthlyExpenseCardComponent', () => {
  let component: MonthlyExpenseCardComponent;
  let fixture: ComponentFixture<MonthlyExpenseCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyExpenseCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyExpenseCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
