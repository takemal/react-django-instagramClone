import { Avatar, AvatarGroup, Checkbox, Divider } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { asyncUpdateLiked, selectPosts } from '../slices/posts';
import { OnClick } from '../types/events';
import { PostType } from '../types/post';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { styled } from '@mui/system';
import { AppDispatch } from '../slices/store';
import { selectProfile } from '../slices/profile';
import { isLoadingAction } from '../slices/fetchState';
import { asyncPostComment, selectComments } from '../slices/comments';

const CustomAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(3),
  height: theme.spacing(3),
  marginRight: theme.spacing(1),
}));

export const Post = (props: PostType) => {
  const { id, title, imgUrl, loginUser_id, postUser_id, likedUser_ids } = props;
  const dispatch = useDispatch<AppDispatch>();
  const profiles = useSelector(selectProfile).profiles;
  const comments = useSelector(selectComments);
  const [text, setText] = useState('');

  const commentsOnPost = comments.filter((comment) => {
    return comment.post_id === id;
  });

  const profile = profiles.filter((prof) => {
    return prof.user_id === postUser_id;
  });

  const postComment = async (e: OnClick) => {
    e.preventDefault();
    const newComment = { text: text, post_id: id };
    await dispatch(isLoadingAction(true));
    await dispatch(asyncPostComment(newComment));
    await dispatch(isLoadingAction(false));
    setText('');
  };

  const addLike = async () => {
    const packet = {
      id: id,
      title: title,
      currentLikedUser_ids: likedUser_ids,
      newLikedUser_id: loginUser_id,
    };
    await dispatch(isLoadingAction(true));
    await dispatch(asyncUpdateLiked(packet));
    await dispatch(isLoadingAction(false));
  };

  if (title) {
    return (
      <div className="bg-white max-w-full border border-gray-400 mb-2.5">
        <div className="flex align-center p-4">
          <Avatar className="mr-2.5 z-10" src={profile[0]?.img} />
          <h3>{profile[0]?.nickName}</h3>
        </div>
        <img className="w-full h-70 object-contain" src={imgUrl} alt="" />

        <h4 className="p-5 break-all">
          <Checkbox
            className="z-0"
            icon={<FavoriteBorderIcon />}
            checkedIcon={<FavoriteIcon />}
            checked={likedUser_ids?.some((likedUser_id) => likedUser_id === loginUser_id)}
            onChange={addLike}
          />
          <strong> {profile[0]?.nickName}</strong> {title}
          <AvatarGroup max={7}>
            {likedUser_ids?.map((likedUser_id) => (
              <Avatar
                className="!z-0"
                key={likedUser_id}
                src={profiles.find((prof) => prof.user_id === likedUser_id)?.img}
              />
            ))}
          </AvatarGroup>
        </h4>

        <Divider />
        <div className="p-5">
          {commentsOnPost.map((comment) => (
            <div key={comment.id} className="flex align-center mb-1 break-all">
              <CustomAvatar src={profiles.find((prof) => prof.user_id === comment.user_id)?.img} />
              <p>
                <strong className="mr-1">{profiles.find((prof) => prof.user_id === comment.user_id)?.nickName}</strong>
                {comment.text}
              </p>
            </div>
          ))}
        </div>

        <form className="flex mt-2.5">
          <input
            className="flex-1 p-2.5 border-none border-t border-gray-400"
            type="text"
            placeholder="add a comment"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            disabled={!text.length}
            className="flex border-none text-blue-500 border-t border-gray-400 cursor-pointer bg-transparent"
            type="submit"
            onClick={(e) => postComment(e)}
          >
            Post
          </button>
        </form>
      </div>
    );
  }
  return null;
};
