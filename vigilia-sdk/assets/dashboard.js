// dashboard.js

let charts = {};
let rangoTiempo = '5m';
let refreshInterval = 5000;
let refreshTimer = null;

const textoRango = {
  '5m': 'últimos 5 minutos',
  '10m': 'últimos 10 minutos',
  '15m': 'últimos 15 minutos',
  '30m': 'últimos 30 minutos',
  '1h': 'última 1 hora',
  '4h': 'últimas 4 horas'
};

function calcularDesdeISO(rango) {
  const ahora = new Date();
  const mapa = {
    '5m': 5,
    '10m': 10,
    '15m': 15,
    '30m': 30,
    '1h': 60,
    '4h': 240
  };
  const minutos = mapa[rango] || 5;
  return new Date(ahora.getTime() - minutos * 60000).toISOString();
}

function agruparPorMinuto(eventos) {
  const resultado = {};
  eventos.forEach(e => {
    const t = new Date(e.timestamp);
    const clave = `${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}`;
    resultado[clave] = (resultado[clave] || 0) + 1;
  });
  return resultado;
}

function renderTabla(eventos) {
  console.log("Valor recibido en renderTabla:", eventos); // 👈 añade esto

  if (!Array.isArray(eventos)) {
    console.error("Error: 'eventos' no es un array");
    return;
  }

  const tbody = document.querySelector('#tabla-eventos tbody');
  tbody.innerHTML = '';

  eventos.slice(-15).reverse().forEach(ev => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${ev.source_ip || '-'}</td>
      <td>${ev.endpoint}</td>
      <td>${ev.method}</td>
      <td>${ev.classification?.label || 'N/A'}</td>
      <td>${new Date(ev.timestamp).toLocaleString()}</td>
    `;
    tbody.appendChild(fila);
  });
}


function renderDonut(eventos) {
  const ataques = eventos.filter(e => e.classification?.label === 'malicioso').length;
  const normales = eventos.length - ataques;
  if (charts.donut) charts.donut.destroy();
  charts.donut = new Chart(document.getElementById('chart-clasificacion'), {
    type: 'bar',
    data: {
      labels: ['Normal', 'Malicioso'],
      datasets: [{
        data: [normales, ataques],
        backgroundColor: ['#4caf50', '#f44336'],
        borderWidth: 1
      }]
    },
    options: {
      animation: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function renderLineaTrafico(eventos) {
  const desde = new Date(calcularDesdeISO(rangoTiempo));
  const ahora = new Date();
  const minutosTotales = Math.floor((ahora - desde) / 60000);
  const labels = [];
  const porMinuto = agruparPorMinuto(eventos);

  for (let i = minutosTotales; i >= 0; i--) {
    const t = new Date(ahora.getTime() - i * 60000);
    const clave = `${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}`;
    labels.push(clave);
    if (!porMinuto[clave]) porMinuto[clave] = 0;
  }

  if (charts.linea) charts.linea.destroy();
  charts.linea = new Chart(document.getElementById('chart-trafico'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Solicitudes por minuto',
        data: labels.map(l => porMinuto[l]),
        fill: true,
        tension: 0.2,
        backgroundColor: 'rgba(33,150,243,0.2)',
        borderColor: '#2196f3'
      }]
    },
    options: {
      animation: false
    }
  });
}

function renderTopIps(eventos) {
  const ipCount = {};
  eventos.forEach(e => {
    if (e.classification?.label === 'malicioso') {
      ipCount[e.source_ip] = (ipCount[e.source_ip] || 0) + 1;
    }
  });
  const top = Object.entries(ipCount).sort((a,b)=>b[1]-a[1]).slice(0,5);
  if (charts.topIps) charts.topIps.destroy();
  charts.topIps = new Chart(document.getElementById('chart-top-ips'), {
    type: 'bar',
    data: {
      labels: top.map(([ip]) => ip),
      datasets: [{
        label: 'Ataques por IP',
        data: top.map(([,count]) => count),
        backgroundColor: '#ff9800'
      }]
    },
    options: {
      indexAxis: 'y',
      animation: { duration: 800 }
    }
  });
}

function cargarDatos() {
  const desde = calcularDesdeISO(rangoTiempo);
  document.getElementById('texto-rango').textContent = `(${textoRango[rangoTiempo] || 'últimos 5 minutos'})`;
  fetch(`/monitoring-dashboard/data?desde=${encodeURIComponent(desde)}`)
    .then(res => res.json())
    .then(eventos => {
      renderTabla(eventos);
      renderDonut(eventos);
      renderLineaTrafico(eventos);
      renderTopIps(eventos);
    })
    .catch(err => console.error('Error cargando métricas:', err));
}

function initDashboard() {
  const rangoEl = document.getElementById('rango-tiempo');
  const refreshEl = document.getElementById('refresh-interval');

  rangoEl.addEventListener('change', e => {
    rangoTiempo = e.target.value;
    cargarDatos();
  });

  refreshEl.addEventListener('change', e => {
    refreshInterval = parseInt(e.target.value, 10);
    if (refreshTimer) clearInterval(refreshTimer);
    refreshTimer = setInterval(cargarDatos, refreshInterval);
  });

  cargarDatos();
  refreshTimer = setInterval(cargarDatos, refreshInterval);
}

document.addEventListener('DOMContentLoaded', initDashboard);
