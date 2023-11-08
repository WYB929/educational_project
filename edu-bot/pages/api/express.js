const express = require("express");
const cors = require("cors");
const Axios = require("axios");
const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

app.post("/compile", (req, res) => {
    const options = {
        method: 'POST',
        url: 'https://online-code-compiler.p.rapidapi.com/v1/',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': 'b0cd7629eemsh0956c482376c675p1b1de6jsn36234a14c31d',
          'X-RapidAPI-Host': 'online-code-compiler.p.rapidapi.com'
        },
        data: {
          // add more languages here
          language: 'python3',
          version: 'latest',
          code: req.body.code,
          input: req.body.input
        }
    };

	Axios(options)
		.then((response) => {
            console.log(response.data);
			res.send(response.data)
		}).catch((error) => {
			console.log(error);
		});
})

// app.get("/language", (req, res) => {
//     const options = {
//         method: 'GET',
//         url: 'https://online-code-compiler.p.rapidapi.com/v1/languages/',
//         headers: {
//           'X-RapidAPI-Key': 'b0cd7629eemsh0956c482376c675p1b1de6jsn36234a14c31d',
//           'X-RapidAPI-Host': 'online-code-compiler.p.rapidapi.com'
//         }
//       };
      
//       Axios(options)
//       .then((response) => {
//           console.log(response.data);
//           res.send(response.data);
//       }).catch((error) => {
//           console.log(error);
//       });
// })

app.listen(8000, () => {
	console.log(`Server listening on port ${PORT}`);
});