import { Component } from '@angular/core';
import { MyApiService } from 'src/app/my-api.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  footerLink: string[] = ['Features', 'About', 'Testimonials', 'Contact', 'Download'];
  version?: any
  constructor(private myApiService : MyApiService){}

  ngOnInit(): void {
    this.getData();
    
    
  }

  getData(){
    this.myApiService.getData().subscribe((data: any)=>{
      this.version = data.tag;
      console.log("********DATA************", data.tag)
    })
  }
}


