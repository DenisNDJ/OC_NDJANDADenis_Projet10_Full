import { Component, OnInit, signal } from '@angular/core';
import { WebsocketService } from './service/websocket-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  username: string = '';
  message: string = '';
  messages = signal<any[]>([]);
  isConnected = signal(false);
  connectingMessage = signal('Connecting...');

  constructor(private websocketService: WebsocketService) {}

  ngOnInit(): void {
    this.websocketService.messages$.subscribe(message => {
      if (message) {
        console.log(`Message received from ${message.sender}: ${message.content}`);
        this.messages.update(msgs => [...msgs, message]);
      }
    });

    this.websocketService.connectionStatus$.subscribe(connected => {
      this.isConnected.set(connected);
      if (connected) {
        this.connectingMessage.set('');
      }
    });
  }

  connect() {
    this.websocketService.connect(this.username);
  }

  sendMessage() {
    if (this.message) {
      this.websocketService.sendMessage(this.username, this.message);
      this.message = '';
    }
  }

  getAvatarColor(): string {
    return "#2196F3";
  }
}