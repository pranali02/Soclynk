use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::time;
use ic_cdk_macros::*;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap, Storable};
use serde::Serialize;
use std::borrow::Cow;
use std::cell::RefCell;

type Memory = VirtualMemory<DefaultMemoryImpl>;

// Data structures
#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
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

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct Post {
    pub id: String,
    pub author: Principal,
    pub content: String,
    pub image_url: Option<String>,
    pub created_at: u64,
    pub likes_count: u64,
    pub comments_count: u64,
    pub liked_by: Vec<Principal>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct Comment {
    pub id: String,
    pub post_id: String,
    pub author: Principal,
    pub content: String,
    pub created_at: u64,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct CreateUserRequest {
    pub username: String,
    pub bio: String,
    pub profile_picture: Option<String>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct CreatePostRequest {
    pub content: String,
    pub image_url: Option<String>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct CreateCommentRequest {
    pub post_id: String,
    pub content: String,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct PostWithAuthor {
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

// Implement Storable traits for stable storage
impl Storable for User {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(candid::encode_one(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }
    
    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Bounded {
        max_size: 1024,
        is_fixed_size: false,
    };
}

impl Storable for Post {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(candid::encode_one(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }
    
    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Bounded {
        max_size: 2048,
        is_fixed_size: false,
    };
}

impl Storable for Comment {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(candid::encode_one(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }
    
    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Bounded {
        max_size: 1024,
        is_fixed_size: false,
    };
}

// Memory management
thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );

    static USERS: RefCell<StableBTreeMap<Principal, User, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0)))
        )
    );

    static POSTS: RefCell<StableBTreeMap<String, Post, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1)))
        )
    );

    static COMMENTS: RefCell<StableBTreeMap<String, Comment, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(2)))
        )
    );
}

// Helper functions
fn generate_id() -> String {
    format!("{}{}", time(), ic_cdk::api::caller().to_text())
}

fn get_user_by_principal(principal: Principal) -> Option<User> {
    USERS.with(|users| users.borrow().get(&principal))
}

// Canister functions
#[init]
fn init() {
    ic_cdk::println!("OnChain360 Backend initialized");
}

#[query]
fn get_caller() -> Principal {
    ic_cdk::api::caller()
}

#[update]
fn create_user(request: CreateUserRequest) -> Result<User, String> {
    let caller = ic_cdk::api::caller();
    
    // Check if user already exists
    if let Some(_) = get_user_by_principal(caller) {
        return Err("User already exists".to_string());
    }
    
    // Check if username is taken
    let username_taken = USERS.with(|users| {
        users.borrow().iter().any(|(_, user)| user.username == request.username)
    });
    
    if username_taken {
        return Err("Username already taken".to_string());
    }
    
    let user = User {
        id: caller,
        username: request.username,
        bio: request.bio,
        profile_picture: request.profile_picture,
        created_at: time(),
        followers_count: 0,
        following_count: 0,
        posts_count: 0,
    };
    
    USERS.with(|users| users.borrow_mut().insert(caller, user.clone()));
    
    Ok(user)
}

#[query]
fn get_user(principal: Principal) -> Option<User> {
    get_user_by_principal(principal)
}

#[query]
fn get_current_user() -> Option<User> {
    let caller = ic_cdk::api::caller();
    get_user_by_principal(caller)
}

#[update]
fn update_user(request: CreateUserRequest) -> Result<User, String> {
    let caller = ic_cdk::api::caller();
    
    let mut user = match get_user_by_principal(caller) {
        Some(user) => user,
        None => return Err("User not found".to_string()),
    };
    
    // Check if new username is taken by another user
    if user.username != request.username {
        let username_taken = USERS.with(|users| {
            users.borrow().iter().any(|(principal, existing_user)| {
                principal != caller && existing_user.username == request.username
            })
        });
        
        if username_taken {
            return Err("Username already taken".to_string());
        }
    }
    
    user.username = request.username;
    user.bio = request.bio;
    user.profile_picture = request.profile_picture;
    
    USERS.with(|users| users.borrow_mut().insert(caller, user.clone()));
    
    Ok(user)
}

#[update]
fn create_post(request: CreatePostRequest) -> Result<Post, String> {
    let caller = ic_cdk::api::caller();
    
    // Check if user exists
    let mut user = match get_user_by_principal(caller) {
        Some(user) => user,
        None => return Err("User not found. Please create a profile first.".to_string()),
    };
    
    let post = Post {
        id: generate_id(),
        author: caller,
        content: request.content,
        image_url: request.image_url,
        created_at: time(),
        likes_count: 0,
        comments_count: 0,
        liked_by: Vec::new(),
    };
    
    // Update user's post count
    user.posts_count += 1;
    USERS.with(|users| users.borrow_mut().insert(caller, user));
    
    POSTS.with(|posts| posts.borrow_mut().insert(post.id.clone(), post.clone()));
    
    Ok(post)
}

#[query]
fn get_posts() -> Vec<PostWithAuthor> {
    let mut posts: Vec<PostWithAuthor> = Vec::new();
    
    POSTS.with(|posts_map| {
        for (_, post) in posts_map.borrow().iter() {
            if let Some(author) = get_user_by_principal(post.author) {
                posts.push(PostWithAuthor {
                    id: post.id,
                    author: post.author,
                    author_username: author.username,
                    content: post.content,
                    image_url: post.image_url,
                    created_at: post.created_at,
                    likes_count: post.likes_count,
                    comments_count: post.comments_count,
                    liked_by: post.liked_by,
                });
            }
        }
    });
    
    // Sort by created_at in descending order
    posts.sort_by(|a, b| b.created_at.cmp(&a.created_at));
    
    posts
}

#[query]
fn get_user_posts(user_principal: Principal) -> Vec<PostWithAuthor> {
    let mut posts: Vec<PostWithAuthor> = Vec::new();
    
    if let Some(user) = get_user_by_principal(user_principal) {
        POSTS.with(|posts_map| {
            for (_, post) in posts_map.borrow().iter() {
                if post.author == user_principal {
                    posts.push(PostWithAuthor {
                        id: post.id,
                        author: post.author,
                        author_username: user.username.clone(),
                        content: post.content,
                        image_url: post.image_url,
                        created_at: post.created_at,
                        likes_count: post.likes_count,
                        comments_count: post.comments_count,
                        liked_by: post.liked_by,
                    });
                }
            }
        });
    }
    
    // Sort by created_at in descending order
    posts.sort_by(|a, b| b.created_at.cmp(&a.created_at));
    
    posts
}

#[update]
fn like_post(post_id: String) -> Result<Post, String> {
    let caller = ic_cdk::api::caller();
    
    // Check if user exists
    if get_user_by_principal(caller).is_none() {
        return Err("User not found".to_string());
    }
    
    let post = POSTS.with(|posts| {
        posts.borrow().get(&post_id)
    });
    
    match post {
        Some(mut p) => {
            if p.liked_by.contains(&caller) {
                // Unlike the post
                p.liked_by.retain(|&x| x != caller);
                p.likes_count = p.likes_count.saturating_sub(1);
            } else {
                // Like the post
                p.liked_by.push(caller);
                p.likes_count += 1;
            }
            
            POSTS.with(|posts| posts.borrow_mut().insert(post_id, p.clone()));
            Ok(p)
        }
        None => Err("Post not found".to_string()),
    }
}

#[update]
fn delete_post(post_id: String) -> Result<(), String> {
    let caller = ic_cdk::api::caller();
    
    let post = POSTS.with(|posts| {
        posts.borrow().get(&post_id)
    });
    
    match post {
        Some(p) => {
            if p.author != caller {
                return Err("Only the author can delete this post".to_string());
            }
            
            // Update user's post count
            if let Some(mut user) = get_user_by_principal(caller) {
                user.posts_count = user.posts_count.saturating_sub(1);
                USERS.with(|users| users.borrow_mut().insert(caller, user));
            }
            
            // Delete associated comments
            COMMENTS.with(|comments| {
                let mut comments_to_delete = Vec::new();
                for (comment_id, comment) in comments.borrow().iter() {
                    if comment.post_id == post_id {
                        comments_to_delete.push(comment_id);
                    }
                }
                
                for comment_id in comments_to_delete {
                    comments.borrow_mut().remove(&comment_id);
                }
            });
            
            POSTS.with(|posts| posts.borrow_mut().remove(&post_id));
            Ok(())
        }
        None => Err("Post not found".to_string()),
    }
}

#[update]
fn create_comment(request: CreateCommentRequest) -> Result<Comment, String> {
    let caller = ic_cdk::api::caller();
    
    // Check if user exists
    if get_user_by_principal(caller).is_none() {
        return Err("User not found".to_string());
    }
    
    // Check if post exists
    let post = POSTS.with(|posts| {
        posts.borrow().get(&request.post_id)
    });
    
    match post {
        Some(mut p) => {
            let comment = Comment {
                id: generate_id(),
                post_id: request.post_id.clone(),
                author: caller,
                content: request.content,
                created_at: time(),
            };
            
            // Update post's comment count
            p.comments_count += 1;
            POSTS.with(|posts| posts.borrow_mut().insert(request.post_id, p));
            
            COMMENTS.with(|comments| comments.borrow_mut().insert(comment.id.clone(), comment.clone()));
            
            Ok(comment)
        }
        None => Err("Post not found".to_string()),
    }
}

#[query]
fn get_comments(post_id: String) -> Vec<Comment> {
    let mut comments: Vec<Comment> = Vec::new();
    
    COMMENTS.with(|comments_map| {
        for (_, comment) in comments_map.borrow().iter() {
            if comment.post_id == post_id {
                comments.push(comment);
            }
        }
    });
    
    // Sort by created_at in ascending order
    comments.sort_by(|a, b| a.created_at.cmp(&b.created_at));
    
    comments
}

// Export candid interface
ic_cdk::export_candid!(); 