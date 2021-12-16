import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import * as _ from 'lodash-es';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'svg-editor',
  template: `<div *ngIf='svgContent' id='templateSvg' [innerHTML]='svgContent'></div>`,
  styles: []
})

export class SvgEditorComponent implements OnInit, OnDestroy {
  showPreviewButton: boolean = false;

  ICON_STRING: string = 'M 18.414062 2 C 18.158062 2 17.902031 2.0979687 17.707031 2.2929688 L 5 15 C 5 15 6.005 15.005 6.5 15.5 C 6.995 15.995 6.984375 16.984375 6.984375 16.984375 C 6.984375 16.984375 8.003 17.003 8.5 17.5 C 8.997 17.997 9 19 9 19 L 21.707031 6.2929688 C 22.098031 5.9019687 22.098031 5.2689063 21.707031 4.8789062 L 19.121094 2.2929688 C 18.926094 2.0979688 18.670063 2 18.414062 2 z M 18.414062 4.4140625 L 19.585938 5.5859375 L 18.537109 6.6347656 L 17.365234 5.4628906 L 18.414062 4.4140625 z M 15.951172 6.8769531 L 17.123047 8.0488281 L 9.4609375 15.710938 C 9.2099375 15.538938 8.9455469 15.408594 8.6855469 15.308594 C 8.5875469 15.050594 8.4590625 14.789063 8.2890625 14.539062 L 15.951172 6.8769531 z M 3.6699219 17 L 3 21 L 7 20.330078 L 3.6699219 17 z';
  @Input() svgContent!: String;
  @Input() onEdit!: Subject<any>;
  @Output() elementClicked = new EventEmitter();
  constructor(private sanitized: DomSanitizer) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.generateMaskForSvgElements();
    }, 1000);
    if (this.onEdit) {
      this.onEdit.subscribe(data => {
        this.updateSVGTag(_.get(data, 'element'), _.get(data, 'type'), _.get(data, 'value'));
      });
    }
  }

  ngOnDestroy() {
    this.onEdit.unsubscribe();
  }

  generateMaskForSvgElements() {
    let textElement = document.getElementById('templateSvg')?.querySelectorAll('text');
    textElement?.forEach((svgElement, index) => {
      let _elementId = this.setElementId(svgElement, index, 'text');

      // Pen icon height
      let editIconHeight = 25;

      // Set custom id for SVG element
      svgElement.setAttribute('id', _elementId);

      // Determine the coordinates of the text tag
      let bBox = (svgElement as unknown as SVGSVGElement).getBBox();

      // Create pen icon wrap for text
      let svgTag = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgTag.setAttribute('x', (bBox['x'] + bBox['width']).toString());

      // Calculate icon position based on text element height
      if (bBox['height'] > 30) {
        let _iconSpace = (bBox['height'] - editIconHeight);
        svgTag.setAttribute('y', (bBox['y'] + (_iconSpace / 2)).toString());
      } else {
        svgTag.setAttribute('y', (bBox['y']).toString());
      }
      svgTag.setAttribute('height', '50');
      svgTag.setAttribute('width', '50');
      svgTag.setAttribute('class', 'svg-edit-icon ' + _elementId);

      let editIconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      editIconPath.setAttribute('id', 'pathIdD');
      editIconPath.setAttribute('d', this.ICON_STRING);
      editIconPath.setAttribute('opacity', '1');
      editIconPath.setAttribute('fill', 'red');

      svgTag.append(editIconPath);
      // Add event listener for text
      svgElement.addEventListener('click', (e) => {
        // Modal popup for text input
        this.svgElementClicked(svgElement, 'text');
      });

      // Add pen icon to SVG DOM to end of text tag
      svgElement?.parentNode?.insertBefore(svgTag, svgElement);
    });

    let imageElements = document.getElementById('templateSvg')?.querySelectorAll('image');
    imageElements?.forEach((imageElement, index) => {
      let _elementId = this.setElementId(imageElement, index, 'image');

      // Pen icon height
      let editIconHeight = 25;

      // Set custom id for SVG element
      imageElement.setAttribute('id', _elementId);

      // Determine the coordinates of the image tag
      let bBox = (imageElement as unknown as SVGSVGElement).getBBox();

      // Create pen icon wrap for text
      let svgTag = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgTag.setAttribute('x', (bBox['x'] + bBox['width']).toString());

      // Calculate icon position based on image element height
      if (bBox['height'] > 30) {
        let _iconSpace = (bBox['height'] - editIconHeight);
        svgTag.setAttribute('y', (bBox['y'] + (_iconSpace / 2)).toString());
      } else {
        svgTag.setAttribute('y', (bBox['y']).toString());
      }
      svgTag.setAttribute('height', '50');
      svgTag.setAttribute('width', '50');
      svgTag.setAttribute('class', 'svg-edit-icon ' + _elementId);

      let editIconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      editIconPath.setAttribute('id', 'pathIdD');
      editIconPath.setAttribute('d', this.ICON_STRING);
      editIconPath.setAttribute('opacity', '1');
      editIconPath.setAttribute('fill', 'red');

      svgTag.append(editIconPath);
      // Add event listener for image
      imageElement.addEventListener('click', (e) => {
        // Modal popup for image input
        this.svgElementClicked(imageElement, 'image');
      });

      // Add pen icon to SVG DOM to end of image tag
      imageElement?.parentNode?.insertBefore(svgTag, imageElement);
    });
  }

  svgElementClicked(svgElement: any, type: any) {
    // if (!this.showPreviewButton) return;
    // var selectedSVGObject = {
    //   type: type,
    //   value: svgElement.textContent,
    //   element: svgElement,
    //   svgElement: svgElement
    // };
    // console.table(selectedSVGObject); // TODO: log!
    this.elementClicked.emit({
      type: type,
      element: svgElement
    });
  }

  setElementId(e: any, index: any, type: any) {
    return _.get(e, 'id') ?
      _.get(e, 'id') + ' ' + type + '_' + index :
      type + '_' + index;
  }

  sanitizeHTML(html: any) {
    return this.sanitized.bypassSecurityTrustHtml(html);
  }

  updateSVGTag(element: any, type: string, value: string) {
    const _element = document?.getElementById(_.get(element, 'id'));
    if (_element && type === 'text') {
      _element.textContent = value;
    }
    if (_element && type === 'image')  {
      _element.setAttribute('xlink:href', value);
    }
    this.updateSVGRectBoundary(element);
  }

  updateSVGRectBoundary(svgElement: SVGElement) {
    let element = document.getElementById(_.get(svgElement, 'id'));
    // Determine the coordinates of the text tag
    let bBox = (element as unknown as SVGSVGElement).getBBox();

    // Update edit icon wrap boundaries for text tag
    let svgTag = document.getElementsByClassName(_.get(svgElement, 'id'));
    svgTag[0].setAttribute('x', (bBox['x'] + bBox['width']).toString());
    svgTag[0].setAttribute('y', (bBox['y']).toString());
    svgTag[0].setAttribute('height', '50');
    svgTag[0].setAttribute('width', '50');
  }
}

