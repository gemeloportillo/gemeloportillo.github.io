import { TARJETAS_CONFIG } from '../config.js';
import { state } from '../state.js';

export function actualizarSaldosUI(disponible, totalTDC, saldoNeto) {
  const elemDisp = document.getElementById('txtSaldoDisponible');
  elemDisp.innerText = `$${disponible.toFixed(2)}`;
  elemDisp.className = disponible < 0 ? "text-3xl font-black text-rose-600" : "text-3xl font-black text-emerald-600";

  document.getElementById('txtDeudaTDC').innerText = `$${totalTDC.toFixed(2)}`;

  const elemNeto = document.getElementById('txtSaldoNeto');
  elemNeto.innerText = `$${saldoNeto.toFixed(2)}`;
  elemNeto.className = saldoNeto < 0 ? "text-lg font-black text-rose-600" : "text-lg font-black text-blue-600";
}

export function renderTarjetasDesglose() {
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

export function cambiarTabGrafica(tipo) {
  state.tabGrafica = tipo;
  document.getElementById('btnTabChartGastos').className = tipo === 'Gasto' ? "px-2.5 py-1 rounded-md bg-white text-rose-600" : "px-2.5 py-1 rounded-md text-slate-500";
  document.getElementById('btnTabChartIngresos').className = tipo === 'Ingreso' ? "px-2.5 py-1 rounded-md bg-white text-emerald-600" : "px-2.5 py-1 rounded-md text-slate-500";
  renderGrafica();
}

export function renderGrafica() {
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