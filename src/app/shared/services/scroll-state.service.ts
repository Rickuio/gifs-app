import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ScrollStateService {

    trendingScrollState = signal(0);

    // Una forma alternativa de manejar paginas
    pagesScrollState: Record<string, number> = {
        'page1': 400,
        'page2': 0,
        'about': 50,
        'page9': 200,
    }

}