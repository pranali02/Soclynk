export const idlFactory = ({ IDL }) => {
  const CreatePostRequest = IDL.Record({
    'content' : IDL.Text,
    'image_url' : IDL.Opt(IDL.Text),
  });
  const Post = IDL.Record({
    'id' : IDL.Text,
    'content' : IDL.Text,
    'image_url' : IDL.Opt(IDL.Text),
    'liked_by' : IDL.Vec(IDL.Principal),
    'created_at' : IDL.Nat64,
    'author' : IDL.Principal,
    'author_username' : IDL.Text,
    'comments_count' : IDL.Nat64,
    'likes_count' : IDL.Nat64,
  });
  const ApiResult_2 = IDL.Variant({ 'Ok' : Post, 'Err' : IDL.Text });
  const CreateUserRequest = IDL.Record({
    'bio' : IDL.Text,
    'username' : IDL.Text,
    'profile_picture' : IDL.Opt(IDL.Text),
  });
  const User = IDL.Record({
    'id' : IDL.Principal,
    'bio' : IDL.Text,
    'username' : IDL.Text,
    'profile_picture' : IDL.Opt(IDL.Text),
    'following_count' : IDL.Nat64,
    'posts_count' : IDL.Nat64,
    'created_at' : IDL.Nat64,
    'followers_count' : IDL.Nat64,
  });
  const ApiResult = IDL.Variant({ 'Ok' : User, 'Err' : IDL.Text });
  const ApiResult_1 = IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : IDL.Text });
  return IDL.Service({
    'create_post' : IDL.Func([CreatePostRequest], [ApiResult_2], []),
    'create_user' : IDL.Func([CreateUserRequest], [ApiResult], []),
    'delete_post' : IDL.Func([IDL.Text], [ApiResult_1], []),
    'get_caller' : IDL.Func([], [IDL.Principal], ['query']),
    'get_current_user' : IDL.Func([], [IDL.Opt(User)], ['query']),
    'get_posts' : IDL.Func([], [IDL.Vec(Post)], ['query']),
    'get_user' : IDL.Func([IDL.Principal], [IDL.Opt(User)], ['query']),
    'get_user_posts' : IDL.Func([IDL.Principal], [IDL.Vec(Post)], ['query']),
    'like_post' : IDL.Func([IDL.Text], [ApiResult_2], []),
  });
};
export const init = ({ IDL }) => { return []; };
