import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Task } from './Task';
import { MessageService } from './message.service';


@Injectable({ providedIn: 'root' })
export class TaskService {

  private TasksUrl = 'api/Tasks';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET Tasks from the server */
  getTasks (): Observable<Task[]> {
    return this.http.get<Task[]>(this.TasksUrl)
      .pipe(
        tap(_ => this.log('fetched Tasks')),
        catchError(this.handleError<Task[]>('getTasks', []))
      );
  }

  /** GET Task by id. Return `undefined` when id not found */
  getTaskNo404<Data>(id: number): Observable<Task> {
    const url = `${this.TasksUrl}/?id=${id}`;
    return this.http.get<Task[]>(url)
      .pipe(
        map(Tasks => Tasks[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} Task id=${id}`);
        }),
        catchError(this.handleError<Task>(`getTask id=${id}`))
      );
  }

  /** GET Task by id. Will 404 if id not found */
  getTask(id: number): Observable<Task> {
    const url = `${this.TasksUrl}/${id}`;
    return this.http.get<Task>(url).pipe(
      tap(_ => this.log(`fetched Task id=${id}`)),
      catchError(this.handleError<Task>(`getTask id=${id}`))
    );
  }

  /* GET Tasks whose name contains search term */
  searchTasks(term: string): Observable<Task[]> {
    if (!term.trim()) {
      // if not search term, return empty Task array.
      return of([]);
    }
    return this.http.get<Task[]>(`${this.TasksUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found Tasks matching "${term}"`) :
         this.log(`no Tasks matching "${term}"`)),
      catchError(this.handleError<Task[]>('searchTasks', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new Task to the server */
  addTask (Task: Task): Observable<Task> {
    return this.http.post<Task>(this.TasksUrl, Task, this.httpOptions).pipe(
      tap((newTask: Task) => this.log(`added Task w/ id=${newTask.id}`)),
      catchError(this.handleError<Task>('addTask'))
    );
  }

  /** DELETE: delete the Task from the server */
  deleteTask (Task: Task | number): Observable<Task> {
    const id = typeof Task === 'number' ? Task : Task.id;
    const url = `${this.TasksUrl}/${id}`;

    return this.http.delete<Task>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted Task id=${id}`)),
      catchError(this.handleError<Task>('deleteTask'))
    );
  }

  /** PUT: update the Task on the server */
  updateTask (Task: Task): Observable<any> {
    return this.http.put(this.TasksUrl, Task, this.httpOptions).pipe(
      tap(_ => this.log(`updated Task id=${Task.id}`)),
      catchError(this.handleError<any>('updateTask'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a TaskService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`TaskService: ${message}`);
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/