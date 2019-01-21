import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Todo } from '../../interfaces/Todo';
import { TodoService } from '../../services/todo.service';
//import { EventEmitter } from 'events';

@Component({
  selector: 'todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent implements OnInit {

  @Input() todo:Todo;
  constructor(private todoService: TodoService) { }

  ngOnInit() {
  }
}
