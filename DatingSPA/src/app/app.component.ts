import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DatingSPA';
  weather: any;

  /**
   *
   */
  constructor(private http: HttpClient) {
    this.getWeather();
  }

  getWeather() {
    this.http.get('http://localhost:59909/weatherforecast').subscribe(response =>{
      debugger;
      this.weather = response;
    }, error => {
      console.error(error);
    })
  }
}
