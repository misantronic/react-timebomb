module.exports = { contents: "\"use strict\";\nObject.defineProperty(exports, \"__esModule\", { value: true });\n//# sourceMappingURL=react-timebomb.js.map",
dependencies: [],
sourceMap: "{\"version\":3,\"file\":\"typings.js\",\"sourceRoot\":\"\",\"sources\":[\"/src/typings.ts\"],\"names\":[],\"mappings\":\"\",\"sourcesContent\":[\"export interface ReactTimebombProps {\\n    value?: Date;\\n    format?: string;\\n    placeholder?: string;\\n    menuWidth?: number;\\n    minDate?: Date;\\n    maxDate?: Date;\\n    selectWeek?: boolean;\\n    showCalendarWeek?: boolean;\\n    showConfirm?: boolean;\\n    onChange(date?: Date): void;\\n    onError?(error: ReactTimebombError, value: string): void;\\n}\\n\\nexport interface ReactTimebombState {\\n    valueText?: string;\\n    allowValidation?: boolean;\\n    date: Date;\\n    mode: 'year' | 'months' | 'month';\\n    showTime?: boolean;\\n}\\n\\nexport type ReactTimebombError = 'outOfRange' | 'invalidDate';\\n\"]}",
headerContent: undefined,
mtime: 1532220049000,
devLibsRequired : undefined,
ac : undefined,
_ : {}
}
