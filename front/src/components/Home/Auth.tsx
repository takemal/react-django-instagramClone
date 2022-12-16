import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { AppDispatch } from '../../slices/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  asyncCreateProf,
  asyncGetMyProf,
  asyncGetProfs,
  asyncLogin,
  asyncRegister,
  selectProfile,
} from '../../slices/profile';
import { Controller, useForm } from 'react-hook-form';
import { Authen } from '../../types/type';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CircularProgress, TextField } from '@mui/material';
import { asyncGetPosts } from '../../slices/posts';
import { closeModalAction, openModalAction, selectModal } from '../../slices/modal';
import { asyncGetComments } from '../../slices/comments';
import { isLoadingAction, selectFetchState } from '../../slices/fetchState';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid gray',
  p: 4,
};

const schema = yup.object({
  email: yup.string().email('有効なメールアドレスを入力してください').required('メールアドレスを入力してください'),
  password: yup.string().required('パスワードを入力してください').min(4, '4文字以上入力してください。'),
});

export const Auth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const modal = useSelector(selectModal);
  const fetchState = useSelector(selectFetchState);
  const isLoading = fetchState.isLoading;

  const {
    control,
    handleSubmit,
    formState: { dirtyFields, touchedFields, errors },
  } = useForm({ criteriaMode: 'all', defaultValues: { email: '', password: '' }, resolver: yupResolver(schema) });

  const onSubmitSignUp = async (data: Authen) => {
    // await dispatch(isLoadingAction(true));
    const result = await dispatch(asyncRegister(data));
    if (asyncRegister.fulfilled.match(result)) {
      await dispatch(asyncLogin(data));
      await dispatch(asyncCreateProf('anonymous'));
      await dispatch(asyncGetProfs());
      await dispatch(asyncGetPosts());
      await dispatch(asyncGetComments());
      await dispatch(asyncGetMyProf());
    }
    // await dispatch(isLoadingAction(false));
    await dispatch(closeModalAction());
  };

  const onSubmitLogin = async (data: Authen) => {
    // await dispatch(isLoadingAction(true));
    const result = await dispatch(asyncLogin(data));
    if (asyncLogin.fulfilled.match(result)) {
      await dispatch(asyncGetProfs());
      await dispatch(asyncGetPosts());
      await dispatch(asyncGetComments());
      await dispatch(asyncGetMyProf());
    }
    // await dispatch(isLoadingAction(false));
    await dispatch(closeModalAction());
  };

  return (
    <div>
      <Modal open={modal.openSignUp}>
        <Box sx={style}>
          <form onSubmit={handleSubmit(onSubmitSignUp)}>
            <div className="flex flex-col">
              <h1 className="font-normal text-center font-playball text-4xl">SNS clone</h1>
              <br />
              <div className="mt-4 flex justify-center">{isLoading && <CircularProgress />}</div>
              <br />
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState: { invalid, isTouched, isDirty, error } }) => (
                  <TextField {...field} fullWidth label="email" type="text" variant="standard" />
                )}
              />
              {touchedFields.email && errors.email?.message ? (
                <div className="text-red-500 text-center m-2.5 text-sm">{errors.email.message}</div>
              ) : null}
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState: { invalid, isTouched, isDirty, error } }) => (
                  <TextField {...field} fullWidth label="password" type="password" variant="standard" />
                )}
              />
              {errors.password?.message && (
                <div className="text-red-500 text-center m-2.5 text-sm">{errors.password.message}</div>
              )}
              <br />
              <br />
              <Button
                variant="contained"
                color="primary"
                disabled={!dirtyFields.email || !dirtyFields.password}
                type="submit"
              >
                Register
              </Button>
              <br />
              <span
                className="text-blue-400 text-center cursor-pointer"
                onClick={async () => {
                  await dispatch(openModalAction('signIn'));
                }}
              >
                You already have a account ?
              </span>
            </div>
          </form>
        </Box>
      </Modal>
      <Modal open={modal.openSignIn}>
        <Box sx={style}>
          <form onSubmit={handleSubmit(onSubmitLogin)}>
            <div className="flex flex-col">
              <h1 className="font-normal text-center font-playball text-4xl">SNS clone</h1>
              <br />
              <div className="mt-4 flex justify-center">{isLoading && <CircularProgress />}</div>
              <br />
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState: { invalid, isTouched, isDirty, error } }) => (
                  <TextField {...field} fullWidth label="email" type="text" variant="standard" />
                )}
              />
              {touchedFields.email && errors.email?.message ? (
                <div className="text-red-500 text-center m-2.5 text-sm">{errors.email.message}</div>
              ) : null}
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState: { invalid, isTouched, isDirty, error } }) => (
                  <TextField {...field} fullWidth label="password" type="password" variant="standard" />
                )}
              />
              {errors.password?.message && (
                <div className="text-red-500 text-center m-2.5 text-sm">{errors.password.message}</div>
              )}
              <br />
              <br />
              <Button
                variant="contained"
                color="primary"
                disabled={!dirtyFields.email || !dirtyFields.password}
                type="submit"
              >
                Login
              </Button>
              <br />
              <span
                className="text-blue-400 text-center cursor-pointer"
                onClick={async () => {
                  dispatch(openModalAction('signUp'));
                }}
              >
                You don't have a account ?
              </span>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};
