import { Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GptService } from './gpt.service';
import { AudioToTextDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';
import type { Response } from 'express';// Se coloca Response como type porque en este archivo no se usa Response para crear instancias, solo para tener tipados
import { FileInterceptor } from '@nestjs/platform-express';
import {diskStorage} from 'multer';

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

  @Post('audio-to-text')
  @UseInterceptors(// Para poder recibir el archivo contenido en la propiedad file del body (USEINTERCEPTORS para subir el archivo)
    FileInterceptor('file', {// file es la propiedad file que viene en el body
      storage: diskStorage({
        destination: './generated/uploads',// Directorio donde se guardará el archivo
        filename: (req, file, callback) => {
          const fileExtension = file.originalname.split('.').pop();// El ultimo elemento del array file.originalname.split('.') se elimina, pero se almacena en fileExtension
          const fileName = `${ new Date().getTime() }.${ fileExtension }`;// En lugar de new Date().getTime() podria ser un uuid para asegurarme que fileName o el nombre del archivo sea unico
          const error = null;

          // console.log(fileName);

          return callback(error, fileName);
        }
      })
    })
  )
  async audioToText(
    @UploadedFile(// UploadedFile es el archivo que se esta subiendo (UploadedFile para validar el archivo que se esta subiendo)
      new ParseFilePipe({// validators contiene todas las validaciones que el archivo debe de pasar
        validators: [// 1 KB = 1000 KB. 1 MB = 1024 MB
          new MaxFileSizeValidator({
            maxSize: 1000 * 1024 * 5,
            message: 'File is bigger than 5mb'
          }),// El tamaño del archivo maximo debe ser de 5 megabytes
          new FileTypeValidator({
            fileType: 'audio/*'
          })// El archivo debe ser de Cualquier tipo de audio
        ]
      })
    ) file: Express.Multer.File,
    @Body() audioToTextDto: AudioToTextDto,
  ){
    // console.log({prompt});

    // console.log({file});

    // return 'done';
    return this.gptService.audioToText(file, audioToTextDto);

  }


}
