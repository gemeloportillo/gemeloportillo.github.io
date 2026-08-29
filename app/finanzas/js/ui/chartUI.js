import { state } from '../state.js';

export function cambiarTabGrafica(tipo) {
  state.tabGrafica = tipo;
  const btnGastos = document.getElementById('btnTabChartGastos');
  const btnIngresos = document.getElementById('btnTabChartIngresos');

  if (btnGastos) {
    btnGastos.className = tipo === 'Gasto' 
      ? "px-2.5 py-1 rounded-md bg-white text-rose-600 font-bold shadow-xs transition-all" 
      : "px-2.5 py-1 rounded-md text-slate-500 hover:text-slate-700 transition-all";
  }
    
  if (btnIngresos) {
    btnIngresos.className = tipo === 'Ingreso' 
      ? "px-2.5 py-1 rounded-md bg-white text-emerald-600 font-bold shadow-xs transition-all" 
      : "px-2.5 py-1 rounded-md text-slate-500 hover:text-slate-700 transition-all";
  }
    
  renderGrafica();
}

export function renderGrafica() {
  const canvas = document.getElementById('chartDistribucion');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (state.chartInstance) {
    state.chartInstance.destroy();
  }

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
      maintainAspectRatio: false,
      plugins: { 
        legend: { 
          position: 'bottom', 
          labels: { boxWidth: 10, font: { size: 10 } } 
        } 
      }
    }
  });
}