import { AuthenticationResult } from '@azure/msal-browser';
import { MsalService } from '@azure/msal-angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'My Microsoft Login Example';

  constructor(private authService: MsalService) {}

  ngOnInit(): void {
    // Ensure the MSAL instance is initialized before handling redirect
    this.authService.initialize().subscribe(() => {
      this.authService.instance.handleRedirectPromise().then(res => {
        if (res != null && res.account != null) {
          this.authService.instance.setActiveAccount(res.account);
          this.handleLoginResponse(res);  // Handle and log the response
        }
      }).catch(err => {
        console.error('Error handling redirect promise:', err);
      });
    }, err => {
      console.error('Error initializing MSAL:', err);
    });
  }

  isLoggedIn(): boolean {
    return this.authService.instance.getActiveAccount() != null;
  }

  login() {
    this.authService.loginRedirect();  // Trigger login via redirect
    this.authService.loginPopup()
      .subscribe((response: AuthenticationResult) => {
        this.authService.instance.setActiveAccount(response.account);
        this.handleLoginResponse(response);  // Handle and log the response
      }, err => {
        console.error('Error during login:', err);
      });
  }

  logout() {
    this.authService.logout();  // Trigger logout
  }

  // New method to handle and log the login response
  private handleLoginResponse(response: AuthenticationResult): void {
    const idToken = response.idToken;         // ID Token containing user info
    const accessToken = response.accessToken; // Access Token to access resources
   

    console.log('ID Token:', idToken);
    console.log('Access Token:', accessToken);
    

   
  }
}
