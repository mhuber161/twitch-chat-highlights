import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Highlight } from './highlightClass';
import { HighlightList } from './highlightList';


@Injectable({
  providedIn: 'root'
})
export class HighlightsService {

  // Pulls chat log from Twitch
  // Parses log to create list of highlights
  // Passes highlights list to highlights.component.ts, which does filtering and sorting
  // This should be done async, show loading area on view while waiting

  constructor() { }

  getHighlights(): Observable<Highlight[]> {
    return of(HighlightList);
  }
}
