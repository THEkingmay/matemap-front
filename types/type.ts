interface User{
    id : string , 
    role : string
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
export type {User , UserCard}