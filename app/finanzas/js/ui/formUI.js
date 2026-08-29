import { CATEGORIAS } from '../config.js';
import { state } from '../state.js';

export function cambiarTipoForm(tipo) {
  state.tipoSeleccionado = tipo;
  
  // Actualizar estilos de los 3 botones
  const btnG = document.getElementById('btnTipoGasto');
  const btnI = document.getElementById('btnTipoIngreso');
  const btnP = document.getElementById('btnTipoPago');

  btnG.className = tipo === 'Gasto' ? "flex-1 py-1.5 text-xs font-bold rounded-lg bg-rose-500 text-white shadow-xs" : "flex-1 py-1.5 text-xs font-bold rounded-lg bg-slate-100 text-slate-600";
  btnI.className = tipo === 'Ingreso' ? "flex-1 py-1.5 text-xs font-bold rounded-lg bg-emerald-500 text-white shadow-xs" : "flex-1 py-1.5 text-xs font-bold rounded-lg bg-slate-100 text-slate-600";
  btnP.className = tipo === 'Pago' ? "flex-1 py-1.5 text-xs font-bold rounded-lg bg-blue-600 text-white shadow-xs" : "flex-1 py-1.5 text-xs font-bold rounded-lg bg-slate-100 text-slate-600";

  const selectCat = document.getElementById('categoria');
  const selectSub = document.getElementById('subcategoria');

  if (tipo === 'Pago') {
    // Si es pago, la categoría se fija como "Pago a TDC" y se deshabilita la subcategoría
    selectCat.innerHTML = '<option value="Pago a TDC">Pago a TDC</option>';
    selectSub.innerHTML = '<option value="">Sin subcategoría</option>';
    selectSub.disabled = true;
  } else {
    selectSub.disabled = false;
    actualizarCategorias(tipo);
  }
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