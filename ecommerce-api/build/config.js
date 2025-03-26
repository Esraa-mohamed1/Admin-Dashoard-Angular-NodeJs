"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.STRIPE_WEBHOOK_SECRET = exports.STRIPE_SECRET = exports.JWT_SECRET = exports.DATABASE_URL = exports.CLIENT_URL = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = 5050;
exports.CLIENT_URL = 'http://localhost:4200';
exports.DATABASE_URL = 'mongodb://127.0.0.1:27017/ecommerce';
exports.JWT_SECRET = 'supersecretjwt';
exports.STRIPE_SECRET = 'sk_test_123456';
exports.STRIPE_WEBHOOK_SECRET = 'whsec_123456';
