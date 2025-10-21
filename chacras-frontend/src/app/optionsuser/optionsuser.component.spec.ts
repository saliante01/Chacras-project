import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsuserComponent } from './optionsuser.component';

describe('OptionsuserComponent', () => {
  let component: OptionsuserComponent;
  let fixture: ComponentFixture<OptionsuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionsuserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionsuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
