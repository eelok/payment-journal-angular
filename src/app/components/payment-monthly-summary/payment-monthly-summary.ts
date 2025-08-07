import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment-service';
import { MonthlySummary } from '../../models/MonthlySummary';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PaymentRequest } from '../../models/PaymentRequest';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder, FormGroup, Validator } from '@angular/forms';

@Component({
  selector: 'app-payment-monthly-summary',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment-monthly-summary.html',
  styleUrl: './payment-monthly-summary.css'
})
export class PaymentMonthlySummary implements OnInit {

  paymentForm!: FormGroup;


  monthlySummaries: MonthlySummary[] = [];
  errorMessage = "";
  isLoading = false;

  tableColumns = [
    {property: "yearMonth", label: "Year - Month"},
    {propery: "allPaymentsInMonth", label: "Payment"},
    {property: "paymentCount", label: "Number of Payments"},
    {property: "totalAmount", label: "Total Paid"},
  ]

  constructor(
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ){}

  private initializedform(): void {
    this.paymentForm = this.fb.group({
      paymentAmount: ['', [Validators.required, Validators.min(0.01)]]
    })
  }

  addPayment(){
    if(this.paymentForm.invalid){
      this.errorMessage = "Error in input";
      return
    }
    
    const paymentAmount = this.paymentForm.value.paymentAmount;
    
    const payload: PaymentRequest = {
      amount: Number(paymentAmount), 
      paymentType: "REGULAR"
    }
    this.paymentService.addPayment(payload).subscribe({
      next: (response) => {
          console.log("response", response);
          // this.paymentForm.value = 0,
          this.errorMessage = "";
          this.refreshMonthlySummary();
      },
      error: (error) => {
        console.log("Error message:", error.error.message);
        this.errorMessage = error.error?.message || "api is failed"
      }
    })

  }

  ngOnInit(): void{
    this.initializedform();
    console.log("Form created:", this.paymentForm);
    console.log("Form value after creatin: ", this.paymentForm.value);
    this.refreshMonthlySummary();
  }

  private refreshMonthlySummary(): void{
    this.isLoading = true;
    this.paymentService.getPaymentMonthlySummary().subscribe({
      next: (monthlySummaries) => {
        this.monthlySummaries = monthlySummaries;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.errorMessage || "api is failed"
        this.isLoading = false;
      },
    });
  }
}
