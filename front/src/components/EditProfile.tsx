import { Box, Button, IconButton, Modal, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { asyncUpdateProf, editNickNameAction, selectProfile } from '../slices/profile';
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

export const EditProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector(selectProfile);
  const modal = useSelector(selectModal);
  const [image, setImage] = useState<File | null>(null);

  const updateProfile = async (e: OnClick) => {
    e.preventDefault();
    const packet = { id: profile.myprofile.id, nickName: profile.myprofile.nickName, img: image };
    await dispatch(isLoadingAction(true));
    await dispatch(asyncUpdateProf(packet));
    await dispatch(isLoadingAction(false));
    await dispatch(closeModalAction());
  };

  const handlerEditPicture = () => {
    const fileInput = document.getElementById('imageInput');
    fileInput?.click();
  };

  return (
    <>
      <Modal open={modal.openProfile} onClose={async () => await dispatch(closeModalAction())}>
        <Box sx={style}>
          <form className="flex flex-col">
            <h1 className="font-playball text-center">SNS clone</h1>

            <br />
            <TextField
              placeholder="nickname"
              type="text"
              value={profile.myprofile?.nickName}
              onChange={(e) => dispatch(editNickNameAction(e.target.value))}
            />

            <input type="file" id="imageInput" hidden={true} onChange={(e) => setImage(e.target.files![0])} />
            <br />
            <IconButton onClick={handlerEditPicture}>
              <AddAPhotoIcon />
            </IconButton>
            <br />
            <Button
              disabled={!profile.myprofile?.nickName}
              variant="contained"
              color="primary"
              type="submit"
              onClick={updateProfile}
            >
              Update
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
};
