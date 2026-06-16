import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TriageService } from './triage.service';

describe('TriageService', () => {
  let service: TriageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TriageService],
    });
    service = TestBed.inject(TriageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('sendMessage() should POST to /ai/chat with the correct body', () => {
    const mockResponse = { reply: 'Do you have a fever?', isFinal: false };

    service.sendMessage('headache', null, null).subscribe((res) => {
      expect(res.reply).toBe('Do you have a fever?');
      expect(res.isFinal).toBe(false);
    });

    const req = httpMock.expectOne('http://127.0.0.1:3000/ai/chat');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.message).toBe('headache');
    req.flush(mockResponse);
  });

  it('sendMessage() should read email from the stored JWT', () => {
    const payload = btoa(JSON.stringify({ email: 'patient@test.com' }));
    localStorage.setItem('token', `h.${payload}.s`);

    service.sendMessage('nausea', null, null).subscribe();

    const req = httpMock.expectOne('http://127.0.0.1:3000/ai/chat');
    expect(req.request.body.email).toBe('patient@test.com');
    req.flush({ reply: 'ok', isFinal: false });
  });

  it('sendMessage() should return isFinal: true when diagnosis is complete', () => {
    service.sendMessage('light sensitivity', null, null).subscribe((res) => {
      expect(res.isFinal).toBe(true);
      expect(res.reply).toContain('FINAL DIAGNOSIS');
    });

    const req = httpMock.expectOne('http://127.0.0.1:3000/ai/chat');
    req.flush({ reply: 'FINAL DIAGNOSIS: Migraine', isFinal: true });
  });

  it('resetConversation() should POST to /ai/reset', () => {
    service.resetConversation(null).subscribe();

    const req = httpMock.expectOne('http://127.0.0.1:3000/ai/reset');
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'Chat reset' });
  });
});
