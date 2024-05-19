import OpenAI from "openai";

interface Options {
    prompt: string;
    lang: string
  }

export const translateUseCase = async (openai: OpenAI, { prompt, lang }: Options) => {
    const response = await openai.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: `Traduce el siguiente texto al idioma ${ lang }: ${prompt}`
            },
        ],
        model: 'gpt-4o',// OpenAI dice que  GPT-4o es tan inteligente como GPT-4 Turbo ademas de ser mucho mas eficiente. gtp-4o tiene mejor soporte a idiomas, mejor visión, y esta a la mitad del costo de la cuota de consumo. Creo que es 1 millon de tokens de entrada por 5 dolares y 1 millon de tokens de respuesta por 5 dolares
        temperature: 0.2,// // temperature va de 0 a 2 incluyendo valores decimales. Un valor alto como 0.8 hace que las respuestas a las peticiones prompt sean más aleatorias. En cambio, valores más cercanos al 0 hacen que la respuesta sea más enfocada y determinada
        // max_tokens: 500,// tokens que conforma la respuesta. Con 500 aparecerán cortadas las respuestas
        // 0.8 en la temperatura hace que las respuestas sean aleatorias

    });

    console.log(response);

    // return response.choices[0].message.content; // esta es una respuesta en texto plano
    return {message: response.choices[0].message.content}
    
}