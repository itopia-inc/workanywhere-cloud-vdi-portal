import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopClientComponent } from './desktop-client.component';

describe('DesktopClientComponent', () => {
  let component: DesktopClientComponent;
  let fixture: ComponentFixture<DesktopClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
