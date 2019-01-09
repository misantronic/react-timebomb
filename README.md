# 💣 react-timebomb

## Examples 🃏

Check [here](https://rawgit.com/misantronic/react-timebomb/master/examples/dist/index.html) for examples.

## Usage

Import

```js
import { ReactTimebomb } from 'react-timebomb';
```

Basic usage

```jsx
<ReactTimebomb format="DD.MM.YYYY" placeholder="Select date..." />
```

Confirm

```jsx
<ReactTimebomb
    showConfirm
    format="DD.MM.YYYY"
    placeholder="Select date and confirm..."
/>
```

Min- and Max-Date

```jsx
<ReactTimebomb
    format="DD.MM.YYYY"
    placeholder="Select date with min- and max-date..."
    minDate={new Date('2000-02-01')}
    maxDate={new Date('2004-10-10')}
/>
```

Week-Selection

```jsx
<ReactTimebomb
    showCalendarWeek
    selectWeek
    format="DD.MM.YYYY"
    placeholder="Select week..."
/>
```

Range-Selection

```jsx
<ReactTimebomb
    selectRange
    showConfirm
    format="DD.MM.YYYY"
    placeholder="Select range..."
/>
```

Datetime-Picker

```jsx
<ReactTimebomb
    format="DD.MM.YYYY HH:mm"
    placeholder="Select date and time..."
/>
```

Timepicker

```jsx
<ReactTimebomb format="HH:mm" placeholder="Select time..." />
```

## Props

| Prop                   | Type                                                           | optional | default      |                                                                                                               |
| ---------------------- | -------------------------------------------------------------- | :------: | ------------ | ------------------------------------------------------------------------------------------------------------- |
| `value`                | `ReactTimebombDate`                                            |          |              |                                                                                                               |
| `onChange`             | `onChange(dateA: Date ǀ undefined [, dateB: Date]): void`      |          |              | Passes the changed date as first param. When `selectRange` or `selectWeek` isset, two date-params are passed. |
| `className`            | `string`                                                       |    x     |              |                                                                                                               |
| `disabled`             | `boolean`                                                      |    x     |              |                                                                                                               |
| `error`                | `boolean`                                                      |    x     |              |                                                                                                               |
| `format`               | `string`                                                       |    x     | 'YYYY-MM-DD' |                                                                                                               |
| `menuWidth`            | `number`                                                       |    x     |              |                                                                                                               |
| `minDate`              | `Date`                                                         |    x     |              |                                                                                                               |
| `maxDate`              | `Date`                                                         |    x     |              |                                                                                                               |
| `mobile`               | `boolean`                                                      |    x     |              |                                                                                                               |
| `placeholder`          | `string`                                                       |    x     |              |                                                                                                               |
| `selectWeek`           | `boolean`                                                      |    x     |              |                                                                                                               |
| `selectRange`          | `boolean`                                                      |    x     |              |                                                                                                               |
| `showCalendarWeek`     | `boolean`                                                      |    x     |              |                                                                                                               |
| `showConfirm`          | `boolean`                                                      |    x     |              | Displays a confirm-button. Submits the date when confirming via button or pressing enter.                     |
| `arrowButtonComponent` | `React.ComponentType<ArrowButtonProps>`                        |    x     |              |                                                                                                               |
| `onError`              | `onError(error: ReactTimebombError, ...value: string[]): void` |    x     |              |                                                                                                               |
| `onOpen`               | `onOpen(): void`                                               |    x     |              |                                                                                                               |
| `onClose`              | `onClose(): void`                                              |    x     |              |                                                                                                               |

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
