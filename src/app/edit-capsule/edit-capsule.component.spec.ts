import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCapsuleComponent } from './edit-capsule.component';

describe('EditCapsuleComponent', () => {
  let component: EditCapsuleComponent;
  let fixture: ComponentFixture<EditCapsuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCapsuleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditCapsuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
