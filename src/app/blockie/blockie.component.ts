import { Component, Input, OnInit } from '@angular/core';
import makeBlockie from 'ethereum-blockies-base64';

@Component({
  selector: 'app-blockie',
  templateUrl: './blockie.component.html',
  styleUrls: ['./blockie.component.scss']
})
export class BlockieComponent implements OnInit {
  @Input() address: string;

  constructor() { }

  ngOnInit(): void {
  }
  getBlockie(address: string): string {
    return makeBlockie(address);
  }
}
