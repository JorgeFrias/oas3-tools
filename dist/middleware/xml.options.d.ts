export declare class XmlOptions {
    tagNameProcessors: 'array';
    valueProcessors: 'array';
    sanitiseProcessors: (req: any, res: any, next: any) => any;
    constructor(tagNameProcessors: 'array', valueProcessors: 'array', sanitiseProcessors: (req: any, res: any, next: any) => any);
}
