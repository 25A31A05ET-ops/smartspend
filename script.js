const STORAGE_KEYS = {
  expenses: 'smartspend-expenses',
  income: 'smartspend-income',
  budget: 'smartspend-budget',
  student: 'smartspend-student',
  savings: 'smartspend-savings',
  monthlyReports: 'smartspend-monthly-reports',
};

const DEFAULT_STUDENT_SETTINGS = {
  pocketMoney: 3000,
  collegeDays: 30,
  savingsTarget: 5000,
};

const state = {
  expenses: [],
  income: [],
  budget: 0,
  studentSettings: { ...DEFAULT_STUDENT_SETTINGS },
  savingsGoals: [],
  monthlyReports: [],
  filters: {
    search: '',
    category: 'all',
    payment: 'all',
    type: 'all',
    date: '',
    sort: 'newest',
  },
};

let activeUserName = '';
let activeUserRole = 'Student';

const elements = {
  startupSplash: document.getElementById('startupSplash'),
  appShell: document.getElementById('appShell'),
  sidebar: document.getElementById('mainSidebar'),
  sidebarOverlay: document.getElementById('sidebarOverlay'),
  mobileNavToggle: document.getElementById('mobileNavToggle'),
  loginScreen: document.getElementById('loginScreen'),
  loginForm: document.getElementById('loginForm'),
  loginUserName: document.getElementById('loginUserName'),
  loginPassword: document.getElementById('loginPassword'),
  currentMonth: document.getElementById('currentMonth'),
  totalBalance: document.getElementById('totalBalance'),
  totalIncome: document.getElementById('totalIncome'),
  totalExpenses: document.getElementById('totalExpenses'),
  remainingBudget: document.getElementById('remainingBudget'),
  remainingBudgetText: document.getElementById('remainingBudgetText'),
  spentAmount: document.getElementById('spentAmount'),
  budgetAmount: document.getElementById('budgetAmount'),
  budgetStatus: document.getElementById('budgetStatus'),
  budgetProgressBar: document.getElementById('budgetProgressBar'),
  budgetProgressText: document.getElementById('budgetProgressText'),
  sidebarBudgetText: document.getElementById('sidebarBudgetText'),
  balanceMeta: document.getElementById('balanceMeta'),
  remainingBudgetMeta: document.getElementById('remainingBudgetMeta'),
  transactionList: document.getElementById('transactionList'),
  incomePortalTotal: document.getElementById('incomePortalTotal'),
  incomePortalCount: document.getElementById('incomePortalCount'),
  incomeTransactionList: document.getElementById('incomeTransactionList'),
  profileMenuToggle: document.getElementById('profileMenuToggle'),
  profileMenu: document.getElementById('profileMenu'),
  logoutButton: document.getElementById('logoutButton'),
  darkModeToggle: document.getElementById('darkModeToggle'),
  currentThemeLabel: document.getElementById('currentThemeLabel'),
  expenseModal: document.getElementById('expenseModal'),
  expenseForm: document.getElementById('expenseForm'),
  expenseTitle: document.getElementById('expenseTitle'),
  expenseAmount: document.getElementById('expenseAmount'),
  expenseCategory: document.getElementById('expenseCategory'),
  expenseGoalField: document.getElementById('expenseGoalField'),
  expenseGoal: document.getElementById('expenseGoal'),
  expenseDate: document.getElementById('expenseDate'),
  expensePayment: document.getElementById('expensePayment'),
  expenseDescription: document.getElementById('expenseDescription'),
  incomeModal: document.getElementById('incomeModal'),
  incomeForm: document.getElementById('incomeForm'),
  incomeSource: document.getElementById('incomeSource'),
  incomeAmount: document.getElementById('incomeAmount'),
  incomeDate: document.getElementById('incomeDate'),
  incomeDescription: document.getElementById('incomeDescription'),
  budgetModal: document.getElementById('budgetModal'),
  budgetForm: document.getElementById('budgetForm'),
  budgetInput: document.getElementById('budgetInput'),
  toastContainer: document.getElementById('toastContainer'),
  addExpenseButton: document.getElementById('addExpenseButton'),
  addIncomeButton: document.getElementById('addIncomeButton'),
  setBudgetButton: document.getElementById('setBudgetButton'),
  budgetShortcutButton: document.getElementById('budgetShortcutButton'),
  closeExpenseModal: document.getElementById('closeExpenseModal'),
  cancelExpenseButton: document.getElementById('cancelExpenseButton'),
  closeIncomeModal: document.getElementById('closeIncomeModal'),
  cancelIncomeButton: document.getElementById('cancelIncomeButton'),
  closeBudgetModal: document.getElementById('closeBudgetModal'),
  cancelBudgetButton: document.getElementById('cancelBudgetButton'),
  searchInput: document.getElementById('searchInput'),
  expenditureMonth: document.getElementById('expenditureMonth'),
  addHistoricalExpenseButton: document.getElementById('addHistoricalExpenseButton'),
  expenditureMonthLabel: document.getElementById('expenditureMonthLabel'),
  expenditureMonthTotal: document.getElementById('expenditureMonthTotal'),
  expenditureMonthCount: document.getElementById('expenditureMonthCount'),
  expenditureMonthChange: document.getElementById('expenditureMonthChange'),
  expenditureCategoryList: document.getElementById('expenditureCategoryList'),
  expenditureTransactionList: document.getElementById('expenditureTransactionList'),
  monthlyReportHistory: document.getElementById('monthlyReportHistory'),
  categoryFilter: document.getElementById('categoryFilter'),
  paymentFilter: document.getElementById('paymentFilter'),
  typeFilter: document.getElementById('typeFilter'),
  dateFilter: document.getElementById('dateFilter'),
  sortFilter: document.getElementById('sortFilter'),
  analyticsIncome: document.getElementById('analyticsIncome'),
  analyticsExpenses: document.getElementById('analyticsExpenses'),
  averageDailySpending: document.getElementById('averageDailySpending'),
  highestCategory: document.getElementById('highestCategory'),
  highestExpense: document.getElementById('highestExpense'),
  transactionCount: document.getElementById('transactionCount'),
  pocketMoneyInput: document.getElementById('pocketMoneyInput'),
  collegeDaysInput: document.getElementById('collegeDaysInput'),
  savingsTargetInput: document.getElementById('savingsTargetInput'),
  studentModeForm: document.getElementById('studentModeForm'),
  dailyLimitValue: document.getElementById('dailyLimitValue'),
  todaySpending: document.getElementById('todaySpending'),
  todayRemaining: document.getElementById('todayRemaining'),
  monthlySpendingValue: document.getElementById('monthlySpendingValue'),
  remainingPocketMoney: document.getElementById('remainingPocketMoney'),
  goalName: document.getElementById('goalName'),
  targetAmount: document.getElementById('targetAmount'),
  currentSavedAmount: document.getElementById('currentSavedAmount'),
  targetDate: document.getElementById('targetDate'),
  savingsForm: document.getElementById('savingsForm'),
  addGoalButton: document.getElementById('addGoalButton'),
  cancelGoalButton: document.getElementById('cancelGoalButton'),
  savingsList: document.getElementById('savingsList'),
  smartInsightsList: document.getElementById('smartInsightsList'),
};

let chartInstances = {};

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return 'No date';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function getMonthKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function shiftMonth(monthKey, amount) {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, month - 1 + amount, 1);
  return getMonthKey(date);
}

function formatMonth(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  return new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' })
    .format(new Date(year, month - 1, 1));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function saveData() {
  if (!activeUserName) {
    return;
  }

  Object.entries({
    expenses: state.expenses,
    income: state.income,
    budget: state.budget,
    student: state.studentSettings,
    savings: state.savingsGoals,
    monthlyReports: state.monthlyReports,
  }).forEach(([key, value]) => {
    localStorage.setItem(getProfileStorageKey(key), JSON.stringify(value));
  });
}

function normalizeUserName(userName) {
  return userName.trim().toLocaleLowerCase();
}

function getProfileStorageKey(key, userName = activeUserName) {
  return `smartspend-profile:${encodeURIComponent(normalizeUserName(userName))}:${key}`;
}

function initializeUserProfile(userName) {
  const userKey = normalizeUserName(userName);
  const initializedKey = `smartspend-profile:${encodeURIComponent(userKey)}:initialized`;
  const legacyOwner = localStorage.getItem('smartspend-legacy-owner') || 'aarav';
  const migratedKey = `smartspend-profile:${encodeURIComponent(userKey)}:legacy-migrated`;

  if (!localStorage.getItem(initializedKey)) {
    if (userKey !== legacyOwner) {
      const defaults = {
        expenses: [],
        income: [],
        budget: 0,
        student: DEFAULT_STUDENT_SETTINGS,
        savings: [],
      };
      Object.entries(defaults).forEach(([key, value]) => {
        localStorage.setItem(getProfileStorageKey(key, userName), JSON.stringify(value));
      });
    }

    localStorage.setItem(initializedKey, 'true');
  }

  if (userKey === legacyOwner && !localStorage.getItem(migratedKey)) {
    Object.entries(STORAGE_KEYS).forEach(([key, legacyKey]) => {
      const legacyValue = localStorage.getItem(legacyKey);
      if (legacyValue !== null) {
        localStorage.setItem(getProfileStorageKey(key, userName), legacyValue);
      }
    });
    localStorage.setItem(migratedKey, 'true');
  }
}

function loadData(userName) {
  activeUserName = userName;
  initializeUserProfile(userName);
  applyTheme(localStorage.getItem(getProfileStorageKey('theme')) === 'dark');

  try {
    const storedExpenses = JSON.parse(localStorage.getItem(getProfileStorageKey('expenses')) || '[]');
    const storedIncome = JSON.parse(localStorage.getItem(getProfileStorageKey('income')) || '[]');
    const storedBudget = JSON.parse(localStorage.getItem(getProfileStorageKey('budget')) || '0');
    const storedStudent = JSON.parse(localStorage.getItem(getProfileStorageKey('student')) || JSON.stringify(DEFAULT_STUDENT_SETTINGS));
    const storedSavings = JSON.parse(localStorage.getItem(getProfileStorageKey('savings')) || '[]');
    const storedMonthlyReports = JSON.parse(localStorage.getItem(getProfileStorageKey('monthlyReports')) || '[]');

    state.expenses = Array.isArray(storedExpenses) ? storedExpenses : [];
    state.income = Array.isArray(storedIncome) ? storedIncome : [];
    state.budget = Number.isFinite(Number(storedBudget)) ? Number(storedBudget) : 0;
    state.studentSettings = {
      pocketMoney: Number(storedStudent.pocketMoney) || DEFAULT_STUDENT_SETTINGS.pocketMoney,
      collegeDays: Number(storedStudent.collegeDays) || DEFAULT_STUDENT_SETTINGS.collegeDays,
      savingsTarget: Number(storedStudent.savingsTarget) || DEFAULT_STUDENT_SETTINGS.savingsTarget,
    };
    state.savingsGoals = Array.isArray(storedSavings) ? storedSavings : [];
    state.monthlyReports = Array.isArray(storedMonthlyReports) ? storedMonthlyReports : [];
  } catch (error) {
    state.expenses = [];
    state.income = [];
    state.budget = 0;
    state.studentSettings = { ...DEFAULT_STUDENT_SETTINGS };
    state.savingsGoals = [];
    state.monthlyReports = [];
  }
}

function getTotalIncome(monthKey = getMonthKey(new Date())) {
  return state.income
    .filter((item) => item.date?.startsWith(monthKey))
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
}

function getTotalExpenses(monthKey = getMonthKey(new Date())) {
  return state.expenses
    .filter((item) => item.date?.startsWith(monthKey))
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
}

function getLifetimeIncome() {
  return state.income.reduce((sum, item) => sum + Number(item.amount || 0), 0);
}

function getLifetimeExpenses() {
  return state.expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
}

function getBalance() {
  return getLifetimeIncome() - getLifetimeExpenses();
}

function getBudgetSummary() {
  const totalSpent = getTotalExpenses();
  const remaining = state.budget - totalSpent;
  const percentageUsed = state.budget > 0 ? (totalSpent / state.budget) * 100 : 0;

  return { totalSpent, remaining, percentageUsed };
}

function setActiveNavigation(targetId) {
  document.querySelectorAll('.nav-item').forEach((item) => {
    const isActive = item.dataset.target === targetId;
    item.classList.toggle('active', isActive);
    item.setAttribute('aria-current', isActive ? 'page' : 'false');
  });

  document.querySelectorAll('[data-portal]').forEach((portal) => {
    portal.hidden = portal.dataset.portal !== targetId;
  });
}

function setSidebarOpen(isOpen) {
  elements.sidebar.classList.toggle('open', isOpen);
  elements.sidebarOverlay.classList.toggle('visible', isOpen);
  elements.mobileNavToggle.setAttribute('aria-expanded', String(isOpen));
}

function jumpToSection(targetId) {
  const hasPortal = document.querySelector(`[data-portal="${CSS.escape(targetId)}"]`);
  if (!hasPortal) {
    return;
  }

  setActiveNavigation(targetId);
  window.scrollTo({ top: 0, behavior: 'auto' });
  if (targetId === 'analytics-section') {
    Object.values(chartInstances).forEach((chart) => chart.resize());
  }
}

function getSelectedUserType() {
  const selected = document.querySelector('input[name="userType"]:checked');
  return selected && selected.value ? selected.value : 'Student';
}

function normalizeUserRole(userType) {
  return ['Student', 'Working Person', 'Housewife'].includes(userType) ? userType : 'Student';
}

function applyUserRoleToProfile(userType) {
  activeUserRole = normalizeUserRole(userType);
  const profileLabel = document.querySelector('.profile-label');
  if (profileLabel) {
    profileLabel.textContent = activeUserRole;
  }
}

function handleLoginSubmit(event) {
  event.preventDefault();

  const userName = elements.loginUserName.value.trim();
  const password = elements.loginPassword.value.trim();
  const userType = normalizeUserRole(getSelectedUserType());

  if (!userName || !password) {
    showToast('Please enter your name and password.');
    return;
  }

  localStorage.setItem(getProfileStorageKey('role', userName), userType);
  localStorage.setItem('smartspend-user-role', userType);
  loadData(userName);
  applyUserRoleToProfile(userType);
  state.filters = {
    search: '',
    category: 'all',
    payment: 'all',
    type: 'all',
    date: '',
    sort: 'newest',
  };
  elements.searchInput.value = '';
  elements.categoryFilter.value = 'all';
  elements.paymentFilter.value = 'all';
  elements.typeFilter.value = 'all';
  elements.dateFilter.value = '';
  elements.sortFilter.value = 'newest';

  localStorage.setItem('smartspend-login', JSON.stringify({ userName }));
  const profileName = document.querySelector('.user-profile strong');
  const avatar = document.querySelector('.user-profile .avatar');
  if (profileName) {
    profileName.textContent = userName;
  }
  if (avatar) {
    avatar.textContent = userName.charAt(0).toLocaleUpperCase();
  }
  setActiveNavigation('dashboard');
  updateDashboard();
  elements.loginScreen.classList.add('hidden');
  elements.appShell.classList.remove('hidden');
  showToast(`Welcome ${userName}!`);
}

function handleLogout() {
  localStorage.removeItem('smartspend-login');
  activeUserName = '';
  applyTheme(false);
  elements.loginForm.reset();
  elements.appShell.classList.add('hidden');
  elements.loginScreen.classList.remove('hidden');
  showToast('You have been logged out.');
}

function setProfileMenuOpen(isOpen) {
  elements.profileMenu.hidden = !isOpen;
  elements.profileMenuToggle.setAttribute('aria-expanded', String(isOpen));
}

function applyTheme(isDark) {
  document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
  if (elements.darkModeToggle) {
    elements.darkModeToggle.setAttribute('aria-checked', String(isDark));
  }
  if (elements.currentThemeLabel) {
    elements.currentThemeLabel.textContent = isDark ? 'Dark theme' : 'Light theme';
  }
}

function getAllTransactions() {
  return [
    ...state.expenses.map((item) => ({ ...item, type: 'expense' })),
    ...state.income.map((item) => ({ ...item, type: 'income' })),
  ];
}

function getFilteredTransactions() {
  const filtered = getAllTransactions().filter((transaction) => {
    const searchText = state.filters.search.toLowerCase();
    const matchesSearch = !searchText || [
      transaction.title,
      transaction.category,
      transaction.source,
      transaction.description,
      transaction.paymentMethod,
    ].some((value) => String(value || '').toLowerCase().includes(searchText));

    const matchesCategory = state.filters.category === 'all' || transaction.category === state.filters.category || transaction.source === state.filters.category;
    const matchesPayment = state.filters.payment === 'all' || transaction.paymentMethod === state.filters.payment;
    const matchesType = state.filters.type === 'all' || transaction.type === state.filters.type;
    const dateMatches = !state.filters.date || transaction.date === state.filters.date;

    return matchesSearch && matchesCategory && matchesPayment && matchesType && dateMatches;
  });

  const sorted = [...filtered];
  switch (state.filters.sort) {
    case 'oldest':
      sorted.sort((a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt));
      break;
    case 'highest':
      sorted.sort((a, b) => Number(b.amount) - Number(a.amount));
      break;
    case 'lowest':
      sorted.sort((a, b) => Number(a.amount) - Number(b.amount));
      break;
    case 'newest':
    default:
      sorted.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
      break;
  }

  return sorted;
}

function renderTransactions() {
  const transactions = getFilteredTransactions();

  if (!transactions.length) {
    elements.transactionList.innerHTML = `
      <div class="empty-state">
        <strong>No transactions found.</strong>
        Try a different search or add your first expense or income entry.
      </div>
    `;
    return;
  }

  elements.transactionList.innerHTML = transactions
    .slice(0, 8)
    .map((transaction) => {
      const isExpense = transaction.type === 'expense';
      const label = isExpense ? 'Expense' : 'Income';
      const icon = isExpense ? '🧾' : '💸';
      const title = transaction.title || transaction.source || 'Transaction';
      const category = transaction.category || transaction.source || 'General';
      const categoryLabel = transaction.goalName
        ? `${category} · ${transaction.goalName}`
        : category;
      const payment = transaction.paymentMethod || '—';
      const amount = isExpense ? -Number(transaction.amount || 0) : Number(transaction.amount || 0);

      return `
        <div class="transaction-row">
          <div class="transaction-main">
            <div class="transaction-badge">${icon}</div>
            <div>
              <strong>${escapeHtml(title)}</strong>
              <small>${label}</small>
            </div>
          </div>

          <div class="transaction-category">${escapeHtml(categoryLabel)}</div>
          <div class="transaction-date">${formatDate(transaction.date || transaction.createdAt)}</div>
          <div class="transaction-method">${payment}</div>
          <div class="transaction-amount ${isExpense ? 'expense' : 'income'}">${formatCurrency(amount)}</div>
          ${isExpense ? `<button class="text-button delete-expense-button" data-delete-expense-id="${escapeHtml(transaction.id)}" type="button" aria-label="Delete expense ${escapeHtml(title)}">Delete</button>` : ''}
        </div>
      `;
    })
    .join('');
  bindExpenseDeleteButtons(elements.transactionList);
}

function renderIncomePortal() {
  const incomeItems = [...state.income].sort((a, b) => {
    return new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt);
  });
  const monthlyIncome = getTotalIncome();
  elements.incomePortalTotal.textContent = formatCurrency(monthlyIncome);
  elements.incomePortalCount.textContent = String(incomeItems.length);
  elements.incomeTransactionList.innerHTML = incomeItems.length
    ? incomeItems.map((incomeItem) => `
      <div class="income-transaction-row">
        <div>
          <strong>${escapeHtml(incomeItem.source || 'Income')}</strong>
          <span>${formatDate(incomeItem.date || incomeItem.createdAt)}</span>
        </div>
        <strong>${formatCurrency(incomeItem.amount)}</strong>
      </div>
    `).join('')
    : '<div class="empty-state"><strong>No income recorded yet.</strong>Add income from Quick actions.</div>';
}

function updateDashboard() {
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = getBalance();
  const budgetSummary = getBudgetSummary();

  elements.currentMonth.textContent = formatMonth(getMonthKey(new Date()));

  elements.totalBalance.textContent = formatCurrency(balance);
  elements.totalIncome.textContent = formatCurrency(totalIncome);
  elements.totalExpenses.textContent = formatCurrency(totalExpenses);
  elements.remainingBudget.textContent = formatCurrency(budgetSummary.remaining);
  elements.remainingBudgetText.textContent = formatCurrency(budgetSummary.remaining);
  elements.spentAmount.textContent = formatCurrency(budgetSummary.totalSpent);
  elements.budgetAmount.textContent = formatCurrency(state.budget);
  elements.sidebarBudgetText.textContent = formatCurrency(state.budget);

  if (balance >= 0) {
    elements.balanceMeta.textContent = 'Healthy balance';
  } else {
    elements.balanceMeta.textContent = 'Spending exceeds income';
  }

  if (budgetSummary.remaining >= 0) {
    elements.remainingBudgetMeta.textContent = 'Budget available';
  } else {
    elements.remainingBudgetMeta.textContent = 'Budget exceeded';
  }

  const percentage = Math.min(100, Math.max(0, budgetSummary.percentageUsed));
  elements.budgetProgressBar.style.width = `${percentage}%`;
  elements.budgetProgressText.textContent = `${Math.round(percentage)}%`;

  if (budgetSummary.percentageUsed < 60) {
    elements.budgetStatus.textContent = "You're on track";
    elements.budgetStatus.style.background = 'rgba(22, 163, 74, 0.12)';
    elements.budgetStatus.style.color = 'var(--success)';
  } else if (budgetSummary.percentageUsed < 80) {
    elements.budgetStatus.textContent = 'Watch your spending';
    elements.budgetStatus.style.background = 'rgba(217, 119, 6, 0.12)';
    elements.budgetStatus.style.color = 'var(--warning)';
  } else if (budgetSummary.percentageUsed <= 100) {
    elements.budgetStatus.textContent = "You're close to your limit";
    elements.budgetStatus.style.background = 'rgba(217, 119, 6, 0.12)';
    elements.budgetStatus.style.color = 'var(--warning)';
  } else {
    elements.budgetStatus.textContent = "You've exceeded your budget";
    elements.budgetStatus.style.background = 'rgba(220, 38, 38, 0.12)';
    elements.budgetStatus.style.color = 'var(--danger)';
  }

  ensureMonthlyReports();
  renderTransactions();
  renderIncomePortal();
  renderPreviousMonthExpenditures();
  renderMonthlyPlan();
  renderSavings();
  renderInsights();
  renderAnalytics();
  renderCharts();
}

function buildMonthlyReport(monthKey) {
  const monthIncome = state.income.filter((item) => item.date?.startsWith(monthKey));
  const monthExpenses = state.expenses.filter((item) => item.date?.startsWith(monthKey));
  const totalIncome = monthIncome.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalExpenses = monthExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return {
    monthKey,
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    expenseCount: monthExpenses.length,
    incomeCount: monthIncome.length,
    generatedAt: new Date().toISOString(),
  };
}

function ensureMonthlyReports() {
  const monthKeys = new Set([
    ...state.expenses.map((expense) => expense.date?.slice(0, 7)).filter(Boolean),
    ...state.income.map((incomeItem) => incomeItem.date?.slice(0, 7)).filter(Boolean),
    getMonthKey(new Date()),
  ]);

  monthKeys.forEach((monthKey) => {
    const existing = state.monthlyReports.find((report) => report.monthKey === monthKey);
    if (!existing) {
      state.monthlyReports.push(buildMonthlyReport(monthKey));
    }
  });

  state.monthlyReports = [...state.monthlyReports]
    .filter((report) => monthKeys.has(report.monthKey))
    .sort((a, b) => b.monthKey.localeCompare(a.monthKey));
}

function renderMonthlyReportHistory() {
  if (!elements.monthlyReportHistory) {
    return;
  }

  const selectedMonth = elements.expenditureMonth ? elements.expenditureMonth.value || getMonthKey(new Date()) : getMonthKey(new Date());
  const history = [...state.monthlyReports]
    .filter((report) => report.monthKey !== selectedMonth)
    .sort((a, b) => b.monthKey.localeCompare(a.monthKey))
    .slice(0, 5);

  if (!history.length) {
    elements.monthlyReportHistory.innerHTML = '<div class="history-empty">No previous monthly reports yet.</div>';
    return;
  }

  elements.monthlyReportHistory.innerHTML = history
    .map((report) => `
      <div class="report-history-item">
        <div>
          <strong>${formatMonth(report.monthKey)}</strong>
          <span>${report.expenseCount} expense entries</span>
        </div>
        <div class="report-history-amount">
          <strong>${formatCurrency(report.totalExpenses)}</strong>
          <small>${formatCurrency(report.totalIncome)} earned</small>
        </div>
      </div>
    `)
    .join('');
}

function renderPreviousMonthExpenditures() {
  if (!elements.expenditureMonth || !elements.expenditureMonthLabel || !elements.expenditureMonthTotal || !elements.expenditureMonthCount || !elements.expenditureMonthChange) {
    return;
  }

  const selectedMonth = elements.expenditureMonth.value || getMonthKey(new Date());
  const selectedExpenses = state.expenses.filter((expense) => expense.date?.startsWith(selectedMonth));
  const total = selectedExpenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const previousMonth = shiftMonth(selectedMonth, -1);
  const previousTotal = state.expenses
    .filter((expense) => expense.date?.startsWith(previousMonth))
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

  elements.expenditureMonthLabel.textContent = `${formatMonth(selectedMonth)} report`;
  elements.expenditureMonthTotal.textContent = formatCurrency(total);
  elements.expenditureMonthCount.textContent = String(selectedExpenses.length);

  if (previousTotal === 0) {
    elements.expenditureMonthChange.textContent = total === 0 ? 'No comparison' : 'No prior spending';
  } else {
    const change = ((total - previousTotal) / previousTotal) * 100;
    const direction = change > 0 ? 'more' : change < 0 ? 'less' : 'unchanged';
    elements.expenditureMonthChange.textContent = change === 0
      ? 'Unchanged'
      : `${Math.abs(change).toFixed(0)}% ${direction}`;
  }

  const categoryTotals = selectedExpenses.reduce((totals, expense) => {
    const category = expense.category || 'Other';
    totals[category] = (totals[category] || 0) + Number(expense.amount || 0);
    return totals;
  }, {});
  const categories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  elements.expenditureCategoryList.innerHTML = categories.length
    ? categories.map(([category, amount]) => `
      <div class="expenditure-category-row">
        <span>${escapeHtml(category)}</span>
        <strong>${formatCurrency(amount)}</strong>
      </div>
    `).join('')
    : '<div class="history-empty">No expenses recorded for this month.</div>';

  const sortedExpenses = [...selectedExpenses].sort((a, b) => {
    return new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt);
  });
  elements.expenditureTransactionList.innerHTML = sortedExpenses.length
    ? sortedExpenses.map((expense) => `
      <div class="expenditure-transaction-row">
        <div class="expenditure-transaction-copy">
          <strong>${escapeHtml(expense.title || 'Expense')}</strong>
          <span>${escapeHtml(expense.category || 'Other')}${expense.goalName ? ` · ${escapeHtml(expense.goalName)}` : ''} · ${formatDate(expense.date)}</span>
        </div>
        <strong class="transaction-amount expense">${formatCurrency(-Number(expense.amount || 0))}</strong>
        <button class="text-button delete-expense-button" data-delete-expense-id="${escapeHtml(expense.id)}" type="button" aria-label="Delete expense ${escapeHtml(expense.title || 'Expense')}">Delete</button>
      </div>
    `).join('')
    : '<div class="history-empty">No expenses recorded for this month.</div>';
  bindExpenseDeleteButtons(elements.expenditureTransactionList);

  renderMonthlyReportHistory();
}

function bindExpenseDeleteButtons(container) {
  container.querySelectorAll('[data-delete-expense-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const expense = state.expenses.find((item) => item.id === button.dataset.deleteExpenseId);
      if (!expense) {
        showToast('Could not find that expense.');
        return;
      }

      const goal = expense.goalId
        ? state.savingsGoals.find((item) => item.id === expense.goalId)
        : null;
      const goalNote = goal
        ? ` This will also subtract ${formatCurrency(expense.amount)} from "${goal.name}".`
        : '';
      if (!window.confirm(`Delete "${expense.title || 'this expense'}" (${formatCurrency(expense.amount)})?${goalNote}`)) {
        return;
      }

      state.expenses = state.expenses.filter((item) => item.id !== expense.id);
      if (goal) {
        goal.currentSavedAmount = Math.max(0, Number(goal.currentSavedAmount || 0) - Number(expense.amount || 0));
      }
      saveData();
      updateDashboard();
      showToast('Expense deleted');
    });
  });
}

function buildMonthlyTrendData() {
  const data = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = date.toLocaleString('en-IN', { month: 'short' });
    const total = state.expenses
      .filter((expense) => expense.date && expense.date.startsWith(monthKey))
      .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

    return { label: monthLabel, total };
  });

  return data;
}

function buildCategoryData() {
  const currentMonth = getMonthKey(new Date());
  const categories = ['Food', 'Transport', 'Education', 'Shopping', 'Entertainment', 'Health', 'Bills', 'Recharge', 'Other'];
  return categories.map((category) => ({
    label: category,
    total: state.expenses
      .filter((expense) => expense.date?.startsWith(currentMonth) && expense.category === category)
      .reduce((sum, expense) => sum + Number(expense.amount || 0), 0),
  }));
}

function buildWeeklyData() {
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const totals = Array(7).fill(0);
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);

  state.expenses.forEach((expense) => {
    const expenseDate = new Date(expense.date);
    const diff = Math.floor((expenseDate - startOfWeek) / 86400000);
    if (diff >= 0 && diff < 7) {
      totals[diff] += Number(expense.amount || 0);
    }
  });

  return { labels, totals };
}

function renderAnalytics() {
  const currentMonth = getMonthKey(new Date());
  const monthExpenses = state.expenses.filter((expense) => expense.date?.startsWith(currentMonth));
  const incomeTotal = getTotalIncome();
  const expenseTotal = getTotalExpenses();
  const averageDaily = expenseTotal / Math.max(1, new Date().getDate());
  const categoryTotals = {};

  monthExpenses.forEach((expense) => {
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + Number(expense.amount || 0);
  });

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  const highestExpense = monthExpenses.reduce((max, expense) => Math.max(max, Number(expense.amount || 0)), 0);

  elements.analyticsIncome.textContent = formatCurrency(incomeTotal);
  elements.analyticsExpenses.textContent = formatCurrency(expenseTotal);
  elements.averageDailySpending.textContent = formatCurrency(averageDaily);
  elements.highestCategory.textContent = topCategory ? topCategory[0] : '—';
  elements.highestExpense.textContent = formatCurrency(highestExpense);
  elements.transactionCount.textContent = String(
    getAllTransactions().filter((transaction) => transaction.date?.startsWith(currentMonth)).length,
  );
}

function renderCharts() {
  if (!window.Chart) {
    return;
  }

  const monthlyTrendCanvas = document.getElementById('monthlyTrendChart');
  const categoryCanvas = document.getElementById('categoryChart');
  const incomeExpenseCanvas = document.getElementById('incomeExpenseChart');
  if (!monthlyTrendCanvas || !categoryCanvas || !incomeExpenseCanvas) {
    return;
  }

  const trendData = buildMonthlyTrendData();
  const categoryData = buildCategoryData();
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (value) => `₹${value}` },
      },
    },
  };

  if (!chartInstances.monthlyTrend) {
    chartInstances.monthlyTrend = new Chart(document.getElementById('monthlyTrendChart'), {
      type: 'line',
      data: {
        labels: trendData.map((item) => item.label),
        datasets: [{
          data: trendData.map((item) => item.total),
          borderColor: '#FF7F50',
          backgroundColor: 'rgba(255,127,80,0.18)',
          tension: 0.35,
          fill: true,
          borderWidth: 2,
        }],
      },
      options: chartOptions,
    });
  } else {
    chartInstances.monthlyTrend.data.labels = trendData.map((item) => item.label);
    chartInstances.monthlyTrend.data.datasets[0].data = trendData.map((item) => item.total);
    chartInstances.monthlyTrend.update();
  }

  if (!chartInstances.category) {
    chartInstances.category = new Chart(document.getElementById('categoryChart'), {
      type: 'bar',
      data: {
        labels: categoryData.map((item) => item.label),
        datasets: [{
          data: categoryData.map((item) => item.total),
          backgroundColor: ['#FF7F50', '#e96d40', '#ff9b75', '#c6532d', '#f2aa8c', '#bd554b', '#d98669', '#e7b29c', '#9a8177'],
          borderRadius: 8,
        }],
      },
      options: chartOptions,
    });
  } else {
    chartInstances.category.data.labels = categoryData.map((item) => item.label);
    chartInstances.category.data.datasets[0].data = categoryData.map((item) => item.total);
    chartInstances.category.update();
  }

  const incomeExpenseData = [getTotalIncome(), getTotalExpenses()];
  if (!chartInstances.incomeExpense) {
    chartInstances.incomeExpense = new Chart(document.getElementById('incomeExpenseChart'), {
      type: 'doughnut',
      data: {
        labels: ['Income', 'Expenses'],
        datasets: [{
          data: incomeExpenseData,
          backgroundColor: ['#43805a', '#bd554b'],
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
      },
    });
  } else {
    chartInstances.incomeExpense.data.datasets[0].data = incomeExpenseData;
    chartInstances.incomeExpense.update();
  }

}

function renderMonthlyPlan() {
  const { pocketMoney, collegeDays, savingsTarget } = state.studentSettings;
  const dailyLimit = collegeDays > 0 ? pocketMoney / collegeDays : 0;
  const today = new Date();
  const todayKey = today.toISOString().split('T')[0];

  const todayExpenses = state.expenses
    .filter((expense) => expense.date === todayKey)
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

  const currentMonth = getMonthKey(today);
  const monthlyExpenses = state.expenses
    .filter((expense) => expense.date && expense.date.startsWith(currentMonth))
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

  const remainingPocket = Math.max(pocketMoney - monthlyExpenses, 0);

  if (elements.pocketMoneyInput) elements.pocketMoneyInput.value = pocketMoney;
  if (elements.collegeDaysInput) elements.collegeDaysInput.value = collegeDays;
  if (elements.savingsTargetInput) elements.savingsTargetInput.value = savingsTarget;
  if (elements.dailyLimitValue) elements.dailyLimitValue.textContent = formatCurrency(dailyLimit) + '/day';
  if (elements.todaySpending) elements.todaySpending.textContent = formatCurrency(todayExpenses);
  if (elements.todayRemaining) elements.todayRemaining.textContent = formatCurrency(Math.max(dailyLimit - todayExpenses, 0));
  if (elements.monthlySpendingValue) elements.monthlySpendingValue.textContent = formatCurrency(monthlyExpenses);
  if (elements.remainingPocketMoney) elements.remainingPocketMoney.textContent = formatCurrency(remainingPocket);
}

function renderSavings() {
  if (!state.savingsGoals.length) {
    elements.savingsList.innerHTML = `
      <div class="empty-state">
        <strong>No savings goals yet.</strong>
        Set a target to start building your future plans.
      </div>
    `;
    return;
  }

  elements.savingsList.innerHTML = state.savingsGoals
    .map((goal) => {
      const progress = goal.targetAmount > 0 ? Math.min(100, (Number(goal.currentSavedAmount || 0) / Number(goal.targetAmount || 1)) * 100) : 0;
      return `
        <div class="goal-card">
          <div class="goal-header">
            <h3>${escapeHtml(goal.name)}</h3>
            <div class="goal-actions">
              <button class="text-button" data-add-goal-id="${escapeHtml(goal.id)}" type="button" aria-expanded="false">Add money</button>
              <button class="text-button" data-edit-goal-id="${escapeHtml(goal.id)}" type="button" aria-expanded="false">Update saved amount</button>
              <button class="text-button" data-remove-goal-id="${escapeHtml(goal.id)}" type="button">Remove</button>
            </div>
          </div>
          <div><strong>${formatCurrency(goal.currentSavedAmount)}</strong> saved of ${formatCurrency(goal.targetAmount)}</div>
          <div class="goal-progress-track"><span style="width: ${progress}%"></span></div>
          <small>${Math.round(progress)}% complete</small>
          <form class="goal-contribution-form" data-contribute-goal-id="${escapeHtml(goal.id)}" hidden>
            <label class="field">
              <span>Amount to add</span>
              <input type="number" min="0.01" step="0.01" placeholder="1000" required />
            </label>
            <div class="goal-savings-actions">
              <button class="primary-button" type="submit">Add contribution</button>
              <button class="secondary-button" data-cancel-goal-contribution type="button">Cancel</button>
            </div>
          </form>
          <form class="goal-savings-form" data-update-goal-id="${escapeHtml(goal.id)}" hidden>
            <label class="field">
              <span>New saved amount</span>
              <input type="number" min="0" step="100" value="${Number(goal.currentSavedAmount) || 0}" required />
            </label>
            <div class="goal-savings-actions">
              <button class="primary-button" type="submit">Save amount</button>
              <button class="secondary-button" data-cancel-goal-edit type="button">Cancel</button>
            </div>
          </form>
        </div>
      `;
    })
    .join('');

  elements.savingsList.querySelectorAll('[data-add-goal-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const form = elements.savingsList.querySelector(`[data-contribute-goal-id="${CSS.escape(button.dataset.addGoalId)}"]`);
      form.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      form.querySelector('input').focus();
    });
  });

  elements.savingsList.querySelectorAll('[data-cancel-goal-contribution]').forEach((button) => {
    button.addEventListener('click', () => {
      const form = button.closest('form');
      form.hidden = true;
      elements.savingsList
        .querySelector(`[data-add-goal-id="${CSS.escape(form.dataset.contributeGoalId)}"]`)
        .setAttribute('aria-expanded', 'false');
      form.reset();
    });
  });

  elements.savingsList.querySelectorAll('.goal-contribution-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const amount = Number(form.querySelector('input').value);
      if (!Number.isFinite(amount) || amount <= 0) {
        showToast('Contribution must be greater than 0.');
        return;
      }

      const goal = state.savingsGoals.find((item) => item.id === form.dataset.contributeGoalId);
      if (!goal) {
        showToast('Could not find that savings goal.');
        return;
      }

      goal.currentSavedAmount = Number(goal.currentSavedAmount || 0) + amount;
      saveData();
      renderSavings();
      showToast('Contribution added to savings goal');
    });
  });

  elements.savingsList.querySelectorAll('[data-edit-goal-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const form = elements.savingsList.querySelector(`[data-update-goal-id="${CSS.escape(button.dataset.editGoalId)}"]`);
      form.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      form.querySelector('input').focus();
    });
  });

  elements.savingsList.querySelectorAll('[data-cancel-goal-edit]').forEach((button) => {
    button.addEventListener('click', () => {
      const form = button.closest('form');
      form.hidden = true;
      elements.savingsList
        .querySelector(`[data-edit-goal-id="${CSS.escape(form.dataset.updateGoalId)}"]`)
        .setAttribute('aria-expanded', 'false');
    });
  });

  elements.savingsList.querySelectorAll('.goal-savings-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const amount = Number(form.querySelector('input').value);
      if (!Number.isFinite(amount) || amount < 0) {
        showToast('Saved amount must be a valid amount of 0 or more.');
        return;
      }

      const goal = state.savingsGoals.find((item) => item.id === form.dataset.updateGoalId);
      if (!goal) {
        showToast('Could not find that savings goal.');
        return;
      }

      goal.currentSavedAmount = amount;
      saveData();
      renderSavings();
      showToast('Saved amount updated');
    });
  });

  elements.savingsList.querySelectorAll('[data-remove-goal-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const goal = state.savingsGoals.find((item) => item.id === button.dataset.removeGoalId);
      if (!goal) {
        showToast('Could not find that savings goal.');
        return;
      }

      if (!window.confirm(`Remove the "${goal.name}" savings goal? Its recorded expenses will remain in your transaction history.`)) {
        return;
      }

      state.savingsGoals = state.savingsGoals.filter((item) => item.id !== goal.id);
      saveData();
      renderSavings();
      showToast('Savings goal removed');
    });
  });
}

function generateInsightList() {
  const insights = [];
  const currentMonth = getMonthKey(new Date());
  const currentMonthExpenses = state.expenses.filter((expense) => expense.date?.startsWith(currentMonth));
  if (!currentMonthExpenses.length) {
    return insights;
  }

  const categoryTotals = {};
  currentMonthExpenses.forEach((expense) => {
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + Number(expense.amount || 0);
  });

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  if (topCategory) {
    insights.push(`You spent ${formatCurrency(topCategory[1])} on ${topCategory[0]} this month.`);
    insights.push(`${topCategory[0]} is your highest spending category.`);
  }

  const currentMonthTotal = getTotalExpenses(currentMonth);
  const previousMonthDate = new Date();
  previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
  const previousMonthKey = `${previousMonthDate.getFullYear()}-${String(previousMonthDate.getMonth() + 1).padStart(2, '0')}`;
  const previousMonthTotal = state.expenses
    .filter((expense) => expense.date && expense.date.startsWith(previousMonthKey))
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

  if (previousMonthTotal > 0) {
    const changePercent = ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;
    insights.push(`You spent ${Math.abs(changePercent).toFixed(0)}% ${changePercent >= 0 ? 'more' : 'less'} this month than last month.`);
  }

  const budgetUsed = getBudgetSummary().percentageUsed;
  if (currentMonthTotal > state.budget) {
    insights.push(`At your current spending rate, you may exceed your budget by ${formatCurrency(currentMonthTotal - state.budget)}.`);
  } else if (budgetUsed > 0) {
    insights.push(`Your spending is at ${Math.round(budgetUsed)}% of your monthly budget.`);
  }

  const dailyAverage = currentMonthTotal / Math.max(1, new Date().getDate());
  insights.push(`Your average daily spending is ${formatCurrency(dailyAverage)}.`);

  return insights.slice(0, 5);
}

function renderInsights() {
  const insights = generateInsightList();

  if (!insights.length) {
    elements.smartInsightsList.innerHTML = '<li>No insights available yet. Add a few transactions to unlock helpful spending analysis.</li>';
    return;
  }

  elements.smartInsightsList.innerHTML = insights
    .map((insight) => `<li>${insight}</li>`)
    .join('');
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  elements.toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 220);
  }, 2200);
}

function openExpenseModal() {
  renderExpenseGoalOptions();
  elements.expenseModal.classList.remove('hidden');
  elements.expenseModal.setAttribute('aria-hidden', 'false');
  elements.expenseTitle.focus();
  if (!elements.expenseDate.value) {
    elements.expenseDate.value = new Date().toISOString().split('T')[0];
  }
}

function openExpenseModalForSelectedMonth() {
  const selectedMonth = elements.expenditureMonth.value || shiftMonth(getMonthKey(new Date()), -1);
  elements.expenseForm.reset();
  openExpenseModal();
  elements.expenseDate.value = `${selectedMonth}-01`;
  elements.expenseTitle.focus();
}

function closeExpenseModal() {
  elements.expenseModal.classList.add('hidden');
  elements.expenseModal.setAttribute('aria-hidden', 'true');
  elements.expenseForm.reset();
  updateExpenseGoalField();
}

function renderExpenseGoalOptions() {
  const previousGoalId = elements.expenseGoal.value;
  elements.expenseGoal.innerHTML = '<option value="">Select a savings goal</option>';

  state.savingsGoals.forEach((goal) => {
    const option = document.createElement('option');
    option.value = goal.id;
    option.textContent = goal.name;
    elements.expenseGoal.appendChild(option);
  });

  if (state.savingsGoals.some((goal) => goal.id === previousGoalId)) {
    elements.expenseGoal.value = previousGoalId;
  }
}

function updateExpenseGoalField() {
  const isGoalSavings = elements.expenseCategory.value === 'Goal savings';
  elements.expenseGoalField.hidden = !isGoalSavings;
  elements.expenseGoal.required = isGoalSavings;
  if (!isGoalSavings) {
    elements.expenseGoal.value = '';
  }
}

function openIncomeModal() {
  elements.incomeModal.classList.remove('hidden');
  elements.incomeModal.setAttribute('aria-hidden', 'false');
  elements.incomeSource.focus();
  if (!elements.incomeDate.value) {
    elements.incomeDate.value = new Date().toISOString().split('T')[0];
  }
}

function closeIncomeModal() {
  elements.incomeModal.classList.add('hidden');
  elements.incomeModal.setAttribute('aria-hidden', 'true');
  elements.incomeForm.reset();
}

function openBudgetModal() {
  const maxBudget = Math.max(0, getTotalIncome());

  elements.budgetModal.classList.remove('hidden');
  elements.budgetModal.setAttribute('aria-hidden', 'false');
  elements.budgetInput.max = String(maxBudget);
  elements.budgetInput.value = Math.min(state.budget, maxBudget);
  if (maxBudget === 0) {
    elements.budgetInput.placeholder = 'Add income first';
  } else {
    elements.budgetInput.placeholder = '8000';
  }
  elements.budgetInput.focus();
}

function closeBudgetModal() {
  elements.budgetModal.classList.add('hidden');
  elements.budgetModal.setAttribute('aria-hidden', 'true');
  elements.budgetForm.reset();
}

function isValidExpenseForm({ title, amount, category, date }) {
  if (!title.trim()) {
    showToast('Expense title cannot be empty.');
    return false;
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    showToast('Amount must be greater than 0.');
    return false;
  }

  if (!category) {
    showToast('Please select a category.');
    return false;
  }

  if (!date) {
    showToast('Please choose a date.');
    return false;
  }

  return true;
}

function isValidIncomeForm({ source, amount, date }) {
  if (!source) {
    showToast('Please select an income source.');
    return false;
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    showToast('Amount must be greater than 0.');
    return false;
  }

  if (!date) {
    showToast('Please choose a date.');
    return false;
  }

  return true;
}

function handleExpenseSubmit(event) {
  event.preventDefault();

  const title = elements.expenseTitle.value.trim();
  const amount = Number(elements.expenseAmount.value);
  const category = elements.expenseCategory.value;
  const date = elements.expenseDate.value;
  const paymentMethod = elements.expensePayment.value;
  const description = elements.expenseDescription.value.trim();
  const goalId = category === 'Goal savings' ? elements.expenseGoal.value : '';
  const savingsGoal = goalId ? state.savingsGoals.find((goal) => goal.id === goalId) : null;

  if (!isValidExpenseForm({ title, amount, category, date })) {
    return;
  }

  if (category === 'Goal savings' && !savingsGoal) {
    showToast(state.savingsGoals.length
      ? 'Please select the savings goal for this money.'
      : 'Create a savings goal before recording goal savings.');
    return;
  }

  const newExpense = {
    id: Date.now().toString(),
    title,
    amount,
    category,
    date,
    paymentMethod,
    description,
    ...(savingsGoal ? { goalId: savingsGoal.id, goalName: savingsGoal.name } : {}),
    createdAt: new Date().toISOString(),
  };

  state.expenses.unshift(newExpense);
  if (savingsGoal) {
    savingsGoal.currentSavedAmount = Number(savingsGoal.currentSavedAmount || 0) + amount;
  }
  saveData();
  updateDashboard();
  closeExpenseModal();
  showToast(savingsGoal
    ? `Expense recorded and added to ${savingsGoal.name}`
    : 'Expense added successfully');
}

function handleIncomeSubmit(event) {
  event.preventDefault();

  const source = elements.incomeSource.value;
  const amount = Number(elements.incomeAmount.value);
  const date = elements.incomeDate.value;
  const description = elements.incomeDescription.value.trim();

  if (!isValidIncomeForm({ source, amount, date })) {
    return;
  }

  const newIncome = {
    id: Date.now().toString(),
    source,
    amount,
    date,
    description,
    createdAt: new Date().toISOString(),
  };

  state.income.unshift(newIncome);
  saveData();
  updateDashboard();
  closeIncomeModal();
  showToast('Income added successfully');
}

function handleBudgetSubmit(event) {
  event.preventDefault();
  const amount = Number(elements.budgetInput.value);
  const maxBudget = Math.max(0, getTotalIncome());

  if (!Number.isFinite(amount) || amount <= 0) {
    showToast('Budget must be a positive number.');
    return;
  }

  if (amount > maxBudget) {
    showToast(`Budget cannot exceed your earned income of ${formatCurrency(maxBudget)}.`);
    elements.budgetInput.focus();
    elements.budgetInput.value = Math.min(state.budget, maxBudget);
    return;
  }

  state.budget = amount;
  saveData();
  updateDashboard();
  closeBudgetModal();
  showToast('Budget updated successfully');
}

function handleStudentFormSubmit(event) {
  event.preventDefault();
  const pocketMoney = Number(elements.pocketMoneyInput.value);
  const collegeDays = Number(elements.collegeDaysInput.value);
  const savingsTarget = Number(elements.savingsTargetInput.value);

  if (!Number.isFinite(pocketMoney) || pocketMoney < 0) {
    showToast('Pocket money must be a valid number.');
    return;
  }

  if (!Number.isFinite(collegeDays) || collegeDays <= 0) {
    showToast('College days must be greater than 0.');
    return;
  }

  state.studentSettings = { pocketMoney, collegeDays, savingsTarget };
  saveData();
  updateDashboard();
  showToast('Student plan saved');
}

function handleSavingsSubmit(event) {
  event.preventDefault();

  const name = elements.goalName.value.trim();
  const targetAmount = Number(elements.targetAmount.value);
  const currentSavedAmount = Number(elements.currentSavedAmount.value);
  const targetDate = elements.targetDate.value;

  if (!name) {
    showToast('Goal name is required.');
    return;
  }

  if (!Number.isFinite(targetAmount) || targetAmount <= 0) {
    showToast('Target amount must be greater than 0.');
    return;
  }

  if (!Number.isFinite(currentSavedAmount) || currentSavedAmount < 0) {
    showToast('Current saved amount must be valid.');
    return;
  }

  if (!targetDate) {
    showToast('Target date is required.');
    return;
  }

  state.savingsGoals.unshift({
    id: Date.now().toString(),
    name,
    targetAmount,
    currentSavedAmount,
    targetDate,
  });

  saveData();
  elements.savingsForm.reset();
  elements.savingsForm.hidden = true;
  elements.addGoalButton.setAttribute('aria-expanded', 'false');
  renderSavings();
  showToast('Savings goal added');
}

function bindFilterEvents() {
  elements.searchInput.addEventListener('input', (event) => {
    state.filters.search = event.target.value;
    renderTransactions();
  });

  elements.categoryFilter.addEventListener('change', (event) => {
    state.filters.category = event.target.value;
    renderTransactions();
  });

  elements.paymentFilter.addEventListener('change', (event) => {
    state.filters.payment = event.target.value;
    renderTransactions();
  });

  elements.typeFilter.addEventListener('change', (event) => {
    state.filters.type = event.target.value;
    renderTransactions();
  });

  elements.dateFilter.addEventListener('change', (event) => {
    state.filters.date = event.target.value;
    renderTransactions();
  });

  elements.sortFilter.addEventListener('change', (event) => {
    state.filters.sort = event.target.value;
    renderTransactions();
  });

  elements.expenditureMonth.addEventListener('change', renderPreviousMonthExpenditures);
}

function bindEvents() {
  elements.darkModeToggle.addEventListener('click', () => {
    const isDark = elements.darkModeToggle.getAttribute('aria-checked') !== 'true';
    applyTheme(isDark);
    if (activeUserName) {
      localStorage.setItem(getProfileStorageKey('theme'), isDark ? 'dark' : 'light');
    }
  });

  elements.profileMenuToggle.addEventListener('click', () => {
    setProfileMenuOpen(elements.profileMenu.hidden);
  });
  if (elements.logoutButton) {
    elements.logoutButton.addEventListener('click', () => {
      setProfileMenuOpen(false);
      handleLogout();
    });
  }
  if (elements.loginForm) {
    elements.loginForm.addEventListener('submit', handleLoginSubmit);
  }

  elements.mobileNavToggle.addEventListener('click', () => {
    setSidebarOpen(!elements.sidebar.classList.contains('open'));
  });
  elements.sidebarOverlay.addEventListener('click', () => setSidebarOpen(false));

  document.querySelectorAll('.nav-item').forEach((button) => {
    button.addEventListener('click', () => {
      jumpToSection(button.dataset.target);
      setSidebarOpen(false);
    });
  });

  document.querySelectorAll('[data-portal-link]').forEach((button) => {
    button.addEventListener('click', () => {
      setProfileMenuOpen(false);
      jumpToSection(button.dataset.portalLink);
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.profile-menu')) {
      setProfileMenuOpen(false);
    }
  });

  elements.addExpenseButton.addEventListener('click', openExpenseModal);
  elements.addHistoricalExpenseButton.addEventListener('click', openExpenseModalForSelectedMonth);
  elements.addIncomeButton.addEventListener('click', openIncomeModal);
  elements.setBudgetButton.addEventListener('click', openBudgetModal);
  elements.budgetShortcutButton.addEventListener('click', openBudgetModal);
  elements.expenseForm.addEventListener('submit', handleExpenseSubmit);
  elements.expenseCategory.addEventListener('change', updateExpenseGoalField);
  elements.incomeForm.addEventListener('submit', handleIncomeSubmit);
  elements.budgetForm.addEventListener('submit', handleBudgetSubmit);
  elements.studentModeForm.addEventListener('submit', handleStudentFormSubmit);
  elements.savingsForm.addEventListener('submit', handleSavingsSubmit);
  elements.addGoalButton.addEventListener('click', () => {
    elements.savingsForm.hidden = false;
    elements.addGoalButton.setAttribute('aria-expanded', 'true');
    elements.goalName.focus();
  });
  elements.cancelGoalButton.addEventListener('click', () => {
    elements.savingsForm.reset();
    elements.savingsForm.hidden = true;
    elements.addGoalButton.setAttribute('aria-expanded', 'false');
  });

  elements.closeExpenseModal.addEventListener('click', closeExpenseModal);
  elements.cancelExpenseButton.addEventListener('click', closeExpenseModal);
  elements.closeIncomeModal.addEventListener('click', closeIncomeModal);
  elements.cancelIncomeButton.addEventListener('click', closeIncomeModal);
  elements.closeBudgetModal.addEventListener('click', closeBudgetModal);
  elements.cancelBudgetButton.addEventListener('click', closeBudgetModal);

  document.querySelector('[data-close-modal="true"]').addEventListener('click', closeExpenseModal);
  document.querySelector('[data-close-income-modal="true"]').addEventListener('click', closeIncomeModal);
  document.querySelector('[data-close-budget-modal="true"]').addEventListener('click', closeBudgetModal);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setSidebarOpen(false);
      setProfileMenuOpen(false);
      if (!elements.expenseModal.classList.contains('hidden')) closeExpenseModal();
      if (!elements.incomeModal.classList.contains('hidden')) closeIncomeModal();
      if (!elements.budgetModal.classList.contains('hidden')) closeBudgetModal();
    }
  });

  bindFilterEvents();
}

function init() {
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('./sw.js')
      .catch((error) => console.error('SmartSpend offline support could not be enabled.', error));
  }

  window.setTimeout(() => {
    elements.startupSplash.classList.add('is-hidden');
    elements.startupSplash.setAttribute('aria-hidden', 'true');
  }, 3000);

  const currentMonth = getMonthKey(new Date());
  if (elements.expenditureMonth) {
    elements.expenditureMonth.max = currentMonth;
    elements.expenditureMonth.value = shiftMonth(currentMonth, -1);
  }

  let storedLogin = null;
  try {
    storedLogin = JSON.parse(localStorage.getItem('smartspend-login') || 'null');
  } catch (error) {
    localStorage.removeItem('smartspend-login');
  }

  if (!localStorage.getItem('smartspend-legacy-owner')) {
    const hasLegacyData = Object.values(STORAGE_KEYS).some((key) => localStorage.getItem(key) !== null);
    if (hasLegacyData) {
      const legacyOwner = storedLogin && typeof storedLogin.userName === 'string' && storedLogin.userName.trim()
        ? normalizeUserName(storedLogin.userName)
        : 'aarav';
      localStorage.setItem('smartspend-legacy-owner', legacyOwner);
    }
  }

  if (storedLogin && typeof storedLogin.userName === 'string' && storedLogin.userName.trim()) {
    loadData(storedLogin.userName);
    const roleStorageKey = getProfileStorageKey('role', storedLogin.userName);
    const storedUserType = normalizeUserRole(
      localStorage.getItem(roleStorageKey) || localStorage.getItem('smartspend-user-role'),
    );
    localStorage.setItem(roleStorageKey, storedUserType);
    localStorage.setItem('smartspend-user-role', storedUserType);
    applyUserRoleToProfile(storedUserType);
    const profileName = document.querySelector('.user-profile strong');
    const avatar = document.querySelector('.user-profile .avatar');
    if (profileName) {
      profileName.textContent = storedLogin.userName;
    }
    if (avatar) {
      avatar.textContent = storedLogin.userName.charAt(0).toLocaleUpperCase();
    }
    elements.loginScreen.classList.add('hidden');
    elements.appShell.classList.remove('hidden');
  } else {
    activeUserName = '';
    activeUserRole = normalizeUserRole(localStorage.getItem('smartspend-user-role'));
    const loginRoleInput = document.querySelector(`input[name="userType"][value="${activeUserRole}"]`);
    if (loginRoleInput) {
      loginRoleInput.checked = true;
    }
    elements.appShell.classList.add('hidden');
    elements.loginScreen.classList.remove('hidden');
  }

  setActiveNavigation('dashboard');
  renderMonthlyPlan();
  bindEvents();
  updateDashboard();
}

init();
