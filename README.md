**⚠️ Warning:** This repo is no longer maintained.

# 💣 react-timebomb

## Examples 🃏

Check [here](https://rawgit.com/misantronic/react-timebomb/master/examples/dist/index.html) for examples.

## Usage

Basic

```jsx
import { ReactTimebomb } from 'react-timebomb';

<ReactTimebomb
    format="DD.MM.YYYY"
    placeholder="Select date..."
    onChange={console.log}
/>;
```

Confirm date before changing value

```jsx
<ReactTimebomb
    showConfirm
    format="DD.MM.YYYY"
    placeholder="Select date and confirm..."
    onChange={console.log}
/>
```

Min- and Max-Date (or either)

```jsx
<ReactTimebomb
    format="DD.MM.YYYY"
    placeholder="Select date with min- and max-date..."
    minDate={new Date('2000-02-01')}
    maxDate={new Date('2004-10-10')}
    onChange={console.log}
/>
```

Week-Selection

```jsx
<ReactTimebomb
    showCalendarWeek
    selectRange="week"
    format="DD.MM.YYYY"
    placeholder="Select week..."
    onChange={console.log}
/>
```

Range-Selection

```jsx
<ReactTimebomb
    selectRange
    format="DD.MM.YYYY"
    placeholder="Select range..."
    onChange={console.log}
/>
```

Datetime-Picker

```jsx
<ReactTimebomb
    format="DD.MM.YYYY HH:mm"
    placeholder="Select date and time..."
    onChange={console.log}
/>
```

Timepicker

```jsx
<ReactTimebomb
    format="HH:mm"
    placeholder="Select time..."
    onChange={console.log}
/>
```

## Props

| Prop                   | Type                                                                          | optional | default      |                                                                                                    |
| ---------------------- | ----------------------------------------------------------------------------- | :------: | ------------ | -------------------------------------------------------------------------------------------------- |
| `value`                | `ReactTimebombDate`                                                           |          |              |                                                                                                    |
| `onChange`             | `onChange(dateA: Date ǀ undefined [, dateB: Date]): void`                     |          |              | Passes the changed date as first param. When `selectRange` isset, two date-params are passed.      |
| `className`            | `string`                                                                      |    x     |              |                                                                                                    |
| `disabled`             | `boolean`                                                                     |    x     |              |                                                                                                    |
| `error`                | `boolean`                                                                     |    x     |              |                                                                                                    |
| `format`               | `string`                                                                      |    x     | 'YYYY-MM-DD' |                                                                                                    |
| `menuWidth`            | `number`                                                                      |    x     |              |                                                                                                    |
| `timeStep`             | `number`                                                                      |    x     | 1            |                                                                                                    |
| `minDate`              | `Date`                                                                        |    x     |              |                                                                                                    |
| `maxDate`              | `Date`                                                                        |    x     |              |                                                                                                    |
| `mobile`               | `boolean`                                                                     |    x     |              | Display a mobile-optimized menu                                                                    |
| `placeholder`          | `string`                                                                      |    x     |              |                                                                                                    |
| `selectRange`          | `'week' ǀ boolean ǀ number`                                                   |    x     |              | Pass true for free day selection, number for number of days selection or 'week' for week-selection |
| `showCalendarWeek`     | `boolean`                                                                     |    x     |              |                                                                                                    |
| `showConfirm`          | `boolean`                                                                     |    x     |              | Displays a confirm-button. Submits the date when confirming via button or pressing enter.          |
| `arrowButtonId`        | `string`                                                                      |    x     |              |                                                                                                    |
| `arrowButtonComponent` | `React.ComponentType<ArrowButtonProps>`                                       |    x     |              |                                                                                                    |
| `clearComponent`       | `React.ComponentType<ClearComponentProps>`                                    |    x     |              |                                                                                                    |
| `iconComponent`        | `React.ComponentType<IconProps>`                                              |    x     |              |                                                                                                    |
| `labelComponent`       | `React.ComponentType<ReactTimebombValueProps ǀ ReactTimebombMultiValueProps>` |    x     |              |                                                                                                    |
| `confirmComponent`     | `React.ComponentType<ReactTimebombMenuProps>`                                 |    x     |              |                                                                                                    |
| `onError`              | `onError(error: ReactTimebombError, ...value: string[]): void`                |    x     |              |                                                                                                    |
| `onOpen`               | `onOpen(): void`                                                              |    x     |              |                                                                                                    |
| `onClose`              | `onClose(): void`                                                             |    x     |              |                                                                                                    |

### Types

```ts
type ReactTimebombDate = Date | undefined | Date[];
type ReactTimebombError = 'outOfRange' | 'invalidDate';
```

## Localization

Timebomb is completely localized by [moment](http://momentjs.com/docs/#/i18n/changing-locale/).
The default locale is `en`. The fastest way to change it, is by importing the locale-file to your project:

```js
import 'moment/locale/de';
```

You can also use all other ways suggested by moment:
http://momentjs.com/docs/#/i18n/changing-locale/
