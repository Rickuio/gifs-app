import { HttpClient } from "@angular/common/http";
import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { environment } from "@environments/environment";
import type { GiphyResponse } from "../interfaces/giphy.interfaces";
import { Gif } from "../interfaces/gif.interface";
import { GifMapper } from "../mapper/gif.mapper";
import { map, Observable, tap } from "rxjs";

const GIF_KEY = 'gifs';
const GIF_LIMIT = 20;

const loadGifsLocalStorage = () => {
    const gifsLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}'; // Record<string, gifs[]>
    const gifs = JSON.parse(gifsLocalStorage);
    console.log({LS: gifs});
    return gifs;
}

@Injectable({  providedIn: 'root' })
export class GifService {

    private http = inject(HttpClient);
    
    trendingGifs = signal<Gif[]>([]);
    trendingGifsLoading = signal(false);
    private trendingPage = signal(0);

    trendingGifsGroup = computed<Gif[][]>(() => {
        const groups = [];
        for (let i=0; i<this.trendingGifs().length; i += 3) {
            groups.push(this.trendingGifs().slice(i, i+3));
        }
        //console.log({three: groups});
        return groups;
    });

    // searchHistory = signal<Record<string, Gif[]>>({});
    searchHistory = signal<Record<string, Gif[]>>(loadGifsLocalStorage());
    searchHistoryMenu = computed( () => Object.keys(this.searchHistory()) );
    
    constructor() {
        this.loadNextTrendingGifs();
        //console.log('servicio creado!');
    }

    loadNextTrendingGifs() {

        if (this.trendingGifsLoading()) return;

        this.trendingGifsLoading.set(true);

        this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
            params: {
                api_key: environment.giphyApiKey,
                limit: GIF_LIMIT,
                offset: this.trendingPage() * GIF_LIMIT,
            },
        }).subscribe((resp) => {
            //console.log({resp});
            const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
            //console.log('\nLuego del Mapper: ', {gifs});
            // this.trendingGifs.set(gifs);
            this.trendingGifs.update( current => [...current, ...gifs] );
            this.trendingPage.update( (page) => page + 1);
            this.trendingGifsLoading.set(false);
        });
    }

    searchGifs(query: string): Observable<Gif[]> {
        return this.http
            .get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
                params: {
                    api_key: environment.giphyApiKey,
                    q: query,
                    limit: GIF_LIMIT,
                    offset: 0
                },
            })
            .pipe(
                map((resp) => GifMapper.mapGiphyItemsToGifArray(resp.data)),
                // map ( ({data}) => data), map( (items) => GifMapper.mapGiphyItemsToGifArray(items))
                // TODO: Historial
                tap( items => {
                    this.searchHistory.update( history => ({
                        ...history, [query.toLowerCase()]: items,
                    }));
                })
            );
        // .subscribe((resp) => {
        //     const searchGifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
        //     console.log({searchGifs});
        // });
    }

    // Metodo trae los gifs historicos
    getHistoryGifs(query: string): Gif[] {
        return this.searchHistory()[query] ?? [];
    }
    
    // Efecto para guardar en el local storage
    saveGifsLocalStorage = effect(() => {
        //console.log(`Count items menu: ${this.searchHistoryMenu().length}`)
        //localStorage.setItem('searching', JSON.stringify(this.searchHistoryMenu()) );
        const historyString = JSON.stringify(this.searchHistory());
        localStorage.setItem(GIF_KEY, historyString);
    });

}