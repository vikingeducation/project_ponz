# Ponz.io

Ponz.io is a sample social networking app, and totally not a ponzi scheme, which lets users track how many other people they have signed up or "ponzverted".

1. Clone this repo. Running the following command from the terminal should accomplish this:

    git clone https://github.com/GeneTinderholm/project_ponz

2. Install modules. This can be done by running the following command from the terminal inside the main project folder:

    npm i

3. Install mongodb.

Optional step: If you wish to use the store functionality, you must create a database of objects to buy with your "Ponz Pointz". I have included an initial package of cereal images to help you get started.

4. Run the app. This can be done by running the following command from the terminal inside the main project folder:

    node app.js

5. Navigate to [http://localhost:3000](http://localhost:3000) in your browser. 

If you are not logged in, you will be greeted with a log in page. Input your name and password and click the "Log In" button. If you do not have an account, click the "Or Sign Up" link. Then input the desired name and password and click the "Sign Up" button. Then log in as normal.

You should be greeted with a page that looks like the following:

![Main](https://github.com/GeneTinderholm/project_ponz/blob/master/images/main.png?raw=true)

On top is your referal link. Anyone who signs up with this link will be credited to your account.

Below that is a tree of your "Ponzverts" as well as those that your Ponzverts have Ponzverted.

It should look something like:

![Tree](https://github.com/GeneTinderholm/project_ponz/blob/master/images/ponzTree.png?raw=true)

Beside the name of each person is a green badge representing how many Ponz Pointz were credited to your account when they signed up.

Below the tree is the "Pyramid of Opportunity". The top level represents you. The second level represents those you have directly ponzverted. The third level represents those that your Ponzverts have ponzverted and so on. It will continue to grow as new members join your network.

It should look something like:

![Pyramid](https://github.com/GeneTinderholm/project_ponz/blob/master/images/pyramid.png?raw=true)

#####Optional Content

If you set up a database of items to purchase, you can use your Ponz Points to buy items from the integrated store. There is no way to return items, spent Ponz Pointz are gone forever so be careful.

If it is set up, it will look something like this:

![Shop](https://github.com/GeneTinderholm/project_ponz/blob/master/images/cereal.png?raw=true)

Clicking the blue "Buy" button will, if you have enough points, spend your points and display a humorous message.
