import { Component, OnInit } from '@angular/core';
import { AddPayment } from '../add-payment/add-payment';
import { PaymentMonthlySummary } from '../payment-monthly-summary/payment-monthly-summary';
import { PaymentService } from '../../services/payment-service';
import { MonthlySummary } from '../../models/MonthlySummary';
import { paymentType } from '../../models/scharedConst';
import { PaymentRequest } from '../../models/PaymentRequest';

@Component({
  selector: 'app-dashboard',
  imports: [AddPayment, PaymentMonthlySummary],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  monthlySummaries: MonthlySummary[] = [];
  availablePaymentTypes = paymentType;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private paymentService: PaymentService) {}

  ngOnInit() {
    this.refreshMonthlySummary();
  }

  private refreshMonthlySummary() {
    this.isLoading = true;
    this.paymentService.getPaymentMonthlySummary().subscribe({
      next: (monthlySummaries) => {
        this.monthlySummaries = monthlySummaries;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error?.error.message || 'api is failed';
        this.isLoading = false;
      },
    });
  }

  onPaymentSubmitted(paymentRequest: PaymentRequest) {
    this.paymentService.addPayment(paymentRequest).subscribe({
      next: (response) => {
        console.log('response', response);
        this.errorMessage = '';
        this.refreshMonthlySummary();
      },
      error: (error) => {
        this.errorMessage = error?.error.message || 'api is failed';
      },
    });
  }
}
