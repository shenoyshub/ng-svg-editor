import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs/internal/Subject';

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
    component.onEdit = new Subject();
    fixture.detectChanges();
  });

  afterEach(() => {
    // spyOn(component, 'ngOnDestroy').and.callFake(() => { });
    fixture.destroy();
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

  it('should set element id for provided element', () => {
    const e = { id: 'text' };
    const res = component.setElementId(e, 1, 'text');
    expect(res).toBe('text text_1');
  });

  describe('Create mask or draw edit icon for given SVG file input', () => {

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

  });

  describe('Element Click methods', () => {

    it('should call element click output emit event', () => {
      spyOn(component.elementClicked, 'emit').and.callThrough();
      const svgElement = { id: 'text_0', textContent: 'Sample SVG String' };
      const type = 'text';
      component.svgElementClicked(svgElement, type);
      expect(component.elementClicked.emit).toHaveBeenCalledWith({
        element: svgElement,
        type: type
      });
    });

  });

  describe('SVG element update value and redraw icon', () => {

    it('should update `text` SVG element with new value', () => {
      const _svgString = '<svg height="30" width="200"><text x="0" y="15" font-size="2em" fill="red">Sample SVG String</text><image href="https://yari-demos.prod.mdn.mozit.cloud/en-US/docs/Web/SVG/Element/image/mdn_logo_only_color.png" height="200" width="200"></image></svg>';
      let _string = component.sanitizeHTML(_svgString);
      component.svgContent = _string as string;
      fixture.detectChanges();
      component.generateMaskForSvgElements();
      const svgElement = document.getElementById('text_0');
      const newValue = 'updated text tag value';
      component.updateSVGTag(svgElement, 'text', newValue);
      const res = document.getElementById('text_0')?.textContent;
      expect(res).toEqual(newValue);
    });

    it('should update `image` SVG element with new value', () => {
      const _svgString = '<svg height="30" width="200"><text x="0" y="15" font-size="2em" fill="red">Sample SVG String</text><image href="https://yari-demos.prod.mdn.mozit.cloud/en-US/docs/Web/SVG/Element/image/mdn_logo_only_color.png" height="200" width="200"></image></svg>';
      let _string = component.sanitizeHTML(_svgString);
      component.svgContent = _string as string;
      fixture.detectChanges();
      component.generateMaskForSvgElements();
      const svgElement = document.getElementById('image_0');
      const newValue = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYBAMAAACDuy0HAAAAG1BMVEX/wQeAgIDvuBafkGG/oEPfsCWvmFLPqDSPiHCaVabLAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAdklEQVRIiWNgGAWjYBSMglEwCkYBGUBZWMnQCMZUACJ8ik1UjJ2cYUwDIMKnWIhJUEGRgcGN3QDIFAAiIkzW0FAgwuRAwVBBUQYGljYQMwCIiDCZSZQEN7MZM5Di5gAiTIaGcwowNAiH8ygYBaNgFIyCUTAYAQBzNRHuWxEUOAAAAABJRU5ErkJggg==';
      component.updateSVGTag(svgElement, 'image', newValue);
      const res = document.getElementById('image_0')?.getAttribute('xlink:href');
      expect(res).toEqual(newValue);
    });

    it('should update `image` SVG element with new value and redraw icon', () => {
      const _svgString = '<svg height="30" width="200"><text x="0" y="15" font-size="2em" fill="red">Sample SVG String</text><image href="https://yari-demos.prod.mdn.mozit.cloud/en-US/docs/Web/SVG/Element/image/mdn_logo_only_color.png" height="200" width="200"></image></svg>';
      let _string = component.sanitizeHTML(_svgString);
      component.svgContent = _string as string;
      fixture.detectChanges();
      component.generateMaskForSvgElements();
      const svgElement = document.getElementById('image_0');
      const newValue = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYBAMAAACDuy0HAAAAG1BMVEX/wQeAgIDvuBafkGG/oEPfsCWvmFLPqDSPiHCaVabLAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAdklEQVRIiWNgGAWjYBSMglEwCkYBGUBZWMnQCMZUACJ8ik1UjJ2cYUwDIMKnWIhJUEGRgcGN3QDIFAAiIkzW0FAgwuRAwVBBUQYGljYQMwCIiDCZSZQEN7MZM5Di5gAiTIaGcwowNAiH8ygYBaNgFIyCUTAYAQBzNRHuWxEUOAAAAABJRU5ErkJggg==';
      component.updateSVGTag(svgElement, 'image', newValue);
      const updatedSvgElement: any = document?.getElementById('image_0');
      spyOn(component, 'updateSVGRectBoundary').and.callThrough();
      component.updateSVGRectBoundary(updatedSvgElement);
      expect(component.updateSVGRectBoundary).toHaveBeenCalledWith(updatedSvgElement);
    });

  });
});


