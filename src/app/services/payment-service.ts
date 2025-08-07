import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MonthlySummary } from '../models/MonthlySummary';
import { Payment } from '../models/Payment';
import { PaymentRequest } from '../models/PaymentRequest';

@Injectable({
  providedIn: 'root'
}) 
export class PaymentService {

  private baseUrl = 'http://localhost:8080/api/v1/payments';

  constructor(private http: HttpClient){}


  getPaymentMonthlySummary(): Observable<MonthlySummary[]> {
    return this.http.get<MonthlySummary[]>(`${this.baseUrl}/monthly-summary`);
  }

  addPayment(paymentRequest: PaymentRequest): Observable<Payment>{
    return this.http.post<Payment>(`${this.baseUrl}`, paymentRequest, {
      headers: {'Content-Type': 'application/json'}
    });
  }
}

