// Configuración común para todos los niveles
const API_URL = '/.netlify/functions/gemini';

function initializeTutor(level) {
  const chatContainer = document.getElementById('chat-container');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');

  // Función para mostrar errores
  function showError(error) {
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('alert', 'alert-danger', 'mt-2');
    errorDiv.textContent = `Error: ${error.message || 'Problema al conectar con el tutor'}`;
    chatContainer.appendChild(errorDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  // Función para formatear la respuesta
  function formatResponse(text) {
    return text
      .replace(/<strong>(.*?)<\/strong>/g, '<strong>$1</strong>')
      .replace(/<em>(.*?)<\/em>/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
      .replace(/Ejemplo:/g, '<div class="example-title">Ejemplo:</div>');
  }

  // Función para agregar mensajes
  function addMessage(sender, message, isHTML = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('mb-2', 'p-3', sender === 'Tú' ? 'bg-light' : 'bg-primary-subtle', 'rounded');
    
    messageDiv.innerHTML = `
      <span class="fw-bold ${sender === 'Tú' ? 'text-primary' : 'text-success'}">${sender}: </span>
      <span>${isHTML ? formatResponse(message) : message}</span>
    `;
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  // Función para enviar mensaje
  async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    userInput.value = '';
    sendButton.disabled = true;
    sendButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    
    try {
      addMessage('Tú', message);
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, level })
      });
      
      if (!response.ok) throw new Error('Error en la respuesta');
      
      const data = await response.json();
      addMessage('Tutor', data.response, true);
      
    } catch (error) {
      showError(error);
    } finally {
      sendButton.disabled = false;
      sendButton.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar';
    }
  }

  // Event listeners
  sendButton.addEventListener('click', sendMessage);
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  // Mensaje inicial
  const greetings = {
    a1: '¡Hola! Soy tu tutor de inglés nivel A1 (principiante). ¿En qué puedo ayudarte hoy?',
    a2: '¡Hola! Soy tu tutor de inglés nivel A2 (básico). ¿Qué quieres aprender hoy?',
    b1: '¡Bienvenido a tu clase de inglés nivel B1 (intermedio)! ¿Cómo puedo ayudarte?',
    b2: '¡Saludos! Soy tu tutor de inglés nivel B2 (intermedio alto). ¿Qué tema te interesa?',
    c1: '¡Hola! Soy tu tutor de inglés nivel C1 (avanzado). ¿En qué puedo asistirte hoy?',
    c2: '¡Bienvenido a tu clase de inglés nivel C2 (maestría)! ¿Qué deseas practicar hoy?'
  };
  
  addMessage('Tutor', greetings[level] || greetings.a1);
}

// Inicializa el tutor cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Extrae el nivel de la URL o del título de la página
  const level = window.location.pathname.match(/(a1|a2|b1|b2|c1|c2)/i)?.[0]?.toLowerCase() || 'a1';
  initializeTutor(level);
});