import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationComponent } from './navigation.component';
import { AuthService } from '../services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {
      isAuthenticated$: of(false), // Mock initial state
      logout: jasmine.createSpy('logout'),
    };

    await TestBed.configureTestingModule({
      imports: [NavigationComponent, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        provideRouter([]), // Use `provideRouter` to supply routes
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display login link when not authenticated', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('a[href="/login"]')).toBeTruthy();
  });

  it('should call logout when logout button is clicked', () => {
    mockAuthService.isAuthenticated$ = of(true); // Mock authenticated state
    fixture.detectChanges();
    const logoutButton = fixture.nativeElement.querySelector('button');
    expect(logoutButton).toBeTruthy();
    logoutButton?.click();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});
