export function actualizarSaldosUI(disponible, totalTDC, saldoNeto) {
  const elemDisp = document.getElementById('txtSaldoDisponible');
  if (elemDisp) {
    elemDisp.innerText = `$${disponible.toFixed(2)}`;
    elemDisp.className = disponible < 0 ? "text-3xl font-black text-rose-600" : "text-3xl font-black text-emerald-600";
  }

  const elemDeuda = document.getElementById('txtDeudaTDC');
  if (elemDeuda) elemDeuda.innerText = `$${totalTDC.toFixed(2)}`;

  const elemNeto = document.getElementById('txtSaldoNeto');
  if (elemNeto) {
    elemNeto.innerText = `$${saldoNeto.toFixed(2)}`;
    elemNeto.className = saldoNeto < 0 ? "text-lg font-black text-rose-600" : "text-lg font-black text-blue-600";
  }
}