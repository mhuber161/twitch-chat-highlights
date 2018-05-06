import { Component, OnInit } from '@angular/core';
import { HighlightList } from '../highlightList';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
import {SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl} from '@angular/platform-browser';
import { Highlight } from '../highlightClass';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(protected sanitizer: DomSanitizer) {}

  transform(value: string, type: string = 'resourceUrl'): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    switch (type) {
      case 'html':
        return this.sanitizer.bypassSecurityTrustHtml(value);
      case 'style':
        return this.sanitizer.bypassSecurityTrustStyle(value);
      case 'script':
        return this.sanitizer.bypassSecurityTrustScript(value);
      case 'url':
        return this.sanitizer.bypassSecurityTrustUrl(value);
      case 'resourceUrl':
        return this.sanitizer.bypassSecurityTrustResourceUrl(value);
      default:
        throw new Error(`Unable to bypass security for invalid type: ${type}`);
    }
  }
}

@Component({
  selector: 'app-highlights',
  templateUrl: './highlights.component.html',
  // template: `
  //    <iframe [src]="iframe"></iframe>
  // `,
  styleUrls: ['./highlights.component.css']
})
export class HighlightsComponent implements OnInit {

  exampleVideoId = '257792165';
  vidSrc; // binded to iframe src
  embedUrlPrefix = 'http://player.twitch.tv/?video=v';
  embedUrl;
  sanitizer: DomSanitizer;
  timestampPrefix = '&time=';


  // this should contain a list of links to highlights, data should come from highlights service

  highlightList = HighlightList;

  constructor(private san: DomSanitizer) {
    this.sanitizer = san;
    this.vidSrc = this.sanitizer.bypassSecurityTrustResourceUrl('http://player.twitch.tv');
  }

  ngOnInit() {  }



  getVideo(videoId: string) {
    if (videoId.length > 0) {
      // TODO: input verification, must only contain characters 0-9
      this.embedUrl = this.embedUrlPrefix + videoId;

      this.vidSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.embedUrl);
      // Async have service check if chat log exists, if not pull it. Load embedded video.
      // Then process chat in the background
    }
  }

  selectHighlight(highlight: Highlight) {
    this.embedUrl = this.embedUrlPrefix + highlight.videoId + this.timestampPrefix + highlight.time;
    this.vidSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.embedUrl);
  }

}
