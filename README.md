# JKL_2DoList
A progressive Webapp (to-do-list), createt as part of the module mobile web applicaton.

### Prerequisites

- node.js

### Installing
Clone --> npm install --> node server.js

or if you want the server to restart after each change, install Nodemon first:

Clone --> npm install --> npm i nodemon -g --> nodemon run

## Troubleshooting
The app works offline as good as online; however, if the page is reloaded offline the service worker somehow doesn't react after sync events anymore --> reinstall service worker

If the app doesn't work as you've expected follow these steps

1) Clear your cache
2) Clear your IndexDB
3) Clear local storage

if that doesn't help uninstall the service worker and refresh the page!



## Tested

The App has been tested with Chrome!


## Deployment

!Attention the connection has to be https!
You can find a live Version on [HEROKU](https://jkl2dolist.herokuapp.com)

## Built With

- Node.js
- Bootstrap

## Authors

See  the list of [contributors](https://github.com/enjoymrban/JKL_2DoList/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


