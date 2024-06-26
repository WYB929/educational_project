import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";  

import Editor from "@monaco-editor/react";
import Navbar from './Components/Navbar';
import Axios from 'axios';
import simplify from "./api/simplify";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [keyClick, setKeyDef] = useState("");
  const [result, setResult] = useState();
  const [userCode, setUserCode] = useState("# Enter your code here");
  const [more_q, setMore_Q] = useState();

  function detect() {
    event.preventDefault();
    fetch('http://localhost:8000/detect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ animal: animalInput}),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.label);
      // setGroup(data.label);
      onSubmit(data.label);})
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  async function onSubmit(group) {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput, group: group}),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      console.log(group);
      if (group==0) {
        console.log(data.result_1);
        setUserCode("# Enter your code here\n");
        setResult(data.result_1.split(' '));
      }
      else {
        const codeContent = data.result_1.replaceAll('<code>', '').replaceAll('</code>', '').replace('\n', '');
        console.log(codeContent);
        // setResult("");
        setUserCode(codeContent);
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
  const [upload_message, setUploadMessage] = useState("");
  const [code_question, setCodeQuestion] = useState('');

  function codeCompile() {
    setLoading(true);
    fetch('http://localhost:8000/codeCompile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({code: userCode,language: userLang,input: userInput}),
    })
    .then(response => response.json())
    .then(data => {console.log(data); setUserOutput(data); setLoading(false);})
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  function clearOutput() {
    setUserCode("# Enter your code here");
  }

  const [explanation, setExplanation] = useState("")
  async function explainCode() {
    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userCode}),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setExplanation(data.result_3);
      setUserCode(data.result_3+'\n\n'+userCode);
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  }
  
  const [score, setScore] = useState(10)
  const [errors, setError] = useState([])
  const [check, setCheck] = useState(false)
  function improveCode() {
    fetch('http://localhost:8000/improve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: userCode}),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data); 
      setScore(data.score); 
      setError(data.errors);
      setCheck(true);})
    .catch((error) => {
      console.error('Error:', error);
    });
  }


  const [rewrite, setRewrite] = useState("")
  async function rewriteCode(e) {
    try {
      e.target.style.color = 'red';
      const response = await fetch("/api/rewrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ errors: e.target.innerText, question: userCode}),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setUserCode(data.result_3.replaceAll('<code>', '').replaceAll('</code>', ''));
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  }


  const [simplify, setSimplify] = useState("")
  async function simplifyCode() {
    try {
      const response = await fetch("/api/simplify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userCode}),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setSimplify(data.result_3);
      setUserCode(data.result_3);
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  }

  const [test_cases, setTestCases] = useState("")
  async function testCases() {
    try {
      const response = await fetch("/api/test_cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userCode}),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setTestCases(data.result_3);
      setUserCode(userCode+'\n\n'+data.result_3);
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  }

  async function handleFileUpload(event) {
    event.preventDefault();
    const formData = new FormData();
    const fileInput = document.querySelector('input[type="file"]');
    formData.append("file", fileInput.files[0]);

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log(data);
      const message = data.message + "! And you can retrive your file in code editer with path: " + data.retrive_path;
      setUploadMessage(message);
    } catch (error) {
      console.error('Error:', error);
      setUploadMessage(error);
    }
  }

  async function codeQuestionForm(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/code_question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code_question: code_question, code: userCode}),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setUserCode(data.result);
      console.log(data.result);
    }
    catch(error) {
      console.error('Error:', error);
    }
  }

  const [debug, setDebug] = useState("")
  async function debugCode() {
    try {
      const response = await fetch("/api/debug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userCode}),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setDebug(data.result_3);
      setUserCode(data.result_3);
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
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
        <form onSubmit={(e)=>{detect(e);}}>
          <input
            type="text"
            name="animal"
            placeholder="Enter a Question"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="Submit" />
        </form>

        {/* <div className={styles.divider}>
          {key_words && key_words.map((q, i) => 
            q === '' ? <p></p> :
            <div key={i}>{q}</div>
          )}
        </div> */}

        <h3>Answer</h3>
        <div className={styles.divider}>
          {result && result.map((word, index) => 
            <strong key={index} onMouseOutCapture={(e) => mouseOut(e)} onClick={(e) => click(e)}>
              {word+' '}
            </strong>
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
            height="1000px"
            width="80%"
            language={userLang}
            defaultLanguage="python"
            value={userCode}
            onChange={(value) => { setUserCode(value) }}
          />
          <button className="run-btn" onClick={() => codeCompile()}>
            Run
          </button>
        </div>

        <div>
          <form onSubmit={handleFileUpload}>
            <input type="file" name="myFile" />
            <button type="submit">Upload</button>
          </form>
          <div>{upload_message}</div>
        </div>

        <div className="right-container">
          {/* <h4>Input:</h4>
          <div className="input-box">
            <textarea id="code-inp" onChange={(e)=>setUserInput(e.target.value)}></textarea>
          </div> */}
          <h4>Linter Check:</h4>
          <div>
            {errors.length>0 && errors.map((error, index) => 
              <div key={index} onMouseOutCapture={(e)=>mouseOut(e)} onClick={(e)=>rewriteCode(e)}>
                Line {error}
              </div>
            )}
            {(errors.length===0 && check) && 
              <div>
                Pass Linter Check!
              </div>
            }
            {(errors.length===0 && !check) && 
              <div>
              </div>
            }
          </div>
          <h4>What to improve this code as your wish? Enter your request below:</h4>
          <form onSubmit={codeQuestionForm}>
            <input 
              type="text" 
              name="code_question" 
              placeholder="Enter your request to change the code here" 
              value={code_question} 
              onChange={(e) => setCodeQuestion(e.target.value)} 
            />
            <input type="submit" value="Submit" />
          </form>

          <h4>Output:</h4>
          {loading ? (
            <div className="spinner-box">
              <p>Loading...</p>
            </div>
            ) : (
            <div className="output-box">
              <pre>{userOutput}</pre>

              <button onClick={() => { improveCode() }} className="clear-btn">
                Check
              </button>
              {/* <button onClick={() => { explainCode() }} className="clear-btn">
                Explain
              </button> */}
              {/* <button onClick={() => { clearOutput() }} className="clear-btn">
                Improve
              </button> */}
              {/* <button onClick={() => { rewriteCode() }} className="clear-btn">
                Rewrite
              </button> */}
              {/* <button onClick={() => { simplifyCode() }} className="clear-btn">
                Simplify
              </button>
              <button onClick={() => { testCases() }} className="clear-btn">
                Test Case
              </button>
              <button onClick={() => { debugCode() }} className="clear-btn">
                Debug
              </button>

              <button onClick={() => { clearOutput() }} className="clear-btn">
                Clear
              </button> */}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
