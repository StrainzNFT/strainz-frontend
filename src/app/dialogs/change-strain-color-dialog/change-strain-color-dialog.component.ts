import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {StrainzModel} from '../../models/strain.model';
import {WeedService} from '../../services/weed.service';
import { hexToRgb } from '../../util';

@Component({
  selector: 'app-change-strain-color-dialog',
  templateUrl: './change-strain-color-dialog.component.html',
  styleUrls: ['./change-strain-color-dialog.component.scss']
})
export class ChangeStrainColorDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: StrainzModel, private weedService: WeedService,
              private dialogRef: MatDialogRef<ChangeStrainColorDialogComponent>) { }

  changing = false;
  color: string;

  ngOnInit(): void {
  }

  async changeColor(): Promise<void> {
    this.changing = true;
    const colors = hexToRgb(this.color);
    await this.weedService.changeStrainColor(this.data, colors);
    this.changing = false;
    this.dialogRef.close();
  }



}
