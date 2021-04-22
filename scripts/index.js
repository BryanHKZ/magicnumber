var max = 1000,
  min = 1,
  attempts = 0,
  maxAttempts = 10,
  time = 0,
  magicNumber = Math.round(Math.random() * (max - min) + min),
  init = false,
  date = null,
  userName = null,
  jugador = null,
  userList = null,
  interval = null,
  intentos = [];
const button = document.getElementById("verifyButton");

showUsers();

function displayButtons() {
  button.disabled = !button.disabled;
  document.querySelector(".reset-button").classList.toggle("display");
  document.querySelector("button").classList.toggle("display");
}

function setUsername() {
  userName = document.getElementById("inputUsername").value;

  if (userName.length != 0) {
    document.getElementById("game").classList.toggle("display");
    document.getElementById("register").classList.toggle("display");
  } else {
    alert("El nombre no puede estar vacío");
  }
}

function formatTime(time) {
  date = new Date(time * 1000);
  minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  seconds =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

  return `Tiempo: ${minutes}:${seconds}`;
}

function displayClock() {
  init = true;
  interval = setInterval(() => {
    time++;
    document.getElementById("clock").innerHTML = formatTime(time);
  }, 1000);
}

function resetGame() {
  magicNumber = Math.round(Math.random() * (max - min) + min);
  attempts = 0;
  time = 0;
  date = null;
  init = false;
  intentos = [];
  document.getElementById("output").innerHTML =
    "Ingresa un primer numero para iniciar";
  document.getElementById("attempt").innerHTML = "Intentos usados: " + attempts;
  document.getElementById("clock").innerHTML = "00:00";
  document.getElementById("listaintentos").innerHTML = "Números usados: []";
  displayButtons();
  clearInterval(interval);
}

function listExist() {
  return window.localStorage.getItem("userlist");
}

function updateList(win) {
  jugador = {
    nombre: userName,
    intentos: attempts,
    tiempo: formatTime(time),
    gano: win ? "✅" : "❌",
  };

  if (listExist()) {
    userList = window.localStorage.getItem("userlist");
    var x = JSON.parse(userList);
    x.push(jugador);

    userList = JSON.stringify(x);
    window.localStorage.setItem("userlist", userList);
  } else {
    x = [];
    x.push(jugador);

    userList = JSON.stringify(x);
    window.localStorage.setItem("userlist", userList);
  }

  showUsers();
}

function getInputValue() {
  var userInput = parseInt(document.getElementById("inputUser").value);

  if (!init) displayClock();

  if (userInput == magicNumber) {
    attempts++;
    intentos.push(userInput);
    document.getElementById(
      "output"
    ).innerHTML = `Bien hecho ${userName}, le agarraste la plata al mello y votaste por caicedo`;
    clearInterval(interval);
    updateList(true);
    displayButtons();
  } else if (userInput > magicNumber) {
    attempts++;
    intentos.push(userInput);
    document.getElementById("output").innerHTML =
      "El número ingresado es mayor";
  } else if (userInput < magicNumber) {
    attempts++;
    intentos.push(userInput);
    document.getElementById("output").innerHTML =
      "El número ingresado es menor";
  }
  document.getElementById("attempt").innerHTML = "Intentos usados: " + attempts;

  document.getElementById("listaintentos").innerHTML =
    "Números usados: [" + intentos.join(" | ") + "]";

  if (attempts >= maxAttempts) {
    document.getElementById(
      "output"
    ).innerHTML = `Joa ${userName} no te tocaba, el número era ${magicNumber}`;
    displayButtons();
    updateList(false);
    clearInterval(interval);
  }
}

function showUsers() {
  var lista = window.localStorage.getItem("userlist");
  var htmlItems = "";

  lista = JSON.parse(lista);
  for (var i = 0; i < lista.length; i++) {
    htmlItems += `<tr>
      <td>${lista[i].nombre}</td>
      <td>${lista[i].tiempo.split(" ")[1]}</td>
      <td>${lista[i].intentos}</td>
      <td>${lista[i].gano}</td>
    </tr>`;
  }

  document.getElementById("listausuarios").innerHTML = `<table class="table">
    <thead>
      <tr>
        <th scope="col">Nombre</th>
        <th scope="col">Tiempo (mm:ss)</th>
        <th scope="col">Intentos</th>
        <th scope="col">Victoria</th>
      </tr>
    </thead>
    <tbody>
    ${htmlItems}
    </tbody>
  </table>`;
}
