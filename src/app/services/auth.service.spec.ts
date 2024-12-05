import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check authentication', async () => {
    const authResponse = { message: 'Token is valid' };
    service.checkAuthentication();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/verify`);
    expect(req.request.method).toBe('GET');
    req.flush(authResponse);
  });

  it('should handle login', async () => {
    const loginResponse = { message: 'Login successful' };
    service.login('test@example.com', 'password');
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/signin`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@example.com', password: 'password' });
    req.flush(loginResponse);
  });
});
