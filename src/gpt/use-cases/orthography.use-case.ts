import OpenAI from "openai";


interface Options {
    prompt: string;// prompt es solicitud
}


export const orthographyCheckUseCase = async(openai: OpenAI, options: Options) => {

    const {prompt} = options;// prompt es lo que esta contenido en TextInputMessageBox de la aplicacion de front end de react

    const completion = await openai.chat.completions.create({
        messages: [
            {// knowledge inicial que le daremos a OpenAI. Quiza esta sea la primera "orden" que le daremos a OpenAI
                role: "system",
                content: `
                    Te serán proveídos textos en español con posibles errores ortográficos o gramaticales.
                    Las palabras usadas deben de existir en el diccionario de la Real Academia Española.
                    Debes de responder en formato JSON.
                    Tu tarea es corregirlos y retornar la solución.
                    También, debes de dar un porcentaje de acierto por el usuario.

                    Si no hay errores, debes de retornar un mensaje de felicitaciones.

                    Ejemplo de salida:

                    {
                        userScore: number,
                        errors: [string], // ['error -> solucion']
                        message: string, // Usa emojis y texto para hacer una evaluación al texto del usuario
                    }


                `
            },
            {
                role: 'user',// assistant es para los desarrolladores, gpts es para el publico... En este caso, el usuario va a mandar el content (prompt) (content puede ser la pregunta "Cual es el equipo con mas champions league?")
                content: prompt
            }

        ],
        model: "gpt-3.5-turbo-1106",//  gpt-3.5-turbo-1106 es el recomendado por OpenAI para el modelo gpt-3.5
        // max_tokens // Por defecto, se usan solo los tokens necesarios
        // temperature // temperature va de 0 a 2 incluyendo valores decimales. Un valor alto como 0.8 hace que las respuestas a las peticiones prompt sean más aleatorias. En cambio, valores más cercanos al 0 hacen que la respuesta sea más enfocada y determinada
        temperature: 0.3,
        max_tokens: 150,// Numero maximo de tokens que se gastarán en la respuesta, lo cual hace que mi cuota desminuya. Esta cuota se peude ver en https://platform.openai.com/settings/organization/billing/overview
        response_format: {
            type: 'json_object'
        }
    });
    
    
    
    console.log(completion); // completion es un objeto que tiene mucha informacion
    // console.log(completion.choices[0]);

    const jsonResp = JSON.parse(completion.choices[0].message.content);

    return jsonResp;

    // return {
    //     prompt: prompt,
    //     openAIApiKey: process.env.OPENAI_API_KEY,
    // }
}