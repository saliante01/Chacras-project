import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateformadminComponent } from './updateformadmin.component';

describe('UpdateformadminComponent', () => {
  let component: UpdateformadminComponent;
  let fixture: ComponentFixture<UpdateformadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateformadminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateformadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
