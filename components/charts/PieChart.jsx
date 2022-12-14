import React from "react";
import { Pie } from "react-chartjs-2";
import styles from "../../styles/pages/reportes.module.scss";

function PieChart({ chartData }) {
  return (
    <div className={styles.chart_container + " " + styles.pie}>
      <Pie
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Users Gained between 2016-2020"
            },
            legend: {
              display: true
            }
          }
        }}
      />
    </div>
  );
}
export default PieChart;