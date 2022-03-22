# webroukCustomNumber

Webrouk Custom Number is a lightweight native JavaScript web component for custom input number.

- No dependencies.
- Small and fast.
- Writes its value right into input value field. This makes it easy to use in any html form.

### Demo
---
[CodePen Example](https://codepen.io/muhammad_mabrouk/full/QWaKPQE/)

### Installation
---
Use [NPM](https://www.npmjs.com/package/webrouk-custom-number/) to download and install it directly in to your project

```sh
$ npm install webrouk-custom-number --save
```

or include js file manually

```html
<!-- webrouk-custom-number component file -->
<script src="webrouk-custom-number.js"></script>
```

### Usage
---
Using webroukCustomNumber is simple. Configuration over attributes.

```html
<webrouk-custom-number min="0" max="100" step="10" value="30">
  <!-- This input will receive the value from the component -->
  <input type="hidden">
</webrouk-custom-number>
```

### Options
| Option | Type | Description | Default |
| ----------- |    :----:   | ----------- |    :----:   |
| min | `number` | Specifies the minimum value allowed | `0` |
| max | `number` | Specifies the maximum value allowed | `null` |
| step | `number` | Specifies the legal number intervals | `1` |
| value | `number` | Specifies the default value | `min | 0` |

### Styleable Component Parts
---
- root
- input
- btn btn-up
- btn btn-down

#### Example:

```css
webrouk-custom-number::part(root) {
  position: relative;
}

webrouk-custom-number::part(input) {
  display: block;
  height: 44px;
  width: 100%;
  text-align: center;
  padding: 0 44px;
}

webrouk-custom-number::part(btn) {
  position: absolute;
  top: 0;
  bottom: 0;
  height: 44px;
  width: 44px;
  background-color: blue;
  color: white;
}

webrouk-custom-number::part(btn-up) {
  right: 0;
}

webrouk-custom-number::part(btn-down) {
  left: 0;
}
```

### License
-------
webroukCustomNumber is licensed [MIT](https://choosealicense.com/licenses/mit/).
It can be used for free and without any attribution, in any personal or commercial project.
