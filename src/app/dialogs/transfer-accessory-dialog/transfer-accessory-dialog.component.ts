import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {StrainMetadata} from '../../models/strain.model';
import {ExtendedVaultModel} from '../../models/vault.model';
import {WeedService} from '../../services/weed.service';
import {AccessoryModel} from '../../models/accessory.model';

@Component({
  selector: 'app-transfer-accessory-dialog',
  templateUrl: './transfer-accessory-dialog.component.html',
  styleUrls: ['./transfer-accessory-dialog.component.scss']
})
export class TransferAccessoryDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { accessory: AccessoryModel, vault?: ExtendedVaultModel },
              private weedService: WeedService, private dialogRef: MatDialogRef<TransferAccessoryDialogComponent>) {
  }

  ngOnInit(): void {
  }

  async transfer(receiver: string): Promise<void> {
    this.dialogRef.close();
    if (this.data.vault) {
      await this.weedService.proposeAccessoryTransfer(this.data.accessory, receiver, this.data.vault);
    } else {
      await this.weedService.transferAccessory(this.data.accessory, receiver);
    }
  }

}

