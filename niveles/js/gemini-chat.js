// Configuración de la API (versión simplificada sin .env)
const API_KEY = 'AIzaSyBv7XuuijT28GgQpuy5UXgOfhCb81EWGss'; // Reemplaza si es necesario
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Elementos del DOM
const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Función para mostrar errores
function showError(error) {
  console.error(error);
  const errorDiv = document.createElement('div');
  errorDiv.classList.add('alert', 'alert-danger', 'mt-2');
  errorDiv.textContent = `Error: ${error.message || 'Problema al conectar con Gemini'}`;
  chatContainer.appendChild(errorDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Función para formatear la respuesta de Gemini
function formatGeminiResponse(text) {
  // Reemplazar markdown básico por HTML
  let formattedText = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Negritas
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Cursivas
    .replace(/\n/g, '<br>'); // Saltos de línea

  // Mejorar el formato de ejemplos
  formattedText = formattedText.replace(/Ejemplo:/g, '<div class="example-title">Ejemplo:</div>');
  
  // Formatear listas no numeradas
  formattedText = formattedText.replace(/\•\s(.*?)(<br>|$)/g, '<li>$1</li>');
  formattedText = formattedText.replace(/<li>.*?<\/li>/g, function(match) {
    return '<ul style="margin-left: 20px; list-style-type: disc;">' + match + '</ul>';
  });

  return formattedText;
}

// Función para agregar mensajes al chat
function addMessageToChat(sender, message) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('mb-2', 'p-3', sender === 'Tú' ? 'bg-light' : 'bg-primary-subtle', 'rounded');
  
  const senderSpan = document.createElement('span');
  senderSpan.classList.add('fw-bold', sender === 'Tú' ? 'text-primary' : 'text-success');
  senderSpan.textContent = sender + ': ';
  
  const messageSpan = document.createElement('span');
  
  // Si es el tutor, formateamos el mensaje como HTML
  if (sender === 'Tutor') {
    messageSpan.innerHTML = formatGeminiResponse(message);
  } else {
    messageSpan.textContent = message;
  }
  
  messageDiv.appendChild(senderSpan);
  messageDiv.appendChild(messageSpan);
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Función para enviar mensaje a Gemini
async function sendMessageToGemini(message) {
  try {
    addMessageToChat('Tú', message);
    
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Actúa como un tutor de inglés especializado en nivel A1. Responde en español claro y sencillo. 
                  Usa ejemplos prácticos con este formato:
                  - Para términos importantes: usa "negritas"
                  - Para traducciones: usa "cursivas"
                  - Para ejemplos: escribe "Ejemplo:" seguido del ejemplo
                  - Para listas: usa guiones
                  No uses caracteres como * o ** para formato.
                  La pregunta del estudiante es: ${message}`
          }]
        }]
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error en la API');
    }
    
    const data = await response.json();
    if (!data.candidates || !data.candidates[0].content.parts[0].text) {
      throw new Error('Respuesta inesperada de la API');
    }
    
    const geminiResponse = data.candidates[0].content.parts[0].text;
    addMessageToChat('Tutor', geminiResponse);
    
  } catch (error) {
    showError(error);
  } finally {
    sendButton.disabled = false;
    sendButton.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar';
  }
}

// Event listeners
sendButton.addEventListener('click', async () => {
  const message = userInput.value.trim();
  if (message) {
    userInput.value = '';
    sendButton.disabled = true;
    sendButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    await sendMessageToGemini(message);
  }
});

userInput.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    const message = userInput.value.trim();
    if (message) {
      userInput.value = '';
      sendButton.disabled = true;
      sendButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
      await sendMessageToGemini(message);
    }
  }
});

// Mensaje inicial
addMessageToChat('Tutor', '¡Hola! 👋 Soy tu tutor de inglés nivel A1. ¿Qué te gustaría aprender hoy? Puedes preguntarme sobre vocabulario, gramática o practicar conversación.');