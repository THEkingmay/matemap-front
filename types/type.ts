interface User{
    id : string , 
    role : string ,
    image_url : string
}

interface UserCard {
  id: string;
  name: string;
  bio :string ;
  faculty?: string;
  major?: string;
  tag?: string[];
  image_url?: string;
  birth_year? : number
}

interface ChatRoom {
  roomId: string;
  partnerId: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  image_url: string;
}

export type {User , UserCard, ChatRoom}