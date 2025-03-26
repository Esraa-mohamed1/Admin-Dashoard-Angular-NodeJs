"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
mongoose_1.default.connect(`${config_1.DATABASE_URL}`)
    .then(() => console.log('Successfully connected to the database'))
    .catch(err => console.error('Error connecting to the database: ', err));
