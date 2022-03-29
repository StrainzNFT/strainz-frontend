import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { StrainMetadata, StrainzModel } from '../../models/strain.model';
import {WeedService} from '../../services/weed.service';
import {ExtendedVaultModel, VaultModel} from '../../models/vault.model';

@Component({
  selector: 'app-transfer-dialog',
  templateUrl: './transfer-dialog.component.html',
  styleUrls: ['./transfer-dialog.component.scss']
})
export class TransferDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { plant: StrainzModel, vault?: ExtendedVaultModel },
              private weedService: WeedService, private dialogRef: MatDialogRef<TransferDialogComponent>) {
  }

  ngOnInit(): void {
  }

  async transfer(receiver: string): Promise<void> {
    this.dialogRef.close();
    if (this.data.vault) {
      await this.weedService.proposePlantTransfer(this.data.plant, receiver, this.data.vault);
    } else {
      await this.weedService.transferPlant(this.data.plant, receiver);
    }
  }
}
