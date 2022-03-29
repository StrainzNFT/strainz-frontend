import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StrainMetadata } from '../../models/strain.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-connect-dialog',
  templateUrl: './connect-dialog.component.html',
  styleUrls: ['./connect-dialog.component.scss']
})
export class ConnectDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public callback: (web3Provider) => Promise<void>, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  async connectMetamask(): Promise<void> {
    const eth = (window as any).ethereum;
    await this.connect(eth);
  }

  async connectBinance(): Promise<void> {
    const bsc = (window as any).BinanceChain;
    await this.connect(bsc);
  }

  private async connect(web3Provider): Promise<void> {
    if (web3Provider) {
      await this.callback(web3Provider);
    } else {
      this.snackBar.open('Could not connect to Wallet!', 'OK', {duration: 3000});
    }
  }

}
