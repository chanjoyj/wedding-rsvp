import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { email, form, FormField, required, submit } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { Rsvp } from './rsvp';
import { RsvpData } from './rsvp-data';

const initialModel: RsvpData = {
  fullName: '',
  phone: '',
  email: '',
  attending: '',
  tripPreference: '',
  flightStatus: '',
  arrival: '',
  departure: '',
  specialRequests: '',
  noteForCouple: '',
};

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormField],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly rsvpService = inject(Rsvp);
  readonly model = signal<RsvpData>({ ...initialModel });
  readonly formSubmitted = signal(false);
  readonly submitting = signal(false);
  readonly submitMessage = signal('');
  readonly submitSuccess = signal(false);

  readonly rsvpForm = form(this.model, (s) => {
    required(s.fullName, { message: 'Please enter your full name.' });
    required(s.phone, { message: 'Please add your phone number.' });
    required(s.email, { message: 'Please enter your email address.' });
    email(s.email, { message: 'Please enter a valid email address.' });
    required(s.attending, { message: 'Please tell us if you can attend.' });
    required(s.tripPreference, { message: 'Please choose your trip preference.' });
  });

  readonly canSubmit = computed(() => this.rsvpForm().valid() && !this.submitting());

  protected async save(event: Event): Promise<void> {
    event.preventDefault();
    this.formSubmitted.set(true);

    const submitted = await submit(this.rsvpForm, async () => {
      this.submitting.set(true);
      this.submitMessage.set('Submitting…');
      this.submitSuccess.set(false);

      try {
        await firstValueFrom(this.rsvpService.submit(this.rsvpForm().value()));
        this.submitting.set(false);
        this.submitSuccess.set(true);
        this.submitMessage.set('✅ RSVP submitted successfully!');
        this.rsvpForm().reset();
        this.model.set({ ...initialModel });
      } catch (err) {
        this.submitting.set(false);
        this.submitSuccess.set(false);
        this.submitMessage.set('❌ Error submitting. Please try again.');
        console.error(err);
      }
    });

    if (!submitted) {
      this.submitting.set(false);
      this.submitSuccess.set(false);
      this.submitMessage.set('Please review the required fields below.');
    }
  }
}
