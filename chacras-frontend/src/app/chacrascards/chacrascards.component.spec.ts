import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChacrascardsComponent } from './chacrascards.component';

describe('ChacrascardsComponent', () => {
  let component: ChacrascardsComponent;
  let fixture: ComponentFixture<ChacrascardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChacrascardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChacrascardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
