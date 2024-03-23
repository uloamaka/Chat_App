<a name="readme-top">Chat_App</a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/uloamaka/Chat_App">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Todo_Apis</h3>

  <p align="center">
    A complete Chat_App, this app allows you to create one on one room chat as well as multiple room chat, performing CRUD tasks like read, update and delete of messages, chat.
    It handle authentication of user, allowing only authenticated user to create and access the Chat page.
    <br />
    <a href="https://github.com/uloamaka/Chat_App"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/uloamaka/Chat_App">View Demo</a>
    ·
    <a href="https://github.com/uloamaka/Chat_App/issues">Report Bug</a>
    ·
    <a href="https://github.com/uloamaka/Chat_App/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![Node][Node.js]][https://nodejs.org/]
* [![Express][Express.com]][https://expressjs.com/]
* [![MongoDb][mongodb.com]][https://www.mongodb.com/]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites
* Node
 (https://nodejs.org/)
* mongodb
 (https://www.mongodb.com/)
* Git
 (https://git-scm.com/downloads)
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Get API Key at env_example.md, change to your own KEY
2. Clone the repo
   ```sh
   git clone https://github.com/<your_github_username>/Todo_Apis.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your API in `.env`
   ```js
   const API_KEY = 'ENTER YOUR API';
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Response Utility Functions | Usage

### `res.ok(payload, meta)`

This function is used to send a successful response (HTTP status code 200) with a payload and optional metadata. The `payload` parameter represents the data to be sent in the response body, while the `meta` parameter is an optional object containing additional information about the response e.g pagination data.

### `res.created(payload)`

Use this function to send a response indicating that a resource has been successfully created (HTTP status code 201). The `payload` parameter represents the data of the newly created resource.

### `res.noContent()`

This function sends a response with no content (HTTP status code 204). It is typically used for successful requests that do not require a response body.

### Custom Error Classes

Instead of using `res.error` directly, this template encourages the use of custom error classes for handling and responding to errors. These classes simplify error handling by providing consistent error structures and HTTP status codes. The following custom error classes are available:

- `BadRequest`: Represents a 400 Bad Request error. It takes a `message` parameter as the error message and an optional `errorCode` parameter to identify the specific error.
- `Unauthorized`: Represents a 401 Unauthorized error. It takes a `message` parameter as the error message and an optional `errorCode` parameter.
- `Forbidden`: Represents a 403 Forbidden error. It takes a `message` parameter as the error message and an optional `errorCode` parameter.

To throw one of these custom errors, simply create a new instance of the appropriate error class and throw it with the desired error message and error code.

### Finding Error Codes

A list of all error codes can be found in the `httpErrorCode.js` file. This file provides a comprehensive collection of HTTP status codes and their corresponding error codes. You can refer to this file to find the appropriate error code when throwing a custom error.

### NPM Commands

The following npm commands are available for managing and running the Express application:

- `npm run dev`: Starts the development server. This command is used during the development process to run the application with automatic reloading on code changes.

- `npm start`: Starts the production server. This command is used to run the application in a production environment.


Feel free to modify and use these commands according to your specific application needs.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [ ] Authentication
- [ ] CREATE ROOM (SOCKET IO) 
    - [ ] full CRUD

See the [open issues](https://github.com/github_username/repo_name/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Your Name - [@ebitegift235](https://x.com/@ebitegift235) - ebitegift235@gmail.com

Project Link: [https://github.com/uloamaka/Todo_Apis](https://github.com/uloamaka/Todo_Apis)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/uloamaka/Todo_Apis.svg?style=for-the-badge
[contributors-url]: https://github.com/uloamaka/Todo_Apis/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/uloamaka/Todo_Apis.svg?style=for-the-badge
[forks-url]: https://github.com/uloamaka/Todo_Apis/network/members
[stars-shield]: https://img.shields.io/github/stars/uloamaka/Todo_Apis.svg?style=for-the-badge
[stars-url]: https://github.com/uloamaka/Todo_Apis/stargazers
[issues-shield]: https://img.shields.io/github/issues/uloamaka/Todo_Apis.svg?style=for-the-badge
[issues-url]: https://github.com/uloamaka/Todo_Apis/issues
[license-shield]: https://img.shields.io/github/license/uloamaka/Todo_Apis.svg?style=for-the-badge
[license-url]: https://github.com/uloamaka/Todo_Apis/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: www.linkedin.com/in/godsgift235
