import { Component, OnInit } from '@angular/core';
import { WeedService } from './services/weed.service';
import { PancakeService } from './services/pancake.service';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(private weedService: WeedService, private pancakeService: PancakeService) {
  }

  // @HostBinding('class') className = ''; //

  // toggleControl = new FormControl(false); //

  async ngOnInit(): Promise<void> {
    await this.weedService.init();
    await this.pancakeService.init();
  }
}
