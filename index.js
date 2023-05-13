// VAR
const estimation = document.querySelector('#presupuesto');
const form = document.querySelector('form');
const interfaz = document.querySelector('#interfaz');
const ingreso = document.querySelector('#ingreso');
const spent = document.querySelector('#spent');

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

  nuevoEgreso(gasto) {
    this.gastos = [...this.gastos, gasto];
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
    const message = document.querySelector('#message');
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert mt-3 text-center';
    alertDiv.textContent = msg;
    message.appendChild(alertDiv);

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
      clearHtml(message);
    }, 3000);
  }
  addSpentList(gastos) {
    gastos.forEach( gasto => {
      const li = document.createElement('li');
      li.classList.add('list-group-item')
      li.textContent = gasto.nombre;
      spent.appendChild(li);
    })
  }
}

const ui = new UI();
let sueldo;
// FUNCTION
function setEstimation(e) {
  if (e.keyCode === 13) {
    presupuestoUsuaro = estimation.value;
    if (
      presupuestoUsuaro === '' || presupuestoUsuaro === null ||
      isNaN(presupuestoUsuaro) || presupuestoUsuaro <= 0
    ) {
      estimation.value = '';
      presupuestoUsuaro = null;
      ui.showMessage('debe de ingresar un valor numérico', 'error');
      return;
    }
    sueldo = new Sueldo(presupuestoUsuaro);
    ui.insertarPresupuesto(sueldo);

    interfaz.style.display = 'flex';

    ingreso.style.display = 'none';
  }
}

function clearHtml(div) {
  if (div.firstChild) {
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
  } else if (nombre.length < 3) {
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

  // registrar gasto para llenar el objeto
  sueldo.nuevoEgreso(gasto);
  ui.showMessage('Gasto ingresado correctamente');

  // mandar gastos para imprimirlos en el html
  const { gastos } = sueldo;
  ui.addSpentList(gastos);
  
  // resetear fomulario
  form.reset();
}
