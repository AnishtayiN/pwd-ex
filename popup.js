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
  var generateBtn = document.getElementById('generateBtn');
  var copyBtn = document.getElementById('copyBtn');
  var refreshBtn = document.getElementById('refreshBtn');
  var excludeInput = document.getElementById('excludeChars');
  var historyList = document.getElementById('historyList');
  var clearHistoryBtn = document.getElementById('clearHistory');

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

  // ====== Secure Random (fallback for old Chrome) ======
  function secureRandom(max) {
    var arr = new Uint32Array(1);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(arr);
    } else if (window.msCrypto) {
      window.msCrypto.getRandomValues(arr);
    } else {
      arr[0] = Math.floor(Math.random() * max);
    }
    return arr[0] % max;
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

  // ====== Get Character Pool ======
  function getCharPool() {
    var pool = '';
    if (optUppercase.checked) pool += CHARS_UPPERCASE;
    if (optLowercase.checked) pool += CHARS_LOWERCASE;
    if (optNumbers.checked) pool += CHARS_NUMBERS;
    if (optSymbols.checked) pool += CHARS_SYMBOLS;

    // Exclude ambiguous characters
    if (optNoAmbiguous.checked) {
      var clean = '';
      for (var i = 0; i < pool.length; i++) {
        if (CHARS_AMBIGUOUS.indexOf(pool[i]) === -1) {
          clean += pool[i];
        }
      }
      pool = clean;
    }

    // Exclude custom characters
    var exclude = excludeInput.value;
    if (exclude.length > 0) {
      var clean2 = '';
      for (var j = 0; j < pool.length; j++) {
        if (exclude.indexOf(pool[j]) === -1) {
          clean2 += pool[j];
        }
      }
      pool = clean2;
    }

    return pool;
  }

  // ====== Generate Pronounceable Password ======
  function generatePronounceable(len) {
    var password = '';
    var useUpper = optUppercase.checked;
    for (var i = 0; i < len; i++) {
      var isConsonant = (i % 2 === 0);
      if (isConsonant) {
        var cSet = useUpper ? (secureRandom(2) === 0 ? CONSONANTS_U : CONSONANTS) : CONSONANTS;
        password += cSet[secureRandom(cSet.length)];
      } else {
        var vSet = useUpper ? (secureRandom(2) === 0 ? VOWELS_U : VOWELS) : VOWELS;
        password += vSet[secureRandom(vSet.length)];
      }
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

    // Pronounceable mode
    if (optPronounceable.checked) {
      var pwd = generatePronounceable(len);
      return pwd;
    }

    var pool = getCharPool();
    if (pool.length === 0) {
      alert('لطفاً حداقل یک نوع کاراکتر انتخاب کنید!');
      return '';
    }

    // Check duplicate constraint
    if (optNoDuplicate.checked && len > pool.length) {
      alert('طول رمز (' + len + ') از تعداد کاراکترهای موجود (' + pool.length + ') بیشتر است. لطفاً طول رمز را کمتر کنید.');
      return '';
    }

    var password;
    var maxAttempts = 100;
    var attempt = 0;

    do {
      attempt++;
      password = '';

      if (optNoDuplicate.checked) {
        // Pick without replacement
        var available = pool.split('');
        available = shuffle(available);
        for (var i = 0; i < len; i++) {
          password += available[i];
        }
      } else {
        // Pick with replacement
        for (var j = 0; j < len; j++) {
          password += pool[secureRandom(pool.length)];
        }
      }
    } while (
      optNoSequential.checked &&
      hasSequential(password) &&
      attempt < maxAttempts
    );

    return password;
  }

  // ====== Calculate Password Strength ======
  function calculateStrength(password) {
    if (!password) return { score: 0, label: '---', level: '' };

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
    var poolSize = 0;
    if (/[a-z]/.test(password)) poolSize += 26;
    if (/[A-Z]/.test(password)) poolSize += 26;
    if (/[0-9]/.test(password)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;
    var entropy = len * Math.log2(poolSize || 1);

    if (entropy < 28) return { score: 1, label: 'ضعیف', level: 'weak' };
    if (entropy < 45) return { score: 2, label: 'متوسط', level: 'fair' };
    if (entropy < 60) return { score: 3, label: 'خوب', level: 'good' };
    return { score: 4, label: 'قوی 💪', level: 'strong' };
  }

  // ====== Update Strength Display ======
  function updateStrength(password) {
    var strength = calculateStrength(password);
    strengthFill.className = 'strength-fill' + (strength.level ? ' ' + strength.level : '');
    strengthText.className = 'strength-text' + (strength.level ? ' ' + strength.level : '');
    strengthText.textContent = strength.label;
  }

  // ====== Copy to Clipboard ======
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older Chrome
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch (e) {
      document.body.removeChild(textarea);
      return false;
    }
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
        if (copyToClipboard(history[idx])) {
          showToast('✅ رمز کپی شد!');
        }
      });
    }
  }

  // ====== Escape HTML ======
  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;')
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
          if (data && data.pwHistory) {
            history = data.pwHistory;
            renderHistory();
          }
        });
      } else if (window.localStorage) {
        var stored = localStorage.getItem('pwHistory');
        if (stored) {
          history = JSON.parse(stored);
          renderHistory();
        }
      }
    } catch (e) { /* ignore */ }
  }

  // ====== Main Generate Handler ======
  function handleGenerate() {
    var pwd = generatePassword();
    if (pwd) {
      passwordEl.value = pwd;
      updateStrength(pwd);
      addToHistory(pwd);
    }
  }

  // ====== Event Listeners ======
  generateBtn.addEventListener('click', handleGenerate);

  refreshBtn.addEventListener('click', handleGenerate);

  copyBtn.addEventListener('click', function () {
    var pwd = passwordEl.value;
    if (!pwd) {
      showToast('⚠️ ابتدا رمزی بسازید!');
      return;
    }
    if (copyToClipboard(pwd)) {
      copyBtn.classList.add('copied');
      copyBtn.textContent = '✅';
      showToast('✅ رمز کپی شد!');
      setTimeout(function () {
        copyBtn.classList.remove('copied');
        copyBtn.textContent = '📋';
      }, 1500);
    }
  });

  lengthSlider.addEventListener('input', function () {
    lengthValue.textContent = this.value;
  });

  clearHistoryBtn.addEventListener('click', function () {
    history = [];
    renderHistory();
    saveHistory();
    showToast('🗑️ تاریخچه پاک شد');
  });

  // Auto-generate on load
  loadHistory();
  handleGenerate();

})();
