const chartOptions = {
    series: [{
        name: "CLP",
        data: []
    }],
    chart: {
        height: 350,
        type: "line",
        zoom: {
            enabled: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: "straight"
    },
    grid: {
        row: {
            colors: ["#f3f3f3", "transparent"],
            opacity: 0.5
        }
    },
    xaxis: {
        categories: []
    }
};

const obtenerDataMoneda = async (indicador) => {
    try {
        const response = await fetch(`https://mindicador.cl/api/${indicador}`);
        const json = await response.json();

        return json;
    } catch (e) {
        console.log(e);
    }
};

const pintarGrafico = (serie) => {
    const ultimos10 = serie.slice(0, 10); // Tambien funciona para Strings
    ultimos10.reverse();

    chartOptions.series[0].data = [];
    chartOptions.xaxis.categories = [];

    ultimos10.forEach((dia) => {
        chartOptions.series[0].data.push(dia.valor);
        chartOptions.xaxis.categories.push(dia.fecha.split("T")[0]);
    });

    const chart = new ApexCharts(document.querySelector("#chart"), chartOptions);
    chart.render();
};

const btn = document.getElementById("btn");
btn.addEventListener("click", async () => {
    const pesosChilenos = document.getElementById("clp").value;
    const tipoDeMoneda = document.getElementById("moneda").value;

    const data = await obtenerDataMoneda(tipoDeMoneda);

    const conversion = pesosChilenos / data.serie[0].valor;

    const resultado = document.getElementById("resultado");
    resultado.innerHTML = `Resultado: $${conversion.toFixed(4)}`;

    pintarGrafico(data.serie);
});