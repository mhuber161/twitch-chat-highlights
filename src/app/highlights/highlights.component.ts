import { Component, OnInit } from '@angular/core';
import { HighlightList } from '../highlightList';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
import {SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl} from '@angular/platform-browser';

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
  styleUrls: ['./highlights.component.css']
})
export class HighlightsComponent implements OnInit {

  embedVideoId = '257792165';
  embedSrc = '\'http://player.twitch.tv/?video=v257792165\' | safe';

  // this should contain a list of links to highlights, data should come from highlights service

  highlightList = HighlightList;

  constructor() {  }

  ngOnInit() {  }


  getVideo(videoId: string) {
    if (videoId.length > 0) {
      // TODO: input verification
      this.embedVideoId = videoId;
      // Async have service check if chat log exists, if not pull it. Load embedded video.
      // Then process chat in the background
    }
  }

}
