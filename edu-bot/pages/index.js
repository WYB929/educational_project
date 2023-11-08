import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";  

import Editor from "@monaco-editor/react";
import Navbar from './Components/Navbar';
import Axios from 'axios';

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [keyClick, setKeyDef] = useState("");
  const [result, setResult] = useState();
  const [userCode, setUserCode] = useState("# Enter your code here");
  const [more_q, setMore_Q] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput}),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      var htmlRegexG = /<code>((.*?(\n)?)+)<\/code>/g;
      const code_match = data.result_1.match(htmlRegexG);
      console.log(code_match[0]);
      setResult(data.result_1.replaceAll(htmlRegexG,'').split(' '));
      if (code_match!=null) {
        setUserCode(code_match[0].replaceAll('<code>', '').replaceAll('</code>', '').replace('\n', ''));
      }
      setMore_Q(data.result_2);
      setAnimalInput("");
      setKeyDef("");
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  }

  function mouseOut(event) {
    event.target.style.color = 'black';
  }

  async function click(event) {
    event.preventDefault();
    event.target.style.color = 'red';
    try {
      const response = await fetch("/api/definition", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: event.target.innerText, question: result}),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setKeyDef('Definition: '+data.result_3);
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  }

  // new code
  const [userLang, setUserLang] = useState("python");
  const [userInput, setUserInput] = useState("");
  const [userOutput, setUserOutput] = useState("");
  const [loading, setLoading] = useState(false);

  function compile() {
    setLoading(true);

    Axios.post(`http://localhost:8000/compile`, {
      code: userCode,
      language: userLang,
      input: userInput
    }).then((res) => {
      setUserOutput(res.data.output);
    }).then(() => {
      setLoading(false);
    })

    // Axios.get(`http://localhost:8000/language`).then((res) => {
    //   console.log(res.data);
    // })
  }

  function clearOutput() {
    setUserOutput("");
  }

  return (
    <div>
      <Head>
        <title>EduBot</title>
        <link rel="icon" href="/artificial-intelligence.png" />
      </Head>

      <main className={styles.main}>
        <img src="/artificial-intelligence.png" className={styles.icon} />
        <h3>Question</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Enter a Question"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="Submit" />
        </form>
        <h3>Answer</h3>
        <div className={styles.divider}>
          {result && result.map((word, index) => 
            <strong key={index} onMouseOutCapture={mouseOut} onClick={click}>{word+' '}</strong>
          )}
          <div><br></br>{keyClick}</div>
        </div>
        <h3>Further Question</h3>
        <div className={styles.divider}>
          {more_q && more_q.map((q, i) => 
            q === '' ? <p></p> :
            <div key={i}>{q}</div>
          )}
        </div>


        <Navbar userLang={userLang} setUserLang={setUserLang}/>
        <div className="left-container">
          <Editor
            height="200px"
            width="100%"
            language={userLang}
            defaultLanguage="python"
            value={userCode}
            onChange={(value) => { setUserCode(value) }}
          />
          <button className="run-btn" onClick={() => compile()}>
            Run
          </button>
        </div>
        <div className="right-container">
          <h4>Input:</h4>
          <div className="input-box">
            <textarea id="code-inp" onChange={(e)=>setUserInput(e.target.value)}></textarea>
          </div>
          <h4>Output:</h4>
          {loading ? (
            <div className="spinner-box">
              <p>Loading...</p>
            </div>
            ) : (
            <div className="output-box">
              <pre>{userOutput}</pre>
              <button onClick={() => { clearOutput() }} className="clear-btn">
                Clear
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
