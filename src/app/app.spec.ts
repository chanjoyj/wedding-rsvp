import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { App } from './app';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let app: App;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should render the wedding RSVP heading', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('RSVP');
    expect(compiled.textContent).toContain('Please join us');
  });

  it('should keep the submit button disabled until required guest details are filled', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const submitButton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;

    expect(submitButton.disabled).toBe(true);

    const setInputValue = (selector: string, value: string) => {
      const element = fixture.debugElement.query(By.css(selector)).nativeElement as HTMLInputElement | HTMLSelectElement;
      element.value = value;
      element.dispatchEvent(new Event('input'));
      element.dispatchEvent(new Event('blur'));
    };

    setInputValue('#fullName', 'Jane Doe');
    setInputValue('#phone', '+1 234 567 890');
    setInputValue('#email', 'jane@example.com');

    const attending = fixture.debugElement.query(By.css('#attending')).nativeElement as HTMLSelectElement;
    attending.value = 'Yes';
    attending.dispatchEvent(new Event('change'));
    attending.dispatchEvent(new Event('blur'));

    fixture.detectChanges();
    expect(submitButton.disabled).toBe(false);
  });
});
