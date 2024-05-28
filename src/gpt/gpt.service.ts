import { Injectable } from '@nestjs/common';

import OpenAI from 'openai';


import { audioToTextUseCase, orthographyCheckUseCase, prosConsDicusserStreamUseCase, prosConsDicusserUseCase, textToAudioGetterUseCase, textToAudioUseCase, translateUseCase } from './use-cases';
import { AudioToTextDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';

@Injectable()
export class GptService {

    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });// Insrancia openai inicializada. Dicha instancia es de la clase OpenAI

    // Solo va a llamar casos de uso

    async orthographyCheck(orthographyDto:OrthographyDto) {
        return await orthographyCheckUseCase(this.openai, {
            prompt: orthographyDto.prompt
        })
    }

    async prosConsDicusser({ prompt }: ProsConsDiscusserDto) {
        return await prosConsDicusserUseCase(this.openai, { prompt });
    }

    async prosConsDicusserStream({ prompt }: ProsConsDiscusserDto) {
        return await prosConsDicusserStreamUseCase(this.openai, { prompt });
    }

    async translate({ prompt, lang }: TranslateDto) {
        return await translateUseCase(this.openai, { prompt, lang });
    }

    async textToAudio({ prompt, voice }: TextToAudioDto) {
        return await textToAudioUseCase(this.openai, { prompt, voice });
    }

    async textToAudioGetter(fileId: number) {
        return await textToAudioGetterUseCase(fileId);
    }

    async audioToText(audioFile: Express.Multer.File, audioToTextDto: AudioToTextDto) {

        const {prompt} = audioToTextDto;

        return await audioToTextUseCase(this.openai, {audioFile, prompt});
    }

}
