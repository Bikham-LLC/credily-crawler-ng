import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedConfigReportComponent } from './failed-config-report.component';

describe('FailedConfigReportComponent', () => {
  let component: FailedConfigReportComponent;
  let fixture: ComponentFixture<FailedConfigReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FailedConfigReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FailedConfigReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
