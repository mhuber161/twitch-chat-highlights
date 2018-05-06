import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-highlights',
  templateUrl: './highlights.component.html',
  styleUrls: ['./highlights.component.css']
})
export class HighlightsComponent implements OnInit {

  highlight = 'www.twitch.tv';
  // this should contain a list of links to highlights, data should come from highlights service

  constructor() { }

  ngOnInit() {
  }


  getVideo(videoId: string) {
    if (videoId.length > 0) {
    }
  }

}
