export const API_URL = "https://script.google.com/macros/s/AKfycbxIlyWwvnEDlspZ3RNHVd9giOoVdcUV0Mnhn6RjElnkCnappCJ4Ph4WjEX2vqBnT44U/exec";

export const TARJETAS_CONFIG = [
  { id: 'TDC HSBC', nombre: 'HSBC', diaCorte: 10, diaPago: 28 },
  { id: 'TDC Banorte', nombre: 'Banorte', diaCorte: 15, diaPago: 5 },
  { id: 'TDC Banregio', nombre: 'Banregio', diaCorte: 20, diaPago: 10 }
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
    "Intereses TDC": []
  },
  Ingreso: {
    "Sueldo": [],
    "Plataformas Digitales": [],
    "Ventas": [],
    "Rendimientos": [],
    "Otros Ingresos": []
  }
};