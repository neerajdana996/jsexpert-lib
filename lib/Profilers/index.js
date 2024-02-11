"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsPerformance_1 = require("./JsPerformance");
var JsexpertProfiler = /** @class */ (function () {
    function JsexpertProfiler() {
    }
    JsexpertProfiler.prototype.activate = function (_a) {
        var clientId = _a.clientId, clientSecret = _a.clientSecret, projectName = _a.projectName, _b = _a.additionalInstrumentations, _c = _a.disableInstrumentations;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.projectName = projectName;
        if (!this.clientId || !this.clientSecret)
            throw new Error('You need to call init method before getJsPerformance');
        var sdk = (0, JsPerformance_1.default)(this.clientId, this.clientSecret, this.projectName);
        sdk.start();
    };
    return JsexpertProfiler;
}());
exports.default = JsexpertProfiler;
