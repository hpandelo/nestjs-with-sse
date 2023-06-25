import {
  Controller,
  Get,
  MessageEvent,
  Param,
  ParseIntPipe,
  Post,
  Res,
  Sse,
} from '@nestjs/common'
import { Report, Status } from '@prisma/client'
import { FastifyReply } from 'fastify'
import { Observable, defer, map, repeat, tap } from 'rxjs'
import { ReportsService } from './reports.service'

@Controller('reports')
export class ReportsController {
  constructor(private service: ReportsService) {}

  @Get()
  all() {
    return this.service.all()
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.service.findOne(id)
  }

  @Post()
  request() {
    return this.service.request()
  }

  @Sse(':id/events')
  events(
    @Param('id', new ParseIntPipe()) id: number,
    @Res() response: FastifyReply,
  ): Observable<MessageEvent> {
    const repeatPipe = repeat({ delay: 1000 })
    const tapPipe = tap((report: Report) => {
      const isProcessed =
        report?.status === Status.DONE || report?.status === Status.ERROR
      isProcessed && setTimeout(() => response?.raw.end(), 500)
    })
    const mapPipe = map((report: Report) => ({
      type: 'message',
      id: id.toString(),
      data: report ?? 'Not found',
    }))

    return defer(() => this.service.findOne(id)).pipe(
      repeatPipe,
      tapPipe,
      mapPipe,
    )
  }
}
