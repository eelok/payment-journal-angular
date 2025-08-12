import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment-service';
import { MonthlySummary } from '../../models/MonthlySummary';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PaymentRequest } from '../../models/PaymentRequest';
import { AbstractControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { FormBuilder, FormGroup, Validator } from '@angular/forms';
import { paymentType } from '../../models/scharedConst';

@Component({
  selector: 'app-payment-monthly-summary',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment-monthly-summary.html',
  styleUrl: './payment-monthly-summary.css'
})
export class PaymentMonthlySummary implements OnInit {

  paymentForm!: FormGroup;
  selectedPaymentType: string = "";
  availabelPaymentType = paymentType;

  monthlySummaries: MonthlySummary[] = [];
  errorMessage = "";
  isLoading = false;

  tableColumns = [
    {property: "yearMonth", label: "Month"},
    {propery: "allPaymentsInMonth", label: "Recieved Payments"},
    {property: "paymentCount", label: "Number of Payments"},
    {property: "totalAmount", label: "Paid Total"},
    // {property: "shouldPay", label: "Should Pay"},
    // {property: "dept", label: "Dept"},
    // {property: "overpay", label: "Overpay"},
    {property: "status", label: "Status"},
  ]

  constructor(
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ){}

  private validatePaymentType(control: AbstractControl): ValidationErrors | null {
    if(!paymentType.includes(control.value)){
      return { invalidPaymentType: true }
    }
    return null;
  }

  getPaymentTypeError(): string {
      const control = this.paymentForm.get('paymentType');
      if(control?.errors && control?.touched){
        if(control.errors['required']){
            return 'Payment type is required';
        }
        if(control.errors['invalidPaymentType']){
            return 'Invalid payment type';
        }
      }
      return '';
  }

  getPaymentAmountError(): string {
    const control = this.paymentForm.get('paymentAmount');
    if(control?.errors && control?.touched && control?.dirty){
      if(control.errors['required']){
        return 'Payment amount is required';
      }
      if(control.errors['min']){
        return 'Payment amount must be greater than 0'
      }
    }
    return '';
  }

  private initializedform(): void {
    this.paymentForm = this.fb.group({
      paymentAmount: ['', [Validators.required, Validators.min(0.01)]],
      paymentType: ['', [Validators.required, this.validatePaymentType.bind(this)]]
    })
  }

  addPayment(){
    if(this.paymentForm.invalid){
      this.paymentForm.markAllAsTouched();
      // this.errorMessage = "Error in input";
      return
    }
    
    const paymentAmount = this.paymentForm.value.paymentAmount;
    const selectedPaymentType = this.paymentForm.value.paymentType;
  
    
    const payload: PaymentRequest = {
      amount: Number(paymentAmount), 
      paymentType: selectedPaymentType
    }
    this.paymentService.addPayment(payload).subscribe({
      next: (response) => {
          console.log("response", response);
          this.errorMessage = "";
          this.paymentForm.reset();
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
