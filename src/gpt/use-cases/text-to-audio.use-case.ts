import OpenAI from "openai";
import * as path from "path";// Se importa asi porque path podria ser nulo
import * as fs from 'fs';

interface Options {
    prompt: string;
    voice?: string;
}


export const textToAudioUseCase = async(openai: OpenAI, { prompt, voice }: Options) => {

    const voices = {
        'nova': 'nova',
        'alloy': 'alloy',
        'echo' : 'echo',
        'fable' : 'fable',
        'onyx' : 'onyx',
        'shimmer': 'shimmer',
    }

    const selectedVoice = voices[voice] ?? 'nova';

    // __dirname contiene la ruta absoluta donde se encuentra este archivo text-to-audio.use-case.ts. Al dinal, folderPath apuntará al directorio audios que está dentro del directorio generated
    const folderPath = path.resolve(__dirname, '../../../generated/audios'); // Para saber que usuario generó el audio: /generated/USERID/audios, donde USERID (id de usuario puede ser un uuid) estará en una base de datos
    const speechFile = path.resolve(folderPath, `${folderPath}/${ new Date().getTime() }.mp3`)

    fs.mkdirSync(folderPath, { recursive: true });// De manera recursiva, se crearan los directorios generated y audios en caso de que no existan

    // Generar el mp3 (buffer de datos)
    const mp3 = await openai.audio.speech.create({
        model: 'tts-1',// Estar atento al modelo utilizado, pues puede consumir mucha cuota el modelo que pueda usar
        voice: selectedVoice,
        input: prompt,
        response_format: 'mp3',
    });

    const buffer = Buffer.from( await mp3.arrayBuffer() );// metodo arrayBuffer() devuelve el buffer de datos generado por OpenAI

    fs.writeFileSync(speechFile, buffer);

    return speechFile;
}