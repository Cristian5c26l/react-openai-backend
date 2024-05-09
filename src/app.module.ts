import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { GptModule } from './gpt/gpt.module';

@Module({
  imports: [
    ConfigModule.forRoot(),// Hacer disponibles las variables de entorno ubicadas en el archivo .env. Con esto, se agregan a process.env
    GptModule
  ]
})
export class AppModule {}
