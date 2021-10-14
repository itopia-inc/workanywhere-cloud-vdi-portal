import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrdpClientComponent } from './irdp-client.component';

describe('IrdpClientComponent', () => {
  let component: IrdpClientComponent;
  let fixture: ComponentFixture<IrdpClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IrdpClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IrdpClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
