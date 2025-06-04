// Elementos del DOM para fácil acceso
let loginContainer, loginSection, seccionPrincipal, loginError, pageTitleContainer;

document.addEventListener('DOMContentLoaded', () => {
    
    loginContainer = document.getElementById('loginContainer');
    loginSection = document.getElementById('loginSection'); 
    seccionPrincipal = document.getElementById('seccionPrincipal');
    loginError = document.getElementById('loginError');
    pageTitleContainer = document.getElementById('pageTitleContainer');

    // Verificar si el usuario ya está "logeado" en esta sesión
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        
        if (pageTitleContainer) pageTitleContainer.style.display = 'block';
        if (loginContainer) loginContainer.style.display = 'none';
        if (seccionPrincipal) seccionPrincipal.style.display = 'block';
    } else {
        
        if (pageTitleContainer) pageTitleContainer.style.display = 'block';
        if (loginContainer) loginContainer.style.display = 'flex'; 
        if (seccionPrincipal) seccionPrincipal.style.display = 'none';
    }
    if (loginError) loginError.style.display = 'none'; 
});

function procesarLogin() {
  const usuarioInput = document.getElementById('loginUsuario').value;
  const contrasenaInput = document.getElementById('loginContrasena').value;

  const usuariosValidos = {
      "bradley": "bradley123",
      "user": "user123"
  };

  if (usuariosValidos[usuarioInput] && usuariosValidos[usuarioInput] === contrasenaInput) {
    // Login exitoso
    sessionStorage.setItem('isLoggedIn', 'true'); 

    if (pageTitleContainer) pageTitleContainer.style.display = 'block'; 
    if (loginContainer) loginContainer.style.display = 'none';
    if (seccionPrincipal) seccionPrincipal.style.display = 'block';
    if (loginError) loginError.style.display = 'none';
    document.getElementById("loginForm").reset(); 
  } else {
    // Login fallido
    sessionStorage.removeItem('isLoggedIn'); 
    if (loginError) loginError.style.display = 'block';
  }
}

function volverDesdePrincipal() {
  sessionStorage.removeItem('isLoggedIn'); 

  if (pageTitleContainer) pageTitleContainer.style.display = 'block';
  if (loginContainer) loginContainer.style.display = 'flex';
  if (seccionPrincipal) seccionPrincipal.style.display = 'none';
  if (loginError) loginError.style.display = 'none';
}