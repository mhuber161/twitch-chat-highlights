import { Component, OnInit } from '@angular/core';
import { HighlightList } from '../highlightList';
import { DomSanitizer} from '@angular/platform-browser';
import { Highlight } from '../highlightClass';
import { HighlightsService } from '../highlights.service';
import { Chatlog } from '../chat-objects/chatlog';


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
    this.getChatlog(this.exampleVideoId);
  }

  getChatlog(videoId: string) {
    this.highlightsService.chatMessageArray = [];

    this.highlightsService.getLogJson(videoId, null).subscribe(
      chat => this.highlightsService.loadLogJson(chat, videoId));
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

  // setup single page mean stack app:
  //    https://scotch.io/tutorials/creating-a-single-page-todo-app-with-node-and-angular#frontend-application-with-angular

  // https://www.sitepoint.com/mean-stack-angular-2-angular-cli/

  selectHighlight(highlight: Highlight) {
    this.embedUrl = this.embedUrlPrefix + highlight.videoId + this.timestampPrefix + highlight.time;
    this.vidSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.embedUrl);
  }

}
