import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type ApiResult = { 'Ok' : User } |
  { 'Err' : string };
export type ApiResult_1 = { 'Ok' : boolean } |
  { 'Err' : string };
export type ApiResult_2 = { 'Ok' : Post } |
  { 'Err' : string };
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
  'author_username' : string,
  'comments_count' : bigint,
  'likes_count' : bigint,
}
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
  'create_post' : ActorMethod<[CreatePostRequest], ApiResult_2>,
  'create_user' : ActorMethod<[CreateUserRequest], ApiResult>,
  'delete_post' : ActorMethod<[string], ApiResult_1>,
  'get_caller' : ActorMethod<[], Principal>,
  'get_current_user' : ActorMethod<[], [] | [User]>,
  'get_posts' : ActorMethod<[], Array<Post>>,
  'get_user' : ActorMethod<[Principal], [] | [User]>,
  'get_user_posts' : ActorMethod<[Principal], Array<Post>>,
  'like_post' : ActorMethod<[string], ApiResult_2>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
