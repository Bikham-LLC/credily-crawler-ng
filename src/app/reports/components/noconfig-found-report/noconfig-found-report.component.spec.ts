import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoconfigFoundReportComponent } from './noconfig-found-report.component';

describe('NoconfigFoundReportComponent', () => {
  let component: NoconfigFoundReportComponent;
  let fixture: ComponentFixture<NoconfigFoundReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoconfigFoundReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoconfigFoundReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
