import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'common-file-input-button',
  template: `
    <div class="file-button-container">
      <span
        *ngIf="label !== undefined && label !== ''"
        style="font-family: sans-serif; font-size: 15px; font-weight: 400; cursor: default"
        >{{ label }}</span
      >

      <div class="wrapper">
        <button
          class="file-btn"
          mat-stroked-button
          [disabled]="isBtnDisabled"
          (click)="fileInput.click()"
        >
          {{ placeholder }}
        </button>
      </div>

      <input
        #fileInput
        (change)="onFileSelected($event)"
        [accept]="allowedFileTypes"
        [multiple]="multiple"
        style="display: none;"
        type="file"
      />
    </div>
  `,
  standalone: true,
  styles: [
    `
      .file-button-container {
        display: flex;
        flex-direction: column;
        max-width: 100%;
        @media (max-width: 640px) {
          max-width: 100%;
        }
        @media (min-width: 641px) {
          width: 100%;
          max-width: 450px;
        }

        .wrapper {
          max-width: 100%;
          display: flex;
          align-items: center;

          .file-btn {
            max-width: 100%;
            width: 100%;
            overflow: hidden;
            padding: 22px 5px 22px 5px;
            text-overflow: ellipsis;
          }

          .mdc-button__label {
            text-overflow: ellipsis;
            padding: 20px;
            max-width: 100%;
            overflow: hidden;
            align-self: center;
          }
        }
      }
    `,
  ],
  imports: [NgIf, MatButton],
})
export class CommonFileInputButtonComponent {
  public placeholder = 'Escolher Arquivo';

  // É o tipo mostrado no filtro dos File Explorers quando apertam para selecionar um arquivo.
  @Input()
  public allowedFileTypes = '';
  @Input()
  public label?: string;
  @Input()
  public multiple = false;
  @Input()
  isBtnDisabled: boolean = false;

  /* Manda o arquivo selecionado e o id do campo para o elemento pai */
  @Output()
  public fileSelectedEvent = new EventEmitter<File>();
  @Output()
  public multipleFilesSelectedEvent = new EventEmitter<File[]>();

  constructor(private readonly _snackbar: MatSnackBar) {}

  private snackbar(msg: string) {
    this._snackbar.open(msg, undefined, { duration: 3000 });
  }
  // { err =  }

  /*
   * Troca o conteúdo do botão para o nome do arquivo
   * e emite o evento avisando o elemento pai que um arquivo foi selecionado.
   */
  protected onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const allowedFileTypes = this.allowedFileTypes.toLowerCase().split(',');

    if (fileInput.files) {
      if (this.multiple) {
        const fileList = fileInput.files;
        const acceptedFiles: File[] = [];
        let fullPathString = '';

        for (let i = 0; i < fileList.length; i++) {
          const file = fileList.item(i);
          if (file) {
            const fileExtension =
              '.' + this.getFileExtension(file.name).toLowerCase();

            if (allowedFileTypes.includes(fileExtension)) {
              fullPathString += (i == 0 ? '' : ', ') + file.name;
              acceptedFiles.push(file);
            } else {
              this.snackbar(
                'Um dos arquivos inseridos possui tipo inválido. Tipos de arquivos aceitos: ' +
                  this.allowedFileTypes
              );
              break;
            }
          }
        }

        this.placeholder = fullPathString;
        this.multipleFilesSelectedEvent.emit(acceptedFiles);
      } else {
        const file = fileInput.files[0];
        const fileExtension =
          '.' + this.getFileExtension(file.name).toLowerCase();

        if (allowedFileTypes.includes(fileExtension)) {
          this.fileSelectedEvent.emit(fileInput.files[0]);
          this.placeholder = fileInput.files[0].name;
        } else {
          this.snackbar(
            'O arquivo inserido possui tipo inválido. Tipos de arquivo aceitos: ' +
              this.allowedFileTypes
          );
        }
      }
    } else {
      this.snackbar('Erro ao obter arquivo(s).');
    }
  }

  public getFileExtension(filename: string) {
    return (
      filename.substring(filename.lastIndexOf('.') + 1, filename.length) ||
      filename
    );
  }
}