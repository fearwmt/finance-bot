import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private repo: Repository<Transaction>,
  ) {}

  create(data: Partial<Transaction>) {
    const tx = this.repo.create(data);
    return this.repo.save(tx);
  }

  findAll() {
    return this.repo.find();
  }

  async getSummary() {
    const all = await this.repo.find();
    const income = all.filter(t => t.type === 'income')
                      .reduce((s, t) => s + t.amount, 0);
    const expense = all.filter(t => t.type === 'expense')
                       .reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense };
  }

  async getForecast() {
  const all = await this.repo.find();
  if (all.length === 0) return { forecast: 0 };

  const now = new Date();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth(); 
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  const dayOfMonth = now.getUTCDate();  
  const daysPassed = Math.max(1, Math.floor(dayOfMonth));

  const monthTx = all.filter((t) => {
    const d = new Date(t.date);
    return d.getUTCFullYear() === y && d.getUTCMonth() === m;
  });

  if (monthTx.length === 0) return { forecast: 0 };

  let fixedIncome = 0;
  const variableTx: number[] = [];

  for (const t of monthTx) {
    const desc = (t.description || '').toLowerCase();
    const signed = t.type === 'expense' ? -t.amount : t.amount;

    if (desc.includes('เงินเดือน')) {
      fixedIncome += signed; 
    } else {
      variableTx.push(signed);
    }
  }

  const netSoFar = variableTx.reduce((s, n) => s + n, 0);

  const dailyAvg = netSoFar / daysPassed;

  const forecast = fixedIncome + dailyAvg * daysInMonth;

  console.log({
    now: now.toISOString(),
    y,
    m,
    daysInMonth,
    dayOfMonth,
    daysPassed,
    fixedIncome,
    variableTx,
    netSoFar,
    dailyAvg,
    forecast,
  });

  return { forecast };
}

}
