import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsercreateformComponent } from './usercreateform.component';

describe('UsercreateformComponent', () => {
  let component: UsercreateformComponent;
  let fixture: ComponentFixture<UsercreateformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsercreateformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsercreateformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
