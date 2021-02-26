import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.gmail.com',
          port: '587',
          tls: { ciphers: 'SSLv3' }, // gmail
          auth: {
            user: 'lucassesti@seeken.me',
            pass: 'kVCRCpRbj7WN',
          },
        },
        defaults: {
          from: 'seeken@seeken.me',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
})
export class MailModule {}
