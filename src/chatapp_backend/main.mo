import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
actor {
  var users:[Text] = [];
  type Message = {
    sendersId:Text;
    content:Text;

  };
  var messages = Buffer.Buffer<Message>(1);
  // Method to receive the receiver's principal ID
  public func receivePrincipalId(receiverPrincipalId: Text) : async () {
    users := [receiverPrincipalId];
  };
  // Method to send a message to the receiver
  public func sendMessage(message: Text,sendersPrinciapl:Text): async (){
    messages.add({sendersId=sendersPrinciapl;content=message});
    Debug.print("Senders principal id");
    Debug.print(sendersPrinciapl);
    Debug.print("Message sent to receiver");
    Debug.print(message);
  };

  public func getMessages(): async [Message] {
    return Buffer.toArray(messages)
  };
  
};