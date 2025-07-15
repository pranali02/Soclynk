import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Comment {
  'id' : string,
  'post_id' : string,
  'content' : string,
  'created_at' : bigint,
  'author' : Principal,
}
export interface CreateCommentRequest { 'post_id' : string, 'content' : string }
export interface CreatePostRequest {
  'content' : string,
  'image_url' : [] | [string],
}
export interface CreateUserRequest {
  'bio' : string,
  'username' : string,
  'profile_picture' : [] | [string],
}
export interface Post {
  'id' : string,
  'content' : string,
  'image_url' : [] | [string],
  'liked_by' : Array<Principal>,
  'created_at' : bigint,
  'author' : Principal,
  'comments_count' : bigint,
  'likes_count' : bigint,
}
export interface PostWithAuthor {
  'id' : string,
  'content' : string,
  'image_url' : [] | [string],
  'liked_by' : Array<Principal>,
  'created_at' : bigint,
  'author' : Principal,
  'author_username' : string,
  'comments_count' : bigint,
  'likes_count' : bigint,
}
export type Principal = Principal;
export type Result_Comment = { 'Ok' : Comment } |
  { 'Err' : string };
export type Result_Post = { 'Ok' : Post } |
  { 'Err' : string };
export type Result_Unit = { 'Ok' : null } |
  { 'Err' : string };
export type Result_User = { 'Ok' : User } |
  { 'Err' : string };
export interface User {
  'id' : Principal,
  'bio' : string,
  'username' : string,
  'profile_picture' : [] | [string],
  'following_count' : bigint,
  'posts_count' : bigint,
  'created_at' : bigint,
  'followers_count' : bigint,
}
export interface _SERVICE {
  'create_comment' : ActorMethod<[CreateCommentRequest], Result_Comment>,
  'create_post' : ActorMethod<[CreatePostRequest], Result_Post>,
  'create_user' : ActorMethod<[CreateUserRequest], Result_User>,
  'delete_post' : ActorMethod<[string], Result_Unit>,
  'get_caller' : ActorMethod<[], Principal>,
  'get_comments' : ActorMethod<[string], Array<Comment>>,
  'get_current_user' : ActorMethod<[], [] | [User]>,
  'get_posts' : ActorMethod<[], Array<PostWithAuthor>>,
  'get_user' : ActorMethod<[Principal], [] | [User]>,
  'get_user_posts' : ActorMethod<[Principal], Array<PostWithAuthor>>,
  'like_post' : ActorMethod<[string], Result_Post>,
  'update_user' : ActorMethod<[CreateUserRequest], Result_User>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
