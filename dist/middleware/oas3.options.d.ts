import { OpenApiValidatorOpts } from 'express-openapi-validator/dist/framework/types';
import { LoggingOptions } from './logging.options';
import { SwaggerUiOptions } from './swagger.ui.options';
import { XmlOptions } from './xml.options';
import * as express from 'express';
export declare class Oas3AppOptions {
    routing: any;
    openApiValidator: OpenApiValidatorOpts;
    logging: LoggingOptions;
    swaggerUI: SwaggerUiOptions;
    xml: XmlOptions;
    app: express.Application;
    cors: any;
    constructor(routingOpts: any, openApiValidatorOpts: OpenApiValidatorOpts, logging: LoggingOptions, swaggerUI: SwaggerUiOptions, xml: XmlOptions, app: express.Application, cors: any);
}
