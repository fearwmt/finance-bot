import { Controller, Get, Post, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Get()
  async findAll(): Promise<Transaction[]> {
    return this.service.findAll();
  }

  @Get('summary')
  async getSummary() {
    return this.service.getSummary();
  }

  @Get('forecast')
  async getForecast() {
    return this.service.getForecast();
  }

  @Post()
  async create(@Body() body: Partial<Transaction>) {
    return this.service.create(body);
  }
}
