# Customer Referral Site Source Code

A customer referral site that utilizes Dynamically-generated URLS for referrals

Features: 
- Display of referrals that your referrals created 
- Generates a unique 'referral' url for each user 
- User authentification and 'points' accounting with a NoSQL database

## Deployed Site

Check out this project at: https://secret-atoll-15400.herokuapp.com

## Key Technologies Used and Technical Challenges 

Key Technologies used: 
- unique URL creation
- Heroku
- NoSQL Databases 
- ExpressJS

Challenges:
- Display of Users referred (i.e. create the 'nesting' of users referred by user's referrals see ) -> utilized a 'deep populate' function from Mongoose (similar to a SQL join) and a recursive function to determine the 'depth'/'nesting' of users 

## Demo

![Alt text](./images/1.png?raw=true "Title")
![Alt text](./images/2.png?raw=true "Title")

## Deployment

### Prerequisites

What things you need to install the software and how to install them

* node
* npm
* mongodb

### How to deploy this on your local machine

```
git clone <project-folder-on-github>
cd <cloned-project-folder-on-your-local-machine>
npm install
nodemon app.js
```

## Authors

* **Steven Li** - _Initial work_ -
