import { API_URL, TARJETAS_CONFIG } from './config.js';
import { state } from './state.js';
import { actualizarSaldosUI, renderTarjetasDesglose, renderGrafica } from './ui/index.js';

export async function cargarDatos() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const filas = data.movimientos ? data.movimientos.slice(1) : [];

    let ingresosTotal = 0;
    let gastosContado = 0;
    let totalTDCDeuda = 0;

    state.movimientos = [];
    state.mapGastosCat = {};
    state.mapIngresosCat = {};

    // Resetear saldos con los valores base configurados
    TARJETAS_CONFIG.forEach(tdc => {
      state.saldosTarjetas[tdc.id] = { 
        porPagar: tdc.montoCorte || 0, 
        consumoActual: 0 
      };
    });

    filas.forEach(row => {
      const [id, fecha, tipo, cat, concepto, rawMonto, rawMetodo, periodo] = row;
      const monto = parseFloat(rawMonto) || 0;
      const metodo = rawMetodo ? rawMetodo.toString().trim() : 'Efectivo';

      state.movimientos.push({ id, fecha, tipo, categoria: cat, concepto, monto, metodoPago: metodo, periodo });

      if (tipo === 'Ingreso') {
        ingresosTotal += monto;
        if (cat) state.mapIngresosCat[cat] = (state.mapIngresosCat[cat] || 0) + monto;
      } else if (tipo === 'Gasto') {
        if (metodo.startsWith('TDC')) {
          const tdcConf = TARJETAS_CONFIG.find(t => t.id === metodo);
          const fechaGasto = fecha ? fecha.split('T')[0] : '';
          
          if (tdcConf && fechaGasto > tdcConf.fechaCorte) {
            // Gasto posterior al corte -> Consumo Actual
            state.saldosTarjetas[metodo].consumoActual += monto;
          } else {
            // Gasto dentro o previo al corte -> Por Pagar
            state.saldosTarjetas[metodo].porPagar += monto;
          }
        } else {
          gastosContado += monto;
        }
        if (cat) state.mapGastosCat[cat] = (state.mapGastosCat[cat] || 0) + monto;
      }
    });

    // Sumatoria total por pagar de todas las tarjetas
    Object.values(state.saldosTarjetas).forEach(t => {
      totalTDCDeuda += t.porPagar + t.consumoActual;
    });

    const disponible = ingresosTotal - gastosContado;
    const saldoNeto = disponible - totalTDCDeuda;

    actualizarSaldosUI(disponible, totalTDCDeuda, saldoNeto);
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
  const metodoPago = document.getElementById('metodoPago').value;
  const fecha = document.getElementById('fecha').value;

  // Determinar periodo automáticamente para Google Sheets
  let periodoAuto = "Contado";
  if (metodoPago.startsWith('TDC')) {
    const tdcConf = TARJETAS_CONFIG.find(t => t.id === metodoPago);
    if (tdcConf) {
      periodoAuto = fecha > tdcConf.fechaCorte ? "Nuevo Periodo" : "Periodo Cortado";
    }
  }

  const payload = {
    tipo: state.tipoSeleccionado,
    categoria: categoriaFinal,
    monto: document.getElementById('monto').value,
    concepto: document.getElementById('concepto').value,
    metodoPago: metodoPago,
    fecha: fecha,
    periodo: periodoAuto
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