# Chatroom

## Introduction
This is a chat system built with the implementation of Angular framework as the frontend, NodeJS as the server (backend) and Bootstrap framework for the interface design. This chat system allows users to communicate with each other in real-time within different groups and channels. Users are assigned with different permission roles when accessing the application.

Github link: https://github.com/LT-Loo/3813ICT-Assignment

---------------
## Git
### Git Layout
The git repository contains the source code of the project and a documentation written as a README file. The src folder contains all resources of the Angular frontend system while the server folder contains the source code for the NodeJS server system. Routes and server sockets are defined in the server systen. All codes are modified and commited on the master (default) branch.

### Version Control Approach
Whenever a feature or section of work is completed, codes are staged and commited to the local repository and are then pushed into the remote repository (GitHub). To keep track on the working progress, short message is included in each commit to provide brief explanation of the feature for better understanding.

Since this is an individual project, I didn't find it necessary to create branches as merge conflict is unlikely to happen during the development.

---------------
## Data Structure
MongoDB is implemented to replace the usage of local storage to store data. MongoDB can only be accessed on the server side.

There are five main data structures stored as collections in the database for this application. They are User, Group, Channel, Member and Chat.

The User collection stores the information of an user. Each of its document contains an ID, username, email, password, profile picture, orole and a date when the user is last active on the site.

The Group collection stores the information of a group. Its document contains an ID, name and the date the group is created.

The Channel collection stores the information of a channel within a group. It has an ID, name, group ID to tell which group the channel is belonged to and the date the channel is created.

The Member collection tells the channel a user has access to. It contains the ID, username and role of the user in the particular group, and also the channel ID and group ID.

A group can have a set of channels while a channel must belong to only one group. A user can be a member of multiple channels and groups.

Every channel has a chat history. Chat collection is used to store the chat history of each channel. Each of the documents contains an ID, the channel ID and an array of chat records. There are two types of chat record:

- Message Record:
` {username, profile pic, message, images, dateTime}`
- Notice Record:
` {notice, dateTime}`

---------------
## REST API
|       **Routes**      	| **Method** 	| **Description**                                                                                                                                                                                                                                                                  	| **Parameters**                                                          	|
|:---------------------:	|:----------:	|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|-------------------------------------------------------------------------	|
|      **`/login`**     	|    POST    	| This route is used for user verification. It checks if user exists in the database and if the password provided matches the one stored in the database. If it does, the routes return the user data. Otherwise, it returns error.                                                	| `username: string, password: string`                                    	|
|    **`/register`**    	|    POST    	| This route creates a new user if the username isn't already taken. New user will have a default profile picture and user role which can be changed later. The user data is returned as response.                                                                                 	| `username: string, email: string`                                       	|
|     **`/getALL`**     	|     GET    	| This route returns a list of all items from requested collection in the database.                                                                                                                                                                                                	| `collection: string`                                                    	|
|     **`/getItem`**    	|    POST    	| This route retrieve an item via its ID from mentioned collection.                                                                                                                                                                                                                	| `collection: string, _id: string`                                       	|
|     **`/getList`**    	|    POST    	| This route get list of items from requested collection. Items will only be retrieved if given conditions are met.                                                                                                                                                                	| `collection: string, data: {conditions}`                                	|
| **`/getChannelData`** 	|    POST    	| This route retrieved a list of channel members and the chat history of a specific channel via its channel ID.                                                                                                                                                                    	| `channelID: string`                                                     	|
|   **`/getUserByID`**  	|    POST    	| This route retrieve user data from database via the user ID.                                                                                                                                                                                                                     	| `userID: string`                                                        	|
|    **`/newGroup`**    	|    POST    	| This route creates a new group. It also creates channel for the group if channel list is provided. All Super Admins and creator of the group are added as members of the channels.                                                                                               	| `name: string, dateTime: string, channelList: string[]`                 	|
|   **`/newChannel`**   	|    POST    	| This route creates a new channel in a group. All Super Admins, Group Admins and Group Assistants of the group are added automatically as members of the channel. If a list of new members is provided, it will also add them into the channel.                                   	| `name: string, groupID: string, dateTime: string, memberList: string[]` 	|
|    **`/addMember`**   	|    POST    	| This route add members to existing channel. It will only add the member if the member is not already in the channel to avoid duplicate data.                                                                                                                                     	| `channelID: string, memberList: string[]`                               	|
|   **`/deleteGroup`**  	|    POST    	| This route delete an existing group. It will also delete all channels within the group, all members in the group and all chat history.                                                                                                                                           	| `id: string`                                                            	|
|  **`/deleteChannel`** 	|    POST    	| This route delete an existing channel. The members and the chat history of the channel will also be deleted.                                                                                                                                                                     	| `id: string`                                                            	|
|   **`/deleteMany`**   	|    POST    	| This route delete multiple items from a specific collection. Items will only be deleted if the conditions are met.                                                                                                                                                               	| `collection: string, data: {conditions}`                                	|
|     **`/update`**     	|    POST    	| This route update item data from specific collection. If the process involved updating the user password, it will encrypt the password before storing it into the database.                                                                                                      	| `collection: string, data: {update data}`                               	|
|   **`/upgradeUser`**  	|    POST    	| This route upgrade user's role. If the user is upgraded to a Super Admin, it will update both the user role and group role. If the user is upgraded to a Group Admin, it will not update the group role as user can only be a Group Admin of a group the user created.           	| `username: string, role: string`                                        	|
|  **`/uploadImages`**  	|    POST    	| This route store images in server directory. `isFileValid()` function is used to validate the type of the files. Only image files are accepted. We also have `saveFile()` function to carry out the actual saving process. This route returns a list of filenames to the client. 	| `fd: Form Data`                                                         	|

---------------
## Angular Architecture
---------------
## Components
### Login
This is the default route for the program. It consists of a login form with input fields for username and password, and a login button. When the login button is clicked, the program calls the login() function, which sends a HTTP POST request to "/login" route with the username and password to the server. The server will check if the username received actually exists in the database and if the password provided matches the one stored in the database. If the user is valid, the component will receive a response with user data. The application will then navigate the user to the "/account" route.

If the user is invalid, error message will be displayed on the frontend.

### Account
This is the route the application will navigate the user to after gaining permission to access the site. The route takes the user ID as the query parameter. 

Once the component is successfully rendered and loaded on the page, the application will first retrieve all necessary data from the database for later access. The page displayed on the frontend consists of a section to display some basic user information and another section to list out the groups that the user has joined. Specific features or buttons are displayed based on the role of the current user.

The table below provides brief explanation of each option and the permission role a user should have to access them.
| Feature/Button 	| Explanation                                                                                                                                                                                                                                	|         Permission Role        	|   	
|:-------------:	|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|:------------------------------:	|
|     Logout    	| Logout and exit from the application. User is redirected back to the login page.                                                                                                                                                           	|               ALL              	|   	
|  Create Group 	| Open a modal that consists of input form to create a new group.                                                                                                                                                                            	| - Super Admin<br>- Group Admin 	|   	
|   Admin Work  	| Displayed as a gear/setting button. Open a modal that consists of options to create new user, create new group or change the role of a user.                                                                                               	| - Super Admin<br>- Group Admin 	|   	
|     Group     	| Clicking on the group will open a modal that displays the information of the group. 	|               ALL              	|   	
| Settings          |Open a modal that consists of input form to change profile picture or password.|ALL|

  
### Channel
This is the route that brings user to the channel room. This route takes two query arguments, the group ID and the channel ID. 

The component consists of three sections. A channel panel to list out the channels within the group which the user are given permission to access to, a chatting section to send message and communicate in the channel, and a member list to display all members in the channel. There are extra features which are available only to users with specific roles.

|  Option/Button 	| Explanation                                                                                                                                                                                                                                             	|                                                          Permission Role                                                          	|
|:--------------:	|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|:---------------------------------------------------------------------------------------------------------------------------------:	|
|      Leave     	| Clicking on the button will get user out of the Channel Room and redirect back to the Account route.                                                                                                                                                    	|                                                                ALL                                                                	|
| Delete Channel 	| Clicking on this button will delete the channel the user currently join.                                                                                                                                                                                	|                                                   - Super Admin<br>- Group Admin                                                  	|
|   Delete User  	| When the cursor hovers over the username in the member list, a bin button appears beside the username. Clicking on the button will display a dropdown list which user can choose to either delete the selected used from the channel or from the group. 	| - Super Admin can remove any user<br>- Group Admin can remove Group Assis and normal user<br>- Group Assis can remove normal user 	|
|  Send Message  	| Non-functionable                                                                                                                                                                                                                                        	|                                                                ALL                                                                	|

---------------
## Modals
A modal is implemented as a popup dialog that allows several features such as creating a new user, adding a member to a channel etc. The modal is triggered by interacting with the buttons rendered in the Account page.

The table below provides description of the each feature shown in the modal and their respective functionalities.

|        Modal        	| Description                                                                                                                                                                                                                                                                                                                                                                                                                                        	| Feature/Button                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  	|                 Permission Role                 	|
|:-------------------:	|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|:-----------------------------------------------:	|
|    Group Details    	| Display information of the group and list out the channels available for the user to join when user clicks on the group icon in the Account page.                                                                                                                                                                                                                                                                                                  	| Join Channel - User selects on a channel and click on the Join Channel button to navigate to the specific channel room.<br><br>Delete Channel - Available to Super Admin and Group Admin. User select a channel and click on the Delete Channel button to delete the channel.<br><br>Create Channel - Available to Super Admin, Group Admin and Group Assis. Clicking on button changes the display of the modal to the Create Channel form.<br><br>Add Member - Available to Super Admin, Group Admin and Group Assis. User select a channel and click on the button to change the display of the modal to the Add Member Form.<br><br>Delete Group - Available to Super Admin and Group Admin. Clicking on the button deletes the group and closes the modal. 	|                       ALL                       	|
| Create Channel Form 	| Display input form to create a new channel within the group. User can also add members while creating the channel.<br><br>Super Admin and Group Admin can add any user into the new channel while Group Assis can only add member within the group into the new channel.                                                                                                                                                                           	| Add Button - Add user into the channel if the username entered is valid. Otherwise, display error message for invalid user.<br><br>Create - Create new channel and add listed members into the new channel after making sure the name of the new channel is valid. Otherwise, display error message.                                                                                                                                                                                                                                                                                                                                                                                                                                                            	| - Super Admin<br>- Group Admin<br>- Group Assis 	|
|   Add Member Form   	| Display input form to add member into selected channel. User enters username into the input field and click on the Add button. The application will check if the username entered is valid. If yes, the username will be displayed as a list below the form.<br><br>Multiple members can be added. Super Admin and Group Admin can add any user into the selected channel while Group Assis can only add member within the group into the channel. 	| Add Button - Add user into the list if the username entered is valid. Otherwise, display error message.<br><br>Add Member - Add list of users into the selected channel.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        	| - Super Admin<br>- Group Admin<br>- Group Assis 	|
|  Create Group Form  	| Display input form to create a new group. User needs to fill in the input form with the group name. The group must not have the same name as the existing groups.<br><br>User can also create new channels in the group. The channel names within the group cannot be repeated.<br><br>Error message will be displayed if the input entered is invalid.                                                                                            	| Add Button - Add channel into the list of new channels<br><br>Create - Create the group and the channels within the group                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       	|          - Super Admin<br>- Group Admin         	|
|      Admin Work     	| It consists of three input forms in accordion:<br><br>- Create new user: Need username, email and role in the input form. Username must not be same as existing usernames. Otherwise, an error message will be displayed.<br><br>- Create new group: Functions the same as the Create Group Form<br><br>- Change user role: Enter username of user and select a new role for the user.`                                                            	| N/A                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             	|          - Super Admin<br>- Group Admin         	|
|Settings|Provide input forms to change profile picture or change account password|N/A|ALL|


---------------
## Services
### User Data Service
|       **Method**      	| **Description**                                                                                                                                        	|
|:---------------------:	|--------------------------------------------------------------------------------------------------------------------------------------------------------	|
|      **login()**      	| Send HTTP POST request to /login with request body of username and password to verify user and redirect user to Account Page if user is authenticated. 	|
|   **getUserByID()**   	| Send HTTP POST request to /getUserByID with request body of user ID to get user data.                                                                  	|
|  **getUserGroups()**  	| Send HTTP POST request to /getList with the request body of collection name and group ID to get a list of groups that the user joined.                 	|
| **getUserChannels()** 	| Send HTTP POST request to /getList with the request body of collection name, group ID and channel ID to get a list of channels that the user joined.   	|
|     **register()**    	| Send HTTP POST request to /register with the request body of username and email to create new user.                                                    	|
|   **getAllUsers()**   	| Send HTTP POST request to /getALL with the collection name as the request body to retrieve all user data.                                              	|
|   **upgradeUser()**   	| Send HTTP POST request to /upgradeUser with the request body of user ID and role to update user's role.                                                	|
|    **updateUSer()**   	| Send HTTP POST request to /update with update data and the collection name as the request body to update user data.                                    	|


### Group Channel Data Service
|        **Method**        	| **Description**                                                                                                                                                              	|
|:------------------------:	|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
|      **newGroup()**      	| Send HTTP POST request to /newGroup with request body of group name and channel list to create new group and channels.                                                       	|
|     **newChannel()**     	| Send HTTP POST request to /newChannel with request body of channel name, group ID and member list to create new channel in specified group and add members into the channel. 	|
|      **getGroup()**      	| Send HTTP POST request to /getItem with the request body of collection name and group ID to get requested group data.                                                        	|
|   **getChannelData()**   	| Send HTTP POST request to /getChannelData with the request body of channel ID to get the members and the chat history of the channel.                                        	|
|   **getGroupMembers()**  	| Send HTTP POST request to /getList with the request body of the collection name and groupID to get a list of members in the group.                                           	|
| **addMemberToChannel()** 	| Send HTTP POST request to /addMember with the channel ID and memeber list as the request body to add members into specified channel.                                         	|
|     **deleteGroup()**    	| Send HTTP POST request to /deleteGroup with the request body of group ID to delete the group.                                                                                	|
|    **deleteChannel()**   	| Send HTTP POST request to /deleteChannel with the request body of channel ID to delete the channel.                                                                          	|
| **deleteFromGroup()**    	| Send HTTP POST request to /deleteMany with the request body of the collection name, user ID and group ID to delete selected member from the group.                           	|
| **deleteFromChannel()**  	| Send HTTP POST request to /deleteMany with the request body of the collection name, user ID and channel ID to delete selected member from the channel.                       	|


### Image Upload Service
|    **Method**   	| **Description**                                                                                                           	|
|:---------------:	|---------------------------------------------------------------------------------------------------------------------------	|
| **imgUpload()** 	| Send HTTP POST request to /uploadImages with request body of image files (Form Data type) to store image files in server. 	|


### Chat Service (Socket Service)
|    **Method**    	| **Description**                                                                            	|
|:----------------:	|--------------------------------------------------------------------------------------------	|
| **initSocket()** 	| Initializes client socket.                                                                 	|
|    **join()**    	| Request to join selected channel by emitting username and channel ID to the server socket. 	|
|    **leave()**   	| Request to leave channel                                                                   	|
|   **switch()**   	| Request to switch channel within group by emitting channal ID to the server socket.        	|
|    **send()**    	| Send message to server socket.                                                             	|
|   **getJoin()**  	| Listen for response after requesting to join a channel.                                    	|
|  **getSwitch()** 	| Listen for response after requesting to switch channel.                                    	|
| **getMessage()** 	| Listen for new message from server socket.                                                 	|                                    	|  

---------------
## Author
Ler Theng Loo (s5212872)    
3813ICT Software Frameworks    
Griffith Univeristy    
