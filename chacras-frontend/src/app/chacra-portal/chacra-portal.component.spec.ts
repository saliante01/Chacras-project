import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChacraPortalComponent } from './chacra-portal.component';

describe('ChacraPortalComponent', () => {
  let component: ChacraPortalComponent;
  let fixture: ComponentFixture<ChacraPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChacraPortalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChacraPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
