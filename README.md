## Introduction
This is a chat system that facilitates real-time communication among users across various groups and channels, built with the implementation of Angular framework. Sockets are integrated to ensure reliable data exchange, providng an enhanced user experience for interactive channel-based conversations. 

## Key Feature
### User Roles & Permissions
Users are allocated different roles and permission based on their user types.
| Permission | Super Admin | Group Admin | Group Assistant |
| --- | :---: | :---: | :---: |
| Create new user with Group Admin Role | Yes | | |
| Delete user account | Yes | | |
| Upgrade user to Super Admin role | Yes | | |
| Create new group | Yes | Yes | |
| Create channel within group | Any group | Only for groups they created | Only for groups they joined |
| Delete group or channel | Any group | Only for groups they created | |
| Invite user to a channel | Any group | Only for groups they created | Only for groups they joined |
|Remove user from a channel or group | Any user in any group | Any user except Super Admin in the groups they created | Only normal users in the groups they joined |
| Upgrade a user role to Group Assistant | Any group | Only for groups they created | |

## Technologies Used
- Language: TypeScript
- Framework: Angular, Bootstrap
- Database: MongoDB
- Environement: Node.js

## Developer
Loo<br>
loo.workspace@gmail.com   
