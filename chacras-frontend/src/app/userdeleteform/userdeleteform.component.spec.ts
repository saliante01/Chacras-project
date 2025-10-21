import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserdeleteformComponent } from './userdeleteform.component';

describe('UserdeleteformComponent', () => {
  let component: UserdeleteformComponent;
  let fixture: ComponentFixture<UserdeleteformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserdeleteformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserdeleteformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
