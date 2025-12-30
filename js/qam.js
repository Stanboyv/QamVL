/**
 * QAM (Quadrature Amplitude Modulation) Virtual Lab
 * Complete implementation with tab navigation, quiz system, and simulation
 */

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const appState = {
  currentTab: 'simulation',
  quizAnswers: {},
  quizScore: null,
  simulationParams: {
    modulation: '16-qam',
    snrDb: 10,
    amplitude: 1,
    frequency: 1000,
    phase: 0
  },
  simulationRunning: false
};

// ============================================================================
// TAB NAVIGATION SYSTEM
// ============================================================================

const TabNavigation = {
  /**
   * Initialize tab navigation
   */
  init() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => this.switchTab(button.dataset.tab));
    });
  },

  /**
   * Switch to specified tab
   * @param {string} tabName - Name of tab to switch to
   */
  switchTab(tabName) {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // Deactivate all tabs
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Activate selected tab
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.querySelector(`[data-content="${tabName}"]`).classList.add('active');

    appState.currentTab = tabName;

    // Initialize tab-specific content
    if (tabName === 'simulation') {
      SimulationEngine.initializeSimulation();
    } else if (tabName === 'quiz') {
      QuizSystem.renderQuiz();
    }
  }
};

// ============================================================================
// QUIZ SYSTEM
// ============================================================================

const QuizSystem = {
  questions: [
    {
      id: 1,
      question: 'What does QAM stand for?',
      options: [
        'Quadrature Amplitude Modulation',
        'Quantum Amplitude Measurement',
        'Quick Analog Modulation',
        'Quadratic Amplitude Module'
      ],
      correct: 0,
      explanation: 'QAM stands for Quadrature Amplitude Modulation, a modulation technique using two carriers 90 degrees apart.'
    },
    {
      id: 2,
      question: 'How many symbols are in 16-QAM?',
      options: ['8', '16', '32', '64'],
      correct: 1,
      explanation: '16-QAM has 16 distinct symbols arranged in a 4×4 constellation.'
    },
    {
      id: 3,
      question: 'What is the primary advantage of QAM?',
      options: [
        'Lower cost',
        'Higher spectral efficiency',
        'Simpler implementation',
        'Better coverage'
      ],
      correct: 1,
      explanation: 'QAM provides higher spectral efficiency by encoding multiple bits per symbol.'
    },
    {
      id: 4,
      question: 'In QAM, what do the I and Q components represent?',
      options: [
        'Input and Quality',
        'In-phase and Quadrature',
        'Impedance and Quantum',
        'Integer and Quantum'
      ],
      correct: 1,
      explanation: 'I (In-phase) and Q (Quadrature) are two orthogonal carriers 90 degrees apart.'
    },
    {
      id: 5,
      question: 'How many bits does 64-QAM encode per symbol?',
      options: ['4', '6', '8', '10'],
      correct: 1,
      explanation: '64-QAM encodes 6 bits per symbol (2^6 = 64 possible symbols).'
    },
    {
      id: 6,
      question: 'What effect does increased SNR have on QAM performance?',
      options: [
        'Decreased data rate',
        'Improved symbol detection accuracy',
        'Reduced modulation depth',
        'Increased constellation size'
      ],
      correct: 1,
      explanation: 'Higher SNR improves the ability to accurately detect and distinguish between symbols.'
    },
    {
      id: 7,
      question: 'Which modulation has the highest spectral efficiency among common types?',
      options: ['BPSK', '16-QAM', '256-QAM', 'FSK'],
      correct: 2,
      explanation: '256-QAM provides the highest spectral efficiency, encoding 8 bits per symbol.'
    },
    {
      id: 8,
      question: 'What is the main drawback of higher-order QAM (like 256-QAM)?',
      options: [
        'Higher complexity',
        'Greater sensitivity to noise and distortion',
        'Lower data rates',
        'Increased bandwidth'
      ],
      correct: 1,
      explanation: 'Higher-order QAM requires lower error rates and is more sensitive to channel impairments.'
    }
  ],

  /**
   * Render quiz interface
   */
  renderQuiz() {
    const quizContainer = document.querySelector('[data-content="quiz"]');
    if (!quizContainer) return;

    let html = '<div class="quiz-container">';

    this.questions.forEach((q, index) => {
      html += `
        <div class="quiz-question" data-question-id="${q.id}">
          <div class="question-header">
            <h3>Question ${index + 1} of ${this.questions.length}</h3>
            <p class="question-text">${q.question}</p>
          </div>
          <div class="question-options">
      `;

      q.options.forEach((option, optIndex) => {
        const isSelected = appState.quizAnswers[q.id] === optIndex;
        html += `
          <label class="option-label ${isSelected ? 'selected' : ''}">
            <input type="radio" name="question-${q.id}" value="${optIndex}" 
              ${isSelected ? 'checked' : ''} 
              onchange="QuizSystem.selectAnswer(${q.id}, ${optIndex})">
            <span class="option-text">${option}</span>
          </label>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    html += `
      <div class="quiz-actions">
        <button class="btn btn-primary" onclick="QuizSystem.submitQuiz()">Submit Quiz</button>
        <button class="btn btn-secondary" onclick="QuizSystem.resetQuiz()">Reset</button>
      </div>
    </div>
    `;

    if (appState.quizScore !== null) {
      html = this.renderResults() + html;
    }

    quizContainer.innerHTML = html;
  },

  /**
   * Select answer for a question
   * @param {number} questionId - ID of the question
   * @param {number} optionIndex - Index of selected option
   */
  selectAnswer(questionId, optionIndex) {
    appState.quizAnswers[questionId] = optionIndex;
  },

  /**
   * Submit quiz and calculate score
   */
  submitQuiz() {
    // Check if all questions are answered
    if (Object.keys(appState.quizAnswers).length !== this.questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    let correctCount = 0;
    this.questions.forEach(q => {
      if (appState.quizAnswers[q.id] === q.correct) {
        correctCount++;
      }
    });

    appState.quizScore = {
      correct: correctCount,
      total: this.questions.length,
      percentage: Math.round((correctCount / this.questions.length) * 100)
    };

    this.renderQuiz();
  },

  /**
   * Reset quiz
   */
  resetQuiz() {
    appState.quizAnswers = {};
    appState.quizScore = null;
    this.renderQuiz();
  },

  /**
   * Render quiz results
   * @returns {string} HTML for results
   */
  renderResults() {
    const score = appState.quizScore;
    const percentage = score.percentage;
    let resultClass = 'result-poor';

    if (percentage >= 80) resultClass = 'result-excellent';
    else if (percentage >= 60) resultClass = 'result-good';
    else if (percentage >= 40) resultClass = 'result-fair';

    let html = `
      <div class="quiz-results ${resultClass}">
        <h2>Quiz Results</h2>
        <div class="score-display">
          <div class="score-number">${score.correct}/${score.total}</div>
          <div class="score-percentage">${percentage}%</div>
        </div>
        <p class="result-message">
    `;

    if (percentage >= 80) {
      html += 'Excellent! You have a strong understanding of QAM concepts.';
    } else if (percentage >= 60) {
      html += 'Good! You understand most QAM concepts. Review the explanations for missed questions.';
    } else if (percentage >= 40) {
      html += 'Fair. Study the QAM concepts more carefully and try again.';
    } else {
      html += 'Keep practicing! Review the fundamental QAM concepts and try again.';
    }

    html += '</p><div class="answer-review">';

    this.questions.forEach((q, index) => {
      const userAnswer = appState.quizAnswers[q.id];
      const isCorrect = userAnswer === q.correct;
      const reviewClass = isCorrect ? 'answer-correct' : 'answer-incorrect';

      html += `
        <div class="answer-item ${reviewClass}">
          <h4>Question ${index + 1}</h4>
          <p><strong>Your answer:</strong> ${q.options[userAnswer]}</p>
          ${!isCorrect ? `<p><strong>Correct answer:</strong> ${q.options[q.correct]}</p>` : ''}
          <p><strong>Explanation:</strong> ${q.explanation}</p>
        </div>
      `;
    });

    html += '</div></div>';

    return html;
  }
};

// ============================================================================
// SIMULATION ENGINE
// ============================================================================

const SimulationEngine = {
  canvas: null,
  ctx: null,
  constellationData: [],

  /**
   * Initialize simulation
   */
  initializeSimulation() {
    this.canvas = document.querySelector('canvas[data-canvas="constellation"]');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.setupEventListeners();
    this.drawSimulation();
  },

  /**
   * Setup event listeners for simulation controls
   */
  setupEventListeners() {
    const modulationSelect = document.querySelector('select[data-param="modulation"]');
    const snrSlider = document.querySelector('input[data-param="snr"]');
    const amplitudeSlider = document.querySelector('input[data-param="amplitude"]');

    if (modulationSelect) {
      modulationSelect.addEventListener('change', (e) => {
        appState.simulationParams.modulation = e.target.value;
        this.drawSimulation();
      });
    }

    if (snrSlider) {
      snrSlider.addEventListener('input', (e) => {
        appState.simulationParams.snrDb = parseFloat(e.target.value);
        document.querySelector('[data-display="snr-value"]').textContent = 
          `${e.target.value} dB`;
        this.drawSimulation();
      });
    }

    if (amplitudeSlider) {
      amplitudeSlider.addEventListener('input', (e) => {
        appState.simulationParams.amplitude = parseFloat(e.target.value);
        document.querySelector('[data-display="amplitude-value"]').textContent = 
          `${e.target.value}`;
        this.drawSimulation();
      });
    }
  },

  /**
   * Generate constellation points
   * @returns {Array} Array of constellation points
   */
  generateConstellation() {
    const modulation = appState.simulationParams.modulation;
    const amplitude = appState.simulationParams.amplitude;
    const snrDb = appState.simulationParams.snrDb;
    const points = [];

    let symbols = 4;
    if (modulation === '16-qam') symbols = 16;
    else if (modulation === '32-qam') symbols = 32;
    else if (modulation === '64-qam') symbols = 64;
    else if (modulation === '128-qam') symbols = 128;
    else if (modulation === '256-qam') symbols = 256;

    const gridSize = Math.sqrt(symbols);
    const noiseStd = Math.sqrt(1 / (2 * Math.pow(10, snrDb / 10)));

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const iComponent = ((2 * i + 1 - gridSize) / gridSize) * amplitude;
        const qComponent = ((2 * j + 1 - gridSize) / gridSize) * amplitude;

        // Add some noise samples
        for (let n = 0; n < 5; n++) {
          const noise_i = this.gaussianRandom() * noiseStd;
          const noise_q = this.gaussianRandom() * noiseStd;

          points.push({
            i: iComponent + noise_i,
            q: qComponent + noise_q,
            ideal_i: iComponent,
            ideal_q: qComponent
          });
        }
      }
    }

    return points;
  },

  /**
   * Generate Gaussian random number
   * @returns {number} Random number from normal distribution
   */
  gaussianRandom() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  },

  /**
   * Draw the simulation
   */
  drawSimulation() {
    if (!this.canvas || !this.ctx) return;

    this.constellationData = this.generateConstellation();
    this.drawConstellation();
    this.updateSimulationStats();
  },

  /**
   * Draw constellation diagram
   */
  drawConstellation() {
    const canvas = this.canvas;
    const ctx = this.ctx;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 60;

    // Clear canvas
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      ctx.moveTo(centerX + i * scale, 0);
      ctx.lineTo(centerX + i * scale, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, centerY + i * scale);
      ctx.lineTo(width, centerY + i * scale);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('I (In-phase)', width - 20, centerY - 10);
    ctx.textAlign = 'right';
    ctx.fillText('Q', centerX + 10, 20);

    // Draw constellation points
    this.constellationData.forEach(point => {
      const x = centerX + point.i * scale;
      const y = centerY - point.q * scale;

      // Draw noisy point
      ctx.fillStyle = 'rgba(52, 152, 219, 0.6)';
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw ideal constellation points
    const modulation = appState.simulationParams.modulation;
    let symbols = 4;
    if (modulation === '16-qam') symbols = 16;
    else if (modulation === '32-qam') symbols = 32;
    else if (modulation === '64-qam') symbols = 64;
    else if (modulation === '128-qam') symbols = 128;
    else if (modulation === '256-qam') symbols = 256;

    const gridSize = Math.sqrt(symbols);
    const amplitude = appState.simulationParams.amplitude;

    ctx.fillStyle = '#e74c3c';
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#c0392b';

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const iComponent = ((2 * i + 1 - gridSize) / gridSize) * amplitude;
        const qComponent = ((2 * j + 1 - gridSize) / gridSize) * amplitude;

        const x = centerX + iComponent * scale;
        const y = centerY - qComponent * scale;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  },

  /**
   * Update simulation statistics display
   */
  updateSimulationStats() {
    const stats = this.calculateStats();
    const statsContainer = document.querySelector('[data-display="simulation-stats"]');

    if (statsContainer) {
      statsContainer.innerHTML = `
        <div class="stat-item">
          <label>Average Power:</label>
          <value>${stats.avgPower.toFixed(3)} W</value>
        </div>
        <div class="stat-item">
          <label>Symbol Rate:</label>
          <value>${stats.symbolRate} symbols/s</value>
        </div>
        <div class="stat-item">
          <label>Data Rate:</label>
          <value>${stats.dataRate} Mbps</value>
        </div>
        <div class="stat-item">
          <label>BER (estimated):</label>
          <value>${stats.ber.toExponential(2)}</value>
        </div>
      `;
    }
  },

  /**
   * Calculate simulation statistics
   * @returns {Object} Statistics object
   */
  calculateStats() {
    const modulation = appState.simulationParams.modulation;
    const snrDb = appState.simulationParams.snrDb;
    const snrLinear = Math.pow(10, snrDb / 10);

    let bitsPerSymbol = 2;
    if (modulation === '16-qam') bitsPerSymbol = 4;
    else if (modulation === '32-qam') bitsPerSymbol = 5;
    else if (modulation === '64-qam') bitsPerSymbol = 6;
    else if (modulation === '128-qam') bitsPerSymbol = 7;
    else if (modulation === '256-qam') bitsPerSymbol = 8;

    const symbolRate = 1000; // symbols per second
    const dataRate = (symbolRate * bitsPerSymbol) / 1000000; // Mbps

    // Estimate BER based on SNR (simplified Q-function approximation)
    const ber = Math.erfc(Math.sqrt(snrLinear / 2)) / 2;

    // Calculate average power from constellation
    let totalPower = 0;
    this.constellationData.forEach(point => {
      totalPower += (point.i * point.i + point.q * point.q);
    });
    const avgPower = totalPower / this.constellationData.length;

    return {
      avgPower: avgPower,
      symbolRate: symbolRate,
      dataRate: dataRate,
      ber: ber
    };
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const HelperFunctions = {
  /**
   * Format number to specified decimal places
   * @param {number} value - Number to format
   * @param {number} decimals - Number of decimal places
   * @returns {string} Formatted number
   */
  formatNumber(value, decimals = 2) {
    return parseFloat(value).toFixed(decimals);
  },

  /**
   * Calculate Q-function approximation
   * @param {number} x - Input value
   * @returns {number} Q-function result
   */
  qFunction(x) {
    return 0.5 * Math.erfc(x / Math.sqrt(2));
  },

  /**
   * Generate random bit sequence
   * @param {number} length - Length of sequence
   * @returns {Array} Array of random bits
   */
  generateBitSequence(length) {
    return Array.from({ length }, () => Math.floor(Math.random() * 2));
  },

  /**
   * Decode bit sequence to decimal
   * @param {Array} bits - Array of bits
   * @returns {number} Decimal value
   */
  bitsToDecimal(bits) {
    return bits.reduce((acc, bit, idx) => acc + bit * Math.pow(2, bits.length - 1 - idx), 0);
  },

  /**
   * Encode decimal to bit sequence
   * @param {number} decimal - Decimal value
   * @param {number} length - Length of bit sequence
   * @returns {Array} Array of bits
   */
  decimalToBits(decimal, length) {
    return Array.from({ length }, (_, i) => (decimal >> (length - 1 - i)) & 1);
  },

  /**
   * Calculate SNR from signal and noise
   * @param {number} signalPower - Power of signal
   * @param {number} noisePower - Power of noise
   * @returns {number} SNR in dB
   */
  calculateSNR(signalPower, noisePower) {
    return 10 * Math.log10(signalPower / noisePower);
  },

  /**
   * Calculate Euclidean distance between two points
   * @param {Object} p1 - First point {i, q}
   * @param {Object} p2 - Second point {i, q}
   * @returns {number} Distance
   */
  euclideanDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1.i - p2.i, 2) + Math.pow(p1.q - p2.q, 2));
  },

  /**
   * Validate modulation type
   * @param {string} modulation - Modulation type
   * @returns {boolean} True if valid
   */
  isValidModulation(modulation) {
    const validTypes = ['qpsk', '16-qam', '32-qam', '64-qam', '128-qam', '256-qam'];
    return validTypes.includes(modulation);
  },

  /**
   * Get bits per symbol for modulation type
   * @param {string} modulation - Modulation type
   * @returns {number} Bits per symbol
   */
  getBitsPerSymbol(modulation) {
    const map = {
      'qpsk': 2,
      '16-qam': 4,
      '32-qam': 5,
      '64-qam': 6,
      '128-qam': 7,
      '256-qam': 8
    };
    return map[modulation] || 2;
  },

  /**
   * Calculate spectral efficiency
   * @param {string} modulation - Modulation type
   * @param {number} bandwidth - Bandwidth in Hz
   * @returns {number} Spectral efficiency in bits/s/Hz
   */
  calculateSpectralEfficiency(modulation, bandwidth) {
    const bitsPerSymbol = this.getBitsPerSymbol(modulation);
    return bitsPerSymbol / bandwidth;
  }
};

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize the application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  TabNavigation.init();
  SimulationEngine.initializeSimulation();
  QuizSystem.renderQuiz();
});

// ============================================================================
// EXPORTS (for module usage if needed)
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TabNavigation,
    QuizSystem,
    SimulationEngine,
    HelperFunctions,
    appState
  };
}
