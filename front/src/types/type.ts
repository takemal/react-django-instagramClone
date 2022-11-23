export interface Authen {
  email: string;
  password: string;
}

// export interface File extends Blob {
//   readonly lastModified: number;
//   readonly name: string;
// }

export interface Profile {
  id: number;
  nickName: string;
  img: File | null;
}
