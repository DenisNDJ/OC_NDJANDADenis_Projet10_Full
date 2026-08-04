import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client'

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  // STOMP client instance to handle WebSocket connection
  stompClient: Client | null = null;  

  // Subject to manage the stream of incoming messages
  private messageSubject = new BehaviorSubject<any>(null);
  // Observable for components to subscribe to messages
  public messages$ = this.messageSubject.asObservable();
    

  // Subject to track the connection status (connected/disconnected)
  private connectionSubject = new BehaviorSubject<boolean>(false);
  // Observable for components to track connection status
  public connectionStatus$ = this.connectionSubject.asObservable();
    

  constructor(private zone: NgZone){}

  connect(username:string){
    // Initialize the SockJS WebSocket connection to the server
    const socket = new SockJS('http://localhost:8080/ws');
          
    // Configure the STOMP client with connection details
    this.stompClient = new Client({
      // Use SockJS as the WebSocket factory
      webSocketFactory: () => socket,  
      // Reconnect delay if connection is lost
      reconnectDelay: 5000,  
      // Log STOMP debug messages for troubleshooting
      debug: (str) => console.log(str)  
    });
    

    // On successful connection
    this.stompClient.onConnect = (frame) => {
      this.zone.run(()=>{
      console.log('Connected to WebSocket server');
      // Notify that the connection is successful
      this.connectionSubject.next(true);  

      // Subscribe to the '/topic/public' topic to receive public messages
      this.stompClient?.subscribe('/topic/public', (message: Message) => {
         // Pass the message to subscribers
        this.messageSubject.next(JSON.parse(message.body)); 
      });

      // Send a "JOIN" message to notify the server that a user has joined
      this.stompClient?.publish({
        // Server endpoint for adding users
        destination: '/app/chat.addUser',  
        // Send username and join event
        body: JSON.stringify({ sender: username, type: 'JOIN' })  
      });
    });
    };

    // Handle errors reported by the STOMP broker
    this.stompClient.onStompError = (frame) => {
      // Log the error message
      console.error('Broker reported error: ' + frame.headers['message']);
      // Log additional error details
      console.error('Additional details: ' + frame.body);  
      
    };
    
    this.stompClient?.activate();
  }

  sendMessage(username:string, content:string){
    if (this.stompClient && this.stompClient.connected) {
      // Create a chat message object
      const chatMessage = { sender: username, content: content, type: 'CHAT' };

      // Log the message being sent and the sender
      console.log(`Message sent by ${username}: ${content}`);

      // Publish (send) the message to the '/app/chat.sendMessage' destination
      this.stompClient.publish({
        destination: '/app/chat.sendMessage',
        // Convert the message to JSON and send
        body: JSON.stringify(chatMessage)  
      });
    } else {
      // Log an error if the WebSocket connection is not active
      console.error('WebSocket is not connected. Unable to send message.');
    }

  }

  disconnect(){
    if(this.stompClient){
      this.stompClient.deactivate();
    }
  }
}
