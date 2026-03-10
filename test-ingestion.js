const http = require('http');

const data = JSON.stringify({
  id: "test-123",
  timestamp: new Date().toISOString(),
  type: "audio",
  content: "mock_data",
  metadata: {
    name: "Kieran",
    age: "30",
    location: "London",
    profession: "Designer"
  }
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/ingestion',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let responseData = '';
  res.on('data', (d) => {
    responseData += d;
  });
  res.on('end', () => {
    console.log("Response Status:", res.statusCode);
    console.log("Response Body:", responseData);
    if (!responseData.includes('[PERSON_1]')) {
      console.error("Test failed: PII not sanitized correctly.");
      process.exit(1);
    } else {
      console.log("Test passed: PII sanitized successfully.");
      process.exit(0);
    }
  });
});

req.on('error', (error) => {
  console.error("Test failed:", error);
  process.exit(1);
});

req.write(data);
req.end();
