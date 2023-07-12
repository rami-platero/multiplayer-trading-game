# Trading Game
This is a real time trading game app where users can trade items with other users in different lobbies. The trading system is heavily inspired by the old facebook game called Stick Run, with some features such as:

- General chat in lobbies
- Private chat for users (while trading)
- Great variety of items with their own rarity
- System to trade multiple items with users in real time
- Shop to buy premium items

## **Tech Stack**

**Programming Language**
- Typescript

**Frontend**
- React

**Backend**
- Node.js
- Express
- Socket.io
- JWT

## **Installation Process**

1. Clone this repository
    ```
    git clone https://github.com/rami-platero/multiplayer-trading-game.git
    ```
2. Install npm packages
    - Install frontend packages
    ```
    cd client
    npm install
    ```
    - Install backend packages
    ```
    cd server
    npm install
    ```
3. Create .env file inside the Server folder for the backend and follow this sample code.
    - Sample code
    ```javascript
    MONGODB_URI=YOUR_MONGODB_URI
    SECRET=YOUR_JWT_SECRET_TOKEN
    PORT=PORT_NUMBER
    ```
4. Change cors origin
    - In the backend go to the Sockets folder and inside the socket.ts file change the url to where your frontend is being hosted at.
    ```javascript
    const io = new SocketServer(server, {
    cors: {
      origin: "YOUR_URL",
    },
    });
   ```
   - For the frontend you will have to change the api endpoints
        1. First one is inside the App.tsx file, in one of the first lines of code. You will have to change the axios base url to the url of where your backend is being hosted.
            ```javascript
            axios.defaults.baseURL = `YOUR_URL`; 
            ```
        2. Second one inside the context folder, open the UserContext.tsx file and inside the useEffect code block you will have change the url to the one you are using for you backend, to tell socket.io where to make the requests.
            ```javascript
            useEffect(() => {
                const socket = io("YOUR_URL");

                socket.on("connect", () => {
                    setSocket(socket);
                });
                ...
            ```
        3. Last few inside the hooks folder, you will change the endpoints of the useLogin hook and useSignUp hook.
            ```javascript
            const res = await fetch("YOUR_URL/login", {
            method: "POST",
            ...
            ```
            ```javascript
            const res = await fetch("YOUR_URL/signup", {
            method: "POST",
            ...
            ```

   

