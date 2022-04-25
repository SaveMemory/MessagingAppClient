import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Message } from 'src/models/Message';
import { SignalRService } from '../services/signal-r.service';
import { BehaviorSubject } from 'rxjs';
import { swearwordValidator } from '../validators/swearewordValidator';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  public messageForm: FormGroup;

  public chatMessages$: BehaviorSubject<Message[]> = new BehaviorSubject(new Array<Message>());

  constructor(public signalRService: SignalRService, private http: HttpClient, private changeDetection: ChangeDetectorRef) {
    this.messageForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(2)
      ]),
      messageControl: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(1),
        swearwordValidator(/kurwa/i)
      ]),
    });
  }

  public ngOnInit(): void {
    this.setupSignalRConnection();
  }

  public sendMessage(): void {
    if(!this.messageForm.valid) {
      return
    }

    this.http.post<Message>('https://localhost:7150/api/message', new Message(this.messageForm.controls['username'].value, this.messageForm.controls['messageControl'].value))
      .subscribe();
  }

  private setupSignalRConnection(): void {
    this.signalRService.startConnection();
    this.signalRService.addTransferMessageDataListener();
    this.signalRService.onMessageReceived.subscribe(message => {
      this.chatMessages$.getValue().push(new Message(message.Sender, message.Content));
    });
  }
}
