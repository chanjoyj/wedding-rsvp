import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { RsvpData } from './rsvp-data';

export interface RsvpResponse {
  status: 'success' | 'error';
  message?: string;
  data?: unknown[];
}

@Service()
export class Rsvp {
  private readonly url = environment.googleScriptUrl;
  private readonly http = inject(HttpClient);

  submit(data: RsvpData): Observable<RsvpResponse> {
    const payload = {
      name: data.fullName,
      email: data.email,
      message: JSON.stringify({
        phone: data.phone,
        attending: data.attending,
        tripPreference: data.tripPreference,
        flightStatus: data.flightStatus,
        arrival: data.arrival,
        departure: data.departure,
        specialRequests: data.specialRequests,
        noteForCouple: data.noteForCouple,
      }),
    };

    return this.http.post<RsvpResponse>(this.url, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
