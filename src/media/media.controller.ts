import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOAuth2, ApiTags } from '@nestjs/swagger';
import { OAuthActionsScope } from 'src/lib/decorators/oauth.decorator';
import { MediaService } from './media.service';

@ApiTags('Establishment')
@Controller('medias')
@ApiOAuth2(['public'])
@OAuthActionsScope({
  'Create-Many': ['admin'],
  'Create-One': ['admin'],
  'Update-One': ['admin', 'employee', 'default'],
  'Delete-All': ['admin'],
  'Delete-One': ['admin', 'employee', 'default'],
  'Read-All': ['admin', 'employee', 'default'],
  'Read-One': ['admin', 'employee', 'default'],
  'Replace-One': ['admin', 'employee', 'default'],
})
export class MediaController {
  constructor(private service: MediaService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(@UploadedFile() file: any) {
    return this.service.upload(file.buffer);
  }
}
