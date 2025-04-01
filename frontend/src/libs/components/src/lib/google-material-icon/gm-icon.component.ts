import { Component, Input } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { GmIconType } from "./gm-icon-type";
import { GmIconImage } from "./gm-icon-image";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'lib-gm-icon',
    template: `
        <mat-icon [ngClass]="getClass()">{{ image }}</mat-icon>
    `,
    standalone: true,
    styles: [`
        :host {
            display: flex;
            justify-content: center;
            align-items: center;
            height: min-content;
            width: min-content;
        }   
    `],
    imports: [MatIcon, CommonModule]
})
export class GmIconComponent {
    @Input() type?: GmIconType = 'outlined';

    @Input() image!: GmIconImage;
    public getClass() {
        if (this.type == 'outlined') {
            return 'material-symbols-outlined';
        } else if (this.type == 'rounded') {
            return 'material-symbols-rounded';
        } else if (this.type == 'sharp') {
            return 'material-symbols-sharp';
        } else {
            return '';
        }
    }
}