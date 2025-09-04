import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction/transaction.entity';
import { TransactionModule } from './transaction/transaction.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'finance.db',
      entities: [Transaction],
      synchronize: true,
    }),
    TransactionModule,
    ChatModule,
  ],
})
export class AppModule {}
