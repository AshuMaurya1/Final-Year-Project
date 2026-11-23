const http = require('http');

async function testEndpoint(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:8899${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data: data });
        }
      });
    }).on('error', reject);
  });
}

// Start server
process.env.PORT = '8899';
require('../backend_service/server.js');

setTimeout(async () => {
  try {
    const status = await testEndpoint('/api/intersection/status');
    const vision = await testEndpoint('/api/vision/camera-feeds');
    const research = await testEndpoint('/api/research/baselines');
    const calc = await testEndpoint('/api/research/calculator?q_ns=14&q_ew=6');
    const page = await testEndpoint('/');

    console.log("=== IN-PROCESS TEST RESULTS ===");
    console.log("Status API (HTTP " + status.status + "): Phase = " + status.data.current_phase + ", Paper = " + status.data.paper_reference);
    console.log("Vision Feeds (HTTP " + vision.status + "): Confidence = " + (vision.data.system_confidence * 100) + "%, Cameras = " + Object.keys(vision.data.feeds).join(', '));
    console.log("Research Baselines (HTTP " + research.status + "): Scenarios = " + research.data.scenarios.length + ", Hypotheses = " + research.data.hypotheses.length);
    console.log("  H1: " + research.data.hypotheses[0].status);
    console.log("  H2: " + research.data.hypotheses[1].status);
    console.log("  H3: " + research.data.hypotheses[2].status);
    console.log("Equation 7 Calc (HTTP " + calc.status + "): g_NS = " + calc.data.allocation.gNS + "s, g_EW = " + calc.data.allocation.gEW + "s, Total = " + calc.data.allocation.totalGreen + "s");
    console.log("Frontend Index (HTTP " + page.status + "): Served " + page.data.length + " bytes of HTML");
    console.log("ALL TESTS COMPLETED SUCCESSFULLY!");
    process.exit(0);
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  }
}, 1000);
