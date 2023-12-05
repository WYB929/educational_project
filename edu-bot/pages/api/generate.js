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

  const animal = req.body.animal || '';

  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid question.",
      }
    });
    return;
  }

  try {
    const completion_1 = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct",
      prompt: generatePrompt_1(animal),
      temperature: 0.6,
      max_tokens: 2000,
    });
    console.log("completion_1");
    console.log(completion_1.data);

    // const complete_code_1 = await openai.createCompletion({
    //   model: "text-davinci-002",
    //   prompt: generatePrompt_1(animal),
    //   temperature: 0,
    //   max_tokens: 100,
    // })
    // console.log("completion_code_1");
    // console.log(complete_code_1.data);

    const completion_2 = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct",
      prompt: generatePrompt_2(animal),
      temperature: 0.6,
      max_tokens: 2000,
    });
    console.log("completion_2");
    console.log(completion_2.data);

    const answer = completion_2.data.choices[0].text;
    const completion_4 = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct",
      prompt: generatePrompt_4(answer),
      temperature: 0.6,
      max_tokens: 2000,
    });
    console.log("completion_4");
    console.log(completion_4.data);

    res.status(200).json({ result_1: completion_1.data.choices[0].text,
    result_2: completion_2.data.choices[0].text.split("\n").slice(1),
    result_4: completion_4.data.choices[0].text,
  });
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

function generatePrompt_1(animal) {
  return `In Computer Science, ${animal}? If sample code is required, wrap only python code with <code> </code>. `;
}

function generatePrompt_2(animal) {
  return `In computer science, give me three other related questions and answers to ${animal} in three lines in the format of:
  Question 1:
  Answer:
  Question 2:
  Answer:
  Question 3:
  Answer:`;
}

function generatePrompt_4(animal) {
  return `Please extract all the useful keywords from "${animal}"  separated.by comma`;
}