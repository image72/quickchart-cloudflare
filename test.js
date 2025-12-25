/**
 * Test QuickChart Cloudflare Worker
 * Run with: node test.js
 */

const WORKER_URL = process.env.WORKER_URL || 'http://localhost:8787';

const testChart = {
  type: 'bar',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: 'Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
      },
    ],
  },
};

async function testWorker() {
  console.log('🧪 Testing QuickChart Cloudflare Worker\n');
  console.log(`Worker URL: ${WORKER_URL}\n`);

  // Test 1: Health check
  console.log('Test 1: Health check');
  try {
    const response = await fetch(`${WORKER_URL}/health`);
    console.log(`✅ Status: ${response.status}`);
    const text = await response.text();
    console.log(`   Response: ${text}\n`);
  } catch (error) {
    console.log(`❌ Error: ${error.message}\n`);
  }

  // Test 2: POST with JSON
  console.log('Test 2: POST chart rendering (JSON body)');
  try {
    const start = Date.now();
    const response = await fetch(`${WORKER_URL}/chart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chart: testChart, w: 500, h: 300 }),
    });

    const elapsed = Date.now() - start;
    console.log(`   Status: ${response.status}`);
    console.log(`   Time: ${elapsed}ms`);
    console.log(
      `   Browser Reused: ${response.headers.get('X-Browser-Reused')}`
    );
    console.log(
      `   Image Size: ${(response.headers.get('content-length') / 1024).toFixed(
        1
      )}KB\n`
    );
  } catch (error) {
    console.log(`❌ Error: ${error.message}\n`);
  }

  // Test 3: GET with query string
  console.log('Test 3: GET chart rendering (query string)');
  try {
    const chartStr = JSON.stringify(testChart);
    const encoded = encodeURIComponent(chartStr);
    const start = Date.now();

    const response = await fetch(
      `${WORKER_URL}/chart?c=${encoded}&w=400&h=250`
    );

    const elapsed = Date.now() - start;
    console.log(`   Status: ${response.status}`);
    console.log(`   Time: ${elapsed}ms`);
    console.log(
      `   Browser Reused: ${response.headers.get('X-Browser-Reused')}`
    );
    console.log(
      `   Image Size: ${(response.headers.get('content-length') / 1024).toFixed(
        1
      )}KB\n`
    );
  } catch (error) {
    console.log(`❌ Error: ${error.message}\n`);
  }

  // Test 4: GET with base64
  console.log('Test 4: GET with base64 encoding');
  try {
    const chartStr = JSON.stringify(testChart);
    const base64 = btoa(chartStr);
    const start = Date.now();

    const response = await fetch(
      `${WORKER_URL}/chart?c=${encodeURIComponent(
        base64
      )}&encoding=base64&w=600&h=400`
    );

    const elapsed = Date.now() - start;
    console.log(`   Status: ${response.status}`);
    console.log(`   Time: ${elapsed}ms`);
    console.log(
      `   Browser Reused: ${response.headers.get('X-Browser-Reused')}`
    );
    console.log(
      `   Image Size: ${(response.headers.get('content-length') / 1024).toFixed(
        1
      )}KB\n`
    );
  } catch (error) {
    console.log(`❌ Error: ${error.message}\n`);
  }

  console.log('🎉 Test completed!');
}

testWorker().catch(console.error);
