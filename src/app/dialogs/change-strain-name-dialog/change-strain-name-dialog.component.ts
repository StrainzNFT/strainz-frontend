import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {StrainzModel} from '../../models/strain.model';
import {WeedService} from '../../services/weed.service';

@Component({
  selector: 'app-change-strain-name-dialog',
  templateUrl: './change-strain-name-dialog.component.html',
  styleUrls: ['./change-strain-name-dialog.component.scss']
})
export class ChangeStrainNameDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: StrainzModel, private weedService: WeedService,
              private dialogRef: MatDialogRef<ChangeStrainNameDialogComponent>) { }

  changing = false;

  ngOnInit(): void {
  }

  async changeName(prefix: string, postfix: string): Promise<void> {
    this.changing = true;
    await this.weedService.changeStrainName(this.data, prefix, postfix);
    this.changing = false;
    this.dialogRef.close();
  }
}
