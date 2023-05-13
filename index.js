// VAR
const estimation = document.querySelector('#presupuesto');
const form = document.querySelector('form');

// EVENTS
eventListener();
function eventListener() {
  estimation.addEventListener('keypress', setEstimation);
  form.addEventListener('submit', onSubmit);
}

// CLASS
class Sueldo {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  nuevoEgreso(gasto){
    this.gastos = [
      ...this.gastos,
      gasto
    ];
    console.log('hubo un egreso', this.gastos);
  }
 
}

class UI {
  insertarPresupuesto(cantidad) {
    const { presupuesto, restante } = cantidad;
    document.querySelector('#total span').textContent = presupuesto;
    document.querySelector('#restante span').textContent = restante;
  }
  showMessage(msg, tipo) {
    const alertBox = document.querySelector('#alert-box');
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert mt-3 text-center';
    alertDiv.textContent = msg;
    alertBox.appendChild(alertDiv);

    switch (tipo) {
      case 'error':
        alertDiv.classList.add('alert-danger');
        alertDiv.classList.remove('alert-success');
        break;
      default:
        alertDiv.classList.add('alert-success');
        break;
    }
    setTimeout(() => {
      clearHtml(alertBox);
    }, 3000);
  }
}

const ui = new UI();
let sueldo;
// FUNCTION
function setEstimation(e) {
  if (e.keyCode === 13) {
    presupuestoUsuaro = estimation.value;
    if (
      presupuestoUsuaro === '' ||
      presupuestoUsuaro === null ||
      isNaN(presupuestoUsuaro) ||
      presupuestoUsuaro <= 0
    ) {
      estimation.value = '';
      presupuestoUsuaro = null;
      ui.showMessage('debe de ingresar un valor numérico', 'error');
      return;
    }
    sueldo = new Sueldo(presupuestoUsuaro);
    ui.insertarPresupuesto(sueldo);
    const interfaz = document.querySelector('#interfaz');
    interfaz.style.display = 'flex';
    const ingreso = document.querySelector('#ingreso');
    ingreso.style.display = 'none';
  }
}


function clearHtml(div) {
  if (div.firstChild) {
    console.log(div);
    div.removeChild(div.firstChild);
  }
}

function onSubmit(e) {
  e.preventDefault();
  const nombre = document.querySelector('#gasto').value;
  const cantidad = Number(document.querySelector('#cantidad').value);

  if (nombre === '' || cantidad === '') {
    ui.showMessage('Los campos no deben de ir vacíos', 'error');
    return;
  } else if (nombre.length <= 3) {
    ui.showMessage('El campo Gasto debe tener al menos 3 caracteres', 'error');
    return;
  } else if (cantidad <= 0 || isNaN(cantidad)) {
    ui.showMessage('El campo Cantidad debe ser mayor a cero', 'error');
    return;
  }
  const gasto = {
    nombre,
    cantidad,
    id: Date.now(),
  };

  sueldo.nuevoEgreso(gasto)
  form.reset();
}
