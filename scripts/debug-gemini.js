const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        process.env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
      }
    });
  }
} catch (e) {}

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(name) {
    try {
        console.log(`\nTesting ${name}...`);
        const model = genAI.getGenerativeModel({ model: name });
        const result = await model.generateContent("hi");
        const text = result.response.text();
        console.log(`SUCCESS: ${name}. Response: ${text.slice(0, 30)}`);
        return true;
    } catch (e) {
        console.log(`FAIL: ${name}. Error: ${e.message}`);
        return false;
    }
}

async function main() {
    const targets = [
        "gemini-2.5-flash",
        "gemini-2.0-flash-lite",
        "gemini-flash-latest"
    ];
    
    for (const t of targets) {
        if (await testModel(t)) {
            console.log(`\n*** FOUND WORKING MODEL: ${t} ***`);
        }
    }
}

main();
