import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class BusinessLogicService {
  calculateMonthlyPayment(principal: number, annualRate: number, months: number): number {
    if (principal <= 0 || annualRate < 0 || months <= 0) {
      throw new BadRequestException('Invalid loan calculation parameters.');
    }

    const monthlyRate = annualRate / 12;

    if (monthlyRate === 0) {
      return +(principal / months).toFixed(2); // Handle 0% interest gracefully
    }

    const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, months);
    const denominator = Math.pow(1 + monthlyRate, months) - 1;

    return Math.round(numerator / denominator);
  }

  calculateTotalPayable(monthlyPayment: number, months: number): number {
    return Math.round(monthlyPayment * months);
  }
  
}
