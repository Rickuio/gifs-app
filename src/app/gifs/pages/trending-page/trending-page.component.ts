import { Component, computed, ElementRef, inject, viewChild } from '@angular/core';
import { GifListComponent } from "../../components/gif-list/gif-list.component";
import { GifService } from '../../services/gifs.service';

const imageUrls: string[] = [
  "https://flowbite.s3.amazonaws.com/docs/gallery/square/image.jpg",
  "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg",
  "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg",
  "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg",
  "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg",
  "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg",
  "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-6.jpg",
  "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-7.jpg",
  "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-8.jpg",
  "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-9.jpg",
  "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-10.jpg",
  "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-11.jpg"
];

@Component({
  selector: 'app-trending-page',
  // imports: [GifListComponent],
  templateUrl: './trending-page.component.html',
})
export default class TrendingPageComponent {
  //images = imageUrls;
  gifService = inject(GifService);
  //images = computed( () => this.gifService.trendingGifs() );
  scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('groupDiv')
  onScroll(event: Event) {
    //console.log(event);
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    //console.log(scrollDiv);
    if (!scrollDiv) return;

    const scrollTop = scrollDiv.scrollTop;
    const clientHeight = scrollDiv?.clientHeight;
    const scrollHeight = scrollDiv?.scrollHeight;
    const isAtBottom = (scrollTop + clientHeight + 100) >= scrollHeight;

    if (isAtBottom) {
      // Cargar siguiente pagina de Gifs
      this.gifService.loadNextTrendingGifs();
    }

  }

}
