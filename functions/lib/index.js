"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = __importStar(require("firebase-functions"));
const express_1 = __importDefault(require("express"));
const next_1 = __importDefault(require("next"));
const node_fetch_1 = __importStar(require("node-fetch"));
// Polyfill the Web API objects
global.Request = node_fetch_1.Request;
global.Response = node_fetch_1.Response;
global.Headers = node_fetch_1.Headers;
global.fetch = node_fetch_1.default;
const app = (0, next_1.default)({
    dev: false,
    conf: { distDir: '.next' },
});
const handle = app.getRequestHandler();
const server = (0, express_1.default)();
// Use Express to handle all requests with the Next.js handler
server.all('*', (req, res) => {
    return app.prepare().then(() => handle(req, res));
});
exports.nextApp = functions.https.onRequest(server);
