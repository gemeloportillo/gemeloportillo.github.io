import { state } from '../state.js';

export function cambiarSubTabHistorial(tipo) {
  state.filtroHistorial = tipo;
  state.filtroMetodoPago = 'Todos'; // Resetea sub-filtro al cambiar entre Gasto/Ingreso
  
  const subGastos = document.getElementById('subTabGastos');
  const subIngresos = document.getElementById('subTabIngresos');
  const contenedorFiltrosMetodo = document.getElementById('wrapperFiltrosMetodo');

  if (tipo === 'Gasto') {
    subGastos.className = "flex-1 py-2 font-bold text-sm text-rose-600 border-b-2 border-rose-600";
    subIngresos.className = "flex-1 py-2 font-bold text-sm text-slate-400 border-b-2 border-transparent";
    contenedorFiltrosMetodo.classList.remove('hidden');
  } else {
    subIngresos.className = "flex-1 py-2 font-bold text-sm text-emerald-600 border-b-2 border-emerald-600";
    subGastos.className = "flex-1 py-2 font-bold text-sm text-slate-400 border-b-2 border-transparent";
    contenedorFiltrosMetodo.classList.add('hidden');
  }
  actualizarEstilosFiltrosMetodo();
  renderHistorial();
}

export function actualizarEstilosFiltrosMetodo() {
  const botones = document.querySelectorAll('#filtrosMetodoPago button');
  botones.forEach(btn => {
    if (btn.dataset.metodo === state.filtroMetodoPago) {
      btn.className = "px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500 text-white shadow-xs transition-all whitespace-nowrap";
    } else {
      btn.className = "px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all whitespace-nowrap";
    }
  });
}

export function renderHistorial() {
  const contenedor = document.getElementById('listaRegistros');
  
  let filtrados = state.movimientos.filter(m => m.tipo === state.filtroHistorial);

  if (state.filtroHistorial === 'Gasto' && state.filtroMetodoPago !== 'Todos') {
    filtrados = filtrados.filter(m => m.metodoPago === state.filtroMetodoPago);
  }

  const total = filtrados.reduce((acc, c) => acc + c.monto, 0);

  document.getElementById('txtTotalSeccion').innerText = `$${total.toFixed(2)}`;
  document.getElementById('countGastos').innerText = state.movimientos.filter(m => m.tipo === 'Gasto').length;
  document.getElementById('countIngresos').innerText = state.movimientos.filter(m => m.tipo === 'Ingreso').length;

  if (filtrados.length === 0) {
    contenedor.innerHTML = `<p class="text-center text-xs text-slate-400 py-6">Sin registros para esta selección</p>`;
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