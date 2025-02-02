'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressAppConfig = void 0;
const express_app_config_1 = require("./middleware/express.app.config");
function expressAppConfig(definitionPath, appOptions, customMiddlewares) {
    return new express_app_config_1.ExpressAppConfig(definitionPath, appOptions, customMiddlewares);
}
exports.expressAppConfig = expressAppConfig;
//# sourceMappingURL=index.js.map