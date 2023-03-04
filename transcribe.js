const fs = require("fs");
const https = require("https");
const { execSync: exec } = require("child_process");
const { Deepgram } = require("@deepgram/sdk");
const ffmpegStatic = require("ffmpeg-static");
const deepgram = new Deepgram("60110e3c1e5c62fb16c6504722c2b5862121ee29");
async function ffmpeg(command) {
  return new Promise((resolve, reject) => {
    exec(`${ffmpegStatic} ${command}`, (err, stderr, stdout) => {
      if (err) reject(err);
      resolve(stdout);
    });
  });
}
async function transcribeLocalVideo(filePath) {
  await ffmpeg(`-hide_banner -y -i ${filePath} ${filePath}.wav`).catch((err) =>
    console.log(err)
  );

  const audioFile = {
    buffer: fs.readFileSync(`deepgram.mp4.wav`),
    mimetype: "audio/wav",
  };
  const response = await deepgram.transcription.preRecorded(audioFile, {
    punctuation: true,
    utterances: true,
  });
  return response;
}

// transcribeLocalVideo("deepgram.mp4")
//   .then((transcript) => {
//     fs.writeFileSync("transcript.txt", transcript.toWebVTT());
//     console.dir(transcript.toWebVTT(), { depth: null });
//   })
//   .catch((err) => console.log(err));

module.exports.transcribeLocalVideo = transcribeLocalVideo;
