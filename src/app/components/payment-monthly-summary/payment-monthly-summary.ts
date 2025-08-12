import { Component, Input, OnInit } from '@angular/core';
import { MonthlySummary } from '../../models/MonthlySummary';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-monthly-summary',
  imports: [CommonModule],
  templateUrl: './payment-monthly-summary.html',
  styleUrl: './payment-monthly-summary.css',
})
export class PaymentMonthlySummary implements OnInit {
  @Input() monthlySummaries: MonthlySummary[] = [];
  @Input() isLoading = false;
  @Input() errorMessage = '';

  tableColumns = [
    { property: 'yearMonth', label: 'Month' },
    { propery: 'allPaymentsInMonth', label: 'Recieved Payments' },
    { property: 'paymentCount', label: 'Number of Payments' },
    { property: 'totalAmount', label: 'Paid Total' },
    { property: 'status', label: 'Status' },
  ];

  constructor() {}

  ngOnInit(): void {}
}
