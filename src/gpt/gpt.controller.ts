import { Body, Controller, Post } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto } from './dtos';

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

}
