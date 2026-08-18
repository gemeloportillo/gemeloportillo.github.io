import { CATEGORIAS } from '../config.js';
import { state } from '../state.js';

export function cambiarTipoForm(tipo) {
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

export function actualizarCategorias(tipo) {
  const selectCat = document.getElementById('categoria');
  const cats = Object.keys(CATEGORIAS[tipo]);
  
  selectCat.innerHTML = cats.map(c => `<option value="${c}">${c}</option>`).join('');
  actualizarSubcategorias();
}

export function actualizarSubcategorias() {
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