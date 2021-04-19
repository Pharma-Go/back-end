import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Code } from './code.entity';
import { randomBytes } from 'crypto';

@Injectable()
export class CodeService {
  private length: number = 3;

  constructor(@InjectRepository(Code) private repo: Repository<Code>) {}

  public compareTime(time1: Date, time2: Date) {
    return new Date(time1) > new Date(time2);
  }

  private generateExpirationDate(): Date {
    const now = new Date();
    now.setHours(now.getHours() + 2);

    return now;
  }

  public async create(email: string) {
    const code = randomBytes(this.length).toString('hex');
    const expirationDate = this.generateExpirationDate();
    return this.repo.save({
      code,
      email,
      expirationDate,
    });
  }

  public async getCode(code: string): Promise<Code> {
    return this.repo.findOne({
      where: {
        code: code,
      },
    });
  }

  public async deleteCode(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  @Cron('0 * * * * *')
  private async removeExpiratedCodes() {
    const codes = await this.repo.find();

    for (const code of codes) {
      if (this.compareTime(new Date(), code.expirationDate)) {
        try {
          await this.repo.delete(code.id);
        } catch (err) {
          throw new BadRequestException(err);
        }
      }
    }
  }
}
