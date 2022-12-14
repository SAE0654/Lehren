import { Bar } from "react-chartjs-2";
import styles from "../../styles/pages/reportes.module.scss";

export const BarChart = ({ chartData }) => {
  return (
    <div className={styles.chart_container}>
      <Bar
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
};