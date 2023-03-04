const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const { transcribeLocalVideo } = require("./transcribe");
const axios = require("axios");
const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

async function runCompletion(prompt) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    temperature: 0.6,
    max_tokens: 250,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  });
  return completion.data.choices[0].text;
}

app.post("/transcribe", async (req, res, next) => {
  //   const https = require("https");
  //   const fs = require("fs");

  //   // URL of the video
  //   const url = req.body.url;
  //   let transcription;
  //   https.get(url, async (res) => {
  //     const path = "video.mp4";
  //     const writeStream = fs.createWriteStream(path);

  //     res.pipe(writeStream);

  //     writeStream.on("finish", async () => {
  //       writeStream.close();
  //       console.log("Download Completed!");
  //       transcription = await transcribeLocalVideo("video.mp4");
  //     });
  //   });
  transcription = fs.readFileSync("transcript.txt");
  return res.status(200).json({
    success: true,
    transcription: transcription.toString(),
  });
});

app.post("/get-title-description", async (req, res) => {
  let title = await runCompletion(`Below is the transcript of one of my videos
  ${req.body.transcript}
  Can you please suggest me a title for this video based on the transcript given to you.`);

  let description =
    await runCompletion(`Below is the transcript of one of my videos
  ${req.body.transcript}
  Can you please suggest me a 1000 word long description for this video based on the transcript given to you.`);

  res.status(200).json({ sucees: true, title, description });
});

app.listen(4000, () => {
  console.log("server listening on port 4000");
});

// transcription api ---   params: video file

// description and title --- params: transcription  return description and title ,, chatgpt
