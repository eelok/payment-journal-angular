import { Payment } from "./Payment";

export interface MonthlySummary {
    yearMonth: string;
    totalAmount: number;
    paymentCount: number;
    allPaymentsInMonth: Payment[];

    dept: number;
    overpay: number;
    status: string;
}