import { TestBed } from '@angular/core/testing';

import { SvgEditorService } from './svg-editor.service';

describe('SvgEditorService', () => {
  let service: SvgEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SvgEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
