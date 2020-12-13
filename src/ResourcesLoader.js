import { LoaderResource } from 'pixi.js';
import TextStyleManager from "./TextStyleManager";

export default class ResourcesLoader {
    static pre(resource, next) {
        return next();
    }

    static use(resource, next) {
        if (!resource.data || !(resource.type === LoaderResource.TYPE.JSON)) {
            return next();
        }
        if (resource.data.metadata && resource.data.metadata.type && resource.data.metadata.type === 'FlashLibStyledText') {
            TextStyleManager.addConfig(resource.data);
        }

        return next();
    }
}
