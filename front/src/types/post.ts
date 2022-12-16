export type NewPost = {
  title: string;
  img: File | null;
};

export type Liked = {
  id: number;
  title: string;
  currentLikedUser_ids: number[];
  newLikedUser_id: number;
};

export type Comment = {
  text: string;
  post_id: number;
};

// Postコンポーネントprops
export type PostType = {
  id: number;
  title: string;
  imgUrl: string;
  loginUser_id: number;
  postUser_id: number;
  likedUser_ids: number[];
};
