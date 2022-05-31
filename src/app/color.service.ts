import { Injectable } from '@angular/core';

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

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  private namespaces: any;

  constructor() {
    this.namespaces = {};
  }

  initNamespace(namespace: string = 'root-namespace'): (id: string) => string {
    if (!this.namespaces[namespace]) {
      this.namespaces[namespace] = {
        colors: this.shuffleColors([...COLORS]),
        values: {},
        increment: 0,
      };
    }
    return this.getColorAccessor(namespace);
  }

  hexToRGB(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  private getColorAccessor(
    namespace: string = 'root-namespace'
  ): (id: string) => string {
    return (id: string) => {
      return (
        this.namespaces[namespace].values[id] ||
        (this.namespaces[namespace].values[id] = this.getNewColor(namespace))
      );
    };
  }

  private getNewColor(namespace: string): string {
    const notUsedColors = this.namespaces[namespace].colors.filter(
      (color: string) =>
        !Object.keys(this.namespaces[namespace].values).find(
          (key: string) => color === this.namespaces[namespace].values[key]
        )
    );
    this.namespaces[namespace].increment += 1;
    return notUsedColors.length
      ? notUsedColors[0]
      : this.namespaces[namespace].colors[
          this.namespaces[namespace].increment %
            this.namespaces[namespace].colors.length
        ];
  }

  private shuffleColors(colors: string[]): string[] {
    for (let i = colors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colors[i], colors[j]] = [colors[j], colors[i]];
    }
    return colors;
  }
}
