import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Rsvp } from './rsvp';
import { RsvpData } from './rsvp-data';

describe('Rsvp', () => {
  let service: Rsvp;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Rsvp, provideHttpClient()],
    });

    service = TestBed.inject(Rsvp);
    http = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send JSON data that matches the Apps Script contract', () => {
    const payload: RsvpData = {
      fullName: 'Emily & James',
      phone: '+1 234 567 890',
      email: 'hello@example.com',
      attending: 'Yes',
      tripPreference: 'Banff getaway',
      flightStatus: 'Booked and confirmed',
      arrival: 'AC 123, 14:30',
      departure: 'AC 456, 22:10',
      specialRequests: 'Vegetarian meals',
      noteForCouple: 'We are excited!',
    };

    const postSpy = vi
      .spyOn(http, 'post')
      .mockReturnValue(of({ status: 'success', message: 'Row added!' }));

    service.submit(payload).subscribe();

    expect(postSpy).toHaveBeenCalledTimes(1);
    expect(postSpy.mock.calls[0][0]).toEqual(expect.any(String));
    expect(postSpy.mock.calls[0][1]).toMatchObject({
      name: 'Emily & James',
      email: 'hello@example.com',
      message: JSON.stringify({
        phone: '+1 234 567 890',
        attending: 'Yes',
        tripPreference: 'Banff getaway',
        flightStatus: 'Booked and confirmed',
        arrival: 'AC 123, 14:30',
        departure: 'AC 456, 22:10',
        specialRequests: 'Vegetarian meals',
        noteForCouple: 'We are excited!',
      }),
    });
    expect(postSpy.mock.calls[0][2]).toMatchObject({
      headers: { 'Content-Type': 'application/json' },
    });
  });
});
