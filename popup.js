/**
 * Password Generator - سازنده رمز عبور
 * Created by AnishtayiN (https://t.me/AnishtayiN)
 * Compatible with Chrome 49+ (Manifest V2)
 */

(function () {
  'use strict';

  // ====== Character Sets ======
  var CHARS_UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var CHARS_LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
  var CHARS_NUMBERS = '0123456789';
  var CHARS_SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
  var CHARS_AMBIGUOUS = 'O0Il1';

  // Syllable-based pronounceable chars
  var VOWELS = 'aeiou';
  var CONSONANTS = 'bcdfghjklmnpqrstvwxyz';
  var VOWELS_U = 'AEIOU';
  var CONSONANTS_U = 'BCDFGHJKLMNPQRSTVWXYZ';

  // ====== DOM Elements ======
  var passwordEl = document.getElementById('password');
  var lengthSlider = document.getElementById('lengthSlider');
  var lengthValue = document.getElementById('lengthValue');
  var strengthFill = document.getElementById('strengthFill');
  var strengthText = document.getElementById('strengthText');
  var entropyValue = document.getElementById('entropyValue');
  var crackTimeValue = document.getElementById('crackTimeValue');
  var generateBtn = document.getElementById('generateBtn');
  var copyBtn = document.getElementById('copyBtn');
  var refreshBtn = document.getElementById('refreshBtn');
  var excludeInput = document.getElementById('excludeChars');
  var historyList = document.getElementById('historyList');
  var clearHistoryBtn = document.getElementById('clearHistory');
  var presetButtons = document.querySelectorAll ? document.querySelectorAll('.preset-btn') : [];
  var profileButtons = document.querySelectorAll ? document.querySelectorAll('.profile-card') : [];
  var auditList = document.getElementById('auditList');
  var auditScore = document.getElementById('auditScore');

  var optUppercase = document.getElementById('optUppercase');
  var optLowercase = document.getElementById('optLowercase');
  var optNumbers = document.getElementById('optNumbers');
  var optSymbols = document.getElementById('optSymbols');
  var optNoAmbiguous = document.getElementById('optNoAmbiguous');
  var optNoDuplicate = document.getElementById('optNoDuplicate');
  var optNoSequential = document.getElementById('optNoSequential');
  var optPronounceable = document.getElementById('optPronounceable');

  var history = [];
  var MAX_HISTORY = 20;
  var PROFILES = {
    vault: { length: 32, uppercase: true, lowercase: true, numbers: true, symbols: true, noAmbiguous: true, noDuplicate: false, noSequential: true, pronounceable: false },
    readable: { length: 20, uppercase: true, lowercase: true, numbers: true, symbols: false, noAmbiguous: true, noDuplicate: false, noSequential: true, pronounceable: true },
    pin: { length: 12, uppercase: false, lowercase: false, numbers: true, symbols: false, noAmbiguous: false, noDuplicate: true, noSequential: true, pronounceable: false }
  };

  // ====== Secure Random (fallback for old Chrome) ======
  function secureRandom(max) {
    if (!max || max < 1) return 0;

    var cryptoObj = window.crypto || window.msCrypto;
    if (cryptoObj && cryptoObj.getRandomValues) {
      var arr = new Uint32Array(1);
      var limit = Math.floor(0x100000000 / max) * max;
      do {
        cryptoObj.getRandomValues(arr);
      } while (arr[0] >= limit);
      return arr[0] % max;
    }

    return Math.floor(Math.random() * max);
  }

  // ====== Shuffle Array (Fisher-Yates) ======
  function shuffle(arr) {
    var i, j, temp;
    for (i = arr.length - 1; i > 0; i--) {
      j = secureRandom(i + 1);
      temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  function uniqueChars(str) {
    var seen = {};
    var out = '';
    for (var i = 0; i < str.length; i++) {
      if (!seen[str[i]]) {
        seen[str[i]] = true;
        out += str[i];
      }
    }
    return out;
  }

  function removeChars(str, charsToRemove) {
    var out = '';
    for (var i = 0; i < str.length; i++) {
      if (charsToRemove.indexOf(str[i]) === -1) out += str[i];
    }
    return out;
  }

  function getExcludedChars() {
    var excluded = excludeInput.value || '';
    if (optNoAmbiguous.checked) excluded += CHARS_AMBIGUOUS;
    return uniqueChars(excluded);
  }

  function filterSet(charSet) {
    return uniqueChars(removeChars(charSet, getExcludedChars()));
  }

  function getRequiredSets() {
    var sets = [];
    if (optUppercase.checked) sets.push(filterSet(CHARS_UPPERCASE));
    if (optLowercase.checked) sets.push(filterSet(CHARS_LOWERCASE));
    if (optNumbers.checked) sets.push(filterSet(CHARS_NUMBERS));
    if (optSymbols.checked) sets.push(filterSet(CHARS_SYMBOLS));

    var filtered = [];
    for (var i = 0; i < sets.length; i++) {
      if (sets[i].length > 0) filtered.push(sets[i]);
    }
    return filtered;
  }

  // ====== Get Character Pool ======
  function getCharPool() {
    var sets = getRequiredSets();
    var pool = '';
    for (var i = 0; i < sets.length; i++) pool += sets[i];
    return uniqueChars(pool);
  }

  function pickChar(charSet, used) {
    var available = charSet;
    if (used) {
      available = '';
      for (var i = 0; i < charSet.length; i++) {
        if (!used[charSet[i]]) available += charSet[i];
      }
    }
    if (available.length === 0) return '';
    return available[secureRandom(available.length)];
  }

  function markUsed(used, ch) {
    if (used && ch) used[ch] = true;
  }

  // ====== Generate Pronounceable Password ======
  function generatePronounceable(len) {
    var consonants = filterSet(optUppercase.checked ? CONSONANTS + CONSONANTS_U : CONSONANTS);
    var vowels = filterSet(optUppercase.checked ? VOWELS + VOWELS_U : VOWELS);
    var allLetters = uniqueChars(consonants + vowels);
    var used = optNoDuplicate.checked ? {} : null;
    var password = '';
    var i, charSet, nextChar;

    if (!optUppercase.checked && !optLowercase.checked) {
      alert('برای حالت قابل تلفظ، حداقل حروف بزرگ یا کوچک را انتخاب کنید.');
      return '';
    }

    if (allLetters.length === 0) {
      alert('با تنظیمات فعلی هیچ حرف قابل استفاده‌ای باقی نمانده است.');
      return '';
    }

    if (optNoDuplicate.checked && len > allLetters.length) {
      alert('طول رمز (' + len + ') از تعداد حروف قابل تلفظ موجود (' + allLetters.length + ') بیشتر است. لطفاً طول رمز را کمتر کنید.');
      return '';
    }

    for (i = 0; i < len; i++) {
      charSet = (i % 2 === 0) ? consonants : vowels;
      if (charSet.length === 0) charSet = allLetters;
      nextChar = pickChar(charSet, used) || pickChar(allLetters, used);
      if (!nextChar) return '';
      password += nextChar;
      markUsed(used, nextChar);
    }

    return password;
  }

  // ====== Check Sequential ======
  function hasSequential(password) {
    for (var i = 0; i < password.length - 2; i++) {
      var c1 = password.charCodeAt(i);
      var c2 = password.charCodeAt(i + 1);
      var c3 = password.charCodeAt(i + 2);
      if (c2 - c1 === 1 && c3 - c2 === 1) return true;
      if (c1 - c2 === 1 && c2 - c3 === 1) return true;
    }
    return false;
  }

  // ====== Generate Password ======
  function generatePassword() {
    var len = parseInt(lengthSlider.value, 10);
    var password;
    var maxAttempts = 100;
    var attempt = 0;

    // Pronounceable mode
    if (optPronounceable.checked) {
      do {
        attempt++;
        password = generatePronounceable(len);
      } while (password && optNoSequential.checked && hasSequential(password) && attempt < maxAttempts);
      return password;
    }

    var requiredSets = getRequiredSets();
    var pool = getCharPool();
    if (requiredSets.length === 0 || pool.length === 0) {
      alert('لطفاً حداقل یک نوع کاراکتر انتخاب کنید!');
      return '';
    }

    if (len < requiredSets.length) {
      alert('طول رمز باید حداقل برابر تعداد گروه‌های کاراکتری انتخاب‌شده (' + requiredSets.length + ') باشد.');
      return '';
    }

    // Check duplicate constraint
    if (optNoDuplicate.checked && len > pool.length) {
      alert('طول رمز (' + len + ') از تعداد کاراکترهای موجود (' + pool.length + ') بیشتر است. لطفاً طول رمز را کمتر کنید.');
      return '';
    }

    do {
      attempt++;
      var chars = [];
      var used = optNoDuplicate.checked ? {} : null;
      var i, j, ch;

      for (i = 0; i < requiredSets.length; i++) {
        ch = pickChar(requiredSets[i], used);
        if (!ch) ch = pickChar(pool, used);
        if (!ch) return '';
        chars.push(ch);
        markUsed(used, ch);
      }

      for (j = chars.length; j < len; j++) {
        ch = pickChar(pool, used);
        if (!ch) return '';
        chars.push(ch);
        markUsed(used, ch);
      }

      password = shuffle(chars).join('');
    } while (
      optNoSequential.checked &&
      hasSequential(password) &&
      attempt < maxAttempts
    );

    return password;
  }

  // ====== Calculate Password Strength ======
  function estimatePoolSize(password) {
    var poolSize = 0;
    if (/[a-z]/.test(password)) poolSize += 26;
    if (/[A-Z]/.test(password)) poolSize += 26;
    if (/[0-9]/.test(password)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;
    return poolSize;
  }

  function formatCrackTime(entropy) {
    if (!entropy) return '---';

    var guessesPerSecond = 10000000000;
    var seconds = Math.pow(2, entropy) / guessesPerSecond;
    var units = [
      { label: 'ثانیه', value: 1 },
      { label: 'دقیقه', value: 60 },
      { label: 'ساعت', value: 3600 },
      { label: 'روز', value: 86400 },
      { label: 'سال', value: 31557600 }
    ];

    if (seconds < 1) return 'کمتر از ۱ ثانیه';
    for (var i = units.length - 1; i >= 0; i--) {
      if (seconds >= units[i].value) {
        var amount = seconds / units[i].value;
        if (amount > 1000000 && units[i].label === 'سال') return 'میلیون‌ها سال';
        return Math.round(amount).toLocaleString('fa-IR') + ' ' + units[i].label;
      }
    }
    return '---';
  }

  function calculateStrength(password) {
    if (!password) return { score: 0, label: '---', level: '', entropy: 0, crackTime: '---' };

    var score = 0;
    var len = password.length;

    // Length score
    if (len >= 8) score += 1;
    if (len >= 12) score += 1;
    if (len >= 16) score += 1;
    if (len >= 24) score += 1;
    if (len >= 32) score += 1;

    // Character variety
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 2;

    // Unique characters ratio
    var unique = {};
    for (var i = 0; i < password.length; i++) {
      unique[password[i]] = true;
    }
    var uniqueRatio = Object.keys(unique).length / password.length;
    if (uniqueRatio > 0.7) score += 1;
    if (uniqueRatio > 0.9) score += 1;

    // Entropy estimate
    var poolSize = estimatePoolSize(password);
    var entropy = len * (Math.log(poolSize || 1) / Math.log(2));
    var crackTime = formatCrackTime(entropy);

    if (entropy < 28) return { score: 1, label: 'ضعیف', level: 'weak', entropy: entropy, crackTime: crackTime };
    if (entropy < 45) return { score: 2, label: 'متوسط', level: 'fair', entropy: entropy, crackTime: crackTime };
    if (entropy < 60) return { score: 3, label: 'خوب', level: 'good', entropy: entropy, crackTime: crackTime };
    return { score: 4, label: 'قوی 💪', level: 'strong', entropy: entropy, crackTime: crackTime };
  }

  function buildAudit(password, strength) {
    return [
      { ok: password.length >= 16, text: 'طول حداقل ۱۶ کاراکتر' },
      { ok: /[a-z]/.test(password) && /[A-Z]/.test(password), text: 'ترکیب حروف بزرگ و کوچک' },
      { ok: /[0-9]/.test(password), text: 'دارای عدد' },
      { ok: /[^a-zA-Z0-9]/.test(password) || optPronounceable.checked, text: 'نماد یا حالت خوانای امن' },
      { ok: strength.entropy >= 80 && !hasSequential(password), text: 'آنتروپی بالا و بدون الگوی ترتیبی' }
    ];
  }

  function updateAudit(password, strength) {
    if (!auditList || !auditScore) return;

    var checks = buildAudit(password || '', strength || calculateStrength(password));
    var passed = 0;
    var html = '';
    for (var i = 0; i < checks.length; i++) {
      if (checks[i].ok) passed++;
      html += '<div class="audit-item ' + (checks[i].ok ? 'ok' : 'warn') + '">' +
        '<span>' + (checks[i].ok ? '✅' : '⚠️') + '</span>' +
        '<span>' + checks[i].text + '</span>' +
        '</div>';
    }
    auditScore.textContent = passed + '/' + checks.length;
    auditList.innerHTML = html;
  }

  // ====== Update Strength Display ======
  function updateStrength(password) {
    var strength = calculateStrength(password);
    strengthFill.className = 'strength-fill' + (strength.level ? ' ' + strength.level : '');
    strengthText.className = 'strength-text' + (strength.level ? ' ' + strength.level : '');
    strengthText.textContent = strength.label;
    if (entropyValue) entropyValue.textContent = Math.round(strength.entropy || 0).toLocaleString('fa-IR') + ' بیت';
    if (crackTimeValue) crackTimeValue.textContent = strength.crackTime;
    updateAudit(password, strength);
  }

  // ====== Copy to Clipboard ======
  function copyToClipboard(text, callback) {
    function done(success) {
      if (callback) callback(success);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        done(true);
      }, function () {
        fallbackCopy(text, done);
      });
      return;
    }

    fallbackCopy(text, done);
  }

  function fallbackCopy(text, callback) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      callback(document.execCommand('copy'));
    } catch (e) {
      callback(false);
    }
    document.body.removeChild(textarea);
  }

  // ====== Show Toast ======
  function showToast(msg) {
    var toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () {
      toast.classList.remove('show');
    }, 1500);
  }

  // ====== Add to History ======
  function addToHistory(pwd) {
    if (!pwd) return;
    if (history[0] === pwd) return;
    history.unshift(pwd);
    if (history.length > MAX_HISTORY) history.pop();
    renderHistory();
    saveHistory();
  }

  // ====== Render History ======
  function renderHistory() {
    if (history.length === 0) {
      historyList.innerHTML = '<p class="empty-history">هنوز رمزی ساخته نشده</p>';
      return;
    }
    var html = '';
    for (var i = 0; i < history.length; i++) {
      var display = history[i].length > 28
        ? history[i].substring(0, 28) + '...'
        : history[i];
      html += '<div class="history-item">' +
        '<span class="pwd" title="' + escapeHtml(history[i]) + '">' + escapeHtml(display) + '</span>' +
        '<button class="copy-small" data-index="' + i + '" title="کپی">📋</button>' +
        '</div>';
    }
    historyList.innerHTML = html;

    // Bind copy buttons
    var copyBtns = historyList.querySelectorAll('.copy-small');
    for (var j = 0; j < copyBtns.length; j++) {
      copyBtns[j].addEventListener('click', function () {
        var idx = parseInt(this.getAttribute('data-index'), 10);
        copyToClipboard(history[idx], function (success) {
          showToast(success ? '✅ رمز کپی شد!' : '❌ کپی ناموفق بود');
        });
      });
    }
  }

  // ====== Escape HTML ======
  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ====== Save / Load History ======
  function saveHistory() {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ pwHistory: history });
      } else if (window.localStorage) {
        localStorage.setItem('pwHistory', JSON.stringify(history));
      }
    } catch (e) { /* ignore */ }
  }

  function loadHistory() {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get('pwHistory', function (data) {
          if (data && data.pwHistory && data.pwHistory.constructor === Array) {
            history = data.pwHistory.slice(0, MAX_HISTORY);
            renderHistory();
          }
        });
      } else if (window.localStorage) {
        var stored = localStorage.getItem('pwHistory');
        if (stored) {
          var parsed = JSON.parse(stored);
          if (parsed && parsed.constructor === Array) {
            history = parsed.slice(0, MAX_HISTORY);
            renderHistory();
          }
        }
      }
    } catch (e) { /* ignore */ }
  }

  function applyProfile(name) {
    var profile = PROFILES[name];
    if (!profile) return;

    lengthSlider.value = profile.length;
    lengthValue.textContent = profile.length;
    optUppercase.checked = profile.uppercase;
    optLowercase.checked = profile.lowercase;
    optNumbers.checked = profile.numbers;
    optSymbols.checked = profile.symbols;
    optNoAmbiguous.checked = profile.noAmbiguous;
    optNoDuplicate.checked = profile.noDuplicate;
    optNoSequential.checked = profile.noSequential;
    optPronounceable.checked = profile.pronounceable;
    handleGenerate(true);
  }

  // ====== Main Generate Handler ======
  function handleGenerate(saveToHistory) {
    var pwd = generatePassword();
    if (pwd) {
      passwordEl.value = pwd;
      updateStrength(pwd);
      if (saveToHistory) addToHistory(pwd);
    }
  }

  // ====== Event Listeners ======
  generateBtn.addEventListener('click', function () { handleGenerate(true); });

  refreshBtn.addEventListener('click', function () { handleGenerate(true); });

  copyBtn.addEventListener('click', function () {
    var pwd = passwordEl.value;
    if (!pwd) {
      showToast('⚠️ ابتدا رمزی بسازید!');
      return;
    }
    copyToClipboard(pwd, function (success) {
      if (success) {
        copyBtn.classList.add('copied');
        copyBtn.textContent = '✅';
        showToast('✅ رمز کپی شد!');
        setTimeout(function () {
          copyBtn.classList.remove('copied');
          copyBtn.textContent = '📋';
        }, 1500);
      } else {
        showToast('❌ کپی ناموفق بود');
      }
    });
  });

  lengthSlider.addEventListener('input', function () {
    lengthValue.textContent = this.value;
    handleGenerate(false);
  });

  for (var p = 0; p < presetButtons.length; p++) {
    presetButtons[p].addEventListener('click', function () {
      lengthSlider.value = this.getAttribute('data-length');
      lengthValue.textContent = lengthSlider.value;
      handleGenerate(true);
    });
  }

  for (var pr = 0; pr < profileButtons.length; pr++) {
    profileButtons[pr].addEventListener('click', function () {
      applyProfile(this.getAttribute('data-profile'));
    });
  }

  var optionInputs = [optUppercase, optLowercase, optNumbers, optSymbols, optNoAmbiguous, optNoDuplicate, optNoSequential, optPronounceable, excludeInput];
  for (var o = 0; o < optionInputs.length; o++) {
    optionInputs[o].addEventListener('change', function () { handleGenerate(false); });
    optionInputs[o].addEventListener('keyup', function () { handleGenerate(false); });
  }

  clearHistoryBtn.addEventListener('click', function () {
    history = [];
    renderHistory();
    saveHistory();
    showToast('🗑️ تاریخچه پاک شد');
  });

  if (window.__PWD_EX_TEST__) {
    window.__passwordGenerator = {
      generatePassword: generatePassword,
      calculateStrength: calculateStrength,
      formatCrackTime: formatCrackTime,
      buildAudit: buildAudit,
      applyProfile: applyProfile,
      hasSequential: hasSequential,
      getCharPool: getCharPool,
      escapeHtml: escapeHtml,
      secureRandom: secureRandom
    };
    return;
  }

  // Auto-generate on load
  loadHistory();
  handleGenerate(true);

})();
