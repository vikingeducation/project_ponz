# Ponz.io

## Introduction
This project involves using the passport library to authenticate a pyramid-scheme mock company's referral program. This project also uses recursion in several key locations. The details are elaborated under the "Additional Notes" section in this readme. 

## Technologies Used
Node, Express, MongoDB, Passport

## Getting Started
Clone the repository, the install the dependencies. Create some users to test the project by running `npm run seeds`. Then, launch the project with `npm start`. Try creating a user, then using their referral link, sign up for a separate account in an incognito window. Go back to the first user and see the page populate with the appropriate information.

## Deployment Link
A deployed version of this project may be found [here.](https://shielded-escarpment-47453.herokuapp.com/)

## Additional Notes
This project makes use of recursion in a few key places. It is worth looking at the `register.js` file in the routes folder. Specifically, the updateScoreRecursively function traverses throughout the entirety of the tree structure to find all the parents of the current user and update their scores accordingly. 

The idea is that a direct referral will grant a parent (let's call them User A) a score increase of 40. Then, if this user (let's call them User B) goes on to refer someone else, then User B will have a score increase of 40, and User A a score increase of 20. And so on. If the distance between the registered user and any parent in the tree is greater than 4, then they will be given a flat increase of 1. Considering that a newly registered user can easily have a nearly unlimited amount of parents, the recursive function allows us to easily traverse throughout the entire tree and update the parents' scores appropriately.

Also of note is the handlebars template that manages this in the front end. Considering viewing the file `referrals.handlebars` under views>ponzio. This also likewise recursively renders a handlebars partial in order to display all the children of the currently logged in user in order to see how their own referral pyramid is coming along. 