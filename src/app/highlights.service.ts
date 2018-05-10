import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Highlight } from './highlightClass';
import { HighlightList } from './highlightList';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chatlog } from './chat-objects/chatlog';


@Injectable({
  providedIn: 'root'
})
export class HighlightsService {

  // Pulls chat log from Twitch
  // Parses log to create list of highlights
  // Passes highlights list to highlights.component.ts, which does filtering and sorting
  // This should be done async, show loading area on view while waiting

  // r = requests.get('https://api.twitch.tv/kraken/videos/257792165/comments?content_offset_seconds=0',
      // headers={"Client-ID": "oe92qc609eaxxhoh4h5s06pvz7gd9l", "Accept": "application/vnd.twitchtv.v5+json"})

  tempChatArray: string[];

  httpOptions = {
    headers: new HttpHeaders({
      'Client-ID':  'oe92qc609eaxxhoh4h5s06pvz7gd9l',
      'Accept': 'application/vnd.twitchtv.v5+json'
    })
  };


  private twitchChatUrl = 'https://api.twitch.tv/kraken/videos/257792165/comments?content_offset_seconds=0';
  private chatLog: Observable<Chatlog>;

  constructor(private http: HttpClient) { }

  getHighlights(videoId: string): Observable<Highlight[]> {
    // if chat log not in folder, pull chat log
    // iterate through chat log, every 10 seconds save most popular word and it's score
    // return top n highlight scores

    // this.chatLog = this.http.get<Chatlog>(this.twitchChatUrl, this.httpOptions);

    return of(HighlightList);
  }

  getChatlog(videoId: string): Observable<Chatlog> {
    return this.http.get<Chatlog>(this.twitchChatUrl, this.httpOptions);
  }




  getLogJson(videoId: string, next: string): Observable<Chatlog> {
    return this.http.get<Chatlog>(this.twitchChatUrl, this.httpOptions);
  }

  loadLogJson(chat: Chatlog, videoId: string) {
    for (const comment of chat.comments) {
      this.tempChatArray.push(comment.message.body);
    }

    if (chat._next.length > 0) {
      this.getLogJson('', chat._next).subscribe(chatlog => this.loadLogJson(chatlog, videoId));
    }
  }
}
