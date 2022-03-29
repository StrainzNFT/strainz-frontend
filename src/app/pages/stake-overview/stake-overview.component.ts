import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { WeedService } from '../../services/weed.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-stake-overview',
  templateUrl: './stake-overview.component.html',
  styleUrls: ['./stake-overview.component.scss']
})
export class StakeOverviewComponent implements OnInit {
  account$ = this.weedService.getAccounts().pipe(map(accounts => accounts?.[0] ?? null));






  constructor(private weedService: WeedService, private fb: FormBuilder) { }

  ngOnInit(): void {

  }

  async onboard(): Promise<void> {
    await this.weedService.onboardUser();
  }

}
