import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }
  const key = req.body.key || '';
  const question = req.body.question || '';

  try {
    const completion_3 = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct",
      prompt: generatePrompt(key, question),
      temperature: 0.6,
      max_tokens: 100,
    });
    console.log("completion_3");
    console.log(completion_3.data);
    
    res.status(200).json({result_3: completion_3.data.choices[0].text});
  } catch(error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(animal, question) {
  return `Give definition of ${animal} in computer science in less than three sentences.`;
}