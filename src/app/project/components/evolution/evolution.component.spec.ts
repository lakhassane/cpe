import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvolutionComponent } from './evolution.component';

describe('EvolutionComponent', () => {
  let component: EvolutionComponent;
  let fixture: ComponentFixture<EvolutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvolutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
