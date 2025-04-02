# [WTWR (What to Wear?)](https://leticezwinger.com/): Backend

# Table of Contents

- [Table of Contents](#table-of-contents)
- [Description](#description)
- [API](#api)
- [Deploy](#deploy)
- [System Requirements](#system-requirements)
- [Plugins](#plugins)
- [<a href="https://youtu.be/TOht5NQbq64" rel="nofollow">Video Demo</a>](https://youtu.be/TOht5NQbq64)
- [<a href="https://www.figma.com/design/dQLJwEKasIdspciJAJrCaf/Sprint-11_-WTWR?node-id=311-433&amp;p=f&amp;t=8heaDjekYZaoSaKv-0" rel="nofollow">Figma Design</a>](https://www.figma.com/design/dQLJwEKasIdspciJAJrCaf/Sprint-11_-WTWR?node-id=311-433&p=f&t=8heaDjekYZaoSaKv-0)

<!-- Created by https://github.com/ekalinin/github-markdown-toc -->

# Description

This is the backend of a full-stack web app that helps users save outfits and decide what to wear based on the weather. Built with Node.js, Express, and MongoDB, the server manages user accounts, validates and stores clothing items, and supports weather-based outfit recommendations.

This is a Triple10 web dev program project. In this project we practice:

- Structuring a RESTful API using Express
- Creating data models with Mongoose and connecting to MongoDB
- Implementing secure user authentication with JWT and hashed passwords
- Protecting routes using middleware and role-based access
- Validating input using Celebrate/Joi
- Handling errors with custom error classes and centralized error middleware
- Applying rate limiting and logging middleware for performance and security
- Separating logic into modular files (controllers, routes, middlewares, models)
- Deploying the backend on a Virtual Machine (VM) using Google Cloud Platform (GCP)

![desktop-view](/public/wtwr.png)

# API

Posts are saved into [MongoDB](https://www.mongodb.com/) database and implemented API calls from [OpenWeather](https://openweathermap.org/):

- GET - getClothingItems = ()
- GET - getClothingItemById = (itemId)
- POST - createClothingItem = ({ name, weather, imageUrl })
- DELETE - deleteClothingItem = (itemId, userId)
- PUT - likeItem = (itemId, userId)
- DELETE - unlikeItem = (itemId, userId)
- POST - signUp = ({ name, avatar, email, password })
- POST - login = ({ email, password })
- GET - getCurrentUser = (userId)
- PATCH - updateUser = ({ name, avatar }, userId)

# Deploy

    Install Dependencies
    • npm install

    Development Mode
    • npm run dev

    Production Build
    • npm run build

    Deploying
    • npm run deploy

# System Requirements

- Node.js: v18.0.0 or later
- npm: v8.0.0 or later (or an equivalent package manager such as Yarn)
- MongoDB: v6.0 or later – A running MongoDB instance is required for database operations
- Postman or similar tool: For API testing during development
- Web Browser: A modern browser (e.g. Chrome, Firefox, Safari, or Edge) may be used for viewing responses via front-end or API docs

# Plugins

    Express
    • express v4.18.2 – Minimal and flexible Node.js web application framework

    ESLint
    • eslint v8.56.0 – Identifies and reports on patterns found in ECMAScript/JavaScript code
    • eslint-config-airbnb-base v15.0.0 – Provides Airbnb’s base JS style guide for ESLint
    • eslint-plugin-import v2.29.1 – Supports linting of ES6+ import/export syntax

    Mongoose
    • mongoose v7.6.3 – Elegant MongoDB object modeling for Node.js

    Validator
    • validator v13.11.0 – A library of string validators and sanitizers

    Bcryptjs
    • bcryptjs v2.4.3 – Used for hashing passwords

    Jsonwebtoken
    • jsonwebtoken v9.0.2 – Enables authentication using JWT

    Celebrate/Joi
    • celebrate v15.0.1 – Middleware for validating request bodies using Joi schemas
    • joi v17.9.2 – Data validator for JavaScript objects

    Helmet
    • helmet v7.0.0 – Helps secure Express apps by setting various HTTP headers

    Winston
    • winston v3.9.0 – A versatile logging library for Node.js

    Express-rate-limit
    • express-rate-limit v7.0.0 – Basic IP rate-limiting middleware to prevent abuse

    Cors
    • cors v2.8.5 – Middleware to enable Cross-Origin Resource Sharing

    Dotenv
    • dotenv v16.3.1 – Loads environment variables from a .env file into process.env

    MongoDB Memory Server (for testing)
    • mongodb-memory-server v8.12.1 – Spawns a real MongoDB Server for testing without persistence

# [Video Demo](https://youtu.be/TOht5NQbq64)

# [Figma Design](https://www.figma.com/design/dQLJwEKasIdspciJAJrCaf/Sprint-11_-WTWR?node-id=311-433&p=f&t=8heaDjekYZaoSaKv-0)
