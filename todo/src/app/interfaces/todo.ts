import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { DatePipe } from '@angular/common';

export interface Todo {
    id?: number,
    Name: string,
    isCompleted: boolean,
    expiryDate: Date,
    editing: boolean
}
      

