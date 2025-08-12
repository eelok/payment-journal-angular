import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaymentRequest } from '../../models/PaymentRequest';

@Component({
  selector: 'app-add-payment',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-payment.html',
  styleUrl: './add-payment.css',
})
export class AddPayment implements OnInit {
  @Input() paymentTypes: string[] = [];
  @Output() paymentSubmitted = new EventEmitter<PaymentRequest>();

  paymentForm!: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializedform();
  }

  private validatePaymentType(
    control: AbstractControl
  ): ValidationErrors | null {
    if (!this.paymentTypes.includes(control.value)) {
      return { invalidPaymentType: true };
    }
    return null;
  }

  getPaymentTypeError(): string {
    const control = this.paymentForm.get('paymentType');
    if (control?.errors && control?.touched) {
      if (control.errors['required']) {
        return 'Payment type is required';
      }
      if (control.errors['invalidPaymentType']) {
        return 'Invalid payment type';
      }
    }
    return '';
  }

  getPaymentAmountError(): string {
    const control = this.paymentForm.get('paymentAmount');
    if (control?.errors && control?.touched && control?.dirty) {
      if (control.errors['required']) {
        return 'Payment amount is required';
      }
      if (control.errors['min']) {
        return 'Payment amount must be greater than 0';
      }
    }
    return '';
  }

  private initializedform(): void {
    this.paymentForm = this.fb.group({
      paymentAmount: ['', [Validators.required, Validators.min(0.01)]],
      paymentType: [
        '',
        [Validators.required, this.validatePaymentType.bind(this)],
      ],
    });
  }

  addPayment() {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    const paymentRequest: PaymentRequest = {
      amount: Number(this.paymentForm.value.paymentAmount),
      paymentType: this.paymentForm.value.paymentType,
    };

    this.paymentSubmitted.emit(paymentRequest);
    this.paymentForm.reset();
  }
}
