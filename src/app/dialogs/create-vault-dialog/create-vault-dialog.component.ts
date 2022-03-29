import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { WeedService } from '../../services/weed.service';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-vault-dialog',
  templateUrl: './create-vault-dialog.component.html',
  styleUrls: ['./create-vault-dialog.component.scss']
})
export class CreateVaultDialogComponent implements OnInit, OnDestroy {

  constructor(private snackBar: MatSnackBar, public dialogRef: MatDialogRef<CreateVaultDialogComponent>, private fb: FormBuilder, private weedService: WeedService, private router: Router) {
  }

  vaultForm: FormGroup;

  creating = false;


  accountSubscription: Subscription;


  get signerArray(): FormArray {
    return this.vaultForm.get('signers') as FormArray;
  }

  getSignerGroup(group: AbstractControl): FormGroup {
    return group as FormGroup;
  }

  get signerOptions(): number[] {
    return Object.keys(this.signerArray.controls).map(key => {
      return +key + 1;
    }).filter(option => option > 1);
  }

  async ngOnInit(): Promise<void> {


    this.vaultForm = this.fb.group({
      name: ['', Validators.required],
      signers: this.fb.array([
        this.fb.group({
          name: ['', Validators.required],
          address: ['', Validators.required]
        }),
        this.fb.group({
          name: ['', Validators.required],
          address: ['', Validators.required]
        })
      ]),
      minSignersNeeded: [2, Validators.min(2)]
    });
    this.accountSubscription = this.weedService.getAccounts().pipe(map(accounts => accounts?.[0] ?? null)).subscribe(account => {
      this.signerArray.at(0).setValue({
        name: '',
        address: account
      });
    });
  }

  addSigner(): void {
    const signerGroup = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required]
    });
    this.signerArray.push(signerGroup);
  }

  removeSigner(index: number): void {
    this.signerArray.removeAt(index);
    const minControl = this.vaultForm.get('minSignersNeeded');
    minControl.setValue(minControl.value > this.signerArray.controls.length ? this.signerArray.controls.length : minControl.value);
  }

  async createVault(): Promise<void> {
    this.creating = true;
    try {
      const newAddress = await this.weedService.createVault(this.vaultForm.value);
      if (newAddress) {
        this.dialogRef.close();
        await this.router.navigateByUrl(`/vaults/${newAddress}`);
      } else {
        this.snackBar.open('Error on Vault creation!', 'OK', {
          duration: 2500
        });
        this.creating = false;
      }
    } catch {
      this.snackBar.open('Error on Vault creation!', 'OK', {
        duration: 2500
      });
      this.creating = false;
    }

  }

  ngOnDestroy(): void {
    this.accountSubscription?.unsubscribe();
  }
}
