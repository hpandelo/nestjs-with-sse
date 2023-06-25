import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { ReportsService } from './reports.service'

@Processor('reports') // Nome da fila do Bull
export class ReportsJobService {
  constructor(private reportsService: ReportsService) {}

  @Process()
  async produce(job: Job<{ reportId: number }>) {
    await this.reportsService.produce(job.data.reportId)
    return {} // Indica fim do job
  }
}
