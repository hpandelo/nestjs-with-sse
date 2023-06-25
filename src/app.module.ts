import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { bullConfig } from './config/bull.config'
import { PrismaModule } from './prisma/prisma.module'
import { ReportsModule } from './reports/reports.module'

@Module({
  imports: [ReportsModule, PrismaModule, BullModule.forRoot(bullConfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
