import { Injectable } from '@angular/core';
import {Todo} from '../interfaces/Todo';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import {throwError as observableThrowError} from 'rxjs';
import { DatePipe } from '@angular/common';

const API_URL = environment.apiUrl; 

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  todoTitle: string = '';
  idForTodo: number = 4;
  beforeEditCache: string = '';
  filter: string = 'all';
  
  anyRemainingModel: boolean = true;
  todos: Todo[] = [];

  constructor(private http: HttpClient) { 
    this.todos = this.getTodos();
  }

  getTodos(): Todo[]{
    this.http.get(API_URL)
    .pipe(catchError(this.errorHandler))
    .subscribe((response: any) => {
      this.todos = response;
      console.log(this.todos);
    })
    return this.todos;
  }

  errorHandler(error: HttpErrorResponse) {
    return observableThrowError(error.message || 'something went wrong!');
  }

  addTodo(todoTitle: string): void{
    if(todoTitle.trim().length == 0){
      return;
    }

    
    this.http.post(API_URL, {
      Name: todoTitle,
      isCompleted: false
    })
    .subscribe((response: any) => {
      this.todos.push({
        id: response.id,
        Name: todoTitle,
        isCompleted: false,
        expiryDate: response.date, 
        editing: false
    });
  });

    this.idForTodo++;
  }

  editTodo(todo: Todo): void{
    this.beforeEditCache = todo.Name;
    todo.editing = true;
  }
  
  doneEdit(todo: Todo): void {
    if(this.todoTitle.trim().length == 0){
      todo.Name = this.beforeEditCache;
    }

    this.anyRemainingModel = this.anyRemaining();
    todo.editing = false;

    this.http.patch(API_URL + '/' + todo.id, {
    name: todo.Name,
    completed: todo.isCompleted  
    })
    .subscribe((response: any) => {
       
    })
  }

  cancelEdit(todo: Todo): void{
    todo.Name = this.beforeEditCache;
    todo.editing = false;
  }

  deleteTodo(id: number): void{
    this.todos = this.todos.filter(todo => todo.id != id);

    this.http.delete(API_URL + '/' + id)
    .subscribe((response: any) => {
      this.todos = this.todos.filter(todo => todo.id != id); 
    })
  }
  remaining(): number {
    return this.todos.filter(todo=> !todo.isCompleted).length;
  }
  atLeastOneCompleted(): boolean{
    return this.todos.filter(todo => todo.isCompleted).length > 0;
  }

  clearCompleted(todo: Todo): void {
    this.todos = this.todos.filter(todo => !todo.isCompleted);

    const isCompleted = this.todos
    .filter(todo => todo.isCompleted)
    .map(todo => todo.id)
    
    this.http.request('delete', API_URL + '/' + todo.id, {
      body: {
        todos: isCompleted
      }
    } )
    .subscribe((response: any) => {
      this.todos = this.todos.filter(todo => !todo.isCompleted); 
    })
  }

  checkAllTodos(id: number): void {
  const checkedTodo = (<HTMLInputElement>event.target).checked;
  
    
    this.http.patch(API_URL, {
    isCompleted: true
    })
    .subscribe((response: any) => {
      this.todos.forEach(todo => todo.isCompleted = checkedTodo)
      this.anyRemainingModel = this.anyRemaining();
    })
  }
  
  anyRemaining(): boolean {
    return this.remaining() != 0;
  }

  todosFiltered(): Todo[] {
    if (this.filter == 'all'){
      return this.todos
    } else if (this.filter == 'active'){
      return this.todos.filter(todo => !todo.isCompleted)
    } else if (this.filter == 'completed'){
      return this.todos.filter(todo => todo.isCompleted)
    }

    return this.todos
  }
}
