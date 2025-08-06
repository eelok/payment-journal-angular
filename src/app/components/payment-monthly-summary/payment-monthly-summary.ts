import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment-service';
import { MonthlySummary } from '../../models/MonthlySummary';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-monthly-summary',
  imports: [CommonModule, RouterLink],
  templateUrl: './payment-monthly-summary.html',
  styleUrl: './payment-monthly-summary.css'
})
export class PaymentMonthlySummary implements OnInit {

  monthlySummaries: MonthlySummary[] = [];
  errorMessage = "";
  isLoading = false;

  tableColumns = [
    {property: "yearMonth", label: "Year - Month"},
    {property: "totalAmount", label: "Total Paid"},
  ]

  constructor(
    private paymentService: PaymentService,
  ){}

  ngOnInit(): void{

    this.isLoading = true;
    this.paymentService.getPaymentMonthlySummary().subscribe({
      next: (monthlySummaries) => {
        console.log('Data received:', monthlySummaries);
        console.log('Array length:', monthlySummaries.length); // Add this
        console.log('First item:', monthlySummaries[0]);
        this.monthlySummaries = monthlySummaries;
        console.log('tim', this.monthlySummaries);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.errorMessage || "api is failed"
        this.isLoading = false;
      },
      complete: () => {
        console.log('🏁 HTTP request completed');
      }
    });
  }
}
