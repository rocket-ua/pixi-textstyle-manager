import { Loader } from "pixi.js";
import ResourcesLoader from "./ResourcesLoader";

export default new class TextStyleManager {
    constructor() {
        Loader.registerPlugin(ResourcesLoader);

        this._currentStyle = 'default';

        this.stylesConfig = {};
        this.textFieldsConfig = {};

        this.textFields = [];
    }

    /**
     * Add styles config object
     * @param config
     */
    addConfig(config) {
        this.stylesConfig = config.styles;
        this.textFieldsConfig = config.textFields;

        this._updateTextFieldsStyles();
    }

    /**
     *
     * @param {PIXI.Text} textField
     * @param {String} identificator
     */
    addTextField(textField, identificator= undefined) {
        let item = {
            textField: textField,
            identificator: identificator ? identificator : textField.name,
            baseStyle: Object.assign({}, textField.style),
            currentStyle: 'default'
        };
        this._setStyle(item);

        let index = this._getTextFieldIndex(textField);
        if (index === -1) {
            this.textFields.push(item);
        } else {
            this.textFields[index] = item;
        }
    }

    /**
     * Set style for Text item
     * @param {*} item
     * @param {String} styleName
     * @private
     */
    _setStyle(item, styleName= undefined) {
        if (!styleName) {
            styleName = this.currentStyle;
        }
        if (item.textField && !item.textField._destroyed) {
            let newStyle = this._getTextStyle(item, styleName);
            item.textField.style = Object.assign({}, item.baseStyle, newStyle);
            item.currentStyleName = styleName;
        }
    }

    /**
     * Get styles for current text from config
     * @param {*} item
     * @param {String} styleName
     * @returns {{}}
     * @private
     */
    _getTextStyle(item, styleName) {
        if (!this.textFieldsConfig[item.identificator]) {
            return {}; //this._getStyles(this.textFieldsConfig['default'], style);
        }
        return this._getStyles(this.textFieldsConfig[item.identificator], styleName);
    }

    /**
     * Get styles for Text
     * @param {*} data
     * @param {string} styleName
     * @returns {{}}
     * @private
     */
    _getStyles(data, styleName) {
        let newStyle = {};
        let stylesNames = data[styleName] || data['default'] || [];
        stylesNames.forEach((arrStyleName)=>{
            newStyle = Object.assign(newStyle, this._getCurrentStyle(arrStyleName));
        })
        return newStyle;
    }

    _getCurrentStyle(name) {
        if (!this.stylesConfig[name]) {
            return {};
        }
        return Object.assign({}, this.stylesConfig[name]);
    }

    /**
     * Get Text item index
     * @param {PIXI.Text} textField
     * @returns {number}
     * @private
     */
    _getTextFieldIndex(textField) {
        return this.textFields.findIndex((element) => {
            return element.textField === textField;
        });
    }

    /**
     * Get text item
     * @param {PIXI.Text} textField
     * @returns {*}
     * @private
     */
    _getTextField(textField) {
        return this.textFields.find((element) => {
            return element.textField === textField;
        })
    }

    /**
     * Update all Text's style
     * @private
     */
    _updateTextFieldsStyles() {
        this.textFields.forEach((textField) => {
            this._setStyle(textField);
        });
    }

    /**
     * Set style to Text
     * @param {PIXI.Text} textField
     * @param {String} styleName stale name in config
     */
    setTextStyle(textField, styleName) {
        let item = this._getTextField(textField);
        this._setStyle(item, styleName);
    }

    /**
     * Remove Text from TextStyleManager
     * @param {PIXI.Text} textField
     */
    removeTextField(textField) {
        let index = this._getTextFieldIndex(textField);
        if (index !== -1) {
            this.textFields.splice(index, 1);
        }
    }

    /**
     * Get current project style
     * @returns {string}
     */
    get currentStyle() {
        return this._currentStyle;
    }

    /**
     * Set current project style
     * @param {String} value
     */
    set currentStyle(value) {
        this._currentStyle = value;
        this._updateTextFieldsStyles();
    }
}
