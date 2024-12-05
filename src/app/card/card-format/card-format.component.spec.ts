import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardFormatComponent } from './card-format.component';

describe('CardFormatComponent', () => {
  let component: CardFormatComponent;
  let fixture: ComponentFixture<CardFormatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardFormatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
