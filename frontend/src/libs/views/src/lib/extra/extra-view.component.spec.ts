import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExtraViewComponent } from './extra-view.component';

describe('ExtraComponent', () => {
  let component: ExtraViewComponent;
  let fixture: ComponentFixture<ExtraViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtraViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExtraViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
