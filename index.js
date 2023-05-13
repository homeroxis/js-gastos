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
class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  nuevoEgreso(gasto) {
    this.gastos = [...this.gastos, gasto];
    this.calcularRestante();
  }
  calcularRestante() {
    const gastado = this.gastos.reduce(
      (total, gasto) => total + gasto.cantidad,
      0
    );
    this.restante = this.presupuesto - gastado;
  }

  eliminaGasto(id) {
    this.gastos = this.gastos.filter((gasto) => gasto.id != id);
    this.calcularRestante();
  }
}

class UI {
  insertarPresupuesto(cantidad) {
    const { presupuesto, restante } = cantidad;
    document.querySelector('#total span').textContent = presupuesto;
    document.querySelector('#restante span').textContent = restante;
    setTimeout(() => {
      document.querySelector('#gasto').focus();
    }, 100);
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
  mostrarGatos(gastos) {
    clearHtml(spent);
    gastos.forEach((gasto) => {
      const { nombre, cantidad, id } = gasto;

      const li = document.createElement('li');
      li.classList.add(
        'list-group-item',
        'd-flex',
        'justify-content-between',
        'align-items-center'
      );
      li.textContent = nombre;
      // span cantidad
      const cant = document.createElement('span');
      cant.className = 'badge rounded-pill text-bg-danger';
      cant.textContent = cantidad;
      li.appendChild(cant);

      // Btn borrar
      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('btn', 'btn-danger');
      deleteBtn.textContent = 'x';
      li.appendChild(deleteBtn);

      // función borrar
      deleteBtn.onclick = () => {
        deleteSpent(id);
      };

      spent.appendChild(li);
    });
  }

  actualizarRestante(nuevoRestante) {
    document.querySelector('#restante span').textContent = nuevoRestante;
  }
  comprobarPrsupuesto(sueldo) {
    const { presupuesto, restante } = sueldo;
    const divRestante = document.querySelector('#restante');
    if (presupuesto / 4 > restante) {
      divRestante.classList.remove('alert-success', 'alert-warning');
      divRestante.classList.add('alert-danger');
    } else if (presupuesto / 2 > restante) {
      divRestante.classList.remove('alert-success');
      divRestante.classList.add('alert-warning');
    }
    if (restante <= 0) {
      document.querySelector('#btnSubmit').disabled = true;
      document.querySelector('#gasto').disabled = true;
      document.querySelector('#cantidad').disabled = true;
      ui.showMessage('Te has pasado del presupuesto', 'error');
    } else {
      document.querySelector('#btnSubmit').disabled = false;
      document.querySelector('#gasto').disabled = false;
      document.querySelector('#cantidad').disabled = false;
    }
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
    sueldo = new Presupuesto(presupuestoUsuaro);
    ui.insertarPresupuesto(sueldo);

    interfaz.style.display = 'flex';

    ingreso.style.display = 'none';
  }
}

function clearHtml(div) {
  while (div.firstChild) {
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
  const { gastos, restante } = sueldo;
  ui.mostrarGatos(gastos);
  ui.actualizarRestante(restante);
  ui.comprobarPrsupuesto(sueldo);

  // resetear fomulario
  form.reset();
  document.querySelector('#gasto').focus();
}

function deleteSpent(id) {
  sueldo.eliminaGasto(id);
  const { gastos, restante } = sueldo;
  ui.mostrarGatos(gastos);
  ui.actualizarRestante(restante);
  ui.comprobarPrsupuesto(sueldo);
}
