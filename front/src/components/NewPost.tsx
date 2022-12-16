import { Box, Button, IconButton, Modal, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { asyncNewPost } from '../slices/posts';
import { AppDispatch } from '../slices/store';
import { OnClick } from '../types/events';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { closeModalAction, selectModal } from '../slices/modal';
import { isLoadingAction } from '../slices/fetchState';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const NewPost = () => {
  const dispatch = useDispatch<AppDispatch>();
  const modal = useSelector(selectModal);

  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState('');

  // アイコンを押した際にファイルを選べるようにする
  const handlerEditPicture = () => {
    const fileInput = document.getElementById('imageInput');
    fileInput?.click();
  };

  const newPost = async (e: OnClick) => {
    e.preventDefault();
    const packet = { title: title, img: image };
    await dispatch(isLoadingAction(true));
    await dispatch(asyncNewPost(packet));
    await dispatch(isLoadingAction(false));
    setTitle('');
    setImage(null);
    dispatch(closeModalAction());
  };

  return (
    <>
      <Modal open={modal.openNewPost} onClose={async () => await dispatch(closeModalAction())}>
        <Box sx={style}>
          <form className="flex flex-col">
            <h1 className="font-playball text-center">SNS clone</h1>

            <br />
            <TextField placeholder="Please enter caption" type="text" onChange={(e) => setTitle(e.target.value)} />

            <input type="file" id="imageInput" hidden={true} onChange={(e) => setImage(e.target.files![0])} />
            <br />
            <IconButton onClick={handlerEditPicture}>
              <AddAPhotoIcon />
            </IconButton>
            <br />
            <Button disabled={!title || !image} variant="contained" color="primary" onClick={newPost}>
              New post
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
};
