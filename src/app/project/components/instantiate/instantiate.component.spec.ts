import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantiateComponent } from './instantiate.component';

describe('InstantiateComponent', () => {
  let component: InstantiateComponent;
  let fixture: ComponentFixture<InstantiateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstantiateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstantiateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
