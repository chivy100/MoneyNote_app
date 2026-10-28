/**
 * ==========================================================================
 * MoneyNote - Sổ chi tiêu cá nhân
 * JavaScript: js/app.js
 * Pure ES6+ Modern Architecture
 * Covers all requirements: F01 to F12
 * ==========================================================================
 */

'use strict';

// --- Default Category Metadata & Colors (matching design mockup) ---
const CATEGORIES = {
  expense: [
    { name: 'Ăn uống', chip: '#FFF1E6', fg: '#9A3412', ini: 'Ă', color: '#1D4ED8' },
    { name: 'Đi lại', chip: '#E0F2FE', fg: '#075985', ini: 'Đ', color: '#60A5FA' },
    { name: 'Mua sắm', chip: '#FCE7F3', fg: '#9D174D', ini: 'M', color: '#D97706' },
    { name: 'Học tập', chip: '#EDE9FE', fg: '#5B21B6', ini: 'H', color: '#F59E0B' },
    { name: 'Giải trí', chip: '#E0E7FF', fg: '#3730A3', ini: 'G', color: '#94A3B8' },
    { name: 'Hóa đơn', chip: '#FEF3C7', fg: '#92400E', ini: 'H', color: '#3B82F6' },
    { name: 'Khác', chip: '#F1F5F9', fg: '#334155', ini: 'K', color: '#64748B' }
  ],
  income: [
    { name: 'Lương', chip: '#E7F6EF', fg: '#065F46', ini: 'L', color: '#0E7A55' },
    { name: 'Học bổng', chip: '#E7F6EF', fg: '#065F46', ini: 'H', color: '#10B981' },
    { name: 'Được cho', chip: '#E7F6EF', fg: '#065F46', ini: 'Đ', color: '#059669' },
    { name: 'Khác', chip: '#F1F5F9', fg: '#334155', ini: 'K', color: '#64748B' }
  ]
};

// Map category name to quick lookup metadata
const CATEGORY_MAP = {};
[...CATEGORIES.expense, ...CATEGORIES.income].forEach(cat => {
  CATEGORY_MAP[cat.name] = cat;
});

// Fallback for unknown category
function getCategoryMeta(name) {
  return CATEGORY_MAP[name] || {
    name: name || 'Khác',
    chip: '#F1F5F9',
    fg: '#334155',
    ini: (name && name[0]) ? name[0].toUpperCase() : 'K',
    color: '#64748B'
  };
}

// --- Application State ---
const state = {
  transactions: [],
  currentMonth: '2026-10', // YYYY-MM
  filterType: 'all',       // 'all' | 'income' | 'expense'
  filterCategory: 'all',   // 'all' | category name
  searchQuery: '',
  budgets: {},             // { "YYYY-MM": number }
  theme: 'light',          // 'light' | 'dark'
  editingTxId: null,
  deletingTxId: null,
  isViewAllExpanded: false
};

// --- Storage Keys ---
const STORAGE_KEYS = {
  TRANSACTIONS: 'moneynote_transactions_v1',
  BUDGETS: 'moneynote_budgets_v1',
  THEME: 'moneynote_theme_v1'
};

// --- Seed Data (F06, ~10 realistic transactions as in mockup) ---
function getSampleTransactions(monthStr) {
  const [year, month] = monthStr.split('-');
  return [
    {
      id: 'tx_seed_1',
      type: 'expense',
      amount: 45000,
      category: 'Ăn uống',
      date: `${year}-${month}-28`,
      payment: 'Tiền mặt',
      note: 'Cà phê với nhóm',
      createdAt: Date.now() - 1000
    },
    {
      id: 'tx_seed_2',
      type: 'expense',
      amount: 80000,
      category: 'Đi lại',
      date: `${year}-${month}-27`,
      payment: 'Tiền mặt',
      note: 'Đổ xăng',
      createdAt: Date.now() - 2000
    },
    {
      id: 'tx_seed_3',
      type: 'expense',
      amount: 150000,
      category: 'Học tập',
      date: `${year}-${month}-25`,
      payment: 'Chuyển khoản',
      note: 'Mua giáo trình JavaScript',
      createdAt: Date.now() - 3000
    },
    {
      id: 'tx_seed_4',
      type: 'income',
      amount: 3500000,
      category: 'Lương',
      date: `${year}-${month}-24`,
      payment: 'Chuyển khoản',
      note: 'Lương part-time tháng 10',
      createdAt: Date.now() - 4000
    },
    {
      id: 'tx_seed_5',
      type: 'expense',
      amount: 420000,
      category: 'Hóa đơn',
      date: `${year}-${month}-22`,
      payment: 'Ví điện tử',
      note: 'Tiền điện nước',
      createdAt: Date.now() - 5000
    },
    {
      id: 'tx_seed_6',
      type: 'expense',
      amount: 350000,
      category: 'Mua sắm',
      date: `${year}-${month}-20`,
      payment: 'Chuyển khoản',
      note: 'Áo khoác',
      createdAt: Date.now() - 6000
    },
    {
      id: 'tx_seed_7',
      type: 'expense',
      amount: 110000,
      category: 'Giải trí',
      date: `${year}-${month}-18`,
      payment: 'Ví điện tử',
      note: 'Vé xem phim',
      createdAt: Date.now() - 7000
    },
    {
      id: 'tx_seed_8',
      type: 'income',
      amount: 5000000,
      category: 'Học bổng',
      date: `${year}-${month}-15`,
      payment: 'Chuyển khoản',
      note: 'Học bổng kỳ 1',
      createdAt: Date.now() - 8000
    },
    {
      id: 'tx_seed_9',
      type: 'expense',
      amount: 1990000,
      category: 'Ăn uống',
      date: `${year}-${month}-10`,
      payment: 'Ví điện tử',
      note: 'Tiền ăn cả tháng và liên hoan',
      createdAt: Date.now() - 9000
    },
    {
      id: 'tx_seed_10',
      type: 'expense',
      amount: 730000,
      category: 'Hóa đơn',
      date: `${year}-${month}-05`,
      payment: 'Chuyển khoản',
      note: 'Tiền mạng Internet và phòng trọ',
      createdAt: Date.now() - 10000
    },
    {
      id: 'tx_seed_11',
      type: 'expense',
      amount: 650000,
      category: 'Đi lại',
      date: `${year}-${month}-03`,
      payment: 'Ví điện tử',
      note: 'Vé xe bus tháng và Grab',
      createdAt: Date.now() - 11000
    },
    {
      id: 'tx_seed_12',
      type: 'expense',
      amount: 700000,
      category: 'Mua sắm',
      date: `${year}-${month}-02`,
      payment: 'Chuyển khoản',
      note: 'Đồ dùng cá nhân',
      createdAt: Date.now() - 12000
    }
  ];
}

// --- Formatters & Helpers ---

/**
 * Format currency to Vietnamese standard (e.g., "8.500.000 ₫")
 */
function formatVND(amount) {
  const num = Math.round(Number(amount) || 0);
  return num.toLocaleString('vi-VN') + ' ₫';
}

/**
 * Format date string (YYYY-MM-DD) to DD/MM/YYYY
 */
function formatDateVN(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

/**
 * Get days remaining in the month for budget warning
 */
function getDaysRemainingInMonth(yearMonthStr) {
  const [year, month] = yearMonthStr.split('-').map(Number);
  const now = new Date();
  
  // If target month is current real month
  if (now.getFullYear() === year && now.getMonth() + 1 === month) {
    const lastDay = new Date(year, month, 0).getDate();
    const currentDay = now.getDate();
    return Math.max(0, lastDay - currentDay);
  }
  
  // For other months (e.g. demo month 10/2026), simulate end of month (e.g. 3 days remaining)
  return 3;
}

/**
 * Sanitize HTML string to prevent XSS attacks
 */
function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Parse raw or formatted number string (e.g. "50.000" or "50000") to integer
 */
function parseAmountInput(val) {
  if (!val) return 0;
  // Remove non-digit characters except negative sign
  const clean = String(val).replace(/[^0-9]/g, '');
  return parseInt(clean, 10) || 0;
}

/**
 * Format input value with dots for live typing (e.g. 50000 -> 50.000)
 */
function formatNumberInput(num) {
  if (!num) return '';
  return num.toLocaleString('vi-VN');
}

// --- LocalStorage Persistence (F06) ---

function loadStateFromStorage() {
  try {
    const rawTx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (rawTx) {
      state.transactions = JSON.parse(rawTx);
    } else {
      // First time opening app: seed with initial sample transactions
      state.transactions = getSampleTransactions(state.currentMonth);
      saveTransactionsToStorage();
    }

    const rawBudgets = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    if (rawBudgets) {
      state.budgets = JSON.parse(rawBudgets);
    } else {
      // Default monthly budget
      state.budgets = {
        '2026-10': 6000000,
        [getCurrentYearMonth()]: 6000000
      };
      saveBudgetsToStorage();
    }

    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedTheme) {
      state.theme = savedTheme;
    } else {
      // Check system preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      state.theme = prefersDark ? 'dark' : 'light';
    }
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    state.transactions = getSampleTransactions(state.currentMonth);
    state.budgets = { '2026-10': 6000000 };
  }
}

function saveTransactionsToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(state.transactions));
  } catch (err) {
    console.error('Error saving transactions to localStorage:', err);
    showToast('Lỗi lưu dữ liệu trình duyệt!', 'error');
  }
}

function saveBudgetsToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(state.budgets));
  } catch (err) {
    console.error('Error saving budgets to localStorage:', err);
  }
}

function saveThemeToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, state.theme);
  } catch (err) {
    console.error('Error saving theme to localStorage:', err);
  }
}

function getCurrentYearMonth() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

// --- Toast Notifications ---
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const iconSvg = type === 'success'
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0E7A55" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B42318" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

  toast.innerHTML = `${iconSvg}<span>${escapeHTML(message)}</span>`;
  container.appendChild(toast);

  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// --- DOM References ---
let elements = {};

function initDOMElements() {
  elements = {
    // Month Navigator
    currentMonthHeading: document.getElementById('currentMonthHeading'),
    prevMonthBtn: document.getElementById('prevMonthBtn'),
    nextMonthBtn: document.getElementById('nextMonthBtn'),
    
    // Overview Metrics
    totalIncomeAmount: document.getElementById('totalIncomeAmount'),
    incomeCountSub: document.getElementById('incomeCountSub'),
    totalExpenseAmount: document.getElementById('totalExpenseAmount'),
    expenseCountSub: document.getElementById('expenseCountSub'),
    balanceAmount: document.getElementById('balanceAmount'),
    
    // Budget
    budgetSpentText: document.getElementById('budgetSpentText'),
    budgetLimitText: document.getElementById('budgetLimitText'),
    budgetProgressTrack: document.getElementById('budgetProgressTrack'),
    budgetProgressFill: document.getElementById('budgetProgressFill'),
    budgetAlertBanner: document.getElementById('budgetAlertBanner'),
    budgetAlertText: document.getElementById('budgetAlertText'),
    openBudgetModalBtn: document.getElementById('openBudgetModalBtn'),
    
    // Transactions Table & Filters
    searchInput: document.getElementById('searchInput'),
    categoryFilterSelect: document.getElementById('categoryFilterSelect'),
    transactionsTableBody: document.getElementById('transactionsTableBody'),
    txEmptyState: document.getElementById('txEmptyState'),
    toggleViewAllBtn: document.getElementById('toggleViewAllBtn'),
    segmentBtns: document.querySelectorAll('.segment-btn'),
    exportCsvBtn: document.getElementById('exportCsvBtn'),

    // Category Breakdown
    categoryListContainer: document.getElementById('categoryListContainer'),
    categoryTotalExpenseSub: document.getElementById('categoryTotalExpenseSub'),
    categoryEmptyState: document.getElementById('categoryEmptyState'),

    // Add / Edit Modal
    txModalOverlay: document.getElementById('txModalOverlay'),
    txModalTitle: document.getElementById('txModalTitle'),
    txForm: document.getElementById('txForm'),
    txFormId: document.getElementById('txFormId'),
    openAddModalBtn: document.getElementById('openAddModalBtn'),
    mobileFabBtn: document.getElementById('mobileFabBtn'),
    closeTxModalBtn: document.getElementById('closeTxModalBtn'),
    cancelTxModalBtn: document.getElementById('cancelTxModalBtn'),
    typeIncomeBtn: document.getElementById('typeIncomeBtn'),
    typeExpenseBtn: document.getElementById('typeExpenseBtn'),
    formAmountInput: document.getElementById('formAmountInput'),
    amountInputWrap: document.getElementById('amountInputWrap'),
    amountErrorMsg: document.getElementById('amountErrorMsg'),
    categoryPickerGrid: document.getElementById('categoryPickerGrid'),
    categoryErrorMsg: document.getElementById('categoryErrorMsg'),
    formDateInput: document.getElementById('formDateInput'),
    formPaymentSelect: document.getElementById('formPaymentSelect'),
    formNoteInput: document.getElementById('formNoteInput'),
    formNoteCounter: document.getElementById('formNoteCounter'),
    submitTxBtn: document.getElementById('submitTxBtn'),

    // Delete Modal
    deleteModalOverlay: document.getElementById('deleteModalOverlay'),
    deletePreviewNote: document.getElementById('deletePreviewNote'),
    deletePreviewMeta: document.getElementById('deletePreviewMeta'),
    deletePreviewAmount: document.getElementById('deletePreviewAmount'),
    cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
    confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),

    // Budget Modal
    budgetModalOverlay: document.getElementById('budgetModalOverlay'),
    budgetForm: document.getElementById('budgetForm'),
    budgetAmountInput: document.getElementById('budgetAmountInput'),
    budgetModalMonthText: document.getElementById('budgetModalMonthText'),
    closeBudgetModalBtn: document.getElementById('closeBudgetModalBtn'),
    cancelBudgetBtn: document.getElementById('cancelBudgetBtn'),
    presetBudgetBtns: document.querySelectorAll('.budget-preset-btn'),

    // Settings Modal
    settingsModalOverlay: document.getElementById('settingsModalOverlay'),
    closeSettingsModalBtn: document.getElementById('closeSettingsModalBtn'),
    settingsThemeToggleBtn: document.getElementById('settingsThemeToggleBtn'),
    resetSampleDataBtn: document.getElementById('resetSampleDataBtn'),
    clearAllDataBtn: document.getElementById('clearAllDataBtn'),

    // Theme Toggles
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    mobileThemeToggleBtn: document.getElementById('mobileThemeToggleBtn'),

    // Navigation Links
    navLinks: document.querySelectorAll('.nav-link, .bottom-nav-item')
  };
}

// --- Data Filtering and Processing ---

/**
 * Filter transactions based on active month, type, category, and search query
 */
function getFilteredTransactions() {
  return state.transactions.filter(tx => {
    // 1. Month filter (F07)
    if (!tx.date || !tx.date.startsWith(state.currentMonth)) {
      return false;
    }

    // 2. Type filter (all / income / expense)
    if (state.filterType !== 'all' && tx.type !== state.filterType) {
      return false;
    }

    // 3. Category filter
    if (state.filterCategory !== 'all' && tx.category !== state.filterCategory) {
      return false;
    }

    // 4. Search query (by note or category)
    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase().trim();
      const noteMatch = tx.note && tx.note.toLowerCase().includes(q);
      const catMatch = tx.category && tx.category.toLowerCase().includes(q);
      if (!noteMatch && !catMatch) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    // Sort newest first by date, then by creation timestamp
    const dateCmp = new Date(b.date) - new Date(a.date);
    if (dateCmp !== 0) return dateCmp;
    return (b.createdAt || 0) - (a.createdAt || 0);
  });
}

/**
 * Calculate totals for current month
 */
function calculateMonthSummary() {
  const currentMonthTransactions = state.transactions.filter(tx => 
    tx.date && tx.date.startsWith(state.currentMonth)
  );

  let totalIncome = 0;
  let incomeCount = 0;
  let totalExpense = 0;
  let expenseCount = 0;

  currentMonthTransactions.forEach(tx => {
    const val = Number(tx.amount) || 0;
    if (tx.type === 'income') {
      totalIncome += val;
      incomeCount++;
    } else {
      totalExpense += val;
      expenseCount++;
    }
  });

  const balance = totalIncome - totalExpense;

  return {
    totalIncome,
    incomeCount,
    totalExpense,
    expenseCount,
    balance
  };
}

// --- Rendering Functions ---

/**
 * Render Header Month Display
 */
function renderMonthHeader() {
  const [year, month] = state.currentMonth.split('-');
  const text = `Tháng ${parseInt(month, 10)}/${year}`;
  if (elements.currentMonthHeading) {
    elements.currentMonthHeading.textContent = text;
  }
  if (elements.budgetModalMonthText) {
    elements.budgetModalMonthText.textContent = text;
  }
}

/**
 * Render Overview Cards (F01)
 */
function renderOverviewCards() {
  const summary = calculateMonthSummary();

  if (elements.totalIncomeAmount) {
    elements.totalIncomeAmount.textContent = formatVND(summary.totalIncome);
  }
  if (elements.incomeCountSub) {
    elements.incomeCountSub.textContent = `${summary.incomeCount} khoản thu`;
  }

  if (elements.totalExpenseAmount) {
    elements.totalExpenseAmount.textContent = formatVND(summary.totalExpense);
  }
  if (elements.expenseCountSub) {
    elements.expenseCountSub.textContent = `${summary.expenseCount} khoản chi`;
  }

  if (elements.balanceAmount) {
    elements.balanceAmount.textContent = formatVND(summary.balance);
  }
}

/**
 * Render Monthly Budget (F08)
 */
function renderBudgetSection() {
  const summary = calculateMonthSummary();
  const currentLimit = state.budgets[state.currentMonth] ?? 6000000;
  
  if (elements.budgetSpentText) {
    elements.budgetSpentText.textContent = formatVND(summary.totalExpense);
  }
  if (elements.budgetLimitText) {
    elements.budgetLimitText.textContent = formatVND(currentLimit);
  }

  const fillEl = elements.budgetProgressFill;
  const bannerEl = elements.budgetAlertBanner;
  const alertTextEl = elements.budgetAlertText;

  if (currentLimit <= 0) {
    if (fillEl) fillEl.style.width = '0%';
    if (bannerEl) {
      bannerEl.className = 'budget-alert-banner safe';
      alertTextEl.textContent = 'Bạn chưa đặt hạn mức chi tiêu cho tháng này. Bấm "Đặt hạn mức" để bắt đầu theo dõi!';
    }
    return;
  }

  const percentUsed = Math.round((summary.totalExpense / currentLimit) * 100);
  const visualWidth = Math.min(100, percentUsed);
  const remaining = currentLimit - summary.totalExpense;
  const daysRemaining = getDaysRemainingInMonth(state.currentMonth);

  if (fillEl) {
    fillEl.style.width = `${visualWidth}%`;
    fillEl.classList.remove('warning', 'danger');
  }

  if (bannerEl) {
    bannerEl.classList.remove('warning', 'danger', 'safe');
  }

  if (percentUsed > 100) {
    // Over budget (Exceeded)
    if (fillEl) fillEl.classList.add('danger');
    if (bannerEl) {
      bannerEl.classList.add('danger');
      alertTextEl.textContent = `Cảnh báo: Bạn đã chi vượt ngân sách ${formatVND(Math.abs(remaining))}! Hãy cân nhắc giảm bớt chi tiêu.`;
    }
  } else if (percentUsed >= 80) {
    // Warning (>80%)
    if (fillEl) fillEl.classList.add('warning');
    if (bannerEl) {
      bannerEl.classList.add('warning');
      alertTextEl.textContent = `Bạn đã dùng ${percentUsed}% ngân sách. Còn lại ${formatVND(remaining)} cho ${daysRemaining} ngày cuối tháng.`;
    }
  } else {
    // Safe (<80%)
    if (bannerEl) {
      bannerEl.classList.add('safe');
      alertTextEl.textContent = `Tiến độ chi tiêu tốt (${percentUsed}% ngân sách). Bạn còn lại ${formatVND(remaining)} cho tháng này.`;
    }
  }

  if (elements.budgetProgressTrack) {
    elements.budgetProgressTrack.setAttribute('aria-valuenow', percentUsed);
  }
}

/**
 * Render Transactions Table (F03, F07)
 */
function renderTransactionsTable() {
  const list = getFilteredTransactions();
  const tbody = elements.transactionsTableBody;
  if (!tbody) return;

  tbody.innerHTML = '';

  if (list.length === 0) {
    if (elements.txEmptyState) elements.txEmptyState.style.display = 'flex';
    if (elements.toggleViewAllBtn) elements.toggleViewAllBtn.style.display = 'none';
    return;
  }

  if (elements.txEmptyState) elements.txEmptyState.style.display = 'none';

  // Limit count if not expanded
  const displayLimit = state.isViewAllExpanded ? list.length : 8;
  const displayItems = list.slice(0, displayLimit);

  displayItems.forEach(tx => {
    const tr = document.createElement('tr');
    tr.dataset.id = tx.id;

    const catMeta = getCategoryMeta(tx.category);
    const isIncome = tx.type === 'income';
    const amountSign = isIncome ? '+ ' : '− ';
    const amountClass = isIncome ? 'income' : 'expense';

    tr.innerHTML = `
      <td class="tx-date-cell">${formatDateVN(tx.date)}</td>
      <td>
        <span class="tx-cat-chip">
          <span class="tx-cat-avatar" style="background-color: ${catMeta.chip}; color: ${catMeta.fg};">
            ${escapeHTML(catMeta.ini)}
          </span>
          <span class="tx-cat-name">${escapeHTML(tx.category)}</span>
        </span>
      </td>
      <td class="tx-note-cell" title="${escapeHTML(tx.note || '')}">
        ${escapeHTML(tx.note || '—')}
      </td>
      <td class="tx-amount-cell ${amountClass}">
        ${amountSign}${formatVND(tx.amount)}
      </td>
      <td class="tx-actions-cell">
        <button type="button" class="btn-icon-action edit" aria-label="Sửa giao dịch" title="Sửa giao dịch" data-action="edit" data-id="${tx.id}">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
          </svg>
        </button>
        <button type="button" class="btn-icon-action delete" aria-label="Xóa giao dịch" title="Xóa giao dịch" data-action="delete" data-id="${tx.id}">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
            <path d="M10 11v6"></path>
            <path d="M14 11v6"></path>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
          </svg>
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  // Toggle "Xem tất cả" button text and visibility
  if (elements.toggleViewAllBtn) {
    if (list.length > 8) {
      elements.toggleViewAllBtn.style.display = 'block';
      elements.toggleViewAllBtn.textContent = state.isViewAllExpanded 
        ? 'Thu gọn danh sách' 
        : `Xem tất cả ${list.length} giao dịch`;
    } else {
      elements.toggleViewAllBtn.style.display = 'none';
    }
  }
}

/**
 * Render Category Breakdown Chart (F09)
 */
function renderCategoryBreakdown() {
  const container = elements.categoryListContainer;
  if (!container) return;

  // Filter only expenses in the active month
  const expenses = state.transactions.filter(tx => 
    tx.date && tx.date.startsWith(state.currentMonth) && tx.type === 'expense'
  );

  let totalExpense = 0;
  const catSums = {};

  expenses.forEach(tx => {
    const amt = Number(tx.amount) || 0;
    totalExpense += amt;
    catSums[tx.category] = (catSums[tx.category] || 0) + amt;
  });

  if (elements.categoryTotalExpenseSub) {
    elements.categoryTotalExpenseSub.textContent = `Tổng chi ${formatVND(totalExpense)}`;
  }

  container.innerHTML = '';

  const catNames = Object.keys(catSums);
  if (catNames.length === 0 || totalExpense === 0) {
    if (elements.categoryEmptyState) elements.categoryEmptyState.style.display = 'block';
    return;
  }

  if (elements.categoryEmptyState) elements.categoryEmptyState.style.display = 'none';

  // Sort categories descending by expense amount
  const sortedCats = catNames.map(name => ({
    name,
    amount: catSums[name],
    pct: Math.round((catSums[name] / totalExpense) * 100)
  })).sort((a, b) => b.amount - a.amount);

  const maxAmount = sortedCats[0].amount;

  sortedCats.forEach(c => {
    const meta = getCategoryMeta(c.name);
    // Relative width against the top category (as styled in mockup)
    const relativeWidth = Math.max(8, Math.round((c.amount / maxAmount) * 100));

    const item = document.createElement('div');
    item.className = 'category-item';
    item.innerHTML = `
      <div class="category-meta">
        <span class="cat-name-label">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${meta.color};"></span>
          ${escapeHTML(c.name)}
        </span>
        <span class="cat-amount-label">
          ${formatVND(c.amount)} · <strong>${c.pct}%</strong>
        </span>
      </div>
      <div class="category-bar-track">
        <div class="category-bar-fill" style="width: ${relativeWidth}%; background-color: ${meta.color};"></div>
      </div>
    `;
    container.appendChild(item);
  });
}

/**
 * Render Category Dropdown Filter in Transaction Section
 */
function renderCategoryFilterDropdown() {
  const select = elements.categoryFilterSelect;
  if (!select) return;

  const currentVal = select.value;
  select.innerHTML = '<option value="all">Tất cả danh mục</option>';

  const allCategories = new Set();
  [...CATEGORIES.expense, ...CATEGORIES.income].forEach(c => allCategories.add(c.name));

  // Also include any custom category present in transactions
  state.transactions.forEach(tx => {
    if (tx.category) allCategories.add(tx.category);
  });

  allCategories.forEach(catName => {
    const opt = document.createElement('option');
    opt.value = catName;
    opt.textContent = catName;
    select.appendChild(opt);
  });

  select.value = currentVal || 'all';
}

/**
 * Master Render
 */
function renderApp() {
  renderMonthHeader();
  renderOverviewCards();
  renderBudgetSection();
  renderTransactionsTable();
  renderCategoryBreakdown();
}

// --- Category Grid Picker in Modal (F02, F04) ---
let selectedCategoryInForm = '';
let selectedTypeInForm = 'expense';

function renderCategoryPicker(type) {
  const grid = elements.categoryPickerGrid;
  if (!grid) return;

  grid.innerHTML = '';
  const list = CATEGORIES[type] || CATEGORIES.expense;

  list.forEach(cat => {
    const isSelected = cat.name === selectedCategoryInForm;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `category-chip-btn ${isSelected ? 'selected' : ''}`;
    btn.dataset.category = cat.name;

    btn.innerHTML = `
      <span class="category-chip-icon" style="background-color: ${cat.chip}; color: ${cat.fg};">
        ${escapeHTML(cat.ini)}
      </span>
      <span>${escapeHTML(cat.name)}</span>
    `;

    btn.addEventListener('click', () => {
      selectedCategoryInForm = cat.name;
      // Update UI classes
      grid.querySelectorAll('.category-chip-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      if (elements.categoryErrorMsg) elements.categoryErrorMsg.classList.remove('visible');
    });

    grid.appendChild(btn);
  });
}

function setFormType(type) {
  selectedTypeInForm = type;
  if (type === 'income') {
    elements.typeIncomeBtn.className = 'type-switch-btn active income';
    elements.typeExpenseBtn.className = 'type-switch-btn';
  } else {
    elements.typeIncomeBtn.className = 'type-switch-btn';
    elements.typeExpenseBtn.className = 'type-switch-btn active expense';
  }

  // If previous selected category does not belong to new type, select first category of new type
  const list = CATEGORIES[type] || [];
  const exists = list.some(c => c.name === selectedCategoryInForm);
  if (!exists && list.length > 0) {
    selectedCategoryInForm = list[0].name;
  }

  renderCategoryPicker(type);
}

// --- Modal Handling ---

function openTransactionModal(editId = null) {
  state.editingTxId = editId;
  const isEdit = Boolean(editId);

  // Clear previous errors
  if (elements.amountInputWrap) elements.amountInputWrap.classList.remove('has-error');
  if (elements.amountErrorMsg) elements.amountErrorMsg.classList.remove('visible');
  if (elements.categoryErrorMsg) elements.categoryErrorMsg.classList.remove('visible');

  if (isEdit) {
    const tx = state.transactions.find(t => t.id === editId);
    if (!tx) return;

    elements.txModalTitle.textContent = 'Sửa giao dịch';
    elements.submitTxBtn.textContent = 'Cập nhật';
    elements.txFormId.value = tx.id;
    elements.formAmountInput.value = formatNumberInput(tx.amount);
    elements.formDateInput.value = tx.date;
    elements.formPaymentSelect.value = tx.payment || 'Tiền mặt';
    elements.formNoteInput.value = tx.note || '';
    elements.formNoteCounter.textContent = `${(tx.note || '').length}/100 ký tự`;

    selectedCategoryInForm = tx.category;
    setFormType(tx.type);
  } else {
    elements.txModalTitle.textContent = 'Thêm giao dịch';
    elements.submitTxBtn.textContent = 'Lưu giao dịch';
    elements.txFormId.value = '';
    elements.formAmountInput.value = '';
    
    // Default to today if currentMonth is real month, else demo date
    const todayStr = new Date().toISOString().split('T')[0];
    elements.formDateInput.value = todayStr.startsWith(state.currentMonth) 
      ? todayStr 
      : `${state.currentMonth}-15`;

    elements.formPaymentSelect.value = 'Tiền mặt';
    elements.formNoteInput.value = '';
    elements.formNoteCounter.textContent = '0/100 ký tự';

    selectedCategoryInForm = CATEGORIES.expense[0].name;
    setFormType('expense');
  }

  elements.txModalOverlay.classList.add('active');
  elements.formAmountInput.focus();
}

function closeTransactionModal() {
  if (elements.txModalOverlay) {
    elements.txModalOverlay.classList.remove('active');
  }
  state.editingTxId = null;
}

// Delete Confirmation Modal (F05)
function openDeleteModal(txId) {
  const tx = state.transactions.find(t => t.id === txId);
  if (!tx) return;

  state.deletingTxId = txId;
  elements.deletePreviewNote.textContent = tx.note || tx.category;
  elements.deletePreviewMeta.textContent = `${tx.category} · ${formatDateVN(tx.date)}`;

  const isIncome = tx.type === 'income';
  elements.deletePreviewAmount.textContent = `${isIncome ? '+ ' : '− '}${formatVND(tx.amount)}`;
  elements.deletePreviewAmount.style.color = isIncome ? 'var(--color-income)' : 'var(--color-expense)';

  elements.deleteModalOverlay.classList.add('active');
}

function closeDeleteModal() {
  if (elements.deleteModalOverlay) {
    elements.deleteModalOverlay.classList.remove('active');
  }
  state.deletingTxId = null;
}

// Budget Modal (F08)
function openBudgetModal() {
  const currentLimit = state.budgets[state.currentMonth] ?? 6000000;
  elements.budgetAmountInput.value = formatNumberInput(currentLimit);
  renderMonthHeader();
  elements.budgetModalOverlay.classList.add('active');
  elements.budgetAmountInput.focus();
}

function closeBudgetModal() {
  if (elements.budgetModalOverlay) {
    elements.budgetModalOverlay.classList.remove('active');
  }
}

// Settings Modal
function openSettingsModal() {
  elements.settingsModalOverlay.classList.add('active');
}

function closeSettingsModal() {
  if (elements.settingsModalOverlay) {
    elements.settingsModalOverlay.classList.remove('active');
  }
}

// --- CRUD Operations (F02, F04, F05) ---

function handleFormSubmit(e) {
  e.preventDefault();

  // Validate Amount
  const rawAmount = parseAmountInput(elements.formAmountInput.value);
  let hasError = false;

  if (rawAmount <= 0 || isNaN(rawAmount)) {
    elements.amountInputWrap.classList.add('has-error');
    elements.amountErrorMsg.classList.add('visible');
    hasError = true;
  } else {
    elements.amountInputWrap.classList.remove('has-error');
    elements.amountErrorMsg.classList.remove('visible');
  }

  // Validate Category
  if (!selectedCategoryInForm) {
    elements.categoryErrorMsg.classList.add('visible');
    hasError = true;
  } else {
    elements.categoryErrorMsg.classList.remove('visible');
  }

  // Validate Date
  const dateVal = elements.formDateInput.value;
  if (!dateVal) {
    hasError = true;
  }

  if (hasError) return;

  const noteVal = elements.formNoteInput.value.trim().slice(0, 100);
  const paymentVal = elements.formPaymentSelect.value;
  const isEditing = Boolean(state.editingTxId);

  if (isEditing) {
    // Update existing transaction (F04)
    const index = state.transactions.findIndex(t => t.id === state.editingTxId);
    if (index !== -1) {
      state.transactions[index] = {
        ...state.transactions[index],
        type: selectedTypeInForm,
        amount: rawAmount,
        category: selectedCategoryInForm,
        date: dateVal,
        payment: paymentVal,
        note: noteVal
      };
      saveTransactionsToStorage();
      showToast('Cập nhật giao dịch thành công!', 'success');
    }
  } else {
    // Add new transaction (F02)
    const newTx = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      type: selectedTypeInForm,
      amount: rawAmount,
      category: selectedCategoryInForm,
      date: dateVal,
      payment: paymentVal,
      note: noteVal,
      createdAt: Date.now()
    };
    state.transactions.unshift(newTx);
    saveTransactionsToStorage();
    showToast('Thêm giao dịch thành công!', 'success');
  }

  closeTransactionModal();
  renderCategoryFilterDropdown();
  renderApp();
}

function handleConfirmDelete() {
  if (!state.deletingTxId) return;

  state.transactions = state.transactions.filter(t => t.id !== state.deletingTxId);
  saveTransactionsToStorage();
  closeDeleteModal();
  renderCategoryFilterDropdown();
  renderApp();
  showToast('Đã xóa giao dịch!', 'success');
}

// --- Month Navigation (F07) ---

function changeMonth(offset) {
  const [year, month] = state.currentMonth.split('-').map(Number);
  let newMonth = month + offset;
  let newYear = year;

  if (newMonth > 12) {
    newMonth = 1;
    newYear++;
  } else if (newMonth < 1) {
    newMonth = 12;
    newYear--;
  }

  state.currentMonth = `${newYear}-${String(newMonth).padStart(2, '0')}`;
  renderApp();
}

// --- Theme Toggle (F11) ---

function setTheme(theme) {
  state.theme = theme;
  if (theme === 'dark') {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
  saveThemeToStorage();
}

function toggleTheme() {
  const next = state.theme === 'dark' ? 'light' : 'dark';
  setTheme(next);
  showToast(`Đã chuyển sang giao diện ${next === 'dark' ? 'Tối' : 'Sáng'}`);
}

// --- Export to CSV File (F12) ---

/**
 * Export filtered transactions to CSV with UTF-8 BOM so Microsoft Excel
 * properly renders Vietnamese characters without encoding bugs.
 */
function exportTransactionsCSV() {
  const transactionsToExport = getFilteredTransactions();

  if (transactionsToExport.length === 0) {
    showToast('Không có giao dịch nào trong bộ lọc để xuất!', 'error');
    return;
  }

  // CSV Headers
  const headers = ['Mã GD', 'Ngày', 'Loại', 'Danh mục', 'Ghi chú', 'Số tiền (VND)', 'Hình thức'];

  const rows = transactionsToExport.map(tx => {
    return [
      tx.id,
      formatDateVN(tx.date),
      tx.type === 'income' ? 'Khoản thu' : 'Khoản chi',
      tx.category,
      tx.note || '',
      tx.amount,
      tx.payment || 'Tiền mặt'
    ];
  });

  // Helper to escape CSV field according to RFC 4180
  const escapeCsv = (val) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent = [
    headers.map(escapeCsv).join(','),
    ...rows.map(row => row.map(escapeCsv).join(','))
  ].join('\r\n');

  // \uFEFF is the UTF-8 Byte Order Mark (BOM) needed by Excel
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  
  const [year, month] = state.currentMonth.split('-');
  a.download = `MoneyNote_GiaoDich_${month}_${year}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast(`Đã xuất ${transactionsToExport.length} giao dịch ra file CSV!`, 'success');
}

// --- Event Listeners Setup ---

function setupEventListeners() {
  // 1. Month Navigation
  elements.prevMonthBtn.addEventListener('click', () => changeMonth(-1));
  elements.nextMonthBtn.addEventListener('click', () => changeMonth(1));

  // 2. Open Add Transaction Modal
  elements.openAddModalBtn.addEventListener('click', () => openTransactionModal());
  elements.mobileFabBtn.addEventListener('click', () => openTransactionModal());

  // 3. Modal Close & Cancel
  elements.closeTxModalBtn.addEventListener('click', closeTransactionModal);
  elements.cancelTxModalBtn.addEventListener('click', closeTransactionModal);
  elements.closeBudgetModalBtn.addEventListener('click', closeBudgetModal);
  elements.cancelBudgetBtn.addEventListener('click', closeBudgetModal);
  elements.closeSettingsModalBtn.addEventListener('click', closeSettingsModal);
  elements.cancelDeleteBtn.addEventListener('click', closeDeleteModal);

  // Close modals when clicking backdrop
  [elements.txModalOverlay, elements.deleteModalOverlay, elements.budgetModalOverlay, elements.settingsModalOverlay].forEach(overlay => {
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
        }
      });
    }
  });

  // ESC key to close active modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeTransactionModal();
      closeDeleteModal();
      closeBudgetModal();
      closeSettingsModal();
    }
  });

  // 4. Form Submit
  elements.txForm.addEventListener('submit', handleFormSubmit);

  // 5. Amount Input Formatting while typing
  elements.formAmountInput.addEventListener('input', (e) => {
    const raw = parseAmountInput(e.target.value);
    e.target.value = raw > 0 ? formatNumberInput(raw) : '';
    if (raw > 0) {
      elements.amountInputWrap.classList.remove('has-error');
      elements.amountErrorMsg.classList.remove('visible');
    }
  });

  // 6. Note Character Counter
  elements.formNoteInput.addEventListener('input', (e) => {
    elements.formNoteCounter.textContent = `${e.target.value.length}/100 ký tự`;
  });

  // 7. Form Type Switch
  elements.typeIncomeBtn.addEventListener('click', () => setFormType('income'));
  elements.typeExpenseBtn.addEventListener('click', () => setFormType('expense'));

  // 8. Delete Confirm
  elements.confirmDeleteBtn.addEventListener('click', handleConfirmDelete);

  // 9. Table Row Action Delegations (Edit / Delete)
  elements.transactionsTableBody.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const txId = btn.dataset.id;

    if (action === 'edit') {
      openTransactionModal(txId);
    } else if (action === 'delete') {
      openDeleteModal(txId);
    }
  });

  // 10. Filter Segment Buttons (All / Income / Expense)
  elements.segmentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.segmentBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.filterType = btn.dataset.filterType;
      renderTransactionsTable();
    });
  });

  // 11. Category Filter Dropdown
  elements.categoryFilterSelect.addEventListener('change', (e) => {
    state.filterCategory = e.target.value;
    renderTransactionsTable();
  });

  // 12. Realtime Search Input
  elements.searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderTransactionsTable();
  });

  // 13. Toggle View All Transactions
  elements.toggleViewAllBtn.addEventListener('click', () => {
    state.isViewAllExpanded = !state.isViewAllExpanded;
    renderTransactionsTable();
  });

  // 14. Budget Modal & Save
  elements.openBudgetModalBtn.addEventListener('click', openBudgetModal);
  elements.budgetAmountInput.addEventListener('input', (e) => {
    const raw = parseAmountInput(e.target.value);
    e.target.value = raw > 0 ? formatNumberInput(raw) : '';
  });

  elements.presetBudgetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = Number(btn.dataset.preset);
      elements.budgetAmountInput.value = formatNumberInput(val);
    });
  });

  elements.budgetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const raw = parseAmountInput(elements.budgetAmountInput.value);
    state.budgets[state.currentMonth] = raw;
    saveBudgetsToStorage();
    closeBudgetModal();
    renderBudgetSection();
    showToast(`Đã lưu hạn mức ${formatVND(raw)} cho ${elements.currentMonthHeading.textContent}!`, 'success');
  });

  // 15. Export CSV Button
  elements.exportCsvBtn.addEventListener('click', exportTransactionsCSV);

  // 16. Theme Toggles
  elements.themeToggleBtn.addEventListener('click', toggleTheme);
  elements.mobileThemeToggleBtn.addEventListener('click', toggleTheme);
  elements.settingsThemeToggleBtn.addEventListener('click', toggleTheme);

  // 17. Navigation Links (Desktop & Mobile)
  elements.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const view = link.dataset.view;

      // Update active classes
      elements.navLinks.forEach(l => {
        if (l.dataset.view === view) {
          l.classList.add('active');
        } else {
          l.classList.remove('active');
        }
      });

      if (view === 'settings') {
        openSettingsModal();
      } else if (view === 'transactions') {
        const txSec = document.querySelector('.transactions-card');
        if (txSec) txSec.scrollIntoView({ behavior: 'smooth' });
      } else if (view === 'stats') {
        const statsSec = document.querySelector('.category-stats-card');
        if (statsSec) statsSec.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // 18. Settings Modal Actions
  elements.resetSampleDataBtn.addEventListener('click', () => {
    state.transactions = getSampleTransactions(state.currentMonth);
    saveTransactionsToStorage();
    renderCategoryFilterDropdown();
    renderApp();
    closeSettingsModal();
    showToast('Đã khôi phục 10+ giao dịch mẫu!', 'success');
  });

  elements.clearAllDataBtn.addEventListener('click', () => {
    if (confirm('Bạn có chắc chắn muốn xóa TOÀN BỘ dữ liệu giao dịch và ngân sách không?')) {
      state.transactions = [];
      state.budgets = {};
      localStorage.clear();
      renderCategoryFilterDropdown();
      renderApp();
      closeSettingsModal();
      showToast('Đã xóa toàn bộ dữ liệu trên trình duyệt!', 'success');
    }
  });
}

// --- Application Initialization ---

document.addEventListener('DOMContentLoaded', () => {
  initDOMElements();
  loadStateFromStorage();
  setTheme(state.theme);
  renderCategoryFilterDropdown();
  setupEventListeners();
  renderApp();
});

