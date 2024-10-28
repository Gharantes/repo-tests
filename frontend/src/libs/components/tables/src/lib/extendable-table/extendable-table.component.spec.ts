import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExtendableTableComponent } from './extendable-table.component';

describe('ExtendableTableComponent', () => {
  let component: ExtendableTableComponent;
  let fixture: ComponentFixture<ExtendableTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtendableTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExtendableTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
