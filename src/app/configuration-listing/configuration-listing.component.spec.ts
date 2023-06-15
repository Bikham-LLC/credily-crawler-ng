import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationListingComponent } from './configuration-listing.component';

describe('ConfigurationListingComponent', () => {
  let component: ConfigurationListingComponent;
  let fixture: ComponentFixture<ConfigurationListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
