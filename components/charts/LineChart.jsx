import React from "react";
import { Line } from "react-chartjs-2";
import styles from "../../styles/pages/reportes.module.scss";

function LineChart({ chartData }) {
  return (
    <div className={styles.chart_container}>
      <Line
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Productos"
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
export default LineChart;