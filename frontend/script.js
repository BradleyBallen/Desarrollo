
function guardar(){

    let apellidos='';
    let datoingresado = document.getElementById("correo").value;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    event.preventDefault();

    let raw = JSON.stringify({
      "dni": document.getElementById("dni").value,
      "nombre": document.getElementById("nombre").value,
      "apellidos": document.getElementById("apellidos").value,
      "email": document.getElementById("correo").value
    });

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("https://lustrous-centaur-30ba4f.netlify.app/.netlify/functions/estudiantes", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
}

//Ejemplo cuando se devuelve algo
function cargar(resultado){
    let transformado = JSON.parse(resultado);
    var salida="";
    var elemento="";


    for (let vc in transformado){
        elemento =  "<br>DI: " + transformado[vc].dni;
        elemento = elemento + "<br>Nombres y apellidos: " + transformado[vc].nombre + " " + transformado[vc].apellidos;
        elemento = elemento + "<br>Correo electrónico: " + transformado[vc].email;
        salida = salida  + elemento + "<br><br>";
    }

    document.getElementById("rta").innerHTML = salida;
}

function listar(){
    event.preventDefault();
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    fetch("https://lustrous-centaur-30ba4f.netlify.app/.netlify/functions/estudiantes", requestOptions)
      .then((response) =>
        response.text())
      .then((result) =>
        cargar(result))
      .catch((error) =>
        console.error(error));
}
function mostrarSeccionPrincipal() {
  // Oculta formularios y botón ingresar
  document.getElementById('adicionarEstudiante').parentElement.style.display = 'none';
  document.getElementById('listarEstudiantes').parentElement.style.display = 'none';
  document.getElementById('btnIngresarContainer').style.display = 'none';

  // Muestra la sección principal directamente
  document.getElementById('seccionPrincipal').style.display = 'block';
}

function volverAtras() {
  // Muestra formularios y botón ingresar
  document.getElementById('adicionarEstudiante').parentElement.style.display = 'block';
  document.getElementById('listarEstudiantes').parentElement.style.display = 'block';
  document.getElementById('btnIngresarContainer').style.display = 'block';

  // Oculta la sección principal
  document.getElementById('seccionPrincipal').style.display = 'none';
}


