import React from 'react'
import Budget from './BudgetDisplay.jsx'
import ExpensesForm from './ExpensesForm.jsx'
import { useState } from 'react'
import Table from './Table.jsx'
// import CurrentMonth from './CurrentMonth.jsx'


function Home() {
  const [display, setDisplay] = useState("budget");

  const toggleView = () => {
    setDisplay((prev) => (prev === "budget" ? "table" : "budget"));
  };

  return (
    <div className="main-container bg-gray-100 p-2 sm:p-4 lg:p-6">
      <div className="top-container flex flex-col sm:flex-row gap-4">
        <ExpensesForm />
        {display === "budget" ? (
          <Budget display={display} toggleView={toggleView} />
        ) : (
          <Table display={display} toggleView={toggleView} />
        )}
      </div>
     {/* <CurrentMonth /> */}
    </div>
  );
}

export default Home;