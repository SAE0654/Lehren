import { getSession } from 'next-auth/react';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// Estilos
import styles from "../../styles/pages/reportes.module.scss";
// Componentes
import Layout from '../../components/Layout';
import PieChart from '../../components/charts/PieChart';
import { BarChart } from '../../components/charts/BarChart';
import LineChart from '../../components/charts/LineChart';
import { Chart, registerables } from 'chart.js';
// Funciones externas
import { ModalidadInforme, RegistradosPorMes, RVOEInforme, StatusInforme, TipoOfertaInforme } from '../../utils/reportes';

Chart.register(...registerables);

const Reportes = () => {
    const [chartData, setChartData] = useState(null);
    const [GraphicIndex, setGraphicIndex] = useState(0);
    const [Cargando, setCargando] = useState(true);
    const [DataSAE, setDataSAE] = useState([]);
    const [DataARTEK, setDataARTEK] = useState([]);

    useEffect(() => {
        document.querySelector("body").className = '';
        document.querySelector("body").classList.add("reportes_bg");
        if (Cargando) {
            getProductosDataset();
        }
        console.log(chartData)
    }, [chartData]);

    const getProductosDataset = async () => {
        let ARTEK = [];
        let SAE = [];
        await axios(`${process.env.NEXT_PUBLIC_ENDPOINT}api/productos/artek`).then((res) => {
            ARTEK = res.data;
            setDataARTEK(ARTEK);
        });
        await axios(`${process.env.NEXT_PUBLIC_ENDPOINT}api/productos/sae`).then((res) => {
            SAE = res.data;
            setDataSAE(SAE);
        });
        setCargando(false);
        requestInforme(SAE, ARTEK, 'perMonth');
    }

    const loadDataset = (SAE, ARTEK, labelsArray) => setChartData({
        labels: labelsArray,
        datasets: [
            {
                label: "SAE",
                data: SAE,
                backgroundColor: [
                    "rgba(153, 102, 255, 1)",
                    "rgba(54, 162, 235, 1)",
                    "#50AF95",
                    "#f3ba2f",
                    "#2a71d0"
                ],
                borderColor: "black",
                borderWidth: 2
            },
            {
                label: "ARTEK",
                data: ARTEK,
                backgroundColor: [
                    "rgba(75,192,192,1)",
                    "#ecf0f1",
                    "#50AF95",
                    "#f3ba2f",
                    "#2a71d0"
                ],
                borderColor: "black",
                borderWidth: 2
            }
        ]
    });

    const requestInforme = (SAE, ARTEK, datoSolicitado) => {
        console.log(datoSolicitado)
        switch (datoSolicitado) {
            case 'statusProducto':
                const status = StatusInforme(SAE, ARTEK);
                loadDataset(status[0].dataset, status[1].dataset, status[0].labels);
                break;
            case 'modalidad':
                const modalidad = ModalidadInforme(SAE, ARTEK);
                loadDataset(modalidad[0].dataset, modalidad[1].dataset, modalidad[0].labels);
                break;
            case 'tipo':
                const tipo = TipoOfertaInforme(SAE, ARTEK);
                loadDataset(tipo[0].dataset, tipo[1].dataset, tipo[0].labels);
                break;
            case 'RVOE':
                const RVOE = RVOEInforme(SAE, ARTEK);
                loadDataset(RVOE[0].dataset, RVOE[1].dataset, RVOE[0].labels);
                break;
            case 'perMonth':
                const meses = RegistradosPorMes(SAE, ARTEK);
                loadDataset(meses[0].dataset, meses[1].dataset, meses[0].labels);
                break;
            default:
                break;
        }

    }

    if (Cargando && chartData === null) {
        return <h1>Cargando...</h1>
    }

    return <>
        <Layout>
            <Head>
                <title>Reportes</title>
                <meta name="description" content="Start app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.container}>
                <div className={styles.graphics_area}>
                    <div className={styles.bar_action}>
                        <button onClick={() => setGraphicIndex(0)} className={GraphicIndex === 0 ? styles.active : null}>Gráfico circular</button>
                        <button onClick={() => setGraphicIndex(1)} className={GraphicIndex === 1 ? styles.active : null}>Gráfico de barras</button>
                        <button onClick={() => setGraphicIndex(2)} className={GraphicIndex === 2 ? styles.active : null}>Gráfico linear</button>
                    </div>
                    <select name="dataToBring" onChange={(e) => requestInforme(DataSAE, DataARTEK, e.target.value)}>
                        <option value="perMonth">Registrados por mes</option>
                        <option value="statusProducto">Estatus</option>
                        <option value="modalidad">Modalidad</option>
                        <option value="tipo">Tipo de oferta</option>
                        <option value="RVOE">RVOE</option>
                    </select>
                    {GraphicIndex === 0 ? <PieChart chartData={chartData} /> : null}
                    {GraphicIndex === 1 ? <BarChart chartData={chartData} /> : null}
                    {GraphicIndex === 2 ? <LineChart chartData={chartData} /> : null}
                </div>
                <div className={styles.most_active_users}>
                    <h2>Usuarios más activos</h2>
                </div>
                <div className={styles.sae_number_products}>
                    <h2>Productos SAE</h2>
                    <div className={styles.box_info}>
                        <h3>{DataSAE.length}</h3>
                        <div className={styles.box}>
                            <h3>Último producto registrado:</h3>
                            <p>&nbsp;Este producto</p>
                        </div>
                    </div>
                </div>
                <div className={styles.artek_number_products}>
                    <h2>Productos ARTEK</h2>
                    <div className={styles.box_info}>
                        <h3>{DataARTEK.length}</h3>
                        <div className={styles.box}>
                            <h3>Último producto registrado:</h3>
                            <p>&nbsp;Este producto</p>
                        </div>
                    </div>
                </div>
                <div className={styles.current_users_online}>
                    <h2>Usuarios en línea</h2>
                </div>
            </div>
        </Layout>
    </>
}

export default Reportes;

export async function getServerSideProps(ctx) {
    const _session = await getSession(ctx);

    if (!_session) return {
        redirect: {
            destination: '/',
            permanent: false
        }
    }

    return {
        props: {
        }
    }
}
