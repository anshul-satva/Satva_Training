import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutCompo } from './about-compo';

describe('AboutCompo', () => {
  let component: AboutCompo;
  let fixture: ComponentFixture<AboutCompo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutCompo],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutCompo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
