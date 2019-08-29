import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramAssessmentComponent } from './program-assessment.component';

describe('ProgramsOnlineComponent', () => {
  let component: ProgramAssessmentComponent;
  let fixture: ComponentFixture<ProgramAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
