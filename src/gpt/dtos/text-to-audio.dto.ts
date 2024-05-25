import { IsOptional, IsString } from "class-validator";


export class TextToAudioDto {

    @IsString()
    readonly prompt: string;

    @IsString()
    @IsOptional()
    readonly voice?: string;// si voice no es enviado, se usa una voz por defecto

}