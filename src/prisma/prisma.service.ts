import { PrismaClient } from '@/generated/prisma/client';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private configService: ConfigService) {
    const url = configService.get('database.connectionString');

    if (!url) {
      throw new Error('A DATABASE_URL környezeti változó hiányzik vagy üres!');
    }

    const pool = new Pool({
      connectionString: url,
    });

    const adapter = new PrismaPg(pool);

    super({ adapter } as any);
  }

  async onModuleInit() {
    await this.$connect();
  }
}
