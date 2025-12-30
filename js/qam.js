function runSimulation() {
  const M = parseInt(document.getElementById("qamOrder").value);
  const snrDb = parseFloat(document.getElementById("snr").value);

  // Bits per symbol
  const bitsPerSymbol = Math.log2(M);
  const numSymbols = 500;
  const bits = Array.from({length: numSymbols * bitsPerSymbol}, () => Math.round(Math.random()));

  // Map bits to QAM symbols
  const symbols = [];
  for (let i = 0; i < bits.length; i += bitsPerSymbol) {
    const val = parseInt(bits.slice(i, i + bitsPerSymbol).join(""), 2);
    const I = 2 * (val % Math.sqrt(M)) - Math.sqrt(M) + 1;
    const Q = 2 * Math.floor(val / Math.sqrt(M)) - Math.sqrt(M) + 1;
    symbols.push([I, Q]);
  }

  // Add Gaussian noise
  const snrLinear = Math.pow(10, snrDb / 10);
  const noiseStd = 1 / Math.sqrt(2 * snrLinear);
  const noisySymbols = symbols.map(([I, Q]) => [
    I + noiseStd * randn_bm(),
    Q + noiseStd * randn_bm()
  ]);

  // Plot constellation
  Plotly.newPlot("constellation", [{
    x: noisySymbols.map(s => s[0]),
    y: noisySymbols.map(s => s[1]),
    mode: "markers",
    type: "scatter",
    marker: { size: 6, color: "blue" }
  }], {
    title: `${M}-QAM Constellation`,
    xaxis: { title: "In-Phase (I)" },
    yaxis: { title: "Quadrature (Q)" }
  });

  // Plot waveform (I component)
  Plotly.newPlot("waveform", [{
    y: noisySymbols.map(s => s[0]),
    mode: "lines+markers",
    line: { color: "red" }
  }], {
    title: "Waveform (I Component)",
    xaxis: { title: "Symbol Index" },
    yaxis: { title: "Amplitude" }
  });

  // Estimate BER (simplified)
  let errors = 0;
  for (let i = 0; i < symbols.length; i++) {
    const [I, Q] = symbols[i];
    const [In, Qn] = noisySymbols[i];
    // Decision: nearest symbol
    const decI = Math.round((In + Math.sqrt(M) - 1) / 2);
    const decQ = Math.round((Qn + Math.sqrt(M) - 1) / 2);
    const decVal = decQ * Math.sqrt(M) + decI;
    const origVal = Math.round((Q + Math.sqrt(M) - 1) / 2) * Math.sqrt(M) +
                    Math.round((I + Math.sqrt(M) - 1) / 2);
    if (decVal !== origVal) errors++;
  }
  const ber = errors / symbols.length;

  // Show results
  document.getElementById("resultsText").innerHTML =
    `<p>Simulation complete for ${M}-QAM at SNR = ${snrDb} dB.<br>
     Estimated Bit Error Rate (BER): ${ber.toFixed(4)}</p>`;
}

// Gaussian noise generator
function randn_bm() {
  let u = 0, v = 0;
  while(u === 0) u = Math.random();
  while(v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}
