import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { TransactionService } from '../transaction/transaction.service';

@Injectable()
export class ChatService {
  private openai: OpenAI;

  constructor(private txService: TransactionService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async processMessage(message: string) {
  const numbers = message.match(/-?\d+(\.\d+)?/g);

  const nonFinanceKeywords = [
    "เล่า",
    "บอก",
    "อธิบาย",
    "เรื่อง",
    "วิทยาศาสตร์",
    "ทำยังไง",
    "วิธี",
    "คืออะไร",
  ];

  const isGeneralQuestion = nonFinanceKeywords.some((k) =>
    message.includes(k)
  );

  if (numbers && !isGeneralQuestion) {
    const amount = parseFloat(numbers[numbers.length - 1]);
    const desc = message.replace(/-?\d+(\.\d+)?/g, "").trim();

    let type: "income" | "expense" = "expense";
    if (desc.includes("เงินเดือน") || desc.includes("รายรับ")) {
      type = "income";
    }

    await this.txService.create({
      description: desc || "รายการ",
      amount: Math.abs(amount),
      type,
      category: "general",
      date: new Date().toISOString(),
    });

    const summary = await this.txService.getSummary();
    return {
      reply: `บันทึก ${type === "income" ? "รายรับ" : "รายจ่าย"} "${desc}" ${amount} บาทแล้ว ✅ ตอนนี้ยอดคงเหลือคือ ${summary.balance} บาท`,
    };
  }

  const aiRes = await this.openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: message }],
  });

  return { reply: aiRes.choices[0].message?.content || "🤖 …" };
}

}
