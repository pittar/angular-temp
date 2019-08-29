import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramsAvailableComponent } from './programs-available.component';

describe('ProgramsAvailableComponent', () => {
  let component: ProgramsAvailableComponent;
  let fixture: ComponentFixture<ProgramsAvailableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramsAvailableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramsAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
