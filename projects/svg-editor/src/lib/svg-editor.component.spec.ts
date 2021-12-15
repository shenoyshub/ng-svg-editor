import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SvgEditorComponent } from './svg-editor.component';

describe('SvgEditorComponent', () => {
  let component: SvgEditorComponent;
  let fixture: ComponentFixture<SvgEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SvgEditorComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create svg editor component', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', (done) => {
    component.ngOnInit();
    spyOn(component, 'generateMaskForSvgElements').and.callThrough();
    setTimeout(() => {
      expect(component.generateMaskForSvgElements).toHaveBeenCalled();
      done();
    }, 1000);
  });

  it('should create SVG element based on input params', (done) => {
    const _svgString = '<svg height="30" width="200"><text x="0" y="15" fill="red">Sample SVG String</text></svg>';
    component.svgContent = _svgString;
    fixture.detectChanges();
    const svgElement = document.getElementById('templateSvg');
    expect(svgElement).toBeTruthy();
    expect(svgElement?.innerHTML).toBe('Sample SVG String');
    done();
  });

  it('should draw edit icon for given SVG file', () => {
    const _svgString = '<svg height="30" width="200"><text x="0" y="15" fill="red">Sample SVG String</text><image href="https://yari-demos.prod.mdn.mozit.cloud/en-US/docs/Web/SVG/Element/image/mdn_logo_only_color.png" height="200" width="200"></image></svg>';
    let _string = component.sanitizeHTML(_svgString);
    component.svgContent = _string as string;
    fixture.detectChanges();
    const svgElement = document.getElementById('templateSvg');
    component.generateMaskForSvgElements();
    expect(svgElement).toBeTruthy();
    expect(document.querySelectorAll('.svg-edit-icon').length).toEqual(2);
  });

  it('should draw edit icon for given SVG file for bigger text element', () => {
    const _svgString = '<svg height="30" width="200"><text x="0" y="15" font-size="2em" fill="red">Sample SVG String</text><image href="https://yari-demos.prod.mdn.mozit.cloud/en-US/docs/Web/SVG/Element/image/mdn_logo_only_color.png" height="200" width="200"></image></svg>';
    let _string = component.sanitizeHTML(_svgString);
    component.svgContent = _string as string;
    fixture.detectChanges();
    const svgElement = document.getElementById('templateSvg');
    component.generateMaskForSvgElements();
    expect(svgElement).toBeTruthy();
    expect(document.querySelectorAll('.svg-edit-icon').length).toEqual(2);
  });

  it('should set element id for provided element', () => {
    const e = { id: 'text' };
    const res = component.setElementId(e, 1, 'text');
    expect(res).toBe('text text_1');
  });

  fit('should draw edit icon for given SVG file for bigger text element', (done) => {
    const _svgString = '<svg height="30" width="200"><text x="0" y="15" font-size="2em" fill="red">Sample SVG String</text><image href="https://yari-demos.prod.mdn.mozit.cloud/en-US/docs/Web/SVG/Element/image/mdn_logo_only_color.png" height="200" width="200"></image></svg>';
    let _string = component.sanitizeHTML(_svgString);
    component.svgContent = _string as string;
    fixture.detectChanges();
    spyOn(component, 'elementClicked').and.callThrough();
    component.generateMaskForSvgElements();
    fixture.detectChanges();
    const _e = fixture.debugElement.query(By.css('#text_0'));
    console.log(_e); // TODO: log!
    _e.triggerEventHandler('click', null);
    // expect(component['elementClicked']).toHaveBeenCalled();
    done();
  });

});

