import OpenAI from "openai";

interface Options {
    prompt: string;
  }

export const prosConsDicusserStreamUseCase = async (openai: OpenAI, { prompt }: Options) => {
    return await openai.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: `
                Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
                la respuesta debe de ser en formato markdown,
                los pros y contras deben de estar en una lista,
                `
            },
            {
                role: 'user',
                content: prompt
            }
        ],
        stream: true,
        model: 'gpt-4o',// OpenAI dice que  GPT-4o es tan inteligente como GPT-4 Turbo ademas de ser mucho mas eficiente. gtp-4o tiene mejor soporte a idiomas, mejor visión, y esta a la mitad del costo de la cuota de consumo.
        temperature: 0.8,// // temperature va de 0 a 2 incluyendo valores decimales. Un valor alto como 0.8 hace que las respuestas a las peticiones prompt sean más aleatorias. En cambio, valores más cercanos al 0 hacen que la respuesta sea más enfocada y determinada
        max_tokens: 500,// tokens que conforma la respuesta. Con 500 aparecerán cortadas las respuestas
        // 0.8 en la temperatura hace que las respuestas sean aleatorias

    });
    
}