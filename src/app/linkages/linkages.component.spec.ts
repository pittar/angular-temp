import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkagesComponent } from './linkages.component';

describe('LinkagesComponent', () => {
  let component: LinkagesComponent;
  let fixture: ComponentFixture<LinkagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
