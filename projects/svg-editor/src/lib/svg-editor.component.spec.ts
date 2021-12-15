import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SvgEditorComponent } from './svg-editor.component';

describe('SvgEditorComponent', () => {
  let component: SvgEditorComponent;
  let fixture: ComponentFixture<SvgEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SvgEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create SVG element based on input params', () => {
    const _svgString = '<svg height="30" width="200"><text x="0" y="15" fill="red">Sample SVG String</text></svg>';
    component.svgContent = _svgString;
    fixture.detectChanges();
    const svgElement = document.getElementById('templateSvg');
    expect(svgElement).toBeTruthy();
    expect(svgElement?.innerHTML).toBe('Sample SVG String');
  });

  it('should draw edit icon for given SVG file', () => {
    const _svgString = '<svg height="30" width="200"><text x="0" y="15" fill="red">Sample SVG String</text></svg>';
    let _string = component.sanitizeHTML(_svgString);
    component.svgContent = _string as string;
    fixture.detectChanges();
    const svgElement = document.getElementById('templateSvg');
    component.generateMaskForSvgElements();
    console.log('_______ ', document.getElementById('templateSvg')); // TODO: log!
    expect(svgElement).toBeTruthy();

  });

});
