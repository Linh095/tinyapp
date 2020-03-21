# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly). Users must register in order to creat new short URLs and view other users' short URLs. Once registered and logged in, each user will have their own library of short URLs corresponding to original long URLs. They will also be able to track how many other Tiny app users have visted their short URL and the total number of visits.

## Final Product

!["Home page when user is not logged in"](https://github.com/Linh095/tinyapp/blob/master/docs/homepage.png)
!["Home page of a logged in user"](https://github.com/Linh095/tinyapp/blob/master/docs/urls.png)
!["Page to add new short URL to each user's library"](https://github.com/Linh095/tinyapp/blob/master/docs/create_shortUrl.png)
!["Page to edit exisiting short URL that the user has created"](https://github.com/Linh095/tinyapp/blob/master/docs/edit_shortUrl.png)
!["Page viewing short URL that user did not create (visits of people who did not create shortURL counts towards total number of visits and visitors)"](https://github.com/Linh095/tinyapp/blob/master/docs/shortURL_not_owner.png)



## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session
- method-override

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.