import { API_URL } from './config.js';
import { state } from './state.js';
import { actualizarSaldosUI, renderTarjetasDesglose, renderGrafica } from './ui/index.js';

export async function cargarDatos() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const filas = data.movimientos ? data.movimientos.slice(1) : [];

    let ingresosTotal = 0;
    let gastosContado = 0;
    let totalTDC = 0;

    state.movimientos = [];
    state.mapGastosCat = {};
    state.mapIngresosCat = {};
    state.saldosTarjetas = { 'TDC HSBC': 0, 'TDC Banorte': 0, 'TDC Banregio': 0 };

    filas.forEach(row => {
      const [id, fecha, tipo, cat, concepto, rawMonto, rawMetodo] = row;
      const monto = parseFloat(rawMonto) || 0;
      const metodo = rawMetodo ? rawMetodo.toString().trim() : 'Efectivo';

      state.movimientos.push({ id, fecha, tipo, categoria: cat, concepto, monto, metodoPago: metodo });

      if (tipo === 'Ingreso') {
        ingresosTotal += monto;
        if (cat) state.mapIngresosCat[cat] = (state.mapIngresosCat[cat] || 0) + monto;
      } else if (tipo === 'Gasto') {
        if (metodo.startsWith('TDC')) {
          totalTDC += monto;
          if (state.saldosTarjetas[metodo] !== undefined) {
            state.saldosTarjetas[metodo] += monto;
          }
        } else {
          gastosContado += monto;
        }
        if (cat) state.mapGastosCat[cat] = (state.mapGastosCat[cat] || 0) + monto;
      }
    });

    const disponible = ingresosTotal - gastosContado;
    const saldoNeto = disponible - totalTDC;

    actualizarSaldosUI(disponible, totalTDC, saldoNeto);
    renderTarjetasDesglose();
    renderGrafica();
  } catch (err) {
    console.error("Error al cargar datos:", err);
  }
}

export async function guardarMovimiento(e) {
  e.preventDefault();
  const btn = document.getElementById('btnGuardar');
  btn.disabled = true;
  btn.innerText = 'Guardando...';

  const catPrincipal = document.getElementById('categoria').value;
  const subCat = document.getElementById('subcategoria').value;
  const categoriaFinal = subCat ? `${catPrincipal} (${subCat})` : catPrincipal;

  const payload = {
    tipo: state.tipoSeleccionado,
    categoria: categoriaFinal,
    monto: document.getElementById('monto').value,
    concepto: document.getElementById('concepto').value,
    metodoPago: document.getElementById('metodoPago').value,
    fecha: document.getElementById('fecha').value
  };

  try {
    await fetch(API_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    document.getElementById('monto').value = '';
    document.getElementById('concepto').value = '';

    await cargarDatos();
    alert('¡Movimiento guardado!');
  } catch (error) {
    console.error('Error al guardar:', error);
    alert('Error al guardar.');
  } finally {
    btn.disabled = false;
    btn.innerText = 'Guardar Movimiento';
  }
}