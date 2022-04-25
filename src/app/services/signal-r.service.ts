import { EventEmitter, Injectable, Output } from '@angular/core';
import * as SignalR from "@microsoft/signalr";
import { Message } from 'src/models/Message';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  @Output()
  public onMessageReceived: EventEmitter<Message> = new EventEmitter();
  
  private hubConnection!: SignalR.HubConnection;

  constructor() { }

  public startConnection = () => {
    this.hubConnection = new SignalR.HubConnectionBuilder()
      .withUrl('https://localhost:7150/message')
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(error => console.log(`Error establishing connection: ${error}`))
  }

  public addTransferMessageDataListener = () => {
    this.hubConnection.on('transferMessage', (sender: string, content: string) => {
      this.onMessageReceived.emit(new Message(sender, content));
    })
  }
}
