import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { get } from 'lodash';
import { ColorService } from './color.service';

export interface Example {
  id?: string;
  intentId: string;
  text: string;
  entities: ExamplePart[];
}
export interface ExamplePart {
  entityId: string;
  text: string;
}

const COLORS = [
  '#388c23',
  '#f5cd79',
  '#546de5',
  '#e15f41',
  '#c44569',
  '#7662d5',
  '#f78fb3',
  '#3dc1d3',
  '#aa27a4',
  '#596275',
];

@Component({
  selector: 'hello',
  templateUrl: './hello.component.html',
  styles: ['./hello.component.scss'],
})
export class HelloComponent implements OnInit {
  @Input() name: string;
  @Input() example: Example;

  entitiesColorAccessor: (id: string) => string;
  sanitizeredText: SafeHtml;
  inputText: string;

  constructor(
    private sanitizer: DomSanitizer,
    private colorService: ColorService
  ) {}

  ngOnInit() {
    this.entitiesColorAccessor = this.colorService.initNamespace('entities');
    this.inputText = this.stylingInputExample(this.example);
    this.sanitizeredText = this.getSafeHtml(this.inputText);
  }

  getSafeHtml(text: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(text);
  }

  stylingInputExample(example: Example): string {
    let newText = this.cleanText(example.text);
    const zeroWidthSpace = '\u200B';
    if (get(example, 'entities.length', 0) > 0) {
      example.entities.forEach((entity: ExamplePart, index: number) => {
        // Count occurances of the same entity.text in entities before this one
        const slice = example.entities.slice(0, index);
        let countInEntities = 0;
        slice.forEach(
          (e) => (countInEntities += +e.text.includes(entity.text))
        );
        const re = new RegExp(
          `\\b${this.escapeRegExp(entity.text.toLowerCase())}\\b`,
          'gi'
        );
        // Count in original text without span
        const countInText = (example.text.toLowerCase().match(re) || []).length;
        // Count in new text
        const countInNewText = (newText.toLowerCase().match(re) || []).length;
        const whereToReplace =
          countInNewText > countInText
            ? countInNewText - countInText + countInEntities + 1
            : countInEntities + 1;
        let t = 0;
        newText = newText.replace(re, (match) =>
          ++t === whereToReplace
            ? `<span title="${entity.entityId}" entity-id="${
                entity.entityId
              }" style="background-color: ${this.colorService.hexToRGB(
                this.entitiesColorAccessor(entity.entityId),
                0.25
              )}; padding: 3px 2px; border-radius: 4px;">${
                entity.text
              }</span>${zeroWidthSpace}`
            : match
        );
      });
    }

    return newText;
  }

  private cleanText(text: string) {
    return text
      .replace(/(^\s)|(\s$)/g, '') // trim
      .replace(/(\s\s+)/g, ' ') // remove double spaces
      .replace(/\u200B/g, ''); // remove zero width space
  }

  private escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
