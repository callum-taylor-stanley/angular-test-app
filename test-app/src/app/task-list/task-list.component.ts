import { Component, OnInit } from '@angular/core';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { TaskService } from 'src/task.service';
import { Task, Status } from 'src/Task';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {  
  tasks: Task[];
  faPlusCircle = faPlusCircle;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.getTasks();
  }

  isToDo(id: number) {
    this.tasks.find(task => task.id === id).status === Status.TO_DO;
  }

  addTask() {
  }

  persistTask(description: string) {
    this.taskService.addTask({description} as Task)
    .subscribe(tasks => {
      this.tasks.push(tasks);
    });

  }

  getTasks(): void {
    this.taskService.getTasks()
    .subscribe(tasks => this.tasks = tasks);
  }

}
