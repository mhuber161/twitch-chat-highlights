import { TestBed, inject } from '@angular/core/testing';

import { HighlightsService } from './highlights.service';

describe('HighlightsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HighlightsService]
    });
  });

  it('should be created', inject([HighlightsService], (service: HighlightsService) => {
    expect(service).toBeTruthy();
  }));
});
