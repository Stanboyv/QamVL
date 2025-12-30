# QAM Lab Update Guide

## Overview

This guide provides comprehensive instructions for using the updated QAM (Quadrature Amplitude Modulation) lab, documenting all changes made, and explaining how to implement the new features.

**Last Updated:** December 30, 2025

---

## Table of Contents

1. [What's New](#whats-new)
2. [Key Changes](#key-changes)
3. [Getting Started](#getting-started)
4. [Using the Updated QAM Lab](#using-the-updated-qam-lab)
5. [New Features Implementation](#new-features-implementation)
6. [Migration Guide](#migration-guide)
7. [Troubleshooting](#troubleshooting)
8. [FAQ](#faq)

---

## What's New

The latest update to the QAM Lab introduces several enhancements designed to improve usability, performance, and educational value:

- **Enhanced Signal Processing**: Improved algorithms for signal modulation and demodulation
- **Interactive Visualization**: Real-time plotting and analysis tools
- **Extended Modulation Support**: Support for higher-order QAM constellations (16-QAM, 64-QAM, 256-QAM)
- **Improved Documentation**: Comprehensive guides and examples
- **Performance Optimization**: Faster computation and reduced memory footprint
- **Educational Tools**: Added debugging utilities and analysis frameworks

---

## Key Changes

### 1. Architecture Changes

- **Modular Design**: The codebase has been refactored into modular components:
  - `modulator.py`: Handles QAM modulation
  - `demodulator.py`: Handles QAM demodulation
  - `visualizer.py`: Provides visualization tools
  - `utils.py`: Utility functions and helpers

- **Configuration Management**: New configuration system allows easy parameter adjustment without code modifications

- **Logging System**: Enhanced logging for better debugging and monitoring

### 2. API Changes

The core API has been updated for better consistency:

```python
# Old approach (deprecated)
qam_signal = modulate_qam(data, constellation_size)

# New approach (recommended)
from qamvl.modulator import QAMModulator
modulator = QAMModulator(constellation_size=16)
qam_signal = modulator.modulate(data)
```

### 3. Dependency Updates

- Updated NumPy to version 1.24.x
- Updated Matplotlib to version 3.7.x
- Updated SciPy to version 1.10.x

---

## Getting Started

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Stanboyv/QamVL.git
   cd QamVL
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Verify Installation**
   ```bash
   python -c "import qamvl; print(qamvl.__version__)"
   ```

### Quick Start

Create a simple QAM modulation example:

```python
from qamvl.modulator import QAMModulator
from qamvl.visualizer import plot_constellation

# Initialize modulator for 16-QAM
modulator = QAMModulator(constellation_size=16, random_seed=42)

# Generate random binary data
import numpy as np
data = np.random.randint(0, 2, size=1000)

# Modulate the data
symbols = modulator.modulate(data)

# Visualize constellation
plot_constellation(symbols, title="16-QAM Constellation")
```

---

## Using the Updated QAM Lab

### 1. Basic Modulation

#### 16-QAM Example

```python
from qamvl.modulator import QAMModulator
from qamvl.demodulator import QAMDemodulator
import numpy as np

# Setup
modulator = QAMModulator(constellation_size=16)
demodulator = QAMDemodulator(constellation_size=16)

# Generate test data
test_data = np.random.randint(0, 2, size=400)

# Modulate
modulated_signal = modulator.modulate(test_data)

# Add noise (optional)
from qamvl.utils import add_awgn_noise
noisy_signal = add_awgn_noise(modulated_signal, snr_db=10)

# Demodulate
recovered_data = demodulator.demodulate(noisy_signal)

# Check for errors
errors = np.sum(test_data != recovered_data)
print(f"Bit errors: {errors}/{len(test_data)}")
```

#### Higher Order QAM (64-QAM)

```python
# Initialize for 64-QAM
modulator = QAMModulator(constellation_size=64)
demodulator = QAMDemodulator(constellation_size=64)

# Continue as above...
```

### 2. Signal Analysis

```python
from qamvl.visualizer import plot_eye_diagram, plot_spectrum
from qamvl.utils import calculate_evm, calculate_ber

# Calculate Error Vector Magnitude
evm = calculate_evm(original_symbols, received_symbols)
print(f"EVM: {evm:.2f}%")

# Calculate Bit Error Rate
ber = calculate_ber(test_data, recovered_data)
print(f"BER: {ber:.4f}")

# Plot eye diagram
plot_eye_diagram(noisy_signal, samples_per_symbol=4)

# Plot spectrum
plot_spectrum(modulated_signal)
```

### 3. Channel Simulation

```python
from qamvl.channel import AWGNChannel, RayleighChannel

# AWGN Channel
awgn = AWGNChannel(snr_db=10)
noisy_signal = awgn.pass_signal(modulated_signal)

# Rayleigh Fading Channel
rayleigh = RayleighChannel(doppler_freq=100, num_taps=5)
faded_signal = rayleigh.pass_signal(modulated_signal)
```

---

## New Features Implementation

### 1. Real-Time Visualization

The new visualization system supports real-time updates:

```python
from qamvl.visualizer import RealtimeVisualizer

viz = RealtimeVisualizer(update_interval=100)

for i in range(num_iterations):
    # Your processing here
    symbols = process_data(...)
    
    # Update visualization
    viz.update(symbols)
    viz.show()
```

### 2. Configuration System

Create a `config.yaml` file:

```yaml
modulation:
  constellation_size: 16
  symbol_rate: 1e6
  sample_rate: 4e6
  
channel:
  snr_db: 10
  doppler_freq: 100
  
processing:
  filter_type: "rrc"
  filter_order: 51
  rolloff_factor: 0.35
```

Load and use configuration:

```python
from qamvl.config import load_config

config = load_config('config.yaml')
modulator = QAMModulator(**config['modulation'])
```

### 3. Adaptive Equalization

```python
from qamvl.equalization import AdaptiveEqualizer

# Create equalizer
equalizer = AdaptiveEqualizer(num_taps=11, step_size=0.01)

# Process signal
for symbol in received_symbols:
    equalized = equalizer.process(symbol)
    error = desired_symbol - equalized
    equalizer.update(error)
```

### 4. Logging and Debugging

```python
import logging
from qamvl.logger import setup_logger

# Setup logging
setup_logger(level=logging.DEBUG, log_file='qam_lab.log')

logger = logging.getLogger(__name__)
logger.debug("Starting QAM processing")
logger.info("Modulation complete")
logger.error("Signal detection failed")
```

---

## Migration Guide

### For Users of Previous Versions

If you're upgrading from a previous version, follow these steps:

#### Step 1: Update Your Imports

**Before:**
```python
from qamvl import modulate, demodulate
signal = modulate(data, 16)
```

**After:**
```python
from qamvl.modulator import QAMModulator
modulator = QAMModulator(constellation_size=16)
signal = modulator.modulate(data)
```

#### Step 2: Update Function Calls

Most functions now use keyword arguments:

**Before:**
```python
add_noise(signal, 10, 16)
```

**After:**
```python
add_awgn_noise(signal, snr_db=10, constellation_size=16)
```

#### Step 3: Update Configuration

If you have hardcoded parameters, move them to `config.yaml`:

```yaml
# config.yaml
modulation:
  constellation_size: 16
  
channel:
  snr_db: 10
```

#### Step 4: Test Your Code

Run your existing scripts with the new version and verify results match expectations.

---

## Troubleshooting

### Issue: Import Errors

**Problem:** `ModuleNotFoundError: No module named 'qamvl'`

**Solution:**
1. Ensure QamVL is installed: `pip install -r requirements.txt`
2. Check your Python path: `python -c "import sys; print(sys.path)"`
3. Reinstall if needed: `pip install --upgrade .`

### Issue: Poor EVM or BER Performance

**Problem:** Error Vector Magnitude or Bit Error Rate is higher than expected

**Solutions:**
1. Increase SNR: `add_awgn_noise(signal, snr_db=15)` (from 10)
2. Use better equalization: Check filter parameters in config
3. Verify signal alignment and synchronization
4. Check constellation for correct scaling

### Issue: Memory Issues with Large Datasets

**Problem:** Processing large data arrays causes memory errors

**Solutions:**
1. Process data in chunks:
   ```python
   chunk_size = 10000
   for i in range(0, len(data), chunk_size):
       chunk = data[i:i+chunk_size]
       result = modulator.modulate(chunk)
   ```
2. Use memory-efficient data types: `dtype=np.float32`
3. Clear intermediate results: `del intermediate_var`

### Issue: Visualization Not Displaying

**Problem:** Plots don't appear or are blank

**Solutions:**
1. Ensure matplotlib backend is set: `matplotlib.use('TkAgg')`
2. Use `plt.show()` to display plots
3. Check data range and normalization
4. Verify sufficient data points for visualization

---

## FAQ

### Q1: What QAM constellation sizes are supported?

**A:** The updated lab supports 4-QAM, 16-QAM, 64-QAM, and 256-QAM. You can specify these via the `constellation_size` parameter:

```python
modulator = QAMModulator(constellation_size=64)
```

### Q2: How do I compare my results with theoretical values?

**A:** Use the built-in theoretical calculation tools:

```python
from qamvl.theoretical import theoretical_ber, theoretical_evm

theory_ber = theoretical_ber(snr_db=10, constellation_size=16)
measured_ber = calculate_ber(original_data, recovered_data)
```

### Q3: Can I use this lab for real-time processing?

**A:** Yes, the modular design supports real-time processing. Use the `RealtimeVisualizer` and ensure adequate computational resources.

### Q4: How do I implement custom channels?

**A:** Extend the `BaseChannel` class:

```python
from qamvl.channel import BaseChannel

class CustomChannel(BaseChannel):
    def pass_signal(self, signal):
        # Your channel implementation
        return processed_signal
```

### Q5: What are the system requirements?

**A:** 
- Python 3.8 or higher
- NumPy 1.24.x
- Matplotlib 3.7.x
- SciPy 1.10.x
- 2GB RAM minimum (4GB+ recommended for large datasets)
- 500MB disk space

### Q6: How do I report bugs or request features?

**A:** Open an issue on the GitHub repository:
- Provide a detailed description
- Include minimal reproducible example
- Specify your environment (OS, Python version, etc.)

### Q7: Is there a community forum or discussion board?

**A:** Yes, check the GitHub Discussions tab for community support and knowledge sharing.

### Q8: Can I contribute to the project?

**A:** Absolutely! See CONTRIBUTING.md for guidelines on:
- Setting up development environment
- Coding standards
- Testing requirements
- Pull request process

---

## Additional Resources

### Documentation
- Full API Reference: See `docs/api_reference.md`
- Tutorials: Check `docs/tutorials/` directory
- Examples: Browse `examples/` folder

### External References
- QAM Theory: [Digital Modulation Tutorial](https://example.com)
- Communication Systems: [Reference Book](https://example.com)
- Signal Processing: [Resource Hub](https://example.com)

### Support

For questions or issues:
1. Check this guide first
2. Search GitHub Issues
3. Open a new issue with details
4. Contact maintainers via GitHub

---

## Version History

- **v2.0.0** (Dec 30, 2025): Major update with modular architecture, new features, and improved documentation
- **v1.5.0**: Performance optimizations
- **v1.0.0**: Initial release

---

## License

This project is licensed under the MIT License. See LICENSE file for details.

---

**Happy Modulating! 🔧📊**

For the latest updates, visit: https://github.com/Stanboyv/QamVL
