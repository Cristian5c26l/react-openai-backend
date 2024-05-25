import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';
import type { Response } from 'express';// Se coloca Response como type porque en este archivo no se usa Response para crear instancias, solo para tener tipados

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

  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: Response,
  ){
    const filePath = await this.gptService.textToAudio(textToAudioDto);

    // Cambiar el contenido de la respuesta a traves del header Content-Type
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);// Se hizo correctamente la peticion
    res.sendFile(filePath);// Responder a la peticion con el archivo mp3

  }

  @Get('text-to-audio/:fileId')
  async textToAudioGetter(
    @Param('fileId', ParseIntPipe) fileId: number,// Lo que esta despues (que es dinamico) de /gpt/text-to-audio/ se almacena en fileId, y despues, se convierte a entero
    @Res() res: Response,
  ){
    // console.log(fileId);
    const { exists, filePath } = await this.gptService.textToAudioGetter(fileId) as { exists: boolean, filePath?: string };// filePath?: string indica que filePath es un string o un undefined (si es undefined indica que el objeto puede no venir con filePath)

    if ( !exists ) {
      res.setHeader('Content-Type', 'text/plain');
      res.status(HttpStatus.NOT_FOUND);
      res.send(`Audio ${fileId}.mp3 no encontrado en el servidor`);
    } else {
      // Cambiar el contenido de la respuesta a traves del header Content-Type
      res.setHeader('Content-Type', 'audio/mp3');
      res.status(HttpStatus.OK);// Se hizo correctamente la peticion
      res.sendFile(filePath);// Responder a la peticion con el archivo mp3
    }

  }


}
