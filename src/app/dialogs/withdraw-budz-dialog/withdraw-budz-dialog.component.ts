import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WeedService } from '../../services/weed.service';
import { ExtendedVaultModel } from '../../models/vault.model';

@Component({
  selector: 'app-withdraw-budz-dialog',
  templateUrl: './withdraw-budz-dialog.component.html',
  styleUrls: ['./withdraw-budz-dialog.component.scss']
})
export class WithdrawBudzDialogComponent implements OnInit {

  withdrawForm: FormGroup;

  proposing = false;


  constructor(@Inject(MAT_DIALOG_DATA) public data: {balance: number, vault: ExtendedVaultModel},
              private fb: FormBuilder, private weedService: WeedService, private dialogRef: MatDialogRef<WithdrawBudzDialogComponent>) { }

  ngOnInit(): void {
    this.withdrawForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      receiver: ['', [Validators.required, Validators.minLength(42), Validators.maxLength(42)]]
    });
  }
  async withdraw(): Promise<void> {
    this.proposing = true;
    try {
      await this.weedService.proposeStrainzTokensTransfer(
        this.data.vault, this.withdrawForm.value.receiver, +this.withdrawForm.value.amount
      );
      this.dialogRef.close();
    } catch {

    }
    this.proposing = false;

  }


}
