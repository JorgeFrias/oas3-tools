'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressAppConfig = void 0;
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const bodyParserXml = require("body-parser-xml");
const xml2js = require("xml2js");
const cors = require("cors");
const swagger_ui_1 = require("./swagger.ui");
const swagger_router_1 = require("./swagger.router");
const swagger_parameters_1 = require("./swagger.parameters");
const logger = require("morgan");
const fs = require("fs");
const jsyaml = require("js-yaml");
const OpenApiValidator = require("express-openapi-validator");
class ExpressAppConfig {
    constructor(definitionPath, appOptions, customMiddlewares) {
        this.definitionPath = definitionPath;
        this.routingOptions = appOptions.routing;
        this.setOpenApiValidatorOptions(definitionPath, appOptions);
        // Create new express app only if not passed by options
        this.app = appOptions.app || express();
        this.app.use(cors(appOptions.cors));
        const spec = fs.readFileSync(definitionPath, 'utf8');
        const swaggerDoc = jsyaml.safeLoad(spec);
        this.app.use(bodyParser.urlencoded());
        this.app.use(bodyParser.text());
        this.app.use(bodyParser.json({ limit: '25mb' }));
        this.app.use(bodyParser.raw({ type: 'application/pdf' }));
        this.app.use(this.configureXmlParser(appOptions));
        this.app.use(this.configureXmlSanitiser(appOptions));
        // this.app.use(function (req, res, next){console.log(req.body);next();});
        this.app.use(this.configureLogger(appOptions.logging));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cookieParser());
        const swaggerUi = new swagger_ui_1.SwaggerUI(swaggerDoc, appOptions.swaggerUI);
        this.app.use(swaggerUi.serveStaticContent());
        this.app.use(OpenApiValidator.middleware(this.openApiValidatorOptions));
        this.app.use(new swagger_parameters_1.SwaggerParameters().checkParameters());
        // Bind custom middlewares which need access to the OpenApiRequest context before controllers initialization
        (customMiddlewares || []).forEach(middleware => this.app.use(middleware));
        this.app.use(new swagger_router_1.SwaggerRouter().initialize(this.routingOptions));
        this.app.use(this.errorHandler);
    }
    configureXmlParser(appOptions) {
        bodyParserXml(bodyParser);
        const bodyParserPlusXMLParser = bodyParser;
        let xmlTagNameProcessors = [xml2js.processors.stripPrefix];
        let xmlValueProcessors = [xml2js.processors.parseNumbers, xml2js.processors.parseBooleans];
        let xmlOptions = appOptions.xml;
        if (xmlOptions != undefined) {
            if (xmlOptions.tagNameProcessors != undefined
                && Array.isArray(xmlOptions.tagNameProcessors)) {
                xmlTagNameProcessors = xmlOptions.tagNameProcessors;
            }
            if (xmlOptions.valueProcessors != undefined
                && Array.isArray(xmlOptions.valueProcessors)) {
                xmlValueProcessors = xmlOptions.valueProcessors;
            }
        }
        return bodyParserPlusXMLParser.xml({
            xmlParseOptions: {
                mergeAttrs: true,
                normalize: true,
                normalizeTags: false,
                explicitRoot: false,
                explicitArray: false,
                tagNameProcessors: xmlTagNameProcessors,
                valueProcessors: xmlValueProcessors
            }
        });
    }
    configureXmlSanitiser(appOptions) {
        let xmlSanitizerProcessor = function (req, res, next) { next(); };
        let xmlOptions = appOptions.xml;
        if (xmlOptions != undefined) {
            if (xmlOptions.sanitiseProcessors != undefined) {
                xmlSanitizerProcessor = xmlOptions.sanitiseProcessors;
            }
        }
        return xmlSanitizerProcessor;
    }
    setOpenApiValidatorOptions(definitionPath, appOptions) {
        //If no options or no openApiValidator Options given, create empty options with api definition path
        if (!appOptions || !appOptions.openApiValidator) {
            this.openApiValidatorOptions = { apiSpec: definitionPath };
            return;
        }
        // use the given options
        this.openApiValidatorOptions = appOptions.openApiValidator;
        // Override apiSpec with definition Path to keep the prior behavior
        this.openApiValidatorOptions.apiSpec = definitionPath;
    }
    configureLogger(loggerOptions) {
        let format = 'dev';
        let options = {};
        if (loggerOptions != undefined) {
            if (loggerOptions.format != undefined
                && typeof loggerOptions.format === 'string') {
                format = loggerOptions.format;
            }
            if (loggerOptions.errorLimit != undefined
                && (typeof loggerOptions.errorLimit === 'string' || typeof loggerOptions.errorLimit === 'number')) {
                options['skip'] = function (req, res) { return res.statusCode < parseInt(loggerOptions.errorLimit); };
            }
        }
        return logger(format, options);
    }
    errorHandler(error, request, response, next) {
        response.status(error.status || 500).json({
            message: error.message,
            errors: error.errors,
        });
    }
    getApp() {
        return this.app;
    }
}
exports.ExpressAppConfig = ExpressAppConfig;
//# sourceMappingURL=express.app.config.js.map