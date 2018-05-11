export class Highlight {
  score: number;
  text: string;
  time: number; // In seconds from start of video
  videoId: string;

  constructor(score, text, time, videoId) {
    this.score = score;
    this.text = text;
    this.time = time;
    this.videoId = videoId;
  }
}
