import swaggerAutogen from "swagger-autogen";
import dotenv from "dotenv";
dotenv.config();
const doc = {
  info: {
    version: "1.0.0",
    title: "FoodDelivery App",
    description: "Food App API's",
  },
  // "host": "http://122.175.39.120:8089",
  host: "192.168.1.14:8089",
  basePath: "/",
  schemes: [],
  consumes: ["application/json", "multipart/form-data"],
  produces: ["application/json", "multipart/form-data"],
  tags: [
    { name: "Users", description: "User Api's" },
    { name: "UserCart", description: "Cart Api's" },
    { name: "Address", description: "Address Api's" },
    { name: "Products", description: "Product Api's" },
    { name: "bussiness", description: "bussiness Api's" },
    { name: "categories", description: "categories Api's" },
    { name: "productCategories", description: "productCategories Api's" },
    { name: "orders", description: "Order Api's" },
    { name: "review", description: "Review Api's" },
    { name: "image", description: "image Api's" },
    { name: "todayspecials", description: "todayspecials Api's" },
    { name: "bestchoice", description: "bestchoice Api's" },
    { name: "bestOffers", description: "bestOffer Api's" },
    { name: "search", description: "search Api" },
  ],
};

const outputFile = "./swagger-output.json";
const routes = ["../app.ts"];

let options = {
  autoBody: false,
};

swaggerAutogen(options)(outputFile, routes, doc);
