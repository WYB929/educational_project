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
    const code_question = req.body.code_question || '';
    const code = req.body.code || '';

    if (code_question.trim().length === 0) {
        res.status(400).json({
          error: {
            message: "Please enter a valid question.",
          }
        });
        return;
      }

    try {
      const completion = await openai.createCompletion({
        model: "gpt-3.5-turbo-instruct",
        prompt: generatePrompt(code_question, code),
        temperature: 0.6,
        max_tokens: 2000,
      });
      console.log("code_question");
      console.log(completion.data);
      
      res.status(200).json({result: completion.data.choices[0].text});
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

function generatePrompt(question, code) {
    return `Wite python code below to answer the question: ${question}
    \`\`\`
    ${code}
    \`\`\`
    Please just revise the python code above based on the question and only give me revised code and necessary explanations as comments in the code.`;
}