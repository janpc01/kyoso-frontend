import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {
      login: jasmine.createSpy('login').and.returnValue(of(true)),
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule, FormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login on submit', () => {
    component.email = 'test@example.com';
    component.password = 'password';
    component.onSubmit();
    expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', 'password');
  });
});
