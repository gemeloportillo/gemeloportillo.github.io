export const state = {
  tipoSeleccionado: 'Gasto',
  filtroHistorial: 'Gasto',
  filtroMetodoPago: 'Todos',
  tabGrafica: 'Gasto',
  movimientos: [],
  mapGastosCat: {},
  mapIngresosCat: {},
  // Ahora cada tarjeta guarda { porPagar, consumoActual }
  saldosTarjetas: {
    'TDC HSBC': { porPagar: 0, consumoActual: 0 },
    'TDC Banorte': { porPagar: 0, consumoActual: 0 },
    'TDC Banregio': { porPagar: 0, consumoActual: 0 }
  },
  chartInstance: null
};