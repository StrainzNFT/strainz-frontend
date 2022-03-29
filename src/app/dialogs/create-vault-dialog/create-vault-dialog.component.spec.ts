import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVaultDialogComponent } from './create-vault-dialog.component';

describe('CreateVaultDialogComponent', () => {
  let component: CreateVaultDialogComponent;
  let fixture: ComponentFixture<CreateVaultDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateVaultDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVaultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
