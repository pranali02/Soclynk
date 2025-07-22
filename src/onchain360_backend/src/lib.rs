use ic_cdk_macros::*;
use candid::{CandidType, Principal};
use std::collections::HashMap;
use std::cell::RefCell;

#[derive(CandidType, Clone)]
pub struct User {
    pub id: Principal,
    pub username: String,
    pub bio: String,
    pub profile_picture: Option<String>,
    pub created_at: u64,
    pub followers_count: u64,
    pub following_count: u64,
    pub posts_count: u64,
}

#[derive(CandidType, Clone)]
pub struct Post {
    pub id: String,
    pub author: Principal,
    pub author_username: String,
    pub content: String,
    pub image_url: Option<String>,
    pub created_at: u64,
    pub likes_count: u64,
    pub comments_count: u64,
    pub liked_by: Vec<Principal>,
}

#[derive(CandidType)]
pub struct CreateUserRequest {
    pub username: String,
    pub bio: String,
    pub profile_picture: Option<String>,
}

#[derive(CandidType)]
pub struct CreatePostRequest {
    pub content: String,
    pub image_url: Option<String>,
}

#[derive(CandidType)]
pub enum ApiResult<T> {
    Ok(T),
    Err(String),
}

thread_local! {
    static USERS: RefCell<HashMap<Principal, User>> = RefCell::new(HashMap::new());
    static POSTS: RefCell<HashMap<String, Post>> = RefCell::new(HashMap::new());
    static POST_COUNTER: RefCell<u64> = RefCell::new(0);
}

fn get_time() -> u64 {
    ic_cdk::api::time()
}

fn next_post_id() -> String {
    POST_COUNTER.with(|counter| {
        let mut counter = counter.borrow_mut();
        *counter += 1;
        counter.to_string()
    })
}

#[query]
fn get_caller() -> Principal {
    ic_cdk::caller()
}

#[update]
fn create_user(request: CreateUserRequest) -> ApiResult<User> {
    let caller = ic_cdk::caller();
    
    if caller == Principal::anonymous() {
        return ApiResult::Err("Anonymous users cannot create profiles".to_string());
    }

    USERS.with(|users| {
        let mut users = users.borrow_mut();
        
        if users.contains_key(&caller) {
            return ApiResult::Err("User already exists".to_string());
        }

        let user = User {
            id: caller,
            username: request.username,
            bio: request.bio,
            profile_picture: request.profile_picture,
            created_at: get_time(),
            followers_count: 0,
            following_count: 0,
            posts_count: 0,
        };

        users.insert(caller, user.clone());
        ApiResult::Ok(user)
    })
}

#[query]
fn get_current_user() -> Option<User> {
    let caller = ic_cdk::caller();
    
    if caller == Principal::anonymous() {
        return None;
    }

    USERS.with(|users| {
        users.borrow().get(&caller).cloned()
    })
}

#[query]
fn get_user(principal: Principal) -> Option<User> {
    USERS.with(|users| {
        users.borrow().get(&principal).cloned()
    })
}

#[update]
fn create_post(request: CreatePostRequest) -> ApiResult<Post> {
    let caller = ic_cdk::caller();
    
    if caller == Principal::anonymous() {
        return ApiResult::Err("Anonymous users cannot create posts".to_string());
    }

    let user = USERS.with(|users| {
        users.borrow().get(&caller).cloned()
    });

    let user = match user {
        Some(u) => u,
        None => return ApiResult::Err("User not found. Please create a profile first".to_string()),
    };

    let post_id = next_post_id();
    let post = Post {
        id: post_id.clone(),
        author: caller,
        author_username: user.username.clone(),
        content: request.content,
        image_url: request.image_url,
        created_at: get_time(),
        likes_count: 0,
        comments_count: 0,
        liked_by: Vec::new(),
    };

    POSTS.with(|posts| {
        posts.borrow_mut().insert(post_id, post.clone());
    });

    // Update user's post count
    USERS.with(|users| {
        let mut users = users.borrow_mut();
        if let Some(mut updated_user) = users.get(&caller).cloned() {
            updated_user.posts_count += 1;
            users.insert(caller, updated_user);
        }
    });

    ApiResult::Ok(post)
}

#[query]
fn get_posts() -> Vec<Post> {
    POSTS.with(|posts| {
        let posts = posts.borrow();
        let mut post_list: Vec<Post> = posts.values().cloned().collect();
        
        // Sort by created_at in descending order (newest first)
        post_list.sort_by(|a, b| b.created_at.cmp(&a.created_at));
        post_list
    })
}

#[query]
fn get_user_posts(principal: Principal) -> Vec<Post> {
    POSTS.with(|posts| {
        let posts = posts.borrow();
        let mut post_list: Vec<Post> = posts
            .values()
            .filter(|post| post.author == principal)
            .cloned()
            .collect();
        
        // Sort by created_at in descending order (newest first)
        post_list.sort_by(|a, b| b.created_at.cmp(&a.created_at));
        post_list
    })
}

#[update]
fn like_post(post_id: String) -> ApiResult<Post> {
    let caller = ic_cdk::caller();
    
    if caller == Principal::anonymous() {
        return ApiResult::Err("Anonymous users cannot like posts".to_string());
    }

    POSTS.with(|posts| {
        let mut posts = posts.borrow_mut();
        let mut post = match posts.get(&post_id).cloned() {
            Some(p) => p,
            None => return ApiResult::Err("Post not found".to_string()),
        };

        if post.liked_by.contains(&caller) {
            // Unlike the post
            post.liked_by.retain(|&x| x != caller);
            post.likes_count = post.likes_count.saturating_sub(1);
        } else {
            // Like the post
            post.liked_by.push(caller);
            post.likes_count += 1;
        }

        posts.insert(post_id, post.clone());
        ApiResult::Ok(post)
    })
}

#[update]
fn delete_post(post_id: String) -> ApiResult<bool> {
    let caller = ic_cdk::caller();
    
    if caller == Principal::anonymous() {
        return ApiResult::Err("Anonymous users cannot delete posts".to_string());
    }

    POSTS.with(|posts| {
        let mut posts = posts.borrow_mut();
        let post = match posts.get(&post_id).cloned() {
            Some(p) => p,
            None => return ApiResult::Err("Post not found".to_string()),
        };

        if post.author != caller {
            return ApiResult::Err("You can only delete your own posts".to_string());
        }

        posts.remove(&post_id);
        
        // Update user's post count
        USERS.with(|users| {
            let mut users = users.borrow_mut();
            if let Some(mut user) = users.get(&caller).cloned() {
                user.posts_count = user.posts_count.saturating_sub(1);
                users.insert(caller, user);
            }
        });

        ApiResult::Ok(true)
    })
}

ic_cdk::export_candid!(); 