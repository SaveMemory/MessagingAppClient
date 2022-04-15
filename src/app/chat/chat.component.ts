import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Message } from 'src/models/Message';
import { SignalRService } from '../services/signal-r.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  public username: FormControl = new FormControl('');
  public messageControl: FormControl = new FormControl('');

  public chatMessages$: BehaviorSubject<Message[]> = new BehaviorSubject(new Array<Message>());

  constructor(public signalRService: SignalRService, private http: HttpClient, private changeDetection: ChangeDetectorRef) { }

  public ngOnInit(): void {
    this.signalRService.startConnection();
    this.signalRService.addTransferMessageDataListener();
    this.signalRService.onMessageReceived.subscribe(message => {
      this.chatMessages$.getValue().push(new Message(message.Sender, message.Content));
    })
  }

  public sendMessage(): void {
    
    this.http.post<Message>('https://localhost:7150/api/message', new Message(this.username.value, this.messageControl.value))
      .subscribe((response) => {
      })
  }
}
