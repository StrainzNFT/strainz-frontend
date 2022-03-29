import {Component, Inject, OnInit} from '@angular/core';
import { StrainMetadata, StrainMetadataExtended } from '../../models/strain.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ExtendedVaultModel} from '../../models/vault.model';
import {WeedService} from '../../services/weed.service';

@Component({
  selector: 'app-compost-dialog',
  templateUrl: './compost-dialog.component.html',
  styleUrls: ['./compost-dialog.component.scss']
})
export class CompostDialogComponent implements OnInit {

  composting = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {strain: StrainMetadataExtended, vault?: ExtendedVaultModel},
              private weedService: WeedService, private dialogRef: MatDialogRef<CompostDialogComponent>) {
  }

  ngOnInit(): void {
  }

  async compost(): Promise<void> {
    this.composting = true;
    try {
      if (this.data.vault) {
        // TODO vault
      } else {
        await this.weedService.compost(this.data.strain);
      }
      this.composting = false;
      this.dialogRef.close();

    } catch {
      this.composting = false;
    }
  }

  displayFn(strain: StrainMetadata | string): string {
    if (!strain) {
      return '';
    }
    if (typeof strain === 'string') {
      return strain;
    }

    return `${strain.prefix} ${strain.postfix}`;
  }

  get compostedSeedsAmount(): number {
    return +this.data.strain.growRate / 10;
  }
}
