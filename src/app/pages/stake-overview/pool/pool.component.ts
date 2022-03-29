import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WeedService } from '../../../services/weed.service';
import { PoolModel } from '../../../models/poolModel';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { PancakeService } from '../../../services/pancake.service';
import { StrainzService } from '../../../services/strainz.service';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss']
})
export class PoolComponent implements OnInit, OnDestroy {

  @Input() poolId: number;
  @Input() v2 = false;

  pool: PoolModel;

  withdrawMode = false;
  poolForm: FormGroup;

  accountSub: Subscription;

  approving = false;
  doing = false;

  visible = true;
  apr: number;

  constructor(private weedService: WeedService, private fb: FormBuilder, private pancakeService: PancakeService, private strainzService: StrainzService) {
  }


  updatePoolForm(): void {
    this.poolForm = this.fb.group({
      deposit: [0],
      withdraw: [0]
    });
  }

  async updatePool(): Promise<void> {
    this.pool = this.v2 ? await this.weedService.getV2Pool(this.poolId) : await this.weedService.getPool(this.poolId);
    if (!this.v2) {
      await this.updateAPR();
    }
  }

  async updateAPR(): Promise<void> {
    this.pancakeService.getAPRofPool(this.pool).subscribe(apr => {
      this.apr = apr;
    });
  }

  get validForm(): boolean {
    if (this.withdrawMode) {
      return this.poolForm?.value?.withdraw > 0 && this.poolForm?.value?.withdraw <= this.pool?.staked;
    } else {
      return this.poolForm?.value?.deposit > 0 && this.poolForm?.value?.deposit <= this.pool?.balance;

    }
  }



  async ngOnInit(): Promise<void> {
    this.updatePoolForm();

    if (!this.v2) {
      this.pool = await this.strainzService.getPublicPool(this.poolId);
      await this.updateAPR();
    } else {
      this.withdrawMode = true;
    }


    const a$ = this.weedService.getAccounts().pipe(map(accounts => accounts?.[0] ?? null));
    this.accountSub = a$.subscribe(async account => {
      if (!account) {
        return;

      }
      await this.updatePool();
      this.updatePoolForm();

    });

  }

  async depositOrWithdraw(): Promise<void> {
    const amount = this.withdrawMode ? this.poolForm.value.withdraw : this.poolForm.value.deposit;

    if (this.withdrawMode) {
      this.doing = true;

      if (!this.v2) {
        await this.weedService.withdrawPool(this.poolId, amount);
      } else {
        await this.weedService.withdrawV2Pool(this.poolId, amount);
      }
    } else {
      this.approving = true;
      await this.weedService.approveLPTokensForPool(this.poolId, amount);
      this.approving = false;
      this.doing = true;

      await this.weedService.despositPool(this.poolId, amount);

    }
    this.doing = false;
    await this.weedService.refreshStrainzTokens();
    await this.updatePool();
  }

  get buttonText(): string {
    if (this.approving) {
      return 'Approving..';
    }
    if (this.doing) {
      return this.withdrawMode ? 'Withdrawing..' : 'Depositing..';
    }

    return this.withdrawMode ? 'Withdraw' : 'Deposit';
  }


  ngOnDestroy(): void {
    this.accountSub?.unsubscribe();
  }

  setMax(): void {
    if (this.withdrawMode) {
      this.poolForm.get('withdraw').setValue(this.pool?.staked);
    } else {
      this.poolForm.get('deposit').setValue(this.pool?.balance);

    }
  }

  get poolname(): string {
    if (this.poolId === 0) {
      return 'STRAINZ / BNB';
    }
    return 'STRAINZ / SEEDZ';
  }

  onToggle(value: boolean): void {
    this.withdrawMode = value;
    this.poolForm.reset();
    this.visible = false;
    setTimeout(() => {
      this.visible = true;
    }, 0);
  }



}
