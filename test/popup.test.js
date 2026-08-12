'use strict';

var fs = require('fs');
var vm = require('vm');
var assert = require('assert');

function createElement(id) {
  return {
    id: id,
    value: id === 'lengthSlider' ? '16' : '',
    checked: false,
    textContent: '',
    className: '',
    innerHTML: '',
    style: {},
    classList: { add: function () {}, remove: function () {} },
    addEventListener: function () {},
    querySelectorAll: function () { return []; },
    appendChild: function () {},
    removeChild: function () {},
    select: function () {},
    getAttribute: function () { return '0'; }
  };
}

function loadGenerator() {
  var elements = {};
  var ids = [
    'password', 'lengthSlider', 'lengthValue', 'strengthFill', 'strengthText',
    'generateBtn', 'copyBtn', 'refreshBtn', 'excludeChars', 'historyList',
    'clearHistory', 'entropyValue', 'crackTimeValue', 'auditList', 'auditScore', 'optUppercase', 'optLowercase', 'optNumbers', 'optSymbols',
    'optNoAmbiguous', 'optNoDuplicate', 'optNoSequential', 'optPronounceable'
  ];

  ids.forEach(function (id) {
    elements[id] = createElement(id);
  });

  elements.optUppercase.checked = true;
  elements.optLowercase.checked = true;
  elements.optNumbers.checked = true;
  elements.optSymbols.checked = true;

  var sandbox = {
    console: console,
    Uint32Array: Uint32Array,
    Math: Math,
    Object: Object,
    String: String,
    JSON: JSON,
    Array: Array,
    RegExp: RegExp,
    setTimeout: function () {},
    alertMessages: [],
    alert: function (msg) { sandbox.alertMessages.push(msg); },
    navigator: {},
    document: {
      getElementById: function (id) { return elements[id]; },
      querySelector: function () { return null; },
      querySelectorAll: function () { return []; },
      createElement: function () { return createElement('created'); },
      body: createElement('body'),
      execCommand: function () { return true; }
    },
    window: {
      __PWD_EX_TEST__: true,
      crypto: {
        getRandomValues: function (arr) {
          arr[0] = Math.floor(Math.random() * 0x100000000);
          return arr;
        }
      }
    }
  };
  sandbox.window.window = sandbox.window;
  sandbox.window.document = sandbox.document;
  sandbox.window.navigator = sandbox.navigator;

  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync('popup.js', 'utf8'), sandbox);
  return { elements: elements, api: sandbox.window.__passwordGenerator, alerts: sandbox.alertMessages };
}

function hasDuplicate(str) {
  return new Set(str.split('')).size !== str.length;
}

(function testRequiredCharacterTypes() {
  var t = loadGenerator();
  for (var i = 0; i < 200; i++) {
    var pwd = t.api.generatePassword();
    assert.strictEqual(pwd.length, 16);
    assert(/[A-Z]/.test(pwd), 'missing uppercase: ' + pwd);
    assert(/[a-z]/.test(pwd), 'missing lowercase: ' + pwd);
    assert(/[0-9]/.test(pwd), 'missing number: ' + pwd);
    assert(/[^a-zA-Z0-9]/.test(pwd), 'missing symbol: ' + pwd);
  }
}());

(function testExcludeAndNoDuplicate() {
  var t = loadGenerator();
  t.elements.lengthSlider.value = '20';
  t.elements.optNoDuplicate.checked = true;
  t.elements.optNoAmbiguous.checked = true;
  t.elements.excludeChars.value = 'ABCxyz789!@#';
  var pwd = t.api.generatePassword();
  assert.strictEqual(pwd.length, 20);
  assert(!/[O0Il1ABCxyz789!@#]/.test(pwd), 'excluded char found: ' + pwd);
  assert(!hasDuplicate(pwd), 'duplicate char found: ' + pwd);
}());

(function testPronounceableRespectsLetterSelection() {
  var t = loadGenerator();
  t.elements.optUppercase.checked = false;
  t.elements.optLowercase.checked = false;
  t.elements.optNumbers.checked = true;
  t.elements.optSymbols.checked = false;
  t.elements.optPronounceable.checked = true;
  assert.strictEqual(t.api.generatePassword(), '');
  assert(t.alerts.length > 0);
}());

(function testStrengthMetadata() {
  var t = loadGenerator();
  var strength = t.api.calculateStrength('Abcdef123!@#4567');
  assert(strength.entropy > 100);
  assert.strictEqual(typeof strength.crackTime, 'string');
  assert.notStrictEqual(strength.crackTime, '---');
}());

(function testAuditChecklistAndProfile() {
  var t = loadGenerator();
  var strength = t.api.calculateStrength('AStrongPassphrase2026!');
  var audit = t.api.buildAudit('AStrongPassphrase2026!', strength);
  assert.strictEqual(audit.length, 5);
  assert(audit.filter(function (item) { return item.ok; }).length >= 4);

  t.api.applyProfile('pin');
  assert.strictEqual(t.elements.lengthSlider.value, 12);
  assert.strictEqual(t.elements.optNumbers.checked, true);
  assert.strictEqual(t.elements.optNoDuplicate.checked, true);
  assert.strictEqual(t.elements.optUppercase.checked, false);
}());

(function testStrengthWithoutMathLog2() {
  var t = loadGenerator();
  var oldLog2 = Math.log2;
  Math.log2 = undefined;
  var strength = t.api.calculateStrength('Abcdef123!@#4567');
  Math.log2 = oldLog2;
  assert.strictEqual(strength.level, 'strong');
}());

console.log('popup tests passed');
