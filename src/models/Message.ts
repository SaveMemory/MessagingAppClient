export class Message {
    public Sender: string; 
    public Content: string;

    public constructor(sender: string, content: string) {
        this.Sender = sender;
        this.Content = content;
    }
}