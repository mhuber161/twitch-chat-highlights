import { Component, OnInit } from '@angular/core';
import { HighlightList } from '../highlightList';
import { DomSanitizer} from '@angular/platform-browser';
import { Highlight } from '../highlightClass';
import { HighlightsService } from '../highlights.service';
import { Chatlog } from '../chat-objects/chatlog';

// future references for using mean stack
// setup single page mean stack app:
//    https://scotch.io/tutorials/creating-a-single-page-todo-app-with-node-and-angular#frontend-application-with-angular

// https://www.sitepoint.com/mean-stack-angular-2-angular-cli/

export class ChatMessage {
  time: number;
  text: string;

  constructor(time: number, text: string) {
    this.time = time;
    this.text = text;
  }
}

@Component({
  selector: 'app-highlights',
  templateUrl: './highlights.component.html',
  styleUrls: ['./highlights.component.css']
})
export class HighlightsComponent implements OnInit {

  exampleVideoId = '257792165';
  exampleVideoIdShort = '258923894';

  vidSrc; // binded to iframe src
  embedUrlPrefix = 'http://player.twitch.tv/?video=v';
  embedUrl: string;
  sanitizer: DomSanitizer;
  timestampPrefix = '&time=';
  chatlog: Chatlog;

  chatMessageArray: ChatMessage[];



  // this should contain a list of links to highlights, data should come from highlights service
  // variable binded to view
  highlightList: Highlight[];

  constructor(private san: DomSanitizer, private highlightsService: HighlightsService) {
    this.sanitizer = san;
    this.vidSrc = this.sanitizer.bypassSecurityTrustResourceUrl('http://player.twitch.tv');
  }

  ngOnInit() {
    // this.getChatlog(this.exampleVideoIdShort);   // for testing purposes
  }

  getChatlog(videoId: string) {
    this.chatMessageArray = [];

    this.highlightsService.getLogJson(videoId, null).subscribe(
      resp => {
        const keys = resp.headers.keys();
        this.highlightsService.headers = keys.map(key =>
        `${key}: ${resp.headers.get(key)}`);
        this.loadLogJson(resp.body, videoId);
      });
  }

  // Take user input of video id, load it into embedded video, then load highlights list
  getVideo(videoId: string) {
    if (videoId.length > 0) {
      // TODO: input verification, must only contain characters 0-9
      this.embedUrl = this.embedUrlPrefix + videoId;
      this.vidSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.embedUrl);
      this.getChatlog(videoId);
    }
  }

  // Select highlight from list and load it into embedded video
  selectHighlight(highlight: Highlight) {
    this.embedUrl = this.embedUrlPrefix + highlight.videoId + this.timestampPrefix + highlight.time;
    this.vidSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.embedUrl);
  }



  loadLogJson(chat: Chatlog, videoId: string) {
    for (const comment of chat.comments) {
      this.chatMessageArray.push(new ChatMessage(comment.content_offset_seconds, comment.message.body));
    }

    if (chat._next != null) {
      this.highlightsService.getLogJson(videoId, chat._next).subscribe(resp => {
        const keys = resp.headers.keys();
        this.highlightsService.headers = keys.map(key =>
        `${key}: ${resp.headers.get(key)}`);

        this.loadLogJson(resp.body, videoId);
      });
    } else {
      console.log('Done pulling chat!');
      let timeSegment = 0;
      let currentPoints = 0;
      // tslint:disable-next-line:prefer-const
      let emoteArray = [];

      for (let i = 0; i < this.chatMessageArray.length; i++) {
        if (this.chatMessageArray[i].time > timeSegment + 10) {
          emoteArray.push(new Highlight(currentPoints, 'LUL', (timeSegment === 0) ? timeSegment : timeSegment - 10, videoId));
          currentPoints = 0;
          timeSegment += 10;
        }
        if (this.chatMessageArray[i].text.includes('LUL')) {
          currentPoints++;
        }
      }

      emoteArray.sort((leftSide, rightSide): number => {
        if (leftSide.score > rightSide.score) {return -1; }
        if (leftSide.score < rightSide.score) {return 1; }
      });

      this.highlightList = emoteArray;

    }
  }

}
