// Configuración para Netlify Functions
const API_URL = '/.netlify/functions/gemini';

// Elementos del DOM
const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Función para mostrar errores
function showError(error) {
  console.error(error);
  const errorDiv = document.createElement('div');
  errorDiv.classList.add('alert', 'alert-danger', 'mt-2');
  errorDiv.textContent = `Error: ${error.message || 'Problema al conectar con el tutor'}`;
  chatContainer.appendChild(errorDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Función para formatear la respuesta
function formatGeminiResponse(text) {
  let formattedText = text
    .replace(/<strong>(.*?)<\/strong>/g, '<strong>$1</strong>')
    .replace(/<em>(.*?)<\/em>/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
    .replace(/Ejemplo:/g, '<div class="example-title">Ejemplo:</div>');

  return formattedText;
}

// Función para agregar mensajes al chat
function addMessageToChat(sender, message, isHTML = false) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('mb-2', 'p-3', sender === 'Tú' ? 'bg-light' : 'bg-primary-subtle', 'rounded');
  
  const senderSpan = document.createElement('span');
  senderSpan.classList.add('fw-bold', sender === 'Tú' ? 'text-primary' : 'text-success');
  senderSpan.textContent = sender + ': ';
  
  const messageSpan = document.createElement('span');
  messageSpan.innerHTML = isHTML ? formatGeminiResponse(message) : message;
  
  messageDiv.appendChild(senderSpan);
  messageDiv.appendChild(messageSpan);
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Función para enviar mensaje a través de Netlify Function
async function sendMessageToGemini(message) {
  try {
    addMessageToChat('Tú', message);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message })
    });
    
    if (!response.ok) {
      throw new Error('Error al conectar con el tutor');
    }
    
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    
    addMessageToChat('Tutor', data.response, true);
    
  } catch (error) {
    showError(error);
  } finally {
    sendButton.disabled = false;
    sendButton.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar';
  }
}

// Event listeners (se mantienen igual)
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