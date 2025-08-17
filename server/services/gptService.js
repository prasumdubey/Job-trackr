const axios = require('axios');

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const deploymentId = process.env.AZURE_OPENAI_DEPLOYMENT_ID;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

console.log("ENV - endpoint:", endpoint);
console.log("ENV - apiKey:", apiKey ? "✓ present" : "✗ missing");
console.log("ENV - deploymentId:", deploymentId);
console.log("ENV - apiVersion:", apiVersion);


exports.extractFieldsFromText = async (text) => {
  const prompt = `
Extract the following fields from the job description:
- Company Name
- Job Role
- Job Type (e.g., Internship, Full-Time, Part-Time)
- Location
- Salary
- Probation Period
- Full-Time Opportunity after Internship (Yes/No)

Respond ONLY in JSON with keys: companyName, jobRole, jobType, location, salary, probationPeriod, fullTimeOpportunity.

Job Description:
${text}
`;

  const url = `${endpoint}/openai/deployments/${deploymentId}/chat/completions?api-version=${apiVersion}`;

  // ✅ Debug the request URL
  console.log("Calling Azure OpenAI at:", url);

  const response = await axios.post(
    url,
    {
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 500,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
    }
  );

  const message = response.data.choices[0].message.content;
  try {
    return JSON.parse(message);
  } catch (err) {
    console.error('❌ Failed to parse GPT response:', message);
    throw new Error('Invalid JSON returned by GPT');
  }
};
