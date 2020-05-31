# Fridgify

## [Dev] Notes/Reference:

- Expo hot reloading means any saved changes you make within **fridgify-client** will instantly reload the client to display the change.

- Our express-backend server does not have hot-reload. To show the changes made in **fridgify-server**, restart the server manually.

Port numbers:

Kitematic : 32768  
Express : 3200

## [Dev] Setup:

### Docker/Mongo setup:

1. install [docker for desktop](https://www.docker.com/products/docker-desktop)

2. install [kitematic](https://github.com/docker/kitematic/releases)
   (choose between top 3 distributions)

3. run docker.

4. open kitematic. search and create 'mongo' (make sure docker is running)

5. start Mongo container from the left bar if not running.

6. With Mongo container selected, click on settings in top right corner.

7. Check the published IP:PORT is **localhost:32768**

---

### Code setup / installing dependencies

Go to a directory you want to install the project.
(terminal ex)

Using terminal, clone the code. (recommended via git clone)

    git clone https://github.com/daseyun/Fridgify.git

---

### Backend server:

Enter folder:

    cd Fridgify/src/fridgify-server

Install dependencies:

    sudo npm install

Test the server works: (this starts the backend server)

    npm start

Expected output:

> MongoDB connected: mongodb://localhost:32768  
> dev listening on: 3200

To stop the server: ctrl + c

---

### Frontend server:

Enter fridgify-client directory: (from fridgify-server directory)

    cd ../fridgify-client

Install dependencies and start expo server:

    sudo npm install
    expo start

Different methods of opening the client:

1. Run on simulator
2. web browser
3. install 'expo' from the App Store & scan the QR code. _(Recommended)_

---

### Setting up config:

Note the localhost port for expo.

Go to root project folder.

Go to config/config.json.

Set 'expo_port' to the localhost port.
