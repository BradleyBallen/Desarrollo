const { GoogleGenerativeAI } = require("@google/generative-ai");

// Versión mejorada con manejo de errores robusto y validaciones
exports.handler = async (event) => {
  // Validar método HTTP
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido. Use POST' })
    };
  }

  try {
    // Parsear y validar el cuerpo de la solicitud
    const { message } = JSON.parse(event.body);
    
    if (!message || typeof message !== 'string') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'El campo "message" es requerido y debe ser texto' })
      };
    }

    // Configurar modelo Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7, // Controla la creatividad (0-1)
        maxOutputTokens: 1000 // Limita la longitud de la respuesta
      }
    });

    // Prompt mejor estructurado
    const prompt = `
      Eres un tutor de inglés para principiantes (nivel A1). Sigue estas reglas:
      1. Responde en español claro y simple
      2. Usa este formato:
         - <strong>para términos clave</strong>
         - <em>para palabras en inglés</em>
         - <div class="example">Ejemplo: contenido</div> para ejemplos
      3. No uses markdown (*, **, etc.)
      4. Mantén respuestas breves (máx. 3 párrafos)
      5. Sé paciente y alentador
      
      Pregunta del estudiante: ${message}
    `;

    // Generar contenido
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Validar y limpiar respuesta
    if (!response || !response.text) {
      throw new Error('Respuesta inesperada de la API Gemini');
    }
    
    const text = response.text().trim();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache' // Para respuestas siempre frescas
      },
      body: JSON.stringify({ 
        response: text,
        metadata: {
          model: "gemini-2.0-flash",
          tokens: response.usageMetadata?.totalTokenCount || 'desconocido'
        }
      })
    };

  } catch (error) {
    console.error('Error en la función Gemini:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Error al procesar tu solicitud',
        details: process.env.NODE_ENV === 'development' ? error.message : null
      })
    };
  }
};