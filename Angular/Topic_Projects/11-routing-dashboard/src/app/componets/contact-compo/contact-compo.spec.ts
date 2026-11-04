import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactCompo } from './contact-compo';

describe('ContactCompo', () => {
  let component: ContactCompo;
  let fixture: ComponentFixture<ContactCompo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactCompo],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactCompo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
