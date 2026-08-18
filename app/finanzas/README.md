# Control de Finanzas Personales

Aplicación web ligera para la gestión de finanzas personales, seguimiento de ingresos, gastos diarios y control de saldos/fechas de corte en tarjetas de crédito (TDC).

---

## 🏗️ Arquitectura del Proyecto

El proyecto está diseñado bajo una arquitectura de cliente estático (*Frontend*) desacoplado, respaldado por un servicio *Serverless* (*Backend*) en Google Apps Script que interactúa directamente con una hoja de cálculo en Google Sheets.

* **Frontend:** HTML5, Tailwind CSS (CDNs), FontAwesome y Chart.js.
* **Módulos JS:** ES Modules nativos (`import` / `export`).
* **Backend / Database:** Google Apps Script (`doGet` / `doPost`) + Google Sheets.

---

## 📁 Estructura de Directorios

```text
app/finanzas/
├── index.html              # Vista principal y layout responsivo
├── README.md               # Documentación del proyecto
└── js/
    ├── config.js           # Variables globales, catálogos y configuración de tarjetas
    ├── state.js            # Estado reactivo global de la aplicación
    ├── api.js              # Integración y peticiones HTTP (Apps Script API)
    └── ui/
        ├── index.js        # Punto de entrada de UI e inicialización de EventListeners
        ├── dashboardUI.js  # Módulo de saldos generales, tarjetas y gráficas (Chart.js)
        ├── formUI.js       # Módulo de selección de categorías y subcategorías
        └── historialUI.js  # Módulo de renderizado de lista de movimientos y sub-filtros


## ⚙️ Componentes del Sistema

3.1. Base de Datos y Backend (Google Sheets + Apps Script)
Pestaña Movimientos en Sheets: Funciona como tabla relacional/log de eventos guardando: ID, Fecha, Tipo, Categoria, Subcategoria, Concepto, Monto, Metodo_Pago.

Capa Backend (code.gs):

doGet(): Consulta las filas de la hoja, las transforma en arreglos de objetos JSON y los retorna al cliente.

doPost(e): Recibe transacciones en JSON, asigna ID dinámico/timestamp y las anexa como nuevas filas.

3.2. Capa de Datos y Estado (Frontend)
Configuración (js/config.js): Concentra los parámetros operativos (tarjetas de crédito con sus fechas de corte y días de pago, así como el árbol jerárquico de Categorías -> Subcategorías).

Estado Global (js/state.js): Almacena en un único objeto state la información en memoria de la sesión actual (movimientos cargados, filtros activos, mapa de gastos agrupados y la instancia activa del gráfico Chart.js).

Servicio API (js/api.js): Encapsula el uso de fetch() con async/await para comunicarse con la URL de Apps Script. Aplica la estrategia de red adecuada según requiera el backend de Google.

3.3. Capa de Presentación e Interfaz (js/ui/)
dashboardUI.js: Actualiza métricas principales (Saldo Disponible, Deuda TDC, Saldo Neto) y genera dinámicamente la gráfica interactiva de dona usando Chart.js.

formUI.js: Gestiona el comportamiento en cascada del formulario (al seleccionar una categoría, actualiza automáticamente las subcategorías correspondientes).

historialUI.js: Filtra y ordena los registros cronológicamente, calcula totales en tiempo real por sección y renderiza los elementos con formato visual según su tipo (Ingreso vs. Gasto / Tarjeta vs. Efectivo).

## 🎯 Estrategia de Separación de Módulos JavaScript

Uno de los principales objetivos de este proyecto es demostrar cómo estructurar código escalable sin utilizar bundlers (como Webpack o Vite) mediante ES Modules (ESM).

4.1. Principios Aplicados:
Único Origen de la Verdad (Single Source of Truth - state.js): Previene que múltiples componentes guarden copias locales e inconsistentes de los datos. Todos los componentes de UI leen directamente de state.

Aislamiento de Reglas de Negocio y Configuración (config.js): Ningún archivo de interfaz contiene valores "hardcodeados". Si se agrega una nueva Tarjeta de Crédito o Categoría, solo se modifica config.js.

Separación de Manejo de Red e Interfaz (api.js vs ui/): api.js no sabe cómo ni dónde se dibujan los datos en la pantalla; solo obtiene datos y notifica a la UI. La UI no sabe cómo se construyen las peticiones HTTP; solo llama a funciones de api.js.

Patrón Re-exportador (Barrel Export - ui/index.js): El subdirectorio /ui expone un único punto de entrada (ui/index.js). Módulos externos (api.js o index.html) solo importan desde ./js/ui/index.js, manteniendo las importaciones limpias y centralizadas.

Delegación de Eventos (Event Delegation): En lugar de adjuntar event listeners a decenas de botones o tarjetas dinámicas (como los filtros de métodos de pago), se asigna un listener al contenedor padre en ui/index.js escuchando mediante e.target.closest().

## 🔒 Consideraciones de Seguridad

El archivo README.md es público en el repositorio y sirve exclusivamente para documentar la arquitectura y funcionamiento del código.

Las variables sensibles o de acceso deben mantenerse fuera de repositorios públicos; las URLs de servicios serverless deben configurarse con los niveles de autorización requeridos.

## 🚀 Despliegue y Pruebas Locales

Entorno Local: Dado que se utilizan ES Modules (type="module"), el archivo index.html debe servirse obligatoriamente a través de un servidor HTTP local (ej. la extensión Live Server en VS Code o python -m http.server). No funcionará abriendo el archivo directamente con el protocolo file://.

Producción: La aplicación es 100% estática y puede ser alojada directamente en plataformas como GitHub Pages.