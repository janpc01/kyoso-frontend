import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CardService } from '../../services/card.service';
import { CardFormatComponent } from '../card-format/card-format.component';
import { Router } from '@angular/router';
import { ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';



@Component({
  selector: 'app-card-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageCropperComponent],
  templateUrl: './card-create.component.html',
  styleUrls: ['./card-create.component.css'],
})
export class CardCreateComponent {
  card: any = {
    name: '',
    beltRank: '',
    achievement: '',
    clubName: '',
    image: ''
  };

  selectedImage: File | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  previewImage: string | null | undefined = '../assets/images/placeholder.jpg';
  imageChangedEvent: any = '';
  showCropper = false;

  constructor(private http: HttpClient, private authService: AuthService, private cardService: CardService, private router: Router) {}

  onImageSelected(event: any): void {
    console.log('Image selection started:', {
      type: event.target.files[0]?.type,
      size: event.target.files[0]?.size
    });
    
    this.imageChangedEvent = event;
    this.showCropper = true;
    console.log('Cropper modal opened');
  }

  async imageCropped(event: ImageCroppedEvent) {
    console.log('Image cropping event triggered', event);
    
    if (!event) {
      console.warn('No event data received from cropper');
      return;
    }
    
    try {
      if (event.base64) {
        // Handle base64 data
        this.previewImage = event.base64;
        const base64Data = event.base64.includes('base64,') 
          ? event.base64.split('base64,')[1] 
          : event.base64;
        this.card.image = base64Data;
      } else if (event.blob) {
        // Convert blob to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          this.previewImage = base64data;
          const base64Clean = base64data.split('base64,')[1];
          this.card.image = base64Clean;
          console.log('Blob converted to base64:', {
            fullLength: base64data.length,
            cleanLength: base64Clean.length
          });
        };
        reader.readAsDataURL(event.blob);
      } else {
        console.warn('No usable image data in crop event', event);
      }
    } catch (error) {
      console.error('Error processing cropped image:', error);
    }
  }

  imageLoaded(image: LoadedImage) {
    console.log('Image loaded into cropper:', {
      originalSize: image.original.size
    });
  }

  cropperReady() {
    console.log('Cropper initialized and ready');
  }

  loadImageFailed() {
    console.error('Failed to load image into cropper');
    alert('Failed to load image. Please try another image.');
    this.showCropper = false;
    this.imageChangedEvent = null;
  }

  finishCropping() {
    this.showCropper = false;
  }

  saveCrop() {
    console.log('Save crop initiated');
    
    if (!this.previewImage) {
      console.warn('No image data available to save');
      alert('No image to save');
      return;
    }

    console.log('Image data check:', {
      hasPreviewImage: !!this.previewImage,
      cardImageLength: this.card.image?.length,
      isBase64Prefixed: this.card.image?.startsWith('data:image')
    });
     
    if (!this.card.image.startsWith('data:image')) {
      console.log('Adding base64 prefix to image data');
      this.card.image = `data:image/jpeg;base64,${this.card.image}`;
      this.previewImage = this.card.image;
    }
    
    // Close the cropper
    this.showCropper = false;
    this.imageChangedEvent = null;
    console.log('Crop saved and modal closed');
  }

  cancelCrop() {
    console.log('Crop cancelled');
    this.showCropper = false;
    this.imageChangedEvent = null;
    this.previewImage = null;
    this.card.image = '';
    console.log('Cropper state reset');
  }

  async composeCard(): Promise<void> {
    console.log('Card composition started');
    
    // Validate required fields
    if (!this.card.name || !this.card.beltRank || !this.card.achievement || !this.card.clubName) {
      console.warn('Missing required fields:', {
        name: !!this.card.name,
        beltRank: !!this.card.beltRank,
        achievement: !!this.card.achievement,
        clubName: !!this.card.clubName
      });
      alert('Please fill in all required fields');
      return;
    }

    if (!this.card.image) {
      console.warn('No image selected');
      alert('Please select an image');
      return;
    }

    try {
      console.log('Starting image processing');
      
      // Check if the user is authenticated
      const isAuthenticated = await this.authService.checkAuthentication();
      console.log('Authentication status:', isAuthenticated);
      
      if (!isAuthenticated) {
        console.warn('User not authenticated, redirecting to login');
        alert('Please login to create a card');
        localStorage.setItem('redirectAfterLogin', '/profile');
        await this.router.navigate(['/login']);
        return;
      }

      // Convert the image to base64
      console.log('Converting image to base64');
      const response = await fetch(this.card.image);
      const blob = await response.blob();
      console.log('Image blob created:', {
        type: blob.type,
        size: blob.size
      });

      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(',')[1];
          console.log('Base64 conversion complete:', {
            resultLength: base64String.length
          });
          resolve(base64String);
        };
        reader.readAsDataURL(blob);
      });

      // Send the card with the base64 image
      const cardData = {
        ...this.card,
        image: base64Image
      };
      
      console.log('Sending card data to server:', {
        imageSize: base64Image.length,
        hasRequiredFields: true
      });

      await this.cardService.createCard(cardData);
      console.log('Card created successfully');

      alert('Card created successfully!');
      await this.router.navigate(['/profile']);
    } catch (err: any) {
      console.error('Error creating card:', err);

      if (err.status === 401) {
        console.warn('Authentication error, redirecting to login');
        localStorage.setItem('redirectAfterLogin', '/profile');
        await this.router.navigate(['/login']);
      } else {
        alert('Error creating card. Please try again with a smaller image.');
      }
    }
  }  
}
