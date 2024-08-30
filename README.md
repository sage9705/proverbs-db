# Proverbs API

This is a RESTful API for managing and retrieving proverbs in multiple languages. It's built with Node.js, Express, and MongoDB Atlas.

## Table of Contents

- [Proverbs API](#proverbs-api)
  - [Table of Contents](#table-of-contents)
  - [Setup](#setup)
  - [Database Seeding](#database-seeding)
  - [API Documentation](#api-documentation)
  - [API Endpoints](#api-endpoints)
    - [Get Proverbs](#get-proverbs)
    - [Get Random Proverb](#get-random-proverb)
    - [Search Proverbs](#search-proverbs)
    - [Get Proverb by ID](#get-proverb-by-id)
    - [Create Proverb](#create-proverb)
    - [Update Proverb](#update-proverb)
    - [Delete Proverb](#delete-proverb)
  - [Pagination](#pagination)
  - [Error Handling](#error-handling)

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/sage9705/proverbs-db.git
   cd proverbs-db
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your MongoDB Atlas connection string:

   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   PORT=3000
   ```

4. Start the server:

   ```bash
   npm start
   ```

   For development with auto-restart:

   ```bash
   npm run dev
   ```

## Database Seeding

To populate the database with initial proverbs from the JSON files:

1. Ensure your MongoDB Atlas connection string is correctly set in the `.env` file.
2. Run the seeding script:

   ```bash
   npm run seed
   ```

   This will clear existing proverbs and insert new ones from the JSON files.

## API Documentation

The API is documented using Swagger. Once the server is running, you can access the Swagger UI at:

```
http://localhost:3000/api-docs
```

This interactive documentation provides detailed information about each endpoint, including request parameters, response schemas, and example requests/responses.

## API Endpoints

Base URL: `http://localhost:3000/api/proverbs`

### Get Proverbs

- **GET /**
- Retrieve a paginated list of proverbs.
- Query Parameters:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Number of proverbs per page (default: 10, max: 100)
  - `language` (optional): Filter by language ('en', 'es', or 'fr')
- Example: `GET /api/proverbs?page=2&limit=20&language=en`

### Get Random Proverb

- **GET /random**
- Retrieve a random proverb.
- Query Parameters:
  - `language` (optional): Filter by language ('en', 'es', or 'fr')
- Example: `GET /api/proverbs/random?language=es`

### Search Proverbs

- **GET /search**
- Search proverbs by text.
- Query Parameters:
  - `q`: Search query (required)
  - `language` (optional): Filter by language ('en', 'es', or 'fr')
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Number of proverbs per page (default: 10, max: 100)
- Example: `GET /api/proverbs/search?q=life&language=en&page=1&limit=20`

### Get Proverb by ID

- **GET /:id**
- Retrieve a specific proverb by its ID.
- Example: `GET /api/proverbs/60a123b456c789d012345678`

### Create Proverb

- **POST /**
- Create a new proverb.
- Request Body:
  ```json
  {
    "text": "New proverb text",
    "language": "en",
    "source": "Custom"
  }
  ```

### Update Proverb

- **PUT /:id**
- Update an existing proverb.
- Example: `PUT /api/proverbs/60a123b456c789d012345678`
- Request Body:
  ```json
  {
    "text": "Updated proverb text"
  }
  ```

### Delete Proverb

- **DELETE /:id**
- Delete a proverb by its ID.
- Example: `DELETE /api/proverbs/60a123b456c789d012345678`

## Pagination

The API uses cursor-based pagination for list endpoints. The pagination information is included in the response:

```json
{
  "results": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false,
    "nextPage": 2,
    "prevPage": null,
    "firstPage": 1,
    "lastPage": 10,
    "pages": [
      {
        "page": 1,
        "isCurrent": true,
        "url": "http://localhost:3000/api/proverbs?page=1&limit=10"
      },
      ...
    ]
  }
}
```

This pagination structure provides links to the next, previous, first, and last pages, as well as an array of nearby pages for easy navigation.

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests:

- 200: OK - The request was successful.
- 201: Created - A new resource was successfully created.
- 400: Bad Request - The request was invalid or cannot be served.
- 404: Not Found - The requested resource does not exist.
- 500: Internal Server Error - The server encountered an unexpected condition.

Error responses will include a JSON object with a `message` field describing the error.

Example error response:

```json
{
  "message": "Proverb not found"
}
```

For any issues or feature requests, please open an issue on the GitHub repository.
