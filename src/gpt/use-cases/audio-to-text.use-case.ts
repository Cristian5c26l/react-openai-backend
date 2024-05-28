import * as fs from 'fs';

import OpenAI from "openai";



interface Options {
    prompt?: string;
    audioFile: Express.Multer.File;
}

export const audioToTextUseCase = async(openai: OpenAI, options: Options) => {

    const { prompt, audioFile } = options;// Esta desestructuracion puede hacerse arriba mismo ({openai, options}: Options)

    console.log({prompt, audioFile});

    const response = await openai.audio.transcriptions.create({
        model: 'whisper-1',
        file: fs.createReadStream(audioFile.path),// file recibe un stream de informacion. audioFile.path indica donde está fisicamente el archivo
        prompt: prompt, // prompt es opcional y la documentacion dice que debe estar en el mismo idioma que el audioFile
        language: 'es',// es viene de ISO-639-1
        // response_format: 'vtt', // vtt es una respuesta en formato subtitulos. vtt es mas completo que srt
        response_format: 'verbose_json', // vtt es una respuesta en formato subtitulos. vtt es mas completo que srt
    });

    console.log(response);

    return response;

}