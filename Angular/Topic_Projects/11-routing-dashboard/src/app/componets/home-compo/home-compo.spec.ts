import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCompo } from './home-compo';

describe('HomeCompo', () => {
  let component: HomeCompo;
  let fixture: ComponentFixture<HomeCompo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeCompo],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeCompo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
