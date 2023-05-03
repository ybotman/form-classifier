i am confused here: (a bit of summeary and history-- > )


*** We build the server in ./ server.js
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const cors = require("cors");

server.use(cors());
server.use(middlewares);
server.use(router);
server.listen(5001, () => {
    console.log("JSON Server is running on port 5001");
});


**** Then we built
    ./ src / apiConfig.js
export const apiUrl = "http://localhost:5001";

This should be the basis for all gets and post / push--  (question #1 - is this correct so far ?)

Then we used it in :
    ./pages/index.js with
    import { apiUrl } from "../apiConfig";
    ...
const { data } = await axios.get(`${apiUrl}/images`);
 
And similar in the pages / api...

(qestion #2, shouldnot the put api be simiiar to the axios get ?)