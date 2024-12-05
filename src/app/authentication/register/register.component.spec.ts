import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {
      register: jasmine.createSpy('register').and.returnValue(of(true)), // Mock successful registration
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, HttpClientTestingModule, FormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call register on submit with correct data', async () => {
    // Arrange
    component.email = 'test@example.com';
    component.password = 'password123';
    component.confirmPassword = 'password123'; // Assuming there's a confirm password field

    // Act
    await component.onSubmit();

    // Assert
    expect(mockAuthService.register).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('should set errorMessage on failed registration', async () => {
    // Arrange
    const errorMessage = 'An error occurred. Please try again.';
    mockAuthService.register.and.returnValue(throwError({ error: { message: errorMessage } }));

    component.email = 'test@example.com';
    component.password = 'password123';
    component.confirmPassword = 'password123';

    // Act
    await component.onSubmit();

    // Assert
    expect(component.errorMessage).toBe(errorMessage);
  });

  it('should not call register if passwords do not match', async () => {
    // Arrange
    component.email = 'test@example.com';
    component.password = 'password123';
    component.confirmPassword = 'differentPassword';

    // Act
    await component.onSubmit();

    // Assert
    expect(mockAuthService.register).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Passwords do not match');
  });
});
