export const idlFactory = ({ IDL }) => {
  const CreateCommentRequest = IDL.Record({
    'post_id' : IDL.Text,
    'content' : IDL.Text,
  });
  const Principal = IDL.Principal;
  const Comment = IDL.Record({
    'id' : IDL.Text,
    'post_id' : IDL.Text,
    'content' : IDL.Text,
    'created_at' : IDL.Nat64,
    'author' : Principal,
  });
  const Result_Comment = IDL.Variant({ 'Ok' : Comment, 'Err' : IDL.Text });
  const CreatePostRequest = IDL.Record({
    'content' : IDL.Text,
    'image_url' : IDL.Opt(IDL.Text),
  });
  const Post = IDL.Record({
    'id' : IDL.Text,
    'content' : IDL.Text,
    'image_url' : IDL.Opt(IDL.Text),
    'liked_by' : IDL.Vec(Principal),
    'created_at' : IDL.Nat64,
    'author' : Principal,
    'comments_count' : IDL.Nat64,
    'likes_count' : IDL.Nat64,
  });
  const Result_Post = IDL.Variant({ 'Ok' : Post, 'Err' : IDL.Text });
  const CreateUserRequest = IDL.Record({
    'bio' : IDL.Text,
    'username' : IDL.Text,
    'profile_picture' : IDL.Opt(IDL.Text),
  });
  const User = IDL.Record({
    'id' : Principal,
    'bio' : IDL.Text,
    'username' : IDL.Text,
    'profile_picture' : IDL.Opt(IDL.Text),
    'following_count' : IDL.Nat64,
    'posts_count' : IDL.Nat64,
    'created_at' : IDL.Nat64,
    'followers_count' : IDL.Nat64,
  });
  const Result_User = IDL.Variant({ 'Ok' : User, 'Err' : IDL.Text });
  const Result_Unit = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const PostWithAuthor = IDL.Record({
    'id' : IDL.Text,
    'content' : IDL.Text,
    'image_url' : IDL.Opt(IDL.Text),
    'liked_by' : IDL.Vec(Principal),
    'created_at' : IDL.Nat64,
    'author' : Principal,
    'author_username' : IDL.Text,
    'comments_count' : IDL.Nat64,
    'likes_count' : IDL.Nat64,
  });
  return IDL.Service({
    'create_comment' : IDL.Func([CreateCommentRequest], [Result_Comment], []),
    'create_post' : IDL.Func([CreatePostRequest], [Result_Post], []),
    'create_user' : IDL.Func([CreateUserRequest], [Result_User], []),
    'delete_post' : IDL.Func([IDL.Text], [Result_Unit], []),
    'get_caller' : IDL.Func([], [Principal], ['query']),
    'get_comments' : IDL.Func([IDL.Text], [IDL.Vec(Comment)], ['query']),
    'get_current_user' : IDL.Func([], [IDL.Opt(User)], ['query']),
    'get_posts' : IDL.Func([], [IDL.Vec(PostWithAuthor)], ['query']),
    'get_user' : IDL.Func([Principal], [IDL.Opt(User)], ['query']),
    'get_user_posts' : IDL.Func(
        [Principal],
        [IDL.Vec(PostWithAuthor)],
        ['query'],
      ),
    'like_post' : IDL.Func([IDL.Text], [Result_Post], []),
    'update_user' : IDL.Func([CreateUserRequest], [Result_User], []),
  });
};
export const init = ({ IDL }) => { return []; };
