// ==================== CONFIGURACIÓN Y ESTADO GLOBAL ====================
const API_URL = "https://script.google.com/macros/s/AKfycbxIlyWwvnEDlspZ3RNHVd9giOoVdcUV0Mnhn6RjElnkCnappCJ4Ph4WjEX2vqBnT44U/exec"; // Reemplaza con tu URL de Google Apps Script

const TARJETAS_CONFIG = [
  { id: 'TDC HSBC', nombre: 'HSBC', diaCorte: 26, diaPago: 15 },
  { id: 'TDC Banorte', nombre: 'Banorte', diaCorte: 14, diaPago: 3 },
  { id: 'TDC Banregio', nombre: 'Banregio', diaCorte: 26, diaPago: 17 }
];

const CATEGORIAS = {
  Gasto: {
    "Gasolina": [],
    "Alimentos": ["Mandado", "Comidas"],
    "Gastos Fijos": [],
    "Servicios": ["Pachuca", "CDMX"],
    "Educación": [],
    "Salud": [],
    "Vestido": [],
    "Auto/transporte": ["Accent", "Grand i10", "Accord", "Otro"],
    "Entretenimiento": [],
    "Mantenimiento": [],
    "Intereses TDC": []
  },
  Ingreso: {
    "Sueldo": [],
    "Plataformas Digitales": [],
    "Ventas": [],
    "Rendimientos": [],
    "Otros Ingresos": []
  }
};

const state = {
  tipoSeleccionado: 'Gasto',
  filtroHistorial: 'Gasto',
  tabGrafica: 'Gasto',
  movimientos: [],
  mapGastosCat: {},
  mapIngresosCat: {},
  saldosTarjetas: {},
  chartInstance: null
};

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('fecha').value = new Date().toISOString().split('T')[0];
  actualizarCategorias('Gasto');
  setupEventListeners();
  cargarDatos();
});

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
  document.getElementById('btnTipoGasto').addEventListener('click', () => cambiarTipoForm('Gasto'));
  document.getElementById('btnTipoIngreso').addEventListener('click', () => cambiarTipoForm('Ingreso'));
  
  document.getElementById('categoria').addEventListener('change', actualizarSubcategorias);

  document.getElementById('tabBtnRegistrar').addEventListener('click', () => cambiarTabPrincipal('registrar'));
  document.getElementById('tabBtnHistorial').addEventListener('click', () => cambiarTabPrincipal('historial'));
  
  document.getElementById('subTabGastos').addEventListener('click', () => cambiarSubTabHistorial('Gasto'));
  document.getElementById('subTabIngresos').addEventListener('click', () => cambiarSubTabHistorial('Ingreso'));
  
  document.getElementById('btnTabChartGastos').addEventListener('click', () => cambiarTabGrafica('Gasto'));
  document.getElementById('btnTabChartIngresos').addEventListener('click', () => cambiarTabGrafica('Ingreso'));

  document.getElementById('formMovimiento').addEventListener('submit', guardarMovimiento);
}

// ==================== LÓGICA DE CATEGORÍAS & SUBCATEGORÍAS ====================
function cambiarTipoForm(tipo) {
  state.tipoSeleccionado = tipo;
  const btnGasto = document.getElementById('btnTipoGasto');
  const btnIngreso = document.getElementById('btnTipoIngreso');

  if (tipo === 'Gasto') {
    btnGasto.className = "py-2.5 px-4 rounded-xl font-extrabold text-sm transition-all bg-rose-500 text-white shadow-md";
    btnIngreso.className = "py-2.5 px-4 rounded-xl font-extrabold text-sm transition-all bg-slate-100 text-slate-600 hover:bg-slate-200";
  } else {
    btnIngreso.className = "py-2.5 px-4 rounded-xl font-extrabold text-sm transition-all bg-emerald-500 text-white shadow-md";
    btnGasto.className = "py-2.5 px-4 rounded-xl font-extrabold text-sm transition-all bg-slate-100 text-slate-600 hover:bg-slate-200";
  }
  actualizarCategorias(tipo);
}

function actualizarCategorias(tipo) {
  const selectCat = document.getElementById('categoria');
  const cats = Object.keys(CATEGORIAS[tipo]);
  
  selectCat.innerHTML = cats.map(c => `<option value="${c}">${c}</option>`).join('');
  actualizarSubcategorias();
}

function actualizarSubcategorias() {
  const tipo = state.tipoSeleccionado;
  const catSeleccionada = document.getElementById('categoria').value;
  const subcats = CATEGORIAS[tipo][catSeleccionada] || [];
  
  const contenedorSub = document.getElementById('wrapperSubcategoria');
  const selectSub = document.getElementById('subcategoria');

  if (subcats.length > 0) {
    selectSub.innerHTML = subcats.map(s => `<option value="${s}">${s}</option>`).join('');
    contenedorSub.classList.remove('hidden');
  } else {
    selectSub.innerHTML = '';
    contenedorSub.classList.add('hidden');
  }
}

// ==================== LÓGICA DE UI Y NAVEGACIÓN ====================
function cambiarTabPrincipal(tab) {
  const secRegistrar = document.getElementById('secRegistrar');
  const secHistorial = document.getElementById('secHistorial');
  const btnRegistrar = document.getElementById('tabBtnRegistrar');
  const btnHistorial = document.getElementById('tabBtnHistorial');

  if (tab === 'registrar') {
    secRegistrar.classList.remove('hidden');
    secHistorial.classList.add('hidden');
    btnRegistrar.className = "flex-1 py-2 text-sm font-bold rounded-lg transition-all text-slate-700 bg-white shadow-sm";
    btnHistorial.className = "flex-1 py-2 text-sm font-bold rounded-lg transition-all text-slate-500 hover:text-slate-700";
  } else {
    secRegistrar.classList.add('hidden');
    secHistorial.classList.remove('hidden');
    btnHistorial.className = "flex-1 py-2 text-sm font-bold rounded-lg transition-all text-slate-700 bg-white shadow-sm";
    btnRegistrar.className = "flex-1 py-2 text-sm font-bold rounded-lg transition-all text-slate-500 hover:text-slate-700";
    renderHistorial();
  }
}

function cambiarSubTabHistorial(tipo) {
  state.filtroHistorial = tipo;
  const subGastos = document.getElementById('subTabGastos');
  const subIngresos = document.getElementById('subTabIngresos');

  if (tipo === 'Gasto') {
    subGastos.className = "flex-1 py-2 font-bold text-sm text-rose-600 border-b-2 border-rose-600";
    subIngresos.className = "flex-1 py-2 font-bold text-sm text-slate-400 border-b-2 border-transparent";
  } else {
    subIngresos.className = "flex-1 py-2 font-bold text-sm text-emerald-600 border-b-2 border-emerald-600";
    subGastos.className = "flex-1 py-2 font-bold text-sm text-slate-400 border-b-2 border-transparent";
  }
  renderHistorial();
}

// ==================== DATOS & GOOGLE APPS SCRIPT ====================
async function cargarDatos() {
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

function actualizarSaldosUI(disponible, totalTDC, saldoNeto) {
  const elemDisp = document.getElementById('txtSaldoDisponible');
  elemDisp.innerText = `$${disponible.toFixed(2)}`;
  elemDisp.className = disponible < 0 ? "text-3xl font-black text-rose-600" : "text-3xl font-black text-emerald-600";

  document.getElementById('txtDeudaTDC').innerText = `$${totalTDC.toFixed(2)}`;

  const elemNeto = document.getElementById('txtSaldoNeto');
  elemNeto.innerText = `$${saldoNeto.toFixed(2)}`;
  elemNeto.className = saldoNeto < 0 ? "text-lg font-black text-rose-600" : "text-lg font-black text-blue-600";
}

// ==================== RENDERING TARJETAS DE CRÉDITO ====================
function renderTarjetasDesglose() {
  const container = document.getElementById('contenedorTarjetas');
  container.innerHTML = TARJETAS_CONFIG.map(tdc => {
    const deuda = state.saldosTarjetas[tdc.id] || 0;
    return `
      <div class="bg-white p-2.5 rounded-xl border border-slate-100 text-center shadow-2xs space-y-0.5">
        <span class="text-[10px] font-bold text-slate-400 block tracking-tight">${tdc.nombre}</span>
        <div class="text-xs font-black text-amber-600">$${deuda.toFixed(2)}</div>
        <p class="text-[9px] text-slate-400">Pago: día ${tdc.diaPago}</p>
      </div>
    `;
  }).join('');
}

// ==================== HISTORIAL & GRÁFICA ====================
function renderHistorial() {
  const contenedor = document.getElementById('listaRegistros');
  const filtrados = state.movimientos.filter(m => m.tipo === state.filtroHistorial);
  const total = filtrados.reduce((acc, c) => acc + c.monto, 0);

  document.getElementById('txtTotalSeccion').innerText = `$${total.toFixed(2)}`;
  document.getElementById('countGastos').innerText = state.movimientos.filter(m => m.tipo === 'Gasto').length;
  document.getElementById('countIngresos').innerText = state.movimientos.filter(m => m.tipo === 'Ingreso').length;

  if (filtrados.length === 0) {
    contenedor.innerHTML = `<p class="text-center text-xs text-slate-400 py-6">Sin registros</p>`;
    return;
  }

  filtrados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  contenedor.innerHTML = filtrados.map(item => {
    const esGasto = item.tipo === 'Gasto';
    return `
      <div class="bg-slate-50 p-3 rounded-xl border border-slate-200/60 flex justify-between items-center">
        <div class="space-y-0.5">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold px-2 py-0.5 rounded-full ${esGasto ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}">${item.categoria}</span>
            <span class="text-[11px] text-slate-400">${item.fecha ? item.fecha.split('T')[0] : ''}</span>
          </div>
          <p class="text-sm font-semibold text-slate-800">${item.concepto || item.categoria}</p>
          <p class="text-[11px] text-slate-400"><i class="fa-regular fa-credit-card mr-0.5"></i> ${item.metodoPago}</p>
        </div>
        <span class="text-base font-black ${esGasto ? 'text-rose-600' : 'text-emerald-600'}">
          ${esGasto ? '-' : '+'}$${item.monto.toFixed(2)}
        </span>
      </div>
    `;
  }).join('');
}

function cambiarTabGrafica(tipo) {
  state.tabGrafica = tipo;
  document.getElementById('btnTabChartGastos').className = tipo === 'Gasto' ? "px-2.5 py-1 rounded-md bg-white text-rose-600" : "px-2.5 py-1 rounded-md text-slate-500";
  document.getElementById('btnTabChartIngresos').className = tipo === 'Ingreso' ? "px-2.5 py-1 rounded-md bg-white text-emerald-600" : "px-2.5 py-1 rounded-md text-slate-500";
  renderGrafica();
}

function renderGrafica() {
  const ctx = document.getElementById('chartDistribucion').getContext('2d');
  if (state.chartInstance) state.chartInstance.destroy();

  const isGasto = state.tabGrafica === 'Gasto';
  const dataMap = isGasto ? state.mapGastosCat : state.mapIngresosCat;
  const labels = Object.keys(dataMap);
  const values = Object.values(dataMap);

  state.chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels.length ? labels : ['Sin Datos'],
      datasets: [{
        data: values.length ? values : [1],
        backgroundColor: isGasto 
          ? ['#f43f5e', '#ef4444', '#f97316', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b', '#10b981', '#06b6d4', '#6366f1']
          : ['#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#14b8a6']
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } }
    }
  });
}

// ==================== GUARDAR MOVIMIENTO ====================
async function guardarMovimiento(e) {
  e.preventDefault();
  const btn = document.getElementById('btnGuardar');
  btn.disabled = true;
  btn.innerText = 'Guardando...';

  const catPrincipal = document.getElementById('categoria').value;
  const subCat = document.getElementById('subcategoria').value;
  
  // Concatena subcategoría si existe (ej. "Alimentos (Mandado)")
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