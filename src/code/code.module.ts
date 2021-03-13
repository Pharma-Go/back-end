import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Code } from './code.entity';
import { CodeService } from './code.service';

@Module({
  imports: [TypeOrmModule.forFeature([Code])],
  providers: [CodeService],
  exports: [CodeService],
})
export class CodeModule {}
