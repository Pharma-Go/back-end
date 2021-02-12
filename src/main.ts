import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestApplication, NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { OAuth2ServerExceptionFilter } from './oauth/oauth.filter';

class App {
  public static app: NestApplication;

  private static async setup() {
    // Cria a instância
    const app = (this.app = await NestFactory.create(AppModule));

    // Pipes
    app.useGlobalPipes(
      new ValidationPipe({
        validationError: {
          target: false,
        },
      }), // Validação
    );

    // Cookies
    // app.use(
    //   CookieSession({
    //     secret: process.env.COOKIE_SECRET,
    //     overwrite: true,
    //     signed: true,
    //     httpOnly: true,
    //     maxAge: 1.296e9,
    //     name: 'invictus.sid',
    //   }),
    // );

    // Interceptadores
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)), // Class Tranformer
    );

    // Filtros de Exceção
    app.useGlobalFilters(
      new OAuth2ServerExceptionFilter(), // Erros do OAuth
    );

    // Swagger
    this.setupSwagger();

    // Views
    this.setupViews();
  }

  private static setupViews() {
    this.app.setViewEngine('ejs');
  }

  /**
   * Instala o Swagger
   */
  private static setupSwagger() {
    const options = new DocumentBuilder()
      .setTitle('PharmaGO')
      .setDescription('API PharmaGO')
      .setVersion('0.0.1')
      .addBearerAuth({
        type: 'oauth2',
        flows: {
          password: {
            tokenUrl: 'http://localhost:3000/oauth/token',
            refreshUrl: 'http://localhost:3000/oauth/token',
            scopes: {
              admin: 'Administrador',
              default: 'Usuario',
            },
          },
        },
      })
      .build();

    const document = SwaggerModule.createDocument(this.app, options);
    SwaggerModule.setup('swagger-ui', this.app, document);
    return this;
  }

  public static async start() {
    await this.setup();
    return this.app.listen(process.env.PORT);
  }
}

App.start().then(() => console.log('Api online!'));