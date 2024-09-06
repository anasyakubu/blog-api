### README.md

````markdown
# Blog Post Management API

This is a Blog Post Management API with full CRUD capabilities, role-based access control, comment system, post engagement (likes), search and filtering, and more. The API is built with Node.js, Express, MongoDB, and JWT for authentication.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [Blog Post Management (CRUD)](#blog-post-management-crud)
4. [Categories and Tags](#categories-and-tags)
5. [Comment System](#comment-system)
6. [Post Liking and Engagement](#post-liking-and-engagement)
7. [Search and Filtering](#search-and-filtering)
8. [Role-Based Access Control](#role-based-access-control)
9. [Testing with Postman](#testing-with-postman)

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/blog-post-management-api.git
   cd blog-post-management-api
   ```
````

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file and add the following environment variables:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the server:**

   ```bash
   npm start
   ```

## Authentication

### 1. Register User

- **Endpoint:** `POST /api/auth/register`
- **Description:** Register a new user.
- **Request Body:**

  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- **Response:**

  ```json
  {
    "message": "User registered successfully!"
  }
  ```

### 2. Login User

- **Endpoint:** `POST /api/auth/login`
- **Description:** Login user and get a JWT token.
- **Request Body:**

  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- **Response:**

  ```json
  {
    "token": "your_jwt_token"
  }
  ```

## Blog Post Management (CRUD)

### 1. Create a Blog Post

- **Endpoint:** `POST /api/posts`
- **Description:** Allow authenticated users to create blog posts with a title, body, categories, and tags. Supports image uploads.
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**

  ```json
  {
    "title": "My First Blog Post",
    "body": "This is the content of the blog post.",
    "categories": ["Technology", "Programming"],
    "tags": ["Node.js", "Express"]
  }
  ```

- **Response:**

  ```json
  {
    "message": "Post created successfully!",
    "post": {
      "_id": "postId",
      "title": "My First Blog Post",
      "body": "This is the content of the blog post.",
      ...
    }
  }
  ```

### 2. Retrieve All Blog Posts

- **Endpoint:** `GET /api/posts`
- **Description:** Retrieve a list of all posts with pagination and sorting.
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Number of posts per page (default: 10)
- **Response:**

  ```json
  {
    "posts": [
      {
        "_id": "postId",
        "title": "My First Blog Post",
        "body": "This is the content of the blog post.",
        ...
      },
      ...
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalPosts": 100
    }
  }
  ```

### 3. Update a Blog Post

- **Endpoint:** `PUT /api/posts/:postId`
- **Description:** Allow post owners or admins to update their blog posts.
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**

  ```json
  {
    "title": "Updated Blog Post Title",
    "body": "Updated content of the blog post."
  }
  ```

- **Response:**

  ```json
  {
    "message": "Post updated successfully!",
    "post": {
      "_id": "postId",
      "title": "Updated Blog Post Title",
      ...
    }
  }
  ```

### 4. Delete a Blog Post

- **Endpoint:** `DELETE /api/posts/:postId`
- **Description:** Allow post owners or admins to delete posts.
- **Headers:** `Authorization: Bearer <token>`
- **Response:**

  ```json
  {
    "message": "Post deleted successfully!"
  }
  ```

## Categories and Tags

### 1. Create a Category (Admin Only)

- **Endpoint:** `POST /api/categories`
- **Description:** Admins can create and manage post categories.
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**

  ```json
  {
    "name": "Technology"
  }
  ```

- **Response:**

  ```json
  {
    "message": "Category created successfully!",
    "category": {
      "_id": "categoryId",
      "name": "Technology"
    }
  }
  ```

### 2. Add Tags to Posts

- **Endpoint:** `POST /api/posts/:postId/tags`
- **Description:** Allow users to add tags to posts.
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**

  ```json
  {
    "tags": ["JavaScript", "Web Development"]
  }
  ```

- **Response:**

  ```json
  {
    "message": "Tags added successfully!",
    "post": {
      "_id": "postId",
      "tags": ["JavaScript", "Web Development"]
    }
  }
  ```

### 3. Fetch Available Tags

- **Endpoint:** `GET /api/tags`
- **Description:** Fetch available tags and filter posts by tag.
- **Response:**

  ```json
  {
    "tags": ["Node.js", "Express", "MongoDB", ...]
  }
  ```

## Comment System

### 1. Add a Comment to a Post

- **Endpoint:** `POST /api/posts/:postId/comments`
- **Description:** Allow users to comment on posts.
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**

  ```json
  {
    "comment": "This is a great post!"
  }
  ```

- **Response:**

  ```json
  {
    "message": "Comment added successfully!",
    "comment": {
      "_id": "commentId",
      "comment": "This is a great post!",
      ...
    }
  }
  ```

### 2. Delete a Comment

- **Endpoint:** `DELETE /api/posts/:postId/comments/:commentId`
- **Description:** Allow users to delete their comments, and admins to moderate comments.
- **Headers:** `Authorization: Bearer <token>`
- **Response:**

  ```json
  {
    "message": "Comment deleted successfully!"
  }
  ```

## Post Liking and Engagement

### 1. Like a Post

- **Endpoint:** `POST /api/posts/:postId/like`
- **Description:** Allow users to like a post.
- **Headers:** `Authorization: Bearer <token>`
- **Response:**

  ```json
  {
    "message": "Post liked successfully!"
  }
  ```

### 2. Fetch Popular Posts

- **Endpoint:** `GET /api/posts/popular`
- **Description:** Fetch popular posts based on like counts and comment activity.
- **Response:**

  ```json
  {
    "posts": [
      {
        "_id": "postId",
        "title": "Popular Post",
        ...
      },
      ...
    ]
  }
  ```

## Search and Filtering

### 1. Search Posts

- **Endpoint:** `GET /api/search`
- **Description:** Implement search functionality for posts based on keywords in titles or body.
- **Query Parameters:**
  - `q`: Search query (e.g., `?q=javascript`)
- **Response:**

  ```json
  {
    "posts": [
      {
        "_id": "postId",
        "title": "JavaScript Tips",
        ...
      },
      ...
    ]
  }
  ```

## Role-Based Access Control

- **Admins** can approve/reject posts, manage users, and delete any post.
- **Regular Users** can only modify or delete their own posts and comments.

## Testing with Postman

1. **Import the Postman Collection:** [Download Postman Collection](#) and import it into Postman.
2. **Set Environment Variables:**
   - Set `BASE_URL` to `http://localhost:5000/api`
   - Set `TOKEN` to the JWT token obtained after login.
3. \*\*Follow the API End

points Documentation:\*\* Use the provided request examples and responses to test the endpoints.

## Contributing

Feel free to fork this repository, create a new branch, and submit a pull request.

## License

This project is licensed under the MIT License.

```

This README provides a comprehensive guide for testing your Blog Post Management API with Postman. Adjust the endpoints and request bodies as needed based on your actual API implementation.
```
