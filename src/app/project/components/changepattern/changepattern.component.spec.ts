import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangepatternComponent } from './changepattern.component';

describe('ChangepatternComponent', () => {
  let component: ChangepatternComponent;
  let fixture: ComponentFixture<ChangepatternComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangepatternComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangepatternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
