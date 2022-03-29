import { Component, Input, OnInit } from '@angular/core';
import { StrainMetadataExtended, StrainzModel } from '../../models/strain.model';
import { rgbaToHex } from '@angular-material-components/color-picker';

@Component({
  selector: 'app-strain-image',
  templateUrl: './strain-image.component.html',
  styleUrls: ['./strain-image.component.scss']
})
export class StrainImageComponent implements OnInit {

  @Input() strain: StrainzModel;
  @Input() height = 300;
  @Input() matCard = false;
  @Input() avatar = false;

  jonIds = [9007, 9018];

  constructor() { }

  ngOnInit(): void {
  }

  getSpecial(id: number): string {
    if (this.jonIds.includes(id)) {
      return 'jon';
    }
    return 'none';
  }

}
