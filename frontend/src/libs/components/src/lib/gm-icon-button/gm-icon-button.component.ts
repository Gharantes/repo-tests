import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { GmIconImage } from "../google-material-icon/gm-icon-image";
import { GmIconType } from "../google-material-icon/gm-icon-type";
import { GmIconComponent } from "../google-material-icon/gm-icon.component";

@Component({
    selector: 'lib-gm-icon-button',
    template: `
        <button (click)="clicked()">
            <lib-gm-icon 
                [type]="type"
                [image]="image"    
            ></lib-gm-icon>
        </button>
    `,
    standalone: true,
    styles: [
    ],
    imports: [CommonModule, GmIconComponent]
})
export class GmIconButtonComponent {
    @Input() type?: GmIconType;
    @Input() image!: GmIconImage;

    @Output() click = new EventEmitter<void>();
    public clicked() {
        this.click.emit();
    }
}