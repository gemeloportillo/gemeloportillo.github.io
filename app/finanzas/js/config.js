export const API_URL = "https://script.google.com/macros/s/AKfycbxIlyWwvnEDlspZ3RNHVd9giOoVdcUV0Mnhn6RjElnkCnappCJ4Ph4WjEX2vqBnT44U/exec";

export const TARJETAS_CONFIG = [
  { 
    id: 'TDC HSBC', 
    nombre: 'HSBC', 
    fechaCorte: '2026-08-26', 
    fechaPago: '2026-09-15',
    montoCorte: 14819.66
  },
  { 
    id: 'TDC Banorte', 
    nombre: 'Banorte', 
    fechaCorte: '2026-08-14', 
    fechaPago: '2026-09-03',
    montoCorte: 9907.22
  },
  { 
    id: 'TDC Banregio', 
    nombre: 'Banregio', 
    fechaCorte: '2026-08-25', 
    fechaPago: '2026-09-15',
    montoCorte: 0.00
  }
];

export const CATEGORIAS = {
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
    "Intereses TDC": [],
    "Pago a TDC": []
  },
  Ingreso: {
    "Sueldo": [],
    "Plataformas Digitales": [],
    "Ventas": [],
    "Rendimientos": [],
    "Otros Ingresos": []
  }
};