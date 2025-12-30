document.getElementById("snr").oninput = function () {
    document.getElementById("snrVal").innerText = this.value + " dB";
};

function runSimulation() {
    const N = parseInt(document.getElementById("numBits").value);
    const M = parseInt(document.getElementById("modOrder").value);
    const snrDb = parseInt(document.getElementById("snr").value);

    const bitsPerSymbol = Math.log2(M);
    const symbols = Math.floor(N / bitsPerSymbol);

    let I = [], Q = [];

    const levels = Math.sqrt(M);

    for (let i = 0; i < symbols; i++) {
        I.push((Math.floor(Math.random() * levels) * 2) - (levels - 1));
        Q.push((Math.floor(Math.random() * levels) * 2) - (levels - 1));
    }

    const noiseStd = Math.pow(10, -snrDb / 20);

    let In = I.map(v => v + noiseStd * randn());
    let Qn = Q.map(v => v + noiseStd * randn());

    Plotly.newPlot("constellation", [{
        x: In,
        y: Qn,
        mode: "markers",
        type: "scatter",
        marker: { size: 8 }
    }], {
        title: "QAM Constellation Diagram",
        xaxis: { title: "In-phase", zeroline: true },
        yaxis: { title: "Quadrature", zeroline: true }
    });

    Plotly.newPlot("waveform", [{
        y: In.slice(0, 50),
        mode: "lines"
    }], {
        title: "Received Signal (Time Domain)",
        xaxis: { title: "Sample Index" },
        yaxis: { title: "Amplitude" }
    });

    document.getElementById("berValue").innerText =
        (noiseStd / Math.sqrt(M)).toFixed(5);
}

function randn() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
