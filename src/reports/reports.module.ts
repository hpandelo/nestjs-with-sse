import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { reportsQueue } from '../config/bull.config'
import { ReportsJobService } from './reports-job.service'
import { ReportsController } from './reports.controller'
import { ReportsService } from './reports.service'

@Module({
  imports: [BullModule.registerQueue(reportsQueue)],
  providers: [ReportsService, ReportsJobService],
  controllers: [ReportsController],
})
export class ReportsModule {}
