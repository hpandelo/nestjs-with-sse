import { Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'
import { bullConfig } from './config/bull.config'

@Injectable()
export class AppService {
  async getPing(): Promise<object> {
    const redisInstance = new Redis(
      bullConfig.redis.port,
      bullConfig.redis.host,
    )
    const redis = await redisInstance.ping()

    return {
      http: 'Pong!',
      redis,
    }
  }
}
