import {ErrorHandler, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler{

  constructor() { }

  handleError(error: any): void {
    console.log('An error occurred', error)
  }
}
