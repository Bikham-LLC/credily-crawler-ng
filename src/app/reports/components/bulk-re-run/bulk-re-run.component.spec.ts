import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkReRunComponent } from './bulk-re-run.component';

describe('BulkReRunComponent', () => {
  let component: BulkReRunComponent;
  let fixture: ComponentFixture<BulkReRunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkReRunComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkReRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
