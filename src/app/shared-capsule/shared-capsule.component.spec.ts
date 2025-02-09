import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedCapsuleComponent } from './shared-capsule.component';

describe('SharedCapsuleComponent', () => {
  let component: SharedCapsuleComponent;
  let fixture: ComponentFixture<SharedCapsuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedCapsuleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SharedCapsuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
