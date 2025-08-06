import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment-service';
import { MonthlySummary } from '../../models/MonthlySummary';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-monthly-summary',
  imports: [CommonModule],
  templateUrl: './payment-monthly-summary.html',
  styleUrl: './payment-monthly-summary.css'
})
export class PaymentMonthlySummary implements OnInit {

  monthlySummaries: MonthlySummary[] = [];
  errorMessage = "";

  constructor(
    private paymentService: PaymentService
  ){}

  ngOnInit(): void{
      this.paymentService.getPaymentMonthlySummary().subscribe({
        next: (monthlySummary) => {
          this.monthlySummaries = monthlySummary;
        },
        error: (error) => {
          this.errorMessage = error.error?.errorMessage || "api is failed"
        }
      });
  }
}
