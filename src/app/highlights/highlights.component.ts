import { Component, OnInit } from '@angular/core';
import { HighlightList } from '../highlightList';
// import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
// import {SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl} from '@angular/platform-browser';
import { Highlight } from '../highlightClass';
import { HighlightsService } from '../highlights.service';
import { Chatlog } from '../chat-objects/chatlog';


// @Pipe({ name: 'safe' })
// export class SafePipe implements PipeTransform {
//   constructor(protected sanitizer: DomSanitizer) {}

//   transform(value: string, type: string = 'resourceUrl'): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
//     switch (type) {
//       case 'html':
//         return this.sanitizer.bypassSecurityTrustHtml(value);
//       case 'style':
//         return this.sanitizer.bypassSecurityTrustStyle(value);
//       case 'script':
//         return this.sanitizer.bypassSecurityTrustScript(value);
//       case 'url':
//         return this.sanitizer.bypassSecurityTrustUrl(value);
//       case 'resourceUrl':
//         return this.sanitizer.bypassSecurityTrustResourceUrl(value);
//       default:
//         throw new Error(`Unable to bypass security for invalid type: ${type}`);
//     }
//   }
// }

@Component({
  selector: 'app-highlights',
  templateUrl: './highlights.component.html',
  styleUrls: ['./highlights.component.css']
})
export class HighlightsComponent implements OnInit {

  exampleVideoId = '257792165';
  vidSrc; // binded to iframe src
  embedUrlPrefix = 'http://player.twitch.tv/?video=v';
  embedUrl: string;
  sanitizer: DomSanitizer;
  timestampPrefix = '&time=';
  chatlog: Chatlog;


  // this should contain a list of links to highlights, data should come from highlights service

  highlightList: Highlight[];

  constructor(private san: DomSanitizer, private highlightsService: HighlightsService) {
    this.sanitizer = san;
    this.vidSrc = this.sanitizer.bypassSecurityTrustResourceUrl('http://player.twitch.tv');
  }

  ngOnInit() {
    // this.getHighlights();
    this.getChatlog();
  }

  getHighlights(videoId: string): void {
      // this.highlightList = this.highlightsService.getHighlights();
      this.highlightsService.getHighlights('example-videoId').subscribe(highlights => this.highlightList = highlights);
  }

  getChatlog(videoId: string) {
    const file = videoId + '.log';
    if (true) { // if <videoId>.log does not exist in chat-logs folder, then pull logs and create it
      this.highlightsService.tempChatArray = [];
      this.highlightsService.getLogJson(this.exampleVideoId, null).subscribe(
        chat => this.highlightsService.loadLogJson(chat, this.exampleVideoId));
    }
  }

  getVideo(videoId: string) {
    if (videoId.length > 0) {
      // TODO: input verification, must only contain characters 0-9
      this.embedUrl = this.embedUrlPrefix + videoId;

      this.vidSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.embedUrl);
      // Async have service check if chat log exists locally, if not pull it. Load embedded video.
      // Then process chat in the background
    }

    // getHighlights(videoId)
  }

  selectHighlight(highlight: Highlight) {
    this.embedUrl = this.embedUrlPrefix + highlight.videoId + this.timestampPrefix + highlight.time;
    this.vidSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.embedUrl);
  }

}
