interface User{
    id : string , 
    role : string
}

interface UserCard {
  id: string;
  name: string;
  age?: number;
  faculty?: string;
  major?: string;
  tags?: string[];
  image_url?: string;
}
export type {User , UserCard}