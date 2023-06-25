import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Report, Status } from '@prisma/client'
import { Queue } from 'bull'
import { reportsQueue } from '../config/bull.config'
import { PrismaService } from '../prisma/prisma.service'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

@Injectable()
export class ReportsService {
  constructor(
    private prismaService: PrismaService,
    @InjectQueue(reportsQueue.name)
    private reportsQueue: Queue,
  ) {}

  async all(): Promise<Report[]> {
    const result = await this.prismaService.report.findMany({
      orderBy: {
        created_at: 'desc',
      },
    })

    return result
  }

  async findOne(id: number): Promise<Report> {
    const result = await this.prismaService.report.findUnique({ where: { id } })
    return result
  }

  async request(): Promise<Report> {
    const result = await this.prismaService.report.create({
      data: { status: Status.PENDING },
    })

    await this.reportsQueue.add({ reportId: result.id })
    return result
  }

  async produce(id: number): Promise<Report> {
    await sleep(3000)

    await this.prismaService.report.update({
      where: { id },
      data: { status: Status.PROCESSING },
    })

    await sleep(3000)

    const randomStatus = Math.random() > 0.5 ? Status.DONE : Status.ERROR
    const finishResult = await this.prismaService.report.update({
      where: { id },
      data: {
        filename: randomStatus === Status.DONE ? `report-${id}.pdf` : null,
        status: randomStatus,
      },
    })

    return finishResult
  }
}
