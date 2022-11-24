import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { AppDispatch } from '../slices/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  asyncCreateProf,
  asyncGetMyProf,
  asyncGetProfs,
  asyncLogin,
  asyncRegister,
  fetchEndAction,
  fetchStartAction,
  resetOpenSignUpAction,
  selectAuth,
} from '../slices/auth';
import { Formik } from 'formik';
import { Controller, useForm } from 'react-hook-form';
import { Authen } from '../types/type';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField } from '@mui/material';

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

const schema = yup.object({
  email: yup.string().email('email format is wrong').required('email is must'),
  password: yup.string().required('password is must').min(4, '4文字以上入力してください。'),
});

export const Auth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector(selectAuth);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const {
    control,
    register,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm({ criteriaMode: 'all', defaultValues: { email: '', password: '' }, resolver: yupResolver(schema) });

  const onSubmit = async (data: Authen) => {
    await dispatch(fetchStartAction());
    const result = await dispatch(asyncRegister(data));
    if (asyncRegister.fulfilled.match(result)) {
      await dispatch(asyncLogin(data));
      await dispatch(asyncCreateProf('anonymous'));
      await dispatch(asyncGetProfs());
      // await dispatch(asyncGetPosts());
      // await dispatch(fetchAsyncGetComments());
      await dispatch(asyncGetMyProf());
    }
    await dispatch(fetchEndAction());
    await dispatch(resetOpenSignUpAction());
  };

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={auth.openSignUp}
        onClose={() => dispatch(resetOpenSignUpAction())}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller name="email" control={control} render={(field) => <TextField {...field} type="text" />} />
            {errors.email?.message && <div>{errors.email.message}</div>}
            <Controller name="email" control={control} render={(field) => <TextField {...field} type="password" />} />
            {errors.password?.message && <div>{errors.password.message}</div>}
            <Button variant="contained" color="primary" disabled={!isDirty} type="submit">
              Register
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};
