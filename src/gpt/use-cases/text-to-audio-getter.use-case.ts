import * as path from "path";// Se importa asi porque path podria ser nulo
import * as fs from 'fs';


export const textToAudioGetterUseCase = async(fileId: number) => {

    // __dirname contiene la ruta absoluta donde se encuentra este archivo text-to-audio-getter.use-case.ts. Al final, folderPath apuntará al directorio audios que está dentro del directorio generated
    const folderPath = path.resolve(__dirname, '../../../generated/audios'); // Para saber que usuario generó el audio: /generated/USERID/audios, donde USERID (id de usuario puede ser un uuid) estará en una base de datos
    const speechFile = path.resolve(folderPath, `${folderPath}/${ fileId }.mp3`);// speechFile hará referencia o apuntará al archivo con nombre fileId

    if ( !fs.existsSync( speechFile ) ) return { exists: false };

    return {
        exists: true,
        filePath: speechFile,
    }
}