# pixi-textstyle-manager
Simple library for manage styles of PIXI.Text.
You can use one config file with styles for texts, and change style directly for one text or for all texts in one time.  
You can create json file with styles and download it, on set styles config object directly to TextStyleManager.  
Don't forget write issues or proposal :)  

### Important! Look example in this doc to understand how its works.  

## Installation  
Use simple npm install command to install this library.  
In your project you must import TextStyleManager.  
```shell script
npm install pixi-textstyle-manager
```  

## How to use
Import TextStyleManager.
```javascript
import TextStyleManager from 'pixi-textstyle-manager';
```  

### Loading config file
Config file must be json and follow this structure:
```json
{
  "styles": {
    "default": {
      "fontFamily": "Arial"
    }
  },
  "textFields": {
    "default": {
      "default": ["default"]
    }
  },
  "metadata": {
    "type": "FlashLibStyledText"
  }
}
```
* styles - object included all styles for all text fields.
    - all members must have like PIXI.TextStyle structure.  
    - must include 'default' object with default style (style can be empty {}). 
    - one style in this list can be used for different texts, so you don't need to create same styles for different texts, you can create only one.  
* textFields - object with description which styles must use text for different states.  
    - must include 'default' object for using to text by default.  
    - every state can contain many styles.
    - when style applying, each next style replaces the same parameter from the previous style.
* metadata - special data for loader plugin. Must be like this.  

For loading config file and adding to TextStyleManager use PIXI.Loaded.  
```javascript
PIXI.loader.add('TextsStyles', './TextsStyles.json');
```  
After loading styles from this config will be added automatically.  

### Using config directly without config file  
If you don't want loading json file, you can set config directly to TextStyleManager.  
Object format similar to json config, but don't needed metadata.  

```javascript
TextStyleManager.addConfig({
            "styles": {
                "default": {
                    "fontFamily": "Arial",
                }
            },
            "textFields": {
                "default": {
                    "default": ["default"]
                }
            }
        });
```

## Example  
### Config file  
For example, we have very simple config file:  
```json
{
  "styles": {
    "default": {
      "fontFamily": "Arial",
      "fill": "#000000"
    },
    "en": {
      "fontFamily": "Comic Sans",
      "stroke": "#FFFFFF",
      "strokeThickness": 3
    },
    "ru": {
      "fontFamily": "Times New Roman",
      "fontSize": 30,
      "dropShadow": true
    },
    "redText": {
      "fill": "#FF0000"
    },
    "yellowText": {
      "fill": "#FFFF00"
    },
    "blueText": {
      "fill": "#0000FF"
    },
    "boldText": {
      "fontWeight": "bold"
    },
    "italicText": {
      "fontStyle": "italic"
    },
    "highlight": {
      "fill": "#000000",
      "stroke": "#FFFFFF",
      "strokeThickness": 5
    }
  },
  "textFields": {
    "default": {
      "default": ["default"]
    },

    "text1": {
      "default": ["blueText"],
      "en_gb": ["en", "redText", "boldText"],
      "ru_ru": ["ru", "yellowText", "italicText"]
    },
    "text2": {
      "default": ["blueText"],
      "en_gb": ["en", "redText", "boldText"],
      "ru_ru": ["ru", "yellowText"]
    },
    "text3": {
      "default": ["blueText"],
      "en_gb": ["en", "redText"],
      "ru_ru": ["ru", "yellowText", "italicText"],
      "highlight": ["highlight"]
    }
  },
  "metadata": {
    "type": "FlashLibStyledText"
  }
}
```  
In config, we have 7 different styles (except default). This styles have this names:  
- en
- ru
- redText
- greenText
- blueText
- boldText
- italicText
- highlight  

Styles not must be simple like this. They can contains many parameters. I use simple styles just for this example.  

Next, we have description for 3 Texts (except default):  
- text1
- text2
- text3  

Each of these Texts have 3 states:  
- default - will be used if setted state not defined.
    - this state contains style called "blueText".  
    So if this state will be applied, to Text style will be added style "blueText" from styles config.
- en_gb - will be used some styles
    - in text1, en_gb has 3 style ("en", "redText", "boldText").  
    All these styles from the style config will be applied for the text style,  
    but each next style replaces the same parameter from the previous style.  
- ru_ru - another one state, but works same for another.  

### Code  
We have simple 3 PIXI.Texts
```javascript
import * as PIXI from "pixi.js";
import FlashLibStyledText from "pixi-textstyle-manager";

///

let text1 = new PIXI.Text('Text1');
text1.x = 50;
text1.y = 50
this.addChild(text1);

let text2 = new PIXI.Text('Text2');
text2.x = 50;
text2.y = 100
this.addChild(text2);

let text3 = new PIXI.Text('Text3');
text3.x = 50;
text3.y = 150
this.addChild(text3);

FlashLibStyledText.addTextField(text1, 'text1');
FlashLibStyledText.addTextField(text2, 'text2');
FlashLibStyledText.addTextField(text3, 'text3');
```  
In this conde created 3 simple PIXI.Text.  
Then this Texts added to FlashLibStyledText using addTextField.  
First parameter - Text which will be added.  
Second parameter - identificator for this Text.  
If you don't specify this parameter, FlashLibStyledText will be use "name" parameter from Text as identificator.  
Now text looks like this:  
<img src="https://images2.imgbox.com/3a/47/pbIR2WL9_o.png" height=200>  

All Texts setted to default state and used "blueText" style.  
We can change style to "en_gb" for all Texts.  
```javascript
TextStyleManager.currentStyle = 'en_gb';
```  
For all Texts will be applied stales from "en_gb" state.  
<img src="https://images2.imgbox.com/bc/ab/JnPzZwqp_o.png" height=200>  

Now **text1** and **text2** have "en", "redText" and "boldText" styles, and **text3** have "en", "redText".  
Change state to "ru_ru":  
```javascript
TextStyleManager.currentStyle = 'ru_ru';
```  
For Texts applied styles from "ru_ru":  
<img src="https://images2.imgbox.com/6a/88/sHMuvBUc_o.png" height=200>  

**text3** have "highlight" state with one parameter, but **text1** and **text2** doesen't.  
If TextStyleManager.currentStyle will be setted to "highlight", for **text1** and **text2** will be applied "default" state.  
```javascript
TextStyleManager.currentStyle = 'highlight';
```  
<img src="https://images2.imgbox.com/b4/c9/orAveCCR_o.png" height=200>  

TextStyleManager can set state directly for Text:  
```javascript
TextStyleManager.setTextStyle(text1, "en_gb");
TextStyleManager.setTextStyle(text2, "ru_ru");
TextStyleManager.setTextStyle(text1, "highlight");
```  
<img src="https://images2.imgbox.com/f9/39/XfLfzjZj_o.png" height=200>  

  
## P.S.
For now that's all :)  
Enjoy this and other of my libraries.  
Don't forget write issues or proposal :)  
___
### Contacts
Telegram [@rocket_ua](https://t.me/rocket_ua)
