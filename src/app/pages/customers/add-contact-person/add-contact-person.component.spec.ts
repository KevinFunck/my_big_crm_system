import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContactPersonComponent } from './add-contact-person.component';

describe('AddContactPersonComponent', () => {
  let component: AddContactPersonComponent;
  let fixture: ComponentFixture<AddContactPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddContactPersonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddContactPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
