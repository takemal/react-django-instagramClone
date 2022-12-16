import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { asyncGetMyProf, asyncGetProfs, editNickNameAction, selectProfile } from '../../slices/profile';
import { asyncGetPosts, selectPosts } from '../../slices/posts';
import { AppDispatch } from '../../slices/store';
import { Auth } from '../Home/Auth';
import { MdAddAPhoto } from 'react-icons/md';
import { Avatar, Badge, Button, CircularProgress, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { Post } from '../Post';
import { EditProfile } from '../EditProfile';
import { NewPost } from '../NewPost';
import { closeModalAction, openModalAction } from '../../slices/modal';
import { asyncGetComments } from '../../slices/comments';
import { selectFetchState } from '../../slices/fetchState';
import { profile } from 'console';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

export const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector(selectProfile);
  const posts = useSelector(selectPosts);
  const fetchState = useSelector(selectFetchState);
  const isLoading = fetchState.isLoading;

  useEffect(() => {
    const fetchBootLoader = async () => {
      // JWTトークンがあれば
      if (localStorage.localJWT) {
        // サインインモーダルを消す
        dispatch(closeModalAction());
        const result = await dispatch(asyncGetMyProf());
        if (asyncGetMyProf.rejected.match(result)) {
          dispatch(openModalAction('SignIn'));
          return null;
        }
        await dispatch(asyncGetPosts());
        await dispatch(asyncGetProfs());
        await dispatch(asyncGetComments());
      }
    };
    fetchBootLoader();
  }, [dispatch]);

  return (
    <div>
      <Auth />
      <EditProfile />
      <NewPost />
      <div className="sticky top-0 bg-white p-5 border-gray-300 flex z-10 justify-between object-contain">
        <h1 className="font-playball text-center text-4xl">SNS clone</h1>
        {profile ? (
          <>
            <button
              className="bg-transparent text-gray-500 pt-1 text-3xl border-none outline-none cursor-pointer"
              onClick={() => {
                dispatch(openModalAction('newPost'));
              }}
            >
              <MdAddAPhoto />
            </button>
            <div className="flex justify-end">
              {isLoading && <CircularProgress />}
              <Button
                onClick={() => {
                  localStorage.removeItem('localJWT');
                  dispatch(editNickNameAction(''));
                  dispatch(openModalAction('signIn'));
                }}
              >
                Logout
              </Button>
              <button
                className="bg-transparent text-gray-500 pt-1 text-3xl border-none outline-none cursor-pointer"
                onClick={() => {
                  dispatch(openModalAction('profile'));
                }}
              >
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  variant="dot"
                >
                  <Avatar alt="who?" src={profile.myprofile?.img} />{' '}
                </StyledBadge>
              </button>
            </div>
          </>
        ) : (
          <div>
            <Button
              onClick={() => {
                dispatch(openModalAction('signIn'));
              }}
            >
              LogIn
            </Button>
            <Button
              onClick={() => {
                dispatch(openModalAction('signUp'));
              }}
            >
              SignUp
            </Button>
          </div>
        )}
      </div>
      {profile.myprofile?.nickName && (
        <div className="p-5">
          <Grid container spacing={4}>
            {posts?.reverse().map((post) => (
              <Grid key={post.id} item xs={12} md={4}>
                <Post
                  id={post.id}
                  title={post.title}
                  imgUrl={post.imgUrl}
                  loginUser_id={profile.myprofile.user_id}
                  postUser_id={post.postUser_id}
                  likedUser_ids={post.likedUser_ids}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      )}
    </div>
  );
};
