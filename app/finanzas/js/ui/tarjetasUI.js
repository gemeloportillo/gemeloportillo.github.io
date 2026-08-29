import { TARJETAS_CONFIG } from '../config.js';
import { state } from '../state.js';
import { cargarDatos } from '../api.js';

export function renderTarjetasDesglose() {
  const container = document.getElementById('contenedorTarjetas');
  if (!container) return;
  
  container.className = "grid grid-cols-1 gap-2 pt-1"; 

  container.innerHTML = TARJETAS_CONFIG.map(tdc => {
    const datosTDC = state.saldosTarjetas[tdc.id] || { porPagar: 0, consumoActual: 0 };
    const fCorte = tdc.fechaCorte ? tdc.fechaCorte.split('-').slice(1).join('/') : '--/--';
    const fPago = tdc.fechaPago ? tdc.fechaPago.split('-').slice(1).join('/') : '--/--';

    return `
      <div class="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs space-y-1.5 relative">
        <div class="flex justify-between items-center border-b border-slate-100 pb-1">
          <span class="text-xs font-bold text-slate-700">${tdc.nombre}</span>
          <button onclick="window.abrirModalEditarTDC('${tdc.id}')" class="text-slate-400 hover:text-slate-600 p-1">
            <i class="fa-solid fa-pen text-xs"></i>
          </button>
        </div>
        
        <div class="grid grid-cols-2 gap-2 text-left">
          <div class="bg-amber-50/60 p-1.5 rounded-lg border border-amber-100">
            <span class="text-[9px] font-bold uppercase tracking-wider text-amber-700 block">Por Pagar (${fCorte})</span>
            <div class="text-sm font-black text-amber-600">$${datosTDC.porPagar.toFixed(2)}</div>
            <p class="text-[9px] text-amber-600/80 font-medium">Límite: ${fPago}</p>
          </div>

          <div class="bg-slate-50 p-1.5 rounded-lg border border-slate-200/60">
            <span class="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Consumo Actual</span>
            <div class="text-sm font-black text-slate-700">$${datosTDC.consumoActual.toFixed(2)}</div>
            <p class="text-[9px] text-slate-400">Post-corte</p>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.abrirModalEditarTDC = function(tdcId) {
  const tdc = TARJETAS_CONFIG.find(t => t.id === tdcId);
  if (!tdc) return;

  const nuevaFechaCorte = prompt(`Ajustar fecha de CORTE para ${tdc.nombre} (YYYY-MM-DD):`, tdc.fechaCorte);
  if (!nuevaFechaCorte) return;

  const nuevaFechaPago = prompt(`Ajustar fecha LÍMITE DE PAGO para ${tdc.nombre} (YYYY-MM-DD):`, tdc.fechaPago);
  if (!nuevaFechaPago) return;

  const nuevoMonto = prompt(`Monto a pagar del corte ($):`, tdc.montoCorte || 0);

  tdc.fechaCorte = nuevaFechaCorte;
  tdc.fechaPago = nuevaFechaPago;
  if (nuevoMonto !== null) tdc.montoCorte = parseFloat(nuevoMonto) || 0;

  cargarDatos();
};