const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Método no permitido' }) };
  }

  try {
    const { message, level } = JSON.parse(event.body);
    
    if (!message || !level) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Faltan campos requeridos: message o level' })
      };
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Prompts específicos por nivel
    const prompts = {
      a1: `Eres un tutor de inglés para nivel A1 (principiante). Respuestas muy simples, vocabulario básico. Usa HTML: <strong>términos</strong>, <em>traducciones</em>, <div class="example">Ejemplo</div>. Pregunta: ${message}`,
      a2: `Eres un tutor de inglés para nivel A2 (básico). Usa pasado simple y vocabulario cotidiano. Formato HTML. Pregunta: ${message}`,
      b1: `Eres un tutor de inglés para nivel B1 (intermedio). Explica gramática con ejemplos. Formato HTML. Pregunta: ${message}`,
      b2: `Eres un tutor de inglés para nivel B2 (intermedio alto). Debate temas complejos. Formato HTML. Pregunta: ${message}`,
      c1: `Eres un tutor de inglés para nivel C1 (avanzado). Enfoque en matices y expresiones idiomáticas. Formato HTML. Pregunta: ${message}`,
      c2: `Eres un tutor de inglés para nivel C2 (maestría). Respuestas sofisticadas como nativo. Formato HTML. Pregunta: ${message}`
    };

    const prompt = prompts[level.toLowerCase()] || prompts.a1;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ response: text })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};