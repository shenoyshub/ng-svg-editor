# NgSvgEditor

[![NG SVG Editor](https://github.com/rajeshkumaravel/ng-svg-editor/actions/workflows/run-test-cc.yml/badge.svg)](https://github.com/rajeshkumaravel/ng-svg-editor/actions/workflows/run-test-cc.yml) ![Coveralls](https://img.shields.io/coveralls/github/rajeshkumaravel/ng-svg-editor?label=Repository) ![Coveralls branch](https://img.shields.io/coveralls/github/rajeshkumaravel/ng-svg-editor/main?label=Branch%3A%20main) ![GitHub](https://img.shields.io/github/license/rajeshkumaravel/ng-svg-editor)
<p>
  <img alt="github actions" src="https://img.shields.io/badge/-Github_Actions-2088FF?style=flat-square&logo=github-actions&logoColor=white" height=25 />
  <img alt="angular" src="https://img.shields.io/badge/-Angular-DD0031?style=flat-square&logo=angular&logoColor=white" height=25 />
  <img alt="TypeScript" src="https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" height=25 />
</p>

`ng-svg-editor` is a lightweight and very complete Angular library for editing SVG template inside any Angular project. It was built for modern browsers using TypeScript, HTML5 and Angular >=12.x.x.

---
## Getting started
How to use svg editor in your projects

## License

This project is licensed under the MIT License. See LICENSE for more information.
## Table of contents

- [Installation](#installation)
- [Import in Angular](#import-in-angular)
- [Options](#options)
- [Handle events](#handle-events)
---

### Installation

```
$ npm install --save PKG_NAME
```

### Import in Angular

```console
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SvgEditorModule } from 'svg-editor';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SvgEditorModule
  ],
  providers: [ ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
```

```console
<svg-editor [togglePreview]="togglePreview" [onEdit]="onEdit" (elementClicked)="elementClicked($event)" [svgContent]="svgStringSanitized"></svg-editor>
```

### Options
svg-editor comes with some parameters / options in order to make it fit your needs. The following parameters / options have to be used like this:

_Note: `image` upload accepts either URL / base64 string_

```console
<svg-editor [parameter-or-option-name]="value"></svg-editor>
```

| Option | Type | Required | Description |
| --- | --- | --- | --- |
| svgContent | @@Input String | **Yes** | SVG content
| icon | @@Input String | **Optional** | SVG edit icon
| onEdit | @Input Observable | **Yes** | Observable Subject to send edited `element`, `type` and `updated value`
| elementClicked | @Output EventEmitter | **Yes** | Event emitter when a SVG element is clicked
| togglePreview | @Input Observable | **Optional** | Observable Subject for preview and edit toggle

### Handle events

```console
<svg-editor [togglePreview]="togglePreview" [onEdit]="onEdit" (elementClicked)="elementClicked($event)" [svgContent]="svgStringSanitized"></svg-editor>
```

#### elementClicked

Handling Event emitted when a SVG element is clicked

```console
@Component({
  // ...
})
export class AppComponent {
  onEdit: Subject<any> = new Subject();
  selectedElement: any;
  constructor() {
  }

  public elementClicked(e: any) {
    this.selectedElement = e;
    if (e.type == 'text') {
      // If element clicked is `text`; execute editText method
      this.editText(e);
    } else {
      // If element clicked is `image`; execute imageUpload method
      this.imageUpload();
    }
  }
}
```

#### onEdit

Observable Subject to send edited `element`, `type` and `updated value`

```console
@Component({
  // ...
})
export class AppComponent {
  onEdit: Subject<any> = new Subject();
  selectedElement: any;
  constructor() {
  }

  public elementClicked(e: any) {
    this.selectedElement = e;
    if (e.type == 'text') {
      // If element clicked is `text`; execute editText method
      this.editText(e);
    } else {
      // If element clicked is `image`; execute imageUpload method
      this.imageUpload();
    }
  }

  public editText(e: any) {
    let inputText = prompt("Provide updated value", e.element.textContent);
    if (inputText) {
      this.onEdit.next({
        element: e.element,
        type: 'text',
        value: inputText
      });
    }
  }

  imageUpload() {
    let text = "Upload image with URL; select cancel to upload image from your computer";
    if (confirm(text) == true) {
      let inputText = prompt("Provide image URL value");
      if (inputText) {
        this.onEdit.next({
          element: this.selectedElement.element,
          type: 'image',
          value: inputText
        });
      }
    } else {
      this.onEdit.next({
        element: this.selectedElement.element,
        type: 'image',
        value: <BASE_64 STRING>
      });
    }
  }
}
```

#### togglePreview

Toggle preview and edit on SVG template

```console
  <div class="d-inline-flex flex-column mx-2">
    <h4>Toggle Edit / Preview</h4>
    <button *ngIf="previewButton == 'show'" type="button" class="btn btn-primary" (click)="toggleSVGPreview()">Preview</button>
    <button *ngIf="previewButton == 'hide'" type="button" class="btn btn-primary" (click)="toggleSVGPreview()">Edit</button>
  </div>
```

```console
@Component({
  // ...
})
export class AppComponent {
  togglePreview: Subject<any> = new Subject();
  previewButton: string;
  constructor() {
    this.previewButton = 'show';
  }

  public toggleSVGPreview() {
    this.previewButton = this.previewButton == 'show' ? 'hide' : 'show';
    this.togglePreview.next(this.previewButton);
  }
}
```
