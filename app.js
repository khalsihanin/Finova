/* =========================================================
   FINOVA - MAIN JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       PAGE DETECTION
    ===================================================== */

    const page = window.location.pathname
        .split("/")
        .pop();


    /* =====================================================
       GLOBAL NAVIGATION
    ===================================================== */

    document.querySelectorAll(".nav-link").forEach(link => {

        link.addEventListener("click", () => {

            document.querySelectorAll(".nav-link")
                .forEach(item => item.classList.remove("active"));

            link.classList.add("active");

        });

    });


    /* =====================================================
       LOCAL STORAGE
    ===================================================== */

    let transactions =
        JSON.parse(localStorage.getItem("finovaTransactions")) || [

            {
                id: 1,
                name: "Salary",
                category: "Income",
                date: "Aug 15, 2026",
                amount: 2500,
                type: "income",
                icon: "💰"
            },

            {
                id: 2,
                name: "Netflix",
                category: "Entertainment",
                date: "Aug 14, 2026",
                amount: 15,
                type: "expense",
                icon: "🎬"
            },

            {
                id: 3,
                name: "Grocery Shopping",
                category: "Food",
                date: "Aug 13, 2026",
                amount: 85,
                type: "expense",
                icon: "🛒"
            },

            {
                id: 4,
                name: "Uber",
                category: "Transport",
                date: "Aug 12, 2026",
                amount: 24,
                type: "expense",
                icon: "🚕"
            },

            {
                id: 5,
                name: "Freelance",
                category: "Income",
                date: "Aug 10, 2026",
                amount: 450,
                type: "income",
                icon: "💻"
            },

            {
                id: 6,
                name: "Shopping",
                category: "Shopping",
                date: "Aug 8, 2026",
                amount: 120,
                type: "expense",
                icon: "🛍️"
            }

        ];


    function saveTransactions() {

        localStorage.setItem(
            "finovaTransactions",
            JSON.stringify(transactions)
        );

    }


    /* =====================================================
       CALCULATE FINANCES
    ===================================================== */

    function calculateFinances() {

        let income = 0;
        let expenses = 0;

        transactions.forEach(transaction => {

            if (transaction.type === "income") {

                income += Number(transaction.amount);

            } else {

                expenses += Number(transaction.amount);

            }

        });

        return {

            income,
            expenses,
            balance: income - expenses

        };

    }


    /* =====================================================
       FORMAT MONEY
    ===================================================== */

    function formatMoney(amount) {

        return "$" + Number(amount).toLocaleString(
            "en-US",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        );

    }


    /* =====================================================
       UPDATE DASHBOARD STATS
    ===================================================== */

    function updateFinancialStats() {

        const finances = calculateFinances();


        const balance =
            document.getElementById("balance");

        const income =
            document.getElementById("income");

        const expenses =
            document.getElementById("expenses");


        if (balance) {

            balance.textContent =
                formatMoney(finances.balance);

        }


        if (income) {

            income.textContent =
                formatMoney(finances.income);

        }


        if (expenses) {

            expenses.textContent =
                formatMoney(finances.expenses);

        }

    }


    updateFinancialStats();


    /* =====================================================
       TRANSACTION RENDERING
    ===================================================== */

    function renderTransactions() {

        const container =
            document.getElementById(
                "transactionList"
            );


        if (!container) return;


        container.innerHTML = "";


        transactions
            .slice()
            .reverse()
            .forEach(transaction => {

                const row =
                    document.createElement("div");

                row.className =
                    "transaction-row";


                row.innerHTML = `

                    <div class="transaction-info">

                        <div class="transaction-icon">

                            ${transaction.icon}

                        </div>

                        <div>

                            <strong>
                                ${transaction.name}
                            </strong>

                            <small>
                                ${transaction.category}
                                ·
                                ${transaction.date}
                            </small>

                        </div>

                    </div>


                    <strong class="
                        amount
                        ${transaction.type === "income"
                            ? "income-amount"
                            : "expense-amount"}
                    ">

                        ${transaction.type === "income"
                            ? "+"
                            : "-"
                        }${formatMoney(transaction.amount)}

                    </strong>

                `;


                container.appendChild(row);

            });

    }


    renderTransactions();


    /* =====================================================
       FULL TRANSACTIONS PAGE
    ===================================================== */

    function renderFullTransactions(list = transactions) {

        const container =
            document.getElementById(
                "fullTransactionList"
            );


        if (!container) return;


        container.innerHTML = "";


        if (list.length === 0) {

            container.innerHTML = `

                <div style="
                    text-align:center;
                    padding:40px;
                    color:#68736d;
                    font-size:12px;
                ">

                    No transactions found.

                </div>

            `;

            return;

        }


        list
            .slice()
            .reverse()
            .forEach(transaction => {

                const row =
                    document.createElement("div");

                row.className =
                    "full-transaction-row";


                row.innerHTML = `

                    <div class="transaction-name">

                        <div class="transaction-icon">

                            ${transaction.icon}

                        </div>

                        <div>

                            <strong>
                                ${transaction.name}
                            </strong>

                            <small>
                                ${transaction.category}
                            </small>

                        </div>

                    </div>


                    <div class="table-category">

                        ${transaction.category}

                    </div>


                    <div class="table-date">

                        ${transaction.date}

                    </div>


                    <strong class="
                        ${transaction.type === "income"
                            ? "income-amount"
                            : "expense-amount"}
                    ">

                        ${transaction.type === "income"
                            ? "+"
                            : "-"
                        }${formatMoney(transaction.amount)}

                    </strong>


                    <button
                        class="delete-btn"
                        data-id="${transaction.id}"
                    >

                        🗑

                    </button>

                `;


                container.appendChild(row);

            });


        /* DELETE */

        container
            .querySelectorAll(".delete-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(button.dataset.id);


                        transactions =
                            transactions.filter(
                                item =>
                                    item.id !== id
                            );


                        saveTransactions();

                        renderFullTransactions();

                        renderTransactions();

                        updateFinancialStats();

                    }
                );

            });

    }


    renderFullTransactions();


    /* =====================================================
       TRANSACTION SEARCH
    ===================================================== */

    const searchInput =
        document.getElementById(
            "transactionSearch"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                const search =
                    searchInput.value
                        .toLowerCase()
                        .trim();


                const filtered =
                    transactions.filter(
                        transaction =>

                            transaction.name
                                .toLowerCase()
                                .includes(search)

                            ||

                            transaction.category
                                .toLowerCase()
                                .includes(search)
                    );


                renderFullTransactions(filtered);

            }
        );

    }


    /* =====================================================
       TRANSACTION FILTER
    ===================================================== */

    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );


    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            () => {

                const value =
                    categoryFilter.value;


                if (value === "all") {

                    renderFullTransactions();

                    return;

                }


                const filtered =
                    transactions.filter(
                        transaction =>
                            transaction.category
                                .toLowerCase()
                            === value.toLowerCase()
                    );


                renderFullTransactions(filtered);

            }
        );

    }


    /* =====================================================
       ADD TRANSACTION MODAL
    ===================================================== */

    const transactionModal =
        document.getElementById(
            "transactionModal"
        );


    const openTransactionModal =
        document.getElementById(
            "openTransactionModal"
        );


    const closeTransactionModal =
        document.getElementById(
            "closeTransactionModal"
        );


    if (
        openTransactionModal &&
        transactionModal
    ) {

        openTransactionModal
            .addEventListener(
                "click",
                () => {

                    transactionModal
                        .classList.add("show");

                }
            );

    }


    if (
        closeTransactionModal &&
        transactionModal
    ) {

        closeTransactionModal
            .addEventListener(
                "click",
                () => {

                    transactionModal
                        .classList.remove("show");

                }
            );

    }


    /* CLOSE MODAL WHEN CLICKING OUTSIDE */

    if (transactionModal) {

        transactionModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    transactionModal
                ) {

                    transactionModal
                        .classList.remove("show");

                }

            }
        );

    }


    /* =====================================================
       TRANSACTION TYPE
    ===================================================== */

    let transactionType = "expense";


    document.querySelectorAll(".type-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(".type-btn")
                        .forEach(btn =>
                            btn.classList.remove(
                                "active"
                            )
                        );


                    button.classList.add("active");


                    transactionType =
                        button.dataset.type ||
                        "expense";

                }
            );

        });


    /* =====================================================
       ADD TRANSACTION
    ===================================================== */

    const transactionForm =
        document.getElementById(
            "transactionForm"
        );


    if (transactionForm) {

        transactionForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const name =
                    document.getElementById(
                        "transactionName"
                    ).value;


                const amount =
                    Number(
                        document.getElementById(
                            "transactionAmount"
                        ).value
                    );


                const category =
                    document.getElementById(
                        "transactionCategory"
                    ).value;


                if (!name || !amount) {

                    return;

                }


                const newTransaction = {

                    id: Date.now(),

                    name,

                    category,

                    date:
                        new Date()
                            .toLocaleDateString(
                                "en-US",
                                {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric"
                                }
                            ),

                    amount,

                    type: transactionType,

                    icon:
                        getCategoryIcon(
                            category
                        )

                };


                transactions.push(
                    newTransaction
                );


                saveTransactions();


                transactionForm.reset();


                if (transactionModal) {

                    transactionModal
                        .classList.remove("show");

                }


                renderTransactions();

                renderFullTransactions();

                updateFinancialStats();

            }
        );

    }


    /* =====================================================
       CATEGORY ICONS
    ===================================================== */

    function getCategoryIcon(category) {

        const icons = {

            Food: "🍔",

            Shopping: "🛍️",

            Transport: "🚕",

            Bills: "💡",

            Entertainment: "🎬",

            Income: "💰",

            Salary: "💵",

            Other: "📌"

        };


        return icons[category] || "📌";

    }


    /* =====================================================
       SAVINGS GOALS
    ===================================================== */

    let savingsGoals =
        JSON.parse(
            localStorage.getItem(
                "finovaGoals"
            )
        ) || [];


    function saveGoals() {

        localStorage.setItem(
            "finovaGoals",
            JSON.stringify(savingsGoals)
        );

    }


    /* =====================================================
       CREATE GOAL MODAL
    ===================================================== */

    const goalModal =
        document.getElementById(
            "goalModal"
        );


    const openGoalModal =
        document.getElementById(
            "openGoalModal"
        );


    const closeGoalModal =
        document.getElementById(
            "closeGoalModal"
        );


    if (
        openGoalModal &&
        goalModal
    ) {

        openGoalModal.addEventListener(
            "click",
            () => {

                goalModal
                    .classList.add("show");

            }
        );

    }


    if (
        closeGoalModal &&
        goalModal
    ) {

        closeGoalModal.addEventListener(
            "click",
            () => {

                goalModal
                    .classList.remove("show");

            }
        );

    }


    /* =====================================================
       CREATE GOAL
    ===================================================== */

    const goalForm =
        document.getElementById(
            "goalForm"
        );


    if (goalForm) {

        goalForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const name =
                    document.getElementById(
                        "goalName"
                    ).value;


                const amount =
                    Number(
                        document.getElementById(
                            "goalAmount"
                        ).value
                    );


                const current =
                    Number(
                        document.getElementById(
                            "goalCurrent"
                        ).value
                    );


                const date =
                    document.getElementById(
                        "goalDate"
                    ).value;


                const goal = {

                    id: Date.now(),

                    name,

                    amount,

                    current,

                    date

                };


                savingsGoals.push(goal);

                saveGoals();


                goalForm.reset();


                goalModal
                    .classList.remove("show");


                alert(
                    "🎯 Savings goal created!"
                );

            }
        );

    }


    /* =====================================================
       ADD MONEY TO GOAL
    ===================================================== */

    const moneyModal =
        document.getElementById(
            "moneyModal"
        );


    const closeMoneyModal =
        document.getElementById(
            "closeMoneyModal"
        );


    let selectedGoal = null;


    document.querySelectorAll(
        ".add-money-btn"
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                if (
                    button.classList.contains(
                        "completed-button"
                    )
                ) {

                    return;

                }


                selectedGoal =
                    button.dataset.goal;


                if (moneyModal) {

                    moneyModal
                        .classList.add("show");

                }

            }
        );

    });


    if (closeMoneyModal) {

        closeMoneyModal.addEventListener(
            "click",
            () => {

                moneyModal
                    .classList.remove("show");

            }
        );

    }


    const moneyForm =
        document.getElementById(
            "moneyForm"
        );


    if (moneyForm) {

        moneyForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const amount =
                    Number(
                        document.getElementById(
                            "moneyAmount"
                        ).value
                    );


                if (!amount) return;


                alert(
                    `$${amount} added to ${selectedGoal}! 💚`
                );


                moneyForm.reset();


                moneyModal
                    .classList.remove("show");

            }
        );

    }


    /* =====================================================
       CHART.JS
    ===================================================== */

    function loadChartJS() {

        return new Promise(resolve => {

            if (window.Chart) {

                resolve();

                return;

            }


            const script =
                document.createElement(
                    "script"
                );


            script.src =
                "https://cdn.jsdelivr.net/npm/chart.js";


            script.onload =
                resolve;


            document.head.appendChild(
                script
            );

        });

    }


    /* =====================================================
       DASHBOARD CHART
    ===================================================== */

    loadChartJS().then(() => {

        createCharts();

    });


    function createCharts() {

        /* -------------------------------
           INCOME / EXPENSE CHART
        ------------------------------- */

        const financialChart =
            document.getElementById(
                "financialChart"
            );


        if (
            financialChart &&
            !financialChart.chart
        ) {

            financialChart.chart =
                new Chart(
                    financialChart,
                    {

                        type: "line",

                        data: {

                            labels: [
                                "Jan",
                                "Feb",
                                "Mar",
                                "Apr",
                                "May",
                                "Jun",
                                "Jul",
                                "Aug"
                            ],

                            datasets: [

                                {

                                    label:
                                        "Income",

                                    data: [
                                        1800,
                                        2100,
                                        2200,
                                        2400,
                                        2300,
                                        2500,
                                        2600,
                                        2950
                                    ],

                                    borderColor:
                                        "#35e887",

                                    backgroundColor:
                                        "rgba(53,232,135,0.08)",

                                    fill: true,

                                    tension: 0.4,

                                    pointRadius: 3

                                },

                                {

                                    label:
                                        "Expenses",

                                    data: [
                                        1200,
                                        1400,
                                        1300,
                                        1500,
                                        1250,
                                        1600,
                                        1450,
                                        1050
                                    ],

                                    borderColor:
                                        "#ff5f68",

                                    backgroundColor:
                                        "rgba(255,95,104,0.04)",

                                    fill: true,

                                    tension: 0.4,

                                    pointRadius: 3

                                }

                            ]

                        },

                        options: {

                            responsive: true,

                            maintainAspectRatio:
                                false,

                            plugins: {

                                legend: {

                                    labels: {

                                        color:
                                            "#9aa6a0",

                                        font: {
                                            size: 10
                                        }

                                    }

                                }

                            },

                            scales: {

                                x: {

                                    grid: {
                                        display: false
                                    },

                                    ticks: {
                                        color:
                                            "#68736d"
                                    }

                                },

                                y: {

                                    grid: {

                                        color:
                                            "rgba(255,255,255,0.05)"

                                    },

                                    ticks: {

                                        color:
                                            "#68736d",

                                        callback:
                                            value =>
                                                "$" +
                                                value

                                    }

                                }

                            }

                        }

                    }
                );

        }


        /* -------------------------------
           EXPENSE DONUT
        ------------------------------- */

        const expenseChart =
            document.getElementById(
                "expenseChart"
            );


        if (
            expenseChart &&
            !expenseChart.chart
        ) {

            expenseChart.chart =
                new Chart(
                    expenseChart,
                    {

                        type: "doughnut",

                        data: {

                            labels: [
                                "Food",
                                "Shopping",
                                "Transport",
                                "Bills",
                                "Other"
                            ],

                            datasets: [

                                {

                                    data: [
                                        32,
                                        24,
                                        18,
                                        16,
                                        10
                                    ],

                                    backgroundColor: [
                                        "#35e887",
                                        "#5da9ff",
                                        "#ffb84d",
                                        "#c77dff",
                                        "#ff5f68"
                                    ],

                                    borderWidth: 0

                                }

                            ]

                        },

                        options: {

                            responsive: true,

                            maintainAspectRatio:
                                false,

                            cutout: "72%",

                            plugins: {

                                legend: {
                                    display: false
                                }

                            }

                        }

                    }
                );

        }


        /* -------------------------------
           ANALYTICS CHART
        ------------------------------- */

        const analyticsChart =
            document.getElementById(
                "analyticsChart"
            );


        if (
            analyticsChart &&
            !analyticsChart.chart
        ) {

            analyticsChart.chart =
                new Chart(
                    analyticsChart,
                    {

                        type: "bar",

                        data: {

                            labels: [
                                "Jan",
                                "Feb",
                                "Mar",
                                "Apr",
                                "May",
                                "Jun",
                                "Jul",
                                "Aug"
                            ],

                            datasets: [

                                {

                                    label:
                                        "Income",

                                    data: [
                                        1800,
                                        2100,
                                        2200,
                                        2400,
                                        2300,
                                        2500,
                                        2600,
                                        2950
                                    ],

                                    backgroundColor:
                                        "#35e887",

                                    borderRadius: 5

                                },

                                {

                                    label:
                                        "Expenses",

                                    data: [
                                        1200,
                                        1400,
                                        1300,
                                        1500,
                                        1250,
                                        1600,
                                        1450,
                                        1050
                                    ],

                                    backgroundColor:
                                        "#ff5f68",

                                    borderRadius: 5

                                }

                            ]

                        },

                        options: {

                            responsive: true,

                            maintainAspectRatio:
                                false,

                            plugins: {

                                legend: {

                                    labels: {

                                        color:
                                            "#9aa6a0",

                                        font: {
                                            size: 10
                                        }

                                    }

                                }

                            },

                            scales: {

                                x: {

                                    grid: {
                                        display: false
                                    },

                                    ticks: {
                                        color:
                                            "#68736d"
                                    }

                                },

                                y: {

                                    beginAtZero: true,

                                    grid: {

                                        color:
                                            "rgba(255,255,255,0.05)"

                                    },

                                    ticks: {

                                        color:
                                            "#68736d",

                                        callback:
                                            value =>
                                                "$" +
                                                value

                                    }

                                }

                            }

                        }

                    }
                );

        }


        /* -------------------------------
           CATEGORY CHART
        ------------------------------- */

        const categoryChart =
            document.getElementById(
                "categoryChart"
            );


        if (
            categoryChart &&
            !categoryChart.chart
        ) {

            categoryChart.chart =
                new Chart(
                    categoryChart,
                    {

                        type: "doughnut",

                        data: {

                            labels: [
                                "Food",
                                "Shopping",
                                "Transport",
                                "Bills",
                                "Entertainment"
                            ],

                            datasets: [

                                {

                                    data: [
                                        32,
                                        24,
                                        18,
                                        16,
                                        10
                                    ],

                                    backgroundColor: [
                                        "#35e887",
                                        "#5da9ff",
                                        "#ffb84d",
                                        "#c77dff",
                                        "#ff5f68"
                                    ],

                                    borderWidth: 0

                                }

                            ]

                        },

                        options: {

                            cutout: "65%",

                            plugins: {

                                legend: {
                                    display: false
                                }

                            }

                        }

                    }
                );

        }

    }


    /* =====================================================
       CLOSE ALL MODALS WITH ESC
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                document
                    .querySelectorAll(
                        ".modal-overlay"
                    )
                    .forEach(modal => {

                        modal.classList
                            .remove("show");

                    });

            }

        }
    );


    /* =====================================================
       NOTIFICATION BUTTON
    ===================================================== */

    const notificationButton =
        document.querySelector(
            ".icon-btn"
        );


    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            () => {

                alert(
                    "🔔 You're all caught up! No new notifications."
                );

            }
        );

    }


    /* =====================================================
       WELCOME MESSAGE
    ===================================================== */

    const hour =
        new Date().getHours();


    let greeting = "Good evening";


    if (hour < 12) {

        greeting = "Good morning";

    } else if (hour < 18) {

        greeting = "Good afternoon";

    }


    document
        .querySelectorAll(".welcome")
        .forEach(element => {

            element.textContent =
                `${greeting}, Hanin 👋`;

        });


});