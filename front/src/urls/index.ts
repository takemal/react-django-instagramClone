const apiUrl = process.env.REACT_APP_DEV_API_URL;

export const registerURL = `${apiUrl}/api/register`;
export const myprofileURL = `${apiUrl}/api/myprofile`;
export const commentsURL = `${apiUrl}/api/comment`;
export const postsURL = `${apiUrl}/api/post`;
export const postURL = (postId: string | number) => `${apiUrl}/api/post/${postId}`;
export const profilesURL = `${apiUrl}/api/profile`;
export const profileURL = (profileId: string | number) => `${apiUrl}/api/profile/${profileId}`;
export const jwtURL = `${apiUrl}/authen/jwt/create`;
