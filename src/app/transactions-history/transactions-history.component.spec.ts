import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionHistoryComponent } from './transactions-history.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('TransactionHistoryComponent', () => {
  let component: TransactionHistoryComponent;
  let fixture: ComponentFixture<TransactionHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionHistoryComponent, HttpClientTestingModule, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load transactions on ngOnInit', () => {
    const spy = spyOn(component, 'loadTransactions').and.callThrough();
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should add a new transaction when form is valid', () => {
    component.transactionForm.setValue({
      transactionImport: 100,
      transactionDate: '2025-02-20',
      webSite: 'example.com',
      categoryType: 'SHOPPING'
    });
    const spy = spyOn(component, 'onSubmitTransaction').and.callThrough();
    component.onSubmitTransaction();
    expect(spy).toHaveBeenCalled();
  });
});