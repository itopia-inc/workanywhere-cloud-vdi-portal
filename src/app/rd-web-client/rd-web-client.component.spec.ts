import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdWebClientComponent } from './rd-web-client.component';

describe('RdWebClientComponent', () => {
  let component: RdWebClientComponent;
  let fixture: ComponentFixture<RdWebClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RdWebClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RdWebClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
