import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsDiscusserDto, TranslateDto } from './dtos';
import { Response } from 'express';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(
    // @Body() body: any// Obtener el body (sin importar de qué tipo es el body, como tipo x-www-form-urlencoded) que viene en la peticion
    @Body() orthographyDto:OrthographyDto,// Hacer la validacion de las propiedades del body. En caso de que el body sea de tipo x-www-form-urlencoded (propiedades que vengan de un formulario), de igual forma el dto OrthographyDto valida que las propiedades de ese body luzcan como se quiere que luzcan
  ){
    // return this.gptService.orthographyCheck()
    // return body;
    // return orthographyDto;
    // return this.gptService.orthographyCheck()
    return this.gptService.orthographyCheck(orthographyDto)

  }

  @Post('pros-cons-discusser')
  prosConsDiscusser(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto
  ){
    return this.gptService.prosConsDicusser(prosConsDiscusserDto);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDiscusserStream(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @Res() res: Response// Esto es util para poder emitir streams o partes de la respuesta
  ){
    const stream = await this.gptService.prosConsDicusserStream(prosConsDiscusserDto);// stream contiene toda la respuesta

    res.setHeader('Content-Type','application/json');
    res.status(HttpStatus.OK);

    // Uso de for porque vamos a hacer varias emisiones (chunk) del stream. chunk es una pieza de la respuesta
    for await( const chunk of stream ) {
      const piece = chunk.choices[0].delta.content || '';
      // console.log(piece);// Para asegurarse que el stream es invocado desde la parte del backend
      res.write(piece);
    }

    res.end();// En este punto se termina el stream de datos.

  }

  @Post('translate')
  translate(
    @Body() translateDto: TranslateDto
  ){
    return this.gptService.translate(translateDto);
  }


}
