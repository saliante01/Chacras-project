import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsadminComponent } from './optionsadmin.component';

describe('OptionsadminComponent', () => {
  let component: OptionsadminComponent;
  let fixture: ComponentFixture<OptionsadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionsadminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionsadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
