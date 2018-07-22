module.exports = { contents: "\"use strict\";\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst styled_components_1 = require(\"styled-components\");\nexports.Button = styled_components_1.default.button `\n    margin-right: 5px;\n    border: 1px solid #ccc;\n    border-radius: 3px;\n    padding: 3px 6px;\n    min-height: 21px;\n    box-sizing: border-box;\n\n    &:focus {\n        outline: none;\n    }\n\n    &:disabled {\n        cursor: not-allowed;\n    }\n\n    &:not(:disabled) {\n        cursor: pointer;\n    }\n\n    &:not(:disabled):hover {\n        background-color: #efefef;\n    }\n\n    &:last-child {\n        margin-right: 0;\n    }\n`;\n//# sourceMappingURL=button.js.map",
dependencies: ["styled-components"],
sourceMap: "{\"version\":3,\"file\":\"button.jsx\",\"sourceRoot\":\"\",\"sources\":[\"/src/button.tsx\"],\"names\":[],\"mappings\":\";;AAEA,yDAAuC;AAE1B,QAAA,MAAM,GAAG,2BAAM,CAAC,MAAM,CAAA;;;;;;;;;;;;;;;;;;;;;;;;;;;CA2BlC,CAAC\",\"sourcesContent\":[\"// @ts-ignore\\nimport * as React from 'react';\\nimport styled from 'styled-components';\\n\\nexport const Button = styled.button`\\n    margin-right: 5px;\\n    border: 1px solid #ccc;\\n    border-radius: 3px;\\n    padding: 3px 6px;\\n    min-height: 21px;\\n    box-sizing: border-box;\\n\\n    &:focus {\\n        outline: none;\\n    }\\n\\n    &:disabled {\\n        cursor: not-allowed;\\n    }\\n\\n    &:not(:disabled) {\\n        cursor: pointer;\\n    }\\n\\n    &:not(:disabled):hover {\\n        background-color: #efefef;\\n    }\\n\\n    &:last-child {\\n        margin-right: 0;\\n    }\\n`;\\n\"]}",
headerContent: undefined,
mtime: 1532272714000,
devLibsRequired : undefined,
ac : undefined,
_ : {}
}
