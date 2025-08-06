import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMonthlySummary } from './payment-monthly-summary';

describe('PaymentMonthlySummary', () => {
  let component: PaymentMonthlySummary;
  let fixture: ComponentFixture<PaymentMonthlySummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentMonthlySummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentMonthlySummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
