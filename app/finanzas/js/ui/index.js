import { cambiarTipoForm, actualizarCategorias, actualizarSubcategorias } from './formUI.js';
import { cambiarSubTabHistorial, actualizarEstilosFiltrosMetodo, renderHistorial } from './historialUI.js';
import { cambiarTabGrafica } from './dashboardUI.js';
import { guardarMovimiento, cargarDatos } from '../api.js';
import { state } from '../state.js';

export * from './dashboardUI.js';
export * from './formUI.js';
export * from './historialUI.js';

export function initUI() {
  document.getElementById('fecha').value = new Date().toISOString().split('T')[0];
  actualizarCategorias('Gasto');
  setupEventListeners();
  cargarDatos();
}

function setupEventListeners() {
  // Eventos de formulario
  document.getElementById('btnTipoGasto').addEventListener('click', () => cambiarTipoForm('Gasto'));
  document.getElementById('btnTipoIngreso').addEventListener('click', () => cambiarTipoForm('Ingreso'));
  document.getElementById('categoria').addEventListener('change', actualizarSubcategorias);
  document.getElementById('formMovimiento').addEventListener('submit', guardarMovimiento);

  // Tabs Principales
  document.getElementById('tabBtnRegistrar').addEventListener('click', () => cambiarTabPrincipal('registrar'));
  document.getElementById('tabBtnHistorial').addEventListener('click', () => cambiarTabPrincipal('historial'));

  // Sub-tabs de Historial y Gráficas
  document.getElementById('subTabGastos').addEventListener('click', () => cambiarSubTabHistorial('Gasto'));
  document.getElementById('subTabIngresos').addEventListener('click', () => cambiarSubTabHistorial('Ingreso'));
  document.getElementById('btnTabChartGastos').addEventListener('click', () => cambiarTabGrafica('Gasto'));
  document.getElementById('btnTabChartIngresos').addEventListener('click', () => cambiarTabGrafica('Ingreso'));

  // Sub-filtros por método de pago (Delegación de eventos)
  document.getElementById('filtrosMetodoPago').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-metodo]');
    if (!btn) return;
    state.filtroMetodoPago = btn.dataset.metodo;
    actualizarEstilosFiltrosMetodo();
    renderHistorial();
  });
}

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